import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from fuzzywuzzy import fuzz
import unidecode
import re

class ActionHoiThongTinVeXe(Action):
    def name(self):
        return "action_hoi_thong_tin_ve_xe"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        # ================================================================
        # 1) Lấy entity từ NLU
        # ================================================================
        entities = tracker.latest_message.get("entities", [])
        intent = tracker.latest_message.get("intent", {}).get("name")

        entity_brand = next((e["value"] for e in entities if e["entity"] == "thuong_hieu"), None)
        entity_model = next((e["value"] for e in entities if e["entity"] == "mau_xe"), None)
        entity_color = next((e["value"] for e in entities if e["entity"] == "mau_sac"), None)

        

        # Text gốc người dùng
        user_msg_raw = tracker.latest_message.get("text", "")
        user_msg_clean = unidecode.unidecode(user_msg_raw.lower())

        # === THÊM DÒNG NÀY ĐỂ DEBUG ===
        print(f"DEBUG NLU: model={entity_model}, color={entity_color}") 
        print(f"DEBUG Raw Message: {user_msg_raw}")
        # ===============================

        # ================================================================
        # 2) Gọi API BE lấy danh sách xe
        # ================================================================
        try:
            url = "http://localhost:3000/product"
            res = requests.get(url)
            res.raise_for_status()
            response = res.json()
            bikes = response.get("data", [])

            # Chuẩn hóa tên xe và tên hãng
            for bike in bikes:
                bike["name_clean"] = unidecode.unidecode(bike.get("name", "").lower())
                bike["company_clean"] = unidecode.unidecode(
                    bike.get("Company", {}).get("name", "").lower()
                )
        except Exception as e:
            dispatcher.utter_message(text=f"❌ Lỗi khi lấy dữ liệu từ BE: {e}")
            return []
              
        # ================================================================
        # Nếu user hỏi 1 mẫu xe cụ thể (ưu tiên cao nhất)
        # ================================================================
        if entity_model:
            # Loại bỏ "màu ..." trong tên mẫu nếu người dùng nói cả màu
            entity_model_clean = re.sub(r"m[aà]u\s+[^\s,\.]+", "", entity_model, flags=re.IGNORECASE).strip()
            model_clean = unidecode.unidecode(entity_model_clean.lower())

            # Tìm fuzzy mẫu xe
            best_match = None
            best_score = 0
            for bike in bikes:
                score = fuzz.token_set_ratio(bike["name_clean"], model_clean)
                if score > best_score:
                    best_score = score
                    best_match = bike

            if best_match and best_score >= 60:
                # 1. Ưu tiên lấy entity_color từ NLU (nếu có)
                current_entity_color = entity_color 

                # 2. Nếu NLU không trích xuất màu, thử dùng regex trên câu gốc
                if not current_entity_color:
                    match_color = re.search(r"m[aà]u\s+([^\s,\.]+)", user_msg_raw, re.IGNORECASE)
                    if match_color:
                        current_entity_color = match_color.group(1)
                
                # 3. Quyết định hàm phản hồi
                if current_entity_color:
                    # Nếu có màu (từ NLU hoặc regex) → gọi hàm xử lý màu
                    return self._respond_with_color_stock(best_match, current_entity_color, dispatcher)
                else:
                    # Nếu không có màu → chỉ hỏi tên xe
                    return self._respond_with_bike_info(best_match, dispatcher)



        # ================================================================
        # Nếu user chỉ hỏi hãng xe (không chỉ mẫu)
        # ================================================================
        if entity_brand:
            brand_clean = unidecode.unidecode(entity_brand.lower())

            bikes_in_brand = [b for b in bikes if brand_clean in b["company_clean"]]

            if bikes_in_brand:
                bike_names = ", ".join([f"<b>{b['name']}</b>" for b in bikes_in_brand])

                dispatcher.utter_message(
                    text=f"Hiện tại bên em có các mẫu của hãng <b>{entity_brand}</b>:\n{bike_names}\n\nBạn muốn hỏi giá mẫu nào ạ?"
                )
                return []
        
        # ================================================================
        # 2.1) XỬ LÝ: XE THEO KHOẢNG GIÁ
        # ================================================================
        if "trieu" in user_msg_clean or "tu" in user_msg_clean or "den" in user_msg_clean:
            # Tìm tất cả các số trong câu
            numbers = re.findall(r'\d+', user_msg_clean)
            prices = [int(n) * 1_000_000 for n in numbers]  # nhân 1_000_000 VNĐ

            # Xác định khoảng giá
            if len(prices) == 0:
                min_price = max_price = None
            elif len(prices) == 1:
                min_price = 0
                max_price = prices[0]
            else:
                min_price = min(prices)
                max_price = max(prices)

            # Nếu tìm được khoảng giá
            if min_price is not None and max_price is not None:
                bikes_in_range = [b for b in bikes if min_price <= b["price"] <= max_price]

                if bikes_in_range:
                    names = ", ".join([f"<b>{b['name']}</b>" for b in bikes_in_range])
                    dispatcher.utter_message(
                        text=f"Các xe trong khoảng giá <b>{min_price:,} - {max_price:,}</b> là xe:\n<b>{names}.</b> "
                            "Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                    )
                else:
                    dispatcher.utter_message(
                        text="Không có xe nào trong khoảng giá bạn hỏi. Bạn vui lòng nhập khoảng giá khác!"
                    )
            else:
                # Không tìm thấy số nào trong câu
                dispatcher.utter_message(
                    text="Bạn vui lòng cho mình biết khoảng giá muốn tìm, ví dụ: 10-20 triệu."
                )
            return []
        # ================================================================
        # 2.6) XE CÓ THỜI GIAN SẠC (HỎI "SẠC BAO LÂU", "SẠC MẤY TIẾNG")
        # ================================================================
        if "sac" in user_msg_clean or "tieng" in user_msg_clean:
            # 1) Tìm người dùng đang hỏi sạc bao nhiêu tiếng
            match = re.search(r"(\d+(\.\d+)?)\s*(tieng|gio|h)", user_msg_clean)
            target_hours = None

            if match:
                target_hours = float(match.group(1))  # số giờ muốn tìm

            # Nếu KHÔNG tìm thấy số giờ → trả lời hướng dẫn
            if target_hours is None:
                dispatcher.utter_message(text="Bạn muốn tìm xe sạc trong bao nhiêu tiếng ạ? Ví dụ: 'Xe nào sạc 3 tiếng?'.")
                return []

            # 2) Làm tròn thời gian sạc từng xe (0.5h)
            for b in bikes:
                raw = b.get("ProductDetail", {}).get("charging_time", None)
                if raw is not None:
                    b["charging_time_rounded"] = round(raw * 2) / 2
                else:
                    b["charging_time_rounded"] = None

            # 3) Tìm xe sạc đúng số giờ
            exact = [b for b in bikes if b["charging_time_rounded"] == target_hours]

            if exact:
                names = ", ".join([f"<b>{b['name']}</b>" for b in exact])
                dispatcher.utter_message(
                    text=f"Các xe sạc đúng <b>{target_hours} giờ</b>: {names}. Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                )
                return []

            # 4) Nếu không có → tìm trong khoảng ±0.5 giờ
            low = target_hours - 0.5
            high = target_hours + 0.5

            similar = [
                b for b in bikes
                if b["charging_time_rounded"] is not None
                and low <= b["charging_time_rounded"] <= high
            ]

            if similar:
                names = ", ".join([f"<b>{b['name']}</b>" for b in similar])
                dispatcher.utter_message(
                    text=f"Không có xe sạc đúng {target_hours} giờ, nhưng có các xe sạc gần giống ({low}–{high} giờ): {names}. Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                )
                return []

            # 5) Không tìm thấy gì
            dispatcher.utter_message(text=f"Không tìm thấy xe nào có thời gian sạc gần {target_hours} giờ.")
            return []
        # ================================================================
        # 2.2) XỬ LÝ: XE ĐẮT NHẤT / XE RẺ NHẤT
        # ================================================================
        if "dat" in user_msg_clean  or "mac" in user_msg_clean or "tien" in user_msg_clean or "dac" in user_msg_clean:
            # Tìm xe giá cao nhất
            max_price = max(b["price"] for b in bikes)
            expensive_bikes = [b for b in bikes if b["price"] == max_price]

            names = ", ".join([f"<b>{b['name']}</b>" for b in expensive_bikes])
            dispatcher.utter_message(
                text=f"Xe có giá <b>đắt nhất</b> là: {names} với giá <b>{max_price:,} VNĐ</b>."
            )
            return []

        if "re" in user_msg_clean  or "mem" in user_msg_clean:
            # Tìm xe giá thấp nhất
            min_price = min(b["price"] for b in bikes)
            cheap_bikes = [b for b in bikes if b["price"] == min_price]

            names = ", ".join([f"<b>{b['name']}</b>" for b in cheap_bikes])
            dispatcher.utter_message(
                text=f"Xe có giá <b>rẻ nhất</b> là: {names} với giá <b>{min_price:,} VNĐ</b>."
            )
            return []


            
        # ================================================================
        # 2.3) XỬ LÝ: XE THEO ĐIỂM ĐÁNH GIÁ (CAO NHẤT / THẤP NHẤT)
        # ================================================================
        if "danh gia" in user_msg_clean  or "rating" in user_msg_clean:
            ratings = [b["average_rating"] for b in bikes]
            if "cao" in user_msg_clean  or "tot" in user_msg_clean:
                target = max(ratings)
            else:
                target = min(ratings)

            result = [b for b in bikes if b["average_rating"] == target]

            if result:
                names = ", ".join([f"<b>{b['name']}</b>" for b in result])
                dispatcher.utter_message(
                    text=f"Điểm đánh giá {'cao nhất' if target==max(ratings) else 'thấp nhất'} là <b>{target}</b>⭐.\nLà xe: {names}. Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                )
            else:
                dispatcher.utter_message(text="Xin lỗi tôi không tìm thấy xe theo đánh giá.")
            return []
        
        # ================================================================
        # 2.4) XE CÓ TỐC ĐỘ TỐI ĐA CAO NHẤT / THẤP NHẤT
        # ================================================================
        if "toc do" in user_msg_clean or "tốc độ" in user_msg_clean or "speed" in user_msg_clean:
            speeds = [b.get("ProductDetail", {}).get("maximum_speed", 0) for b in bikes]
            if "cao" in user_msg_clean:
                target_speed = max(speeds)
                label = "cao nhất"
            else:
                target_speed = min(speeds)
                label = "thấp nhất"

            result = [b for b in bikes if b.get("ProductDetail", {}).get("maximum_speed", 0) == target_speed]

            if result:
                names = ", ".join([f"<b>{b['name']}</b>" for b in result])
                dispatcher.utter_message(
                    text=f"Tốc độ tối đa {label} là <b>{target_speed} km/h</b>.\nLà xe: {names}. Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                )
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy xe theo tốc độ bạn yêu cầu.")
            return []

        # ================================================================
        # 2.5) XE CÓ DUNG LƯỢNG PIN CAO NHẤT / THẤP NHẤT
        # ================================================================
        if "pin" in user_msg_clean or "dung" in user_msg_clean or "luong" in user_msg_clean or "battery" in user_msg_clean:
            # Chuyển battery về số nguyên
            batteries = []
            for b in bikes:
                battery_str = b.get("ProductDetail", {}).get("battery", "0")
                try:
                    batteries.append(int(battery_str))
                except:
                    batteries.append(0)

            if "cao" in user_msg_clean:
                target_battery = max(batteries)
                label = "cao nhất"
            else:
                target_battery = min(batteries)
                label = "thấp nhất"

            result = [b for b in bikes if int(b.get("ProductDetail", {}).get("battery", 0)) == target_battery]

            if result:
                names = ", ".join([f"<b>{b['name']}</b>" for b in result])
                dispatcher.utter_message(
                    text=f"Dung lượng pin {label} là <b>{target_battery} Ah</b>.\nLà xe: {names}. Bạn muốn hỏi cụ thể xe nào cứ nói nhé!"
                )
            else:
                dispatcher.utter_message(text="Xin lỗi, không tìm thấy xe theo dung lượng pin bạn yêu cầu.")
            return []


        



        # ================================================================
        # 6) Không có entity → fuzzy search từ câu hỏi
        #    (Hoạt động như Fallback/Dự phòng cho cả Tên xe và Màu sắc)
        # ================================================================
        best_match = None
        best_score = 0

        # 6.1) Thực hiện Fuzzy Search để tìm mẫu xe
        for bike in bikes:
            score = max(
                fuzz.ratio(bike["name_clean"], user_msg_clean),
                fuzz.partial_ratio(bike["name_clean"], user_msg_clean),
                fuzz.token_set_ratio(bike["name_clean"], user_msg_clean)
            )
            if score > best_score:
                best_score = score
                best_match = bike

        # 6.2) Nếu tìm thấy xe (best_match) qua Fuzzy Search
        if best_match and best_score >= 60:
            
            # 6.3) Dự phòng: Kiểm tra xem có từ 'màu' nào trong câu gốc không
            current_entity_color = entity_color # Mặc định là None vì NLU thất bại
            
            # Thử dùng regex để trích xuất màu
            match_color = re.search(r"m[aà]u\s+([^\s,\.]+)", user_msg_raw, re.IGNORECASE)
            
            if match_color:
                current_entity_color = match_color.group(1)
            
            # 6.4) Quyết định hàm phản hồi
            if current_entity_color:
                # Nếu Fuzzy Search tìm ra xe VÀ Regex tìm ra màu
                # -> Gọi hàm trả lời số lượng xe theo màu
                return self._respond_with_color_stock(best_match, current_entity_color, dispatcher)
            else:
                # Chỉ Fuzzy Search tìm ra xe mà không tìm ra màu
                # -> Gọi hàm trả lời thông tin chung (giá, thông số)
                return self._respond_with_bike_info(best_match, dispatcher)

        # ================================================================
        # 7) Không tìm thấy gì — fallback
        # ================================================================
        dispatcher.utter_message(
            text=(
                "Em chưa rõ bạn muốn hỏi mẫu nào.\n"
                "Hiện bên em có các hãng: <b>VinFast, Move, Dibao, Yadea, Nijia, Honda, Yamaha</b>.\n"
                "Bạn muốn xem giá hãng hoặc mẫu nào ạ?"
            )
        )
        return []

    # ================================================================
    # Hàm trả về thông tin xe
    # ================================================================
    def _respond_with_bike_info(self, bike, dispatcher):
        name = f"<b>{bike.get('name','')}</b>"
        price = f"<b>{bike.get('price',0):,} VNĐ</b>"
        specs = bike.get("description", "Đang cập nhật...")

        dispatcher.utter_message(
            text=f"{name} đang có giá khoảng {price}.\n📋 Thông số: {specs}\nBạn muốn hỏi thêm gì nữa không ạ?"
        )
        return []
    
    # ================================================================
    # Hàm trả về số lượng xe theo màu (dùng cho intent hỏi xe + màu)
    # ================================================================
    def _respond_with_color_stock(self, bike, entity_color, dispatcher):
        if not entity_color:
            dispatcher.utter_message(text="Bạn vui lòng cho biết màu xe bạn muốn hỏi ạ.")
            return []

        color_clean = unidecode.unidecode(entity_color.lower())

        # Tìm màu trong danh sách ProductColors
        product_color = None
        for pc in bike.get("ProductColors", []):
            color_name_clean = unidecode.unidecode(pc["Color"]["name"].lower())
            if color_clean in color_name_clean:
                product_color = pc
                break

        if not product_color:
            dispatcher.utter_message(
                text=f"Xe <b>{bike['name']}</b> hiện <b>không có màu {entity_color}</b>."
            )
            return []

        quantity = product_color.get("stock_quantity", 0)

        # Chỉ in tên xe + màu + số lượng, KHÔNG in giá ở đây
        dispatcher.utter_message(
            text=f"Xe <b>{bike['name']}</b> màu <b>{entity_color}</b> hiện còn <b>{quantity}</b> chiếc trong kho."
        )
        return []

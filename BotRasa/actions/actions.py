import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from fuzzywuzzy import fuzz

class ActionHoiGiaXe(Action):
    def name(self):
        return "action_hoi_gia_xe"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        # === Lấy câu hỏi người dùng và làm sạch ===
        user_msg = tracker.latest_message.get("text", "").lower().strip()
        for word in ["giá xe", "xe điện", "xe máy điện", "bao nhiêu", "giá của", "giá", "bao nhieu", "xe"]:
            user_msg = user_msg.replace(word, "").strip()

        # === Gọi API BE lấy danh sách sản phẩm ===
        try:
            url = f"http://backend:3000/product?keyword={user_msg}"
            res = requests.get(url)
            res.raise_for_status()
            response = res.json()
            bikes = response.get("data", [])

            # Chuẩn hóa tên và công ty về chữ thường để so khớp
            for bike in bikes:
                bike["name_lower"] = bike.get("name", "").lower()
                bike["company_lower"] = bike.get("Company", {}).get("name", "").lower()
                bike["description_lower"] = bike.get("description", "").lower()

        except Exception as e:
            dispatcher.utter_message(text=f"❌ Lỗi khi lấy dữ liệu từ BE: {e}")
            return []

        # === Nhận diện hãng xe trong câu hỏi ===
        brand_responses = {
            "vinfast": "Xe VinFast bên em hiện có các dòng như: <b>Feliz S, Evo 200, Klara S</b> với giá từ <b>26–45 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "yadea": "Xe YADEA bên em hiện có các dòng như: <b>G5, Vigor, BuyE</b> với giá từ <b>20–35 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "dibao": "Xe Dibao bên em hiện có các dòng như: <b>Keva, Pansy S, Gogo SS</b> với giá từ <b>17–30 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "move": "Xe MOVE bên em hiện có các dòng như: <b>Isabella, Athena, Stronger Pro</b> với giá từ <b>11–24 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "nijia": "Xe NIJIA bên em hiện có các dòng như: <b>Mini, Cap A</b> với giá từ <b>9–18 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "yamaha": "Xe Yamaha bên em chỉ bán dòng <b>Yamaha Neo</b> giá khoảng <b>50 triệu đồng</b>. Bạn muốn hỏi xe nào?",
            "honda": "Xe Honda bên em chỉ bán dòng <b>Honda Icon</b> giá khoảng <b>40–45 triệu đồng</b>. Bạn muốn hỏi xe nào?"
        }

        detected_brand = None
        for brand in brand_responses.keys():
            if brand in user_msg:
                detected_brand = brand
                break

        # === Lọc theo hãng nếu người dùng hỏi hãng cụ thể ===
        if detected_brand:
            bikes = [b for b in bikes if detected_brand in b["company_lower"]]
            user_msg = user_msg.replace(detected_brand, "").strip()

        # === Tìm xe khớp nhất dựa trên tên ===
        best_match = None
        best_score = 0
        for bike in bikes:
            score = max(
                fuzz.ratio(bike["name_lower"], user_msg),
                fuzz.partial_ratio(bike["name_lower"], user_msg),
                fuzz.token_set_ratio(bike["name_lower"], user_msg)
            )
            if score > best_score:
                best_score = score
                best_match = bike

        # === Nếu tìm thấy xe cụ thể ===
        if best_score >= 60 and best_match:
            name = f"<b>{best_match.get('name','')}</b>"
            price = f"<b>{best_match.get('price',0):,} VNĐ</b>"
            specs = best_match.get("description", "Đang cập nhật...")
            dispatcher.utter_message(
                text=f"{name} có giá khoảng {price}.\n📋 Thông số kỹ thuật: {specs}. Bạn muốn hỏi thêm thông tin gì nữa ạ?"
            )
            return []

        # === Nếu chỉ hỏi hãng mà không nói mẫu ===
        if detected_brand:
            dispatcher.utter_message(text=brand_responses[detected_brand])
            return []

        # === Không tìm thấy gì ===
        dispatcher.utter_message(
            text=("Bên em chuyên phân phối các hãng MOVE, YADEA, DIBAO, NIJIA, "
                  "YAMAHA NEO, HONDA ICON, VinFast\n"
                  "Giá dao động từ 13 đến 70 triệu đồng tuỳ mẫu. Bạn muốn mua mẫu nào?")
        )
        return []

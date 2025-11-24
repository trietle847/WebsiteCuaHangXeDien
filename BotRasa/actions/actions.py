import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from fuzzywuzzy import fuzz
import unidecode

class ActionHoiGiaXe(Action):
    def name(self):
        return "action_hoi_gia_xe"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        # ================================================================
        # 1) Lấy entity từ NLU
        # ================================================================
        entities = tracker.latest_message.get("entities", [])

        entity_brand = next((e["value"] for e in entities if e["entity"] == "thuong_hieu"), None)
        entity_model = next((e["value"] for e in entities if e["entity"] == "mau_xe"), None)

        # Text gốc người dùng
        user_msg_raw = tracker.latest_message.get("text", "")
        user_msg_clean = unidecode.unidecode(user_msg_raw.lower())

        # ================================================================
        # 2) Gọi API BE lấy danh sách xe
        # ================================================================
        try:
            url = "http://localhost:3000/product"
            res = requests.get(url)
            res.raise_for_status()
            response = res.json()
            bikes = response.get("data", [])

            # Chuẩn hóa tên xe
            for bike in bikes:
                bike["name_clean"] = unidecode.unidecode(bike.get("name", "").lower())
                bike["company_clean"] = unidecode.unidecode(
                    bike.get("Company", {}).get("name", "").lower()
                )
        except Exception as e:
            dispatcher.utter_message(text=f"❌ Lỗi khi lấy dữ liệu từ BE: {e}")
            return []

        # ================================================================
        # 3) Nếu user hỏi 1 mẫu xe cụ thể (ưu tiên cao nhất)
        # ================================================================
        if entity_model:
            model_clean = unidecode.unidecode(entity_model.lower())

            # Tìm fuzzy mẫu xe
            best_match = None
            best_score = 0

            for bike in bikes:
                score = fuzz.token_set_ratio(bike["name_clean"], model_clean)
                if score > best_score:
                    best_score = score
                    best_match = bike

            if best_match and best_score >= 60:
                return self._respond_with_bike_info(best_match, dispatcher)

        # ================================================================
        # 4) Nếu user chỉ hỏi hãng xe (không chỉ mẫu)
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
        # 5) Không có entity → fuzzy search từ câu hỏi
        # ================================================================
        best_match = None
        best_score = 0

        for bike in bikes:
            score = max(
                fuzz.ratio(bike["name_clean"], user_msg_clean),
                fuzz.partial_ratio(bike["name_clean"], user_msg_clean),
                fuzz.token_set_ratio(bike["name_clean"], user_msg_clean)
            )
            if score > best_score:
                best_score = score
                best_match = bike

        # Nếu tìm thấy xe phù hợp
        if best_match and best_score >= 60:
            return self._respond_with_bike_info(best_match, dispatcher)

        # ================================================================
        # 6) Không tìm thấy gì — fallback
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
    # Hàm SEPARATE trả về thông tin xe
    # ================================================================
    def _respond_with_bike_info(self, bike, dispatcher):
        name = f"<b>{bike.get('name','')}</b>"
        price = f"<b>{bike.get('price',0):,} VNĐ</b>"
        specs = bike.get("description", "Đang cập nhật...")

        dispatcher.utter_message(
            text=f"{name} đang có giá khoảng {price}.\n📋 Thông số: {specs}\nBạn muốn hỏi thêm gì nữa không ạ?"
        )
        return []

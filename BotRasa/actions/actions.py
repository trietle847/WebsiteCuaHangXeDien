from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from fuzzywuzzy import fuzz
import json
import os

class ActionHoiGiaXe(Action):
    def name(self):
        return "action_hoi_gia_xe"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        # === Đọc dữ liệu xe ===
        project_root = os.path.dirname(os.path.dirname(__file__))
        data_path = os.path.join(project_root, "data", "products.json")

        try:
            with open(data_path, "r", encoding="utf-8") as f:
                bikes = json.load(f)
        except Exception as e:
            dispatcher.utter_message(text=f"❌ Lỗi khi đọc dữ liệu xe: {e}")
            return []

        # === Lấy câu hỏi người dùng ===
        user_msg = tracker.latest_message.get("text", "").lower().strip()
        print(f"[DEBUG] Người dùng hỏi: {user_msg}")

        # === Loại bỏ các từ không cần thiết ===
        for word in ["giá xe", "xe điện", "xe máy điện", "bao nhiêu", "giá của", "giá", "bao nhieu", "xe"]:
            user_msg = user_msg.replace(word, "").strip()
        print(f"[DEBUG] Sau khi làm sạch: {user_msg}")

        # === Nhận diện hãng xe trong câu hỏi ===
        brand_responses = {
            "vinfast": "Xe VinFast hiện có Feliz S, Evo 200, Klara S... giá từ **26–45 triệu đồng** 🇻🇳⚡",
            "yadea": "Các mẫu YADEA như G5, Vigor, BuyE... giá từ **20–35 triệu đồng** ⚡",
            "dibao": "Xe Dibao hiện có Keva, Pansy S, Gogo SS... giá từ **17–30 triệu đồng** ❤️",
            "move": "Xe MOVE có các mẫu Isabella, Athena, Stronger Pro... giá từ **11–24 triệu đồng** 🚗",
            "nijia": "Xe NIJIA có mẫu Mini, Cap A... giá từ **9–18 triệu đồng**.",
            "yamaha": "Yamaha Neo giá khoảng **50 triệu đồng**, pin lithium, chạy 70–100km/lần sạc.",
            "honda": "Honda Icon giá khoảng **40–45 triệu đồng**, động cơ 2000W, tiết kiệm điện."
        }

        detected_brand = None
        for brand in brand_responses.keys():
            if brand in user_msg:
                detected_brand = brand
                print(f"[DEBUG] Phát hiện hãng: {brand}")
                break

        # === Nếu phát hiện hãng → chỉ lọc xe của hãng đó ===
        if detected_brand:
            bikes = [b for b in bikes if detected_brand.lower() in b["name"].lower()]
            user_msg = user_msg.replace(detected_brand, "").strip()

        # === Tìm xe khớp nhất ===
        best_match = None
        best_score = 0

        for bike in bikes:
            name = bike["name"].lower()
            score = max(
                fuzz.ratio(name, user_msg),
                fuzz.partial_ratio(name, user_msg),
                fuzz.token_set_ratio(name, user_msg)
            )
            print(f"[DEBUG] So khớp '{name}' với '{user_msg}' = {score}")

            if score > best_score:
                best_score = score
                best_match = bike

        # === Nếu tìm thấy xe cụ thể ===
        if best_score >= 60 and best_match:
            price = f"{best_match['price']:,} VNĐ"
            specs = best_match.get("specifications", "Đang cập nhật...")
            dispatcher.utter_message(
                text=(f"🚘 **{best_match['name']}** có giá khoảng **{price}**.\n"
                      f"📋 Thông số kỹ thuật: {specs}")
            )
            print(f"[DEBUG] ✅ Trả về kết quả cho xe: {best_match['name']}")
            return []

        # === Nếu chỉ hỏi hãng mà không nói mẫu ===
        if detected_brand:
            dispatcher.utter_message(text=brand_responses[detected_brand])
            print(f"[DEBUG] 🏷️ Trả về mô tả hãng: {detected_brand}")
            return []

        # === Không tìm thấy gì ===
        print("[DEBUG] ❌ Không khớp xe hoặc hãng nào.")
        dispatcher.utter_message(
            text=("Bên em chuyên phân phối các hãng **MOVE, YADEA, DIBAO, NIJIA, "
                  "YAMAHA NEO, HONDA ICON, VinFast** 🇻🇳\n"
                  "Giá dao động từ **13 đến 70 triệu đồng** tuỳ mẫu.")
        )
        return []

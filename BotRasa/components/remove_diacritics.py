# components/remove_diacritics.py
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from rasa.engine.graph import GraphComponent, ExecutionContext
from rasa.shared.nlu.training_data.message import Message
from rasa.shared.nlu.constants import TEXT
import unicodedata
import re

@DefaultV1Recipe.register(
    component_types=["message_preprocessor"], is_trainable=False
)
class RemoveDiacriticsComponent(GraphComponent):
    """Component loại bỏ dấu tiếng Việt trước khi phân tích NLU"""

    @staticmethod
    def required_components():
        return []

    def __init__(self, config=None):
        self.config = config or {}

    @classmethod
    def create(cls, config, **kwargs):
        return cls(config)

    def convert_text(self, text: str) -> str:
        # Chuẩn hóa NFC -> NFD để tách dấu
        text = unicodedata.normalize("NFD", text)
        # Loại bỏ các ký tự dấu
        text = re.sub(r"[\u0300-\u036f]", "", text)
        # Loại bỏ các ký tự đặc biệt (tuỳ chọn)
        text = text.replace("đ", "d").replace("Đ", "D")
        return text

    def process(self, message: Message, **kwargs) -> None:
        text = message.get(TEXT)
        if text:
            clean_text = self.convert_text(text)
            message.set(TEXT, clean_text)

    def train(self, training_data, **kwargs):
        for example in training_data.training_examples:
            text = example.get(TEXT)
            if text:
                example.set(TEXT, self.convert_text(text))

import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import axios
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // State lưu log lỗi để debug dễ hơn trên giao diện
  const [nluResult, setNluResult] = useState("Chưa có dữ liệu...");

  // Tạo sender_id cố định cho mỗi lần F5 để Rasa nhớ ngữ cảnh
  const senderId = useRef("user_" + Math.floor(Math.random() * 1000000));
  const emojiBtnRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesRef = useRef(null);

  // URL Config
  const RASA_URL = "http://localhost:5005/webhooks/rest/webhook";
  const PARSE_URL = "http://localhost:5005/model/parse";

  // Danh sách Emoji (giữ nguyên của bạn)
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "☺️",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🥳",
    "🤩",
    "🥸",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👿",
    "👹",
    "👺",
    "💀",
    "☠️",
    "👻",
    "👽",
    "👾",
    "🤖",
    "💩",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "🤫",
    "🤭",
    "🫠",
    "🥴",
    "😵",
    "😵‍💫",
    "🤐",
    "🥱",
    "😪",
    "😴",
    "😌",
    "🤤",
    "😮",
    "😯",
    "😲",
    "😳",
    "🥵",
    "🥶",
    "😦",
    "😧",
    "😨",
    "😰",
    "😥",
    "😢",
    "😭",
    "😱",
    "😖",
    "😣",
    "😞",
    "😓",
    "😩",
    "😫",
    "🥱",
    "😤",
    "😡",
    "😠",
    "🤬",
    "😈",
    "👿",
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      addMessage(
        "Xin chào! Emotor ở đây để hỗ trợ bạn. Vui lòng đặt câu hỏi!",
        "bot"
      );
    }
  };

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const addEmoji = (emoji) => {
    setUserInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Xử lý click ra ngoài để đóng emoji
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        emojiBtnRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !emojiBtnRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
    // Scroll xuống cuối
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 50);
  };

  // Hàm gọi API phân tích NLU (Intent/Entities)
  const analyzeNLU = async (text) => {
    try {
      // Axios tự động stringify body và parse JSON response
      const res = await axios.post(PARSE_URL, { text });
      const data = res.data;

      const intent = data.intent?.name || "Không xác định";
      const score = data.intent?.confidence?.toFixed(3) || "N/A";
      const entities = data.entities || [];

      let entityList = entities
        .map(
          (e) =>
            `${e.entity}: "${e.value}" (score: ${
              e.confidence_entity?.toFixed(3) || "?"
            })`
        )
        .join("\n");
      if (!entityList) entityList = "(Không có entity nào)";

      setNluResult(
        `🧠 Phân tích NLU\n\nNgười dùng: ${text}\nIntent: ${intent}\nConfidence: ${score}\nEntities:\n${entityList}`
      );
    } catch (err) {
      console.error("Lỗi NLU:", err);
      setNluResult(`⚠️ Lỗi NLU: ${err.message}`);
    }
  };

  // Hàm gửi tin nhắn chính
  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text) return;

    addMessage(text, "user");
    setUserInput("");

    try {
      // Gửi tin nhắn đến Rasa qua Axios
      const res = await axios.post(RASA_URL, {
        sender: senderId.current,
        message: text,
      });

      // Axios trả về dữ liệu trong res.data
      const data = res.data;

      if (data && data.length > 0) {
        data.forEach((msg) => {
          if (msg.text) addMessage(msg.text, "bot");
          if (msg.image)
            addMessage(
              `<img src="${msg.image}" alt="img" style="max-width:100%"/>`,
              "bot"
            );
        });
      } else {
        // Trường hợp bot không trả lời gì (thường do lỗi logic action hoặc chưa train)
        // addMessage("Bot đang suy nghĩ... (nhưng không trả lời)", "bot");
      }

      // Gọi NLU để debug (chạy ngầm)
      analyzeNLU(text);
    } catch (err) {
      console.error("Lỗi Chat:", err);
      if (err.code === "ERR_NETWORK") {
        addMessage(
          "⚠️ Lỗi kết nối: Server Rasa chưa bật hoặc bị chặn CORS.",
          "bot"
        );
      } else {
        addMessage(`⚠️ Lỗi hệ thống: ${err.message}`, "bot");
      }
    }
  };

  return (
    <div>
      {/* ICON NỔI */}
      <div className="chatbot-icon" onClick={toggleChat}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="bot"
        />
      </div>

      {isOpen && (
        <div className="chat-app">
          <div id="chat-container">
            <div id="header">
              <div className="title">🤖 Chat với Emotor</div>
              <div className="subtitle">“Chạy xanh – Sống chất”</div>
            </div>

            <div id="messages" ref={messagesRef}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={msg.sender === "user" ? "user-msg" : "bot-msg"}
                  // Lưu ý: dangerouslySetInnerHTML cần cẩn thận XSS, nhưng với bot nội bộ thì tạm ổn
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
              ))}
              {/* Hiển thị kết quả NLU debug nhỏ ở dưới cùng nếu cần kiểm tra */}
              {/* <div style={{fontSize: '10px', color: '#888', padding: '10px', whiteSpace: 'pre-wrap'}}>{nluResult}</div> */}
            </div>

            <div id="input-container">
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
              />

              <button
                id="emoji-btn"
                ref={emojiBtnRef}
                onClick={toggleEmojiPicker}
              >
                🤖
              </button>

              {showEmojiPicker && (
                <div id="emoji-picker" ref={emojiPickerRef}>
                  {emojis.map((emoji) => (
                    <span key={emoji} onClick={() => addEmoji(emoji)}>
                      {emoji}
                    </span>
                  ))}
                </div>
              )}

              <button id="send-btn" onClick={sendMessage}>
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="#0078ff" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

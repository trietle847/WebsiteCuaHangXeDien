import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [nluResult, setNluResult] = useState("Chưa có dữ liệu...");

  const senderId = useRef("user_" + Math.floor(Math.random() * 1000000));
  const emojiBtnRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesRef = useRef(null);

  const rasaUrl = "http://localhost:5005/webhooks/rest/webhook";
  const parseUrl = "http://localhost:5005/model/parse";

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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 50);
  };

  const analyzeNLU = async (text) => {
    try {
      const res = await fetch(parseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
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
      setNluResult("⚠️ Không thể phân tích NLU!");
    }
  };

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text) return;
    addMessage(text, "user");
    setUserInput("");
    try {
      const res = await fetch(rasaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: senderId.current, message: text }),
      });
      const data = await res.json();
      data.forEach((msg) => {
        if (msg.text) addMessage(msg.text, "bot");
      });
      setTimeout(() => analyzeNLU(text), 300);
    } catch (err) {
      addMessage("⚠️ Không thể kết nối Rasa!", "bot");
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
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                ></div>
              ))}
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

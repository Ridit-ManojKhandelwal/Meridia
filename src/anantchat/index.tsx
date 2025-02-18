import React, { useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { SendOutlined } from "@ant-design/icons";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Import a Highlight.js theme (you can choose any theme)
import "./style.css";

export default function AnantChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Highlight code using highlight.js
  const highlightCode = (code: any) => {
    return hljs.highlightAuto(code).value; // Auto-detect and highlight the code
  };

  // Check if message contains code (between triple backticks)
  const isCode = (text: any) => text.startsWith("```") && text.endsWith("```");

  // Render code messages with highlighted code, other messages as regular text
  const renderMessage = (msg: any) => {
    if (isCode(msg.text)) {
      const code = msg.text.slice(3, -3).trim(); // Remove the surrounding backticks
      const highlightedCode = highlightCode(code);

      return (
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      );
    }
    return <p>{msg.text}</p>; // Regular text
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    const response = await window.electron.sendMessage(message);
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "bot", text: response },
    ]);
    // setMessage("");
  };

  return (
    <div className="anantchat-wrapper">
      <h2>AnantChat</h2>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <PerfectScrollbar>
            <div key={index} className={msg.role === "bot" ? "bot" : "user"}>
              <strong>{msg.role === "bot" ? "Gemini" : "You"}:</strong>
              {renderMessage(msg)}
            </div>
          </PerfectScrollbar>
        ))}
      </div>
      <div className="chat-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask AnantChat anything..."
        />
        <button onClick={sendMessage}>
          <SendOutlined />
        </button>
      </div>
    </div>
  );
}

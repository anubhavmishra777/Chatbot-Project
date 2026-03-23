import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! Main Gimmi hoon. Main aapki kya madad kar sakta hoon?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Naya message aate hi niche scroll karne ke liye
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const tempInput = input;
    setInput("");

    try {
      // Backend URL (127.0.0.1 Windows par best chalta hai)
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: tempInput
      });

      const botMsg = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "Oops! Backend se connection nahi ho paya.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="chat-header">
        <div className="status-dot"></div>
        <h1>Gimmi AI</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper bot">
            <div className="message-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-container">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Gimmi se kuch puchiye..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
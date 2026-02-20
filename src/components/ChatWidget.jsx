import React, { useState, useEffect, useRef } from 'react';
import { Fab, Box, Paper, Typography, IconButton, TextField } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import './ChatWidget.css'; // Import the new CSS file

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Landmark Assistant. Ask me anything about your trip!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: 'user' };
    const currentInput = input;

    // Create a snapshot of the history including the new message
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:8080/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput, 
          history: updatedHistory 
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { text: "Connection error.", sender: 'bot' }]);
    }
  };

  return (
    <Box className="chat-widget-container">
      {isOpen && (
        <Paper elevation={6} className="chat-window">
          {/* Header */}
          <Box className="chat-header">
            <Typography variant="h6" className="chat-header-title">
              Landmark Chat
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)} 
              className="white-icon"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box className="chat-messages-area">
            {messages.map((msg, i) => (
              <Box key={i} className={`message-row ${msg.sender}`}>
                <Paper className={`message-bubble ${msg.sender}`}>
                  <Typography variant="body2" style={{ color: 'inherit' }}>
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box className="chat-input-area">
            <TextField
              fullWidth size="small" variant="outlined" placeholder="Ask about travel..."
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              className="send-btn"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Fab 
        color="primary" 
        onClick={() => setIsOpen(!isOpen)} 
        className="chat-fab"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
};

export default ChatWidget;
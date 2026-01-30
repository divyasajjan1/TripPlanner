import React, { useState, useEffect, useRef } from 'react';
import { Fab, Box, Paper, Typography, IconButton, TextField } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Landmark Assistant. Ask me anything about your trip!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  
  // Reference to the invisible div at the bottom of the chat
  const messagesEndRef = useRef(null);

  // Function to scroll the message area to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Automatically scroll whenever the 'messages' array changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    const currentInput = input;

    // Update UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      // Note: Ensure your Django server is running on port 8080 as per your URL
      const response = await fetch('http://127.0.0.1:8080/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.answer, sender: 'bot' }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev, 
        { text: "Sorry, I'm having trouble connecting to my brain right now.", sender: 'bot' }
      ]);
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      {/* Chat Window */}
      {isOpen && (
        <Paper 
          elevation={6} 
          sx={{ 
            width: 320, height: 450, mb: 2, display: 'flex', flexDirection: 'column',
            borderRadius: 3, overflow: 'hidden' 
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Landmark Chat</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                <Paper sx={{ 
                  p: 1.5, 
                  maxWidth: '80%', 
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'white', 
                  color: msg.sender === 'user' ? 'white' : 'black', 
                  borderRadius: 2 
                }}>
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            ))}
            {/* The magic anchor div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1.5, display: 'flex', borderTop: '1px solid #ddd', bgcolor: 'white' }}>
            <TextField
              fullWidth 
              size="small" 
              variant="outlined" 
              placeholder="Ask about travel..."
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevents cursor moving to new line
                  handleSend();
                }
              }}
            />
            <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Floating Action Button */}
      <Fab color="primary" onClick={() => setIsOpen(!isOpen)} aria-label="chat">
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
};

export default ChatWidget;
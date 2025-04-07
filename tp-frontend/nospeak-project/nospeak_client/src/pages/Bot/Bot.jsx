import React, { useState, useRef, useEffect } from 'react';
import { SpotifyBody } from '../Home/styles';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from './styles';
import { StyledButton, Input } from '../../styled-components/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx';

const ThinkingIndicator = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '4px',
    padding: '8px 12px',
    backgroundColor: '#333',
    borderRadius: '10px',
    color: '#FFA130'
  }}>
    <div style={{ 
      display: 'flex', 
      gap: '4px', 
      alignItems: 'center' 
    }}>
      <CircularProgress size={20} style={{ color: '#FFA130' }} />
    </div>
  </div>
);

export default function Bot({ client }) {
  const [messages, setMessages] = useState([
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector(state => state.user.user);

  useEffect(() => {
    // Simulate loading time or add actual initialization logic
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // const checkPlotExists = async (filename) => {
  //   try {
  //     const plotPath = process.env.PUBLIC_URL + `/plots/${filename}`;
  //     const response = await fetch(plotPath, { method: 'HEAD' });
  //     return response.ok ? plotPath : null;
  //   } catch (error) {
  //     console.error('Error checking plot:', error);
  //     return null;
  //   }
  // };

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: input, 
        sender: 'user',
        plot_data: null 
      }]);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        isLoading: true,
        sender: 'bot',
        plot_data: null
      }]);

      try {
        const chatHistory = messages.map(msg => ({
          content: msg.text,
          sender: msg.sender
        }));

        console.log("Chat history: ", chatHistory);

        const response = await axios.post('http://127.0.0.1:8000/nospeak-app/api/chat/', {
          question: input,
          chat_history: chatHistory
        });

        const { response: botResponse, plot_data } = response.data;
        
        setMessages(prev => prev.slice(0, -1));

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: botResponse,
          sender: 'bot',
          plot_data: plot_data
        }]);

      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev.slice(0, -1), {
          id: prev.length,
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'bot',
          plot_data: null
        }]);
      }

      setInput('');
    }
  };
  if (loading) {
    return <CircularIndeterminate />;
  }

  return (
    <SpotifyBody>
      <Sidebar client={client} />
      <BodyContainer>
        <h1 style={{ color: '#fff', margin: '20px 0 20px 20px' }}>Chipi Bot</h1>
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '10px',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
            }}>
              <Avatar 
                style={{
                  marginRight: message.sender === 'user' ? 0 : '10px',
                  marginLeft: message.sender === 'user' ? '10px' : 0,
                }}
                src={message.sender === 'user' ? `https://i.pravatar.cc/150?u=${user.name}` : process.env.PUBLIC_URL + '/logo_nospeak_bot.png'}
              >
              </Avatar>
              {message.isLoading ? (
                <ThinkingIndicator />
              ) : (
                <div style={{
                  maxWidth: '60%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#333',
                  color: '#fff'
                }}>
                  <ReactMarkdown components={{
                    // Override default paragraph styling
                    p: ({node, ...props}) => (
                      <p style={{ margin: '0', padding: '0' }} {...props} />
                    )
                  }}>
                    {message.text}
                  </ReactMarkdown>
                  {message.plot_data && (
                    <img 
                      src={`data:image/png;base64,${message.plot_data}`} 
                      alt="plot" 
                      style={{ width: '80%', marginTop: '10px' }} 
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{ flex: 1, marginRight: '10px', width: '80%', borderRadius: '20px' }}
          />
          <StyledButton 
            onClick={handleSend} 
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              padding: '0', 
              justifyContent: 'center', 
              alignItems: 'center', 
              margin: '0'
            }}
          >
            <ArrowUpwardIcon />
          </StyledButton>
        </div>
      </BodyContainer>
    </SpotifyBody>
  );
}
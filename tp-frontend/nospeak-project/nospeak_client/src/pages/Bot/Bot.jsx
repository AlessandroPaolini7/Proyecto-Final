import React, { useState, useRef, useEffect } from 'react';
import { SpotifyBody } from '../Home/styles';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
import { StyledButton, Input } from '../../styled-components/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';


export default function Bot({ client }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot', plot_url: null },
    { id: 2, text: "Hi, I work as a community manager and I'm about to launch a campaign for our product. I want to add some pictures of a well-known singer, like Taylor Swift, but I don't know how she's doing lately. Make a chart showing the average user ratings for her last 10 songs.", sender: 'user', plot_url: null },
    { id: 3, text: "I'm processing your request. Please wait.", sender: 'bot', plot_url: null },
    { id: 4, text: "Here is the line chart showing the score review of the last 10 Taylor Swift songs, with scores ranging from 4.8 to 3.3. The chart displays a downward trend in the ratings, as reflected in the decreasing scores from 'Carolina' to 'Delicate'", sender: 'bot', plot_url: process.env.PUBLIC_URL + '/output.png' },

  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const user = useSelector(state => state.user.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { id: prev.length + 1, text: input, sender: 'user' }]);
      setInput('');
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, text: "I'm processing your request. Please wait.", sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    <SpotifyBody>
      <Sidebar client={client} />
      <BodyContainer css={`
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #121212;
      `}>
        <h1 style={{ color: '#fff', margin: '20px 0 20px 20px' }}>Chipi Bot</h1>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
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
              <div style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: message.sender === 'user' ? '#333' : '#333',
                color: '#fff'
              }}>
                {message.text}
                {message.plot_url && <img src={message.plot_url} alt="plot" style={{ width: '80%', marginTop: '10px' }} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{
          display: 'flex',
          padding: '20px',
          marginBottom: '0px',
          borderTop: '1px solid #333',
          height: '40px',
        }}>
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
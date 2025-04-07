import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container, 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice';
import { FormControlLabel, Checkbox } from '@mui/material';

const StyledCard = styled(Card)(({ theme, selected }) => ({
  minWidth: 300,
  maxWidth: 400,
  height: 500, // Fixed height for both cards
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, border 0.3s ease-in-out',
  transform: selected ? 'scale(1.02)' : 'scale(1)',
  border: selected ? `2px solid #FFA130` : 'none',
  borderRadius: '10px',
  backgroundColor: '#000000',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ContinueButton = styled(Button)(() => ({
  color: '#white',
  padding: '10px 40px',
  borderRadius: '90px',
  fontWeight: 'bold',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: '#FF8C00',
    transform: 'scale(1.05)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#666', // darker color when disabled
    color: 'rgb(153, 153, 153)',
  },
}));

const PricingTier = ({ client }) => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isTrial, setIsTrial] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const tiers = [
    {
      title: 'Free',
      price: '$0',
      period: '/month',
      isPremium: false,
      features: [
        'Create up to 2 listen lists',
        'Create up to 3 collections',
        'Follow other users',
        'Basic song recommendations',
      ]
    },
    {
      title: 'Creator',
      price: '$4.99',
      period: '/month',
      isPremium: true,
      features: [
        'All Free features',
        'Unlimited listen lists',
        'Unlimited collections',
        'Detailed analytics powered by ChipiBot',
        'Advanced song and user recommendations',
        'Priority support'
      ]
    }
  ];

  const handleContinue = async () => {
    if (selectedTier !== null) {
      try {
        // If trial is selected, treat as premium regardless of tier selection
        const isPremium = isTrial || tiers[selectedTier].isPremium;
        
        const response = await client.patch(`/api/user/${user.id}`, {
          isPremium: isPremium,
          isTrial: isTrial,
          trialStartDate: isTrial ? new Date().toISOString() : null,
        });

        if (response.status === 200) {
          dispatch(loginSuccess({
            isAuthenticated: true,
            user: { 
              ...user,
              isPremium: isPremium,
              isTrial: isTrial,
              trialStartDate: isTrial ? new Date().toISOString() : null,
            }
          }));

          navigate('/home');
        }
      } catch (error) {
        console.error('Error updating user tier:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(0deg, black, rgb(39, 39, 39))',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ color: 'white', mb: 6 }}
        >
          Choose your plan
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            mb: 6,
            flexWrap: 'wrap'
          }}
        >
          {tiers.map((tier, index) => (
            <StyledCard 
              key={index}
              selected={selectedTier === index}
              onClick={() => setSelectedTier(index)}
            >
              <CardContent sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h4" component="div" gutterBottom>
                    {tier.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" component="span">
                      {tier.price}
                    </Typography>
                    <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
                      {tier.period}
                    </Typography>
                  </Box>
                  <List>
                    {tier.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ padding: '4px 0' }}>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: '#FFA130' }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={isTrial}
                onChange={(e) => setIsTrial(e.target.checked)}
                sx={{
                  color: '#FFA130',
                  '&.Mui-checked': {
                    color: '#FFA130',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'white' }}>
                Try Creator features free for 15 days
              </Typography>
            }
          />

            <ContinueButton 
              variant="contained" 
              disabled={selectedTier === null && !isTrial}
              onClick={handleContinue}
              size="large"
              isTrial={isTrial}
            >
              Continue
            </ContinueButton>
          </Box>
      </Container>
    </Box>
  );
};

export default PricingTier;

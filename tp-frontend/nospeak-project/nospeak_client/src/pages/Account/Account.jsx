import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx';
import {
    Avatar,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
} from '@mui/material';
import {
    StyledPaper,
    ProfileCard,
    StyledTextField,
    StatsContainer,
    StatItem,
    ReviewsContainer,
    ReviewCard,
    ButtonContainer,
    PageContainer,
    GridContainer,
    TabPanel,
    ReviewContent,
    SongInfo,
    ReviewHeader,
    ReviewDate,
    Score,
    SpotifyBody
} from './styles';

export default function Account({client}) {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [goToInicio, setGoToInicio] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const response = await client.get(`/api/user/${user.id}`);
                    setUserData(response.data);
                    setFormData(prev => ({
                        ...prev,
                        email: response.data.email,
                        name: response.data.name,
                    }));
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchData();
    }, [user, client]);

    if (!user) return <Navigate to="/login" />;
    if (loading) return <CircularIndeterminate />;
    if (goToInicio) return <Navigate to="/" />;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async () => {
        try {
            await client.patch(`/api/user/${user.id}`, {
                email: formData.email,
                name: formData.name,
            });
            // Add success notification here
        } catch (error) {
            console.error('Error updating profile:', error);
            // Add error notification here
        }
    };

    const handleUpdatePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            // Add error notification here
            return;
        }
        try {
            await client.patch(`/api/user/${user.id}`, {
                password: formData.newPassword
            });
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            // Add success notification here
        } catch (error) {
            console.error('Error updating password:', error);
            // Add error notification here
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await client.delete(`/api/user/${user.id}`);
            dispatch(logout());
            setGoToInicio(true);
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <SpotifyBody style={{ overflowY: "hidden", height: "100%" }}>
            <Sidebar style={{ overflowY: "hidden" }}/>
            <PageContainer style={{ overflowY: "hidden" }}>
                <GridContainer style={{ overflowY: "hidden" }}>
                  <StyledPaper>
                      <Tabs
                          value={tabValue}
                          onChange={(e, newValue) => setTabValue(newValue)}
                          textColor="inherit"
                          indicatorColor="primary"
                      >
                          <Tab label="Profile" style={{ fontWeight: "bold" }} />
                          <Tab label="Password" style={{ fontWeight: "bold" }} />
                          <Tab label="Reviews" style={{ fontWeight: "bold" }} />
                      </Tabs>

                      {tabValue === 0 && (
                          <TabPanel>
                              <StyledTextField
                                  fullWidth
                                  label="Email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                              />
                              <StyledTextField
                                  fullWidth
                                  label="Username"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                              />
                              <Button 
                                  style={{ 
                                    fontWeight: "bold",
                                    borderRadius: "20px", 
                                    height: '40px',
                                    color: '#fff',
                                    boxShadow: 'none',
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
                                  }}
                                  sx={{
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                      backgroundColor: '#faa130'
                                    }
                                  }}
                                  variant="contained"
                                  onClick={handleUpdateProfile}
                              >
                                  Save Changes
                              </Button>
                          </TabPanel>
                      )}

                      {tabValue === 1 && (
                          <TabPanel>
                              <StyledTextField
                                  fullWidth
                                  type="password"
                                  label="Current Password"
                                  name="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleInputChange}
                              />
                              <StyledTextField
                                  fullWidth
                                  type="password"
                                  label="New Password"
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                              />
                              <StyledTextField
                                  fullWidth
                                  type="password"
                                  label="Confirm New Password"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                              />
                              <Button 
                              style={{ 
                                fontWeight: "bold",
                                borderRadius: "20px", 
                                height: '40px',
                                color: '#fff',
                                boxShadow: 'none',
                                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
                              }}
                              sx={{
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                  backgroundColor: '#faa130'
                                }
                              }}
                                  variant="contained"
                                  onClick={handleUpdatePassword}
                              >
                                  Update Password
                              </Button>
                          </TabPanel>
                      )}

                      {tabValue === 2 && (
                          <TabPanel>
                              <ReviewsContainer>
                                  {userData.reviews?.map((review) => (
                                      <ReviewCard key={review._id}>
                                          <ReviewHeader>
                                              <Score>{review.score}/5</Score>
                                              <ReviewDate>
                                                  {new Date(review.creation_date).toLocaleDateString()}
                                              </ReviewDate>
                                          </ReviewHeader>
                                          <ReviewContent>
                                              <Typography>{review.description}</Typography>
                                          </ReviewContent>
                                          <SongInfo>
                                              <Avatar
                                                  src={review.song.artist.picture}
                                                  sx={{ mr: 2 }}
                                              />
                                              <div>
                                                  <Typography variant="subtitle1">
                                                      {review.song.title}
                                                  </Typography>
                                                  <Typography variant="body2" color="white">
                                                      {review.song.artist.name}
                                                  </Typography>
                                              </div>
                                          </SongInfo>
                                      </ReviewCard>
                                  ))}
                              </ReviewsContainer>
                          </TabPanel>
                      )}
                  </StyledPaper>
                  <ProfileCard>
                        <Avatar
                            src={userData.picture}
                            sx={{ width: 150, height: 150, mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {userData.name}
                        </Typography>
                        <StatsContainer>
                            <StatItem>
                                <Typography variant="h6">{userData.followersCount}</Typography>
                                <Typography variant="body2">Followers</Typography>
                            </StatItem>
                            <StatItem>
                                <Typography variant="h6">{userData.reviewsCount}</Typography>
                                <Typography variant="body2">Reviews</Typography>
                            </StatItem>
                        </StatsContainer>
                        <ButtonContainer>
                            <Button style={{ 
                                    fontWeight: "bold",
                                    borderRadius: "20px", 
                                    height: '40px',
                                    color: '#fff',
                                    boxShadow: 'none',
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    backgroundColor: '#414141'
                                  }}
                                  sx={{
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                      backgroundColor: '#faa130'
                                    }
                                  }}
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDeleteDialog(true)}
                            >
                                Delete Account
                            </Button>
                            <Button style={{ 
                                    fontWeight: "bold",
                                    borderRadius: "20px", 
                                    color: '#fff',
                                    height: '40px',
                                    boxShadow: 'none',
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"
                                  }}
                                  sx={{
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                      backgroundColor: '#faa130'
                                    }
                                  }}
                                variant="contained"
                                onClick={() => dispatch(logout())}
                            >
                                Logout
                            </Button>
                        </ButtonContainer>
                    </ProfileCard>
                </GridContainer>

                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleDeleteAccount} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </PageContainer>
        </SpotifyBody>
    );
}

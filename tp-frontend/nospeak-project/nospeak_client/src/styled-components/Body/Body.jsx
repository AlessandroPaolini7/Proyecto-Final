import React, { useState } from 'react';
import Header from './Header.jsx';
import MediaControlCard from './MediaControlCard.jsx';
import { BodyContainer } from './styles.js';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from './styles';
import { StyledButton, StyledButtonSecondary, Input, Label } from '../styles.js';
import { useSelector } from 'react-redux';
import axios from '../../interceptors/axiosConfig.js';
import{
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../../pages/Artist/styles.js';
import Rating from '@mui/material/Rating';


export default function Body({ client }) {
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [songs, setSongs] = React.useState([]);
    const [deleteAlertData, setDeleteAlertData] = React.useState(null);
    const [score, setScore] = useState(0);
    const user = useSelector(state => state.user.user);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [reviewAlertData, setReviewAlertData] = useState(null);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);   

    const handleDeleteConfirm = async (alertData) => {
        try {
        
          await client.delete(`/api/songs/${alertData.songId}/`);
    
          const updatedSongs = [...songs];
          updatedSongs.splice(alertData.indexToRemove, 1);
          setSongs(updatedSongs);

          setDeleteAlertData(null);
        } catch (error) {
          console.error('Error al eliminar la canción:', error);
        }
      };
    
      const handleDeleteCancel = () => {
        setDeleteAlertData(null);
      };

    React.useEffect(() => {

        axios.get('/api/songs/')
        .then(response => {
            setSongs(response.data);
            setFilteredSongs(response.data);
        })
        .catch(error => {
            console.error('Error al obtener las canciones:', error);
        });

    }, [user]);

    React.useEffect(() => {
        if (reviewAlertData) {
          setRating(reviewAlertData.currentRating || 0);
          setReview('');
        }
      }, [reviewAlertData]);

      React.useEffect(() => {
        const fetchSongs = async () => {
          try {
            const [songsResponse, reviewsResponse] = await Promise.all([
              axios.get('/api/songs/'),
              axios.get(`/api/reviews-user/${user.id}`)
            ]);
      
            const songsData = songsResponse.data;
            const userReviews = reviewsResponse.data;
      
            const songsWithReviews = songsData.map(song => {
              const userReview = userReviews.find(review => review.song._id === song._id);
              return userReview 
                ? {...song, userRating: userReview.score, userReview: userReview.description, reviewId: userReview._id}
                : song;
            });
      
            setSongs(songsWithReviews);
            setFilteredSongs(songsWithReviews);
          } catch (error) {
            console.error('Error al obtener las canciones o reviews:', error);
          }
        };
      
        fetchSongs();
      }, [user]);
    
      const handleSaveReview = async () => {
        try {
          let response;
          if (reviewAlertData.reviewId) {
            response = await axios.patch(`/api/reviews/${reviewAlertData.reviewId}`, {
              score: rating,
              description: review
            });
          } else {
            response = await axios.post('/api/reviews', {
              song: reviewAlertData.songId,
              user: user.id,
              score: rating,
              description: review
            });
          }
    
          if (response.status === 200 || response.status === 201) {
            console.log('Review saved/updated successfully');
            
            const updatedSongs = songs.map(song => 
              song._id === reviewAlertData.songId 
                ? {...song, userRating: rating, userReview: review, reviewId: response.data._id}
                : song
            );
            setSongs(updatedSongs);
            setFilteredSongs(updatedSongs);
            
            setReviewAlertData({
              ...reviewAlertData,
              reviewId: response.data._id
            });
            
            setReview('');
            setRating(0);
          }
        } catch (error) {
          console.error('Error saving/updating review:', error);
        }
      };


    return (
        <>
            <BodyContainer>
                <Header songs={songs} setFilteredSongs={setFilteredSongs} />
                <MediaControlCard
                    client={client}
                    songs={filteredSongs} 
                    setSongs={setSongs}
                    style={{ marginBottom: -150 }}
                    setDeleteAlertData={setDeleteAlertData}
                    userPlaylists={userPlaylists}
                    setReviewAlertData={setReviewAlertData}
                />
            </BodyContainer>
            {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Eliminar canción</AlertTitle>
                    <AlertText>
                        ¿Estás seguro de que deseas eliminar la canción "{deleteAlertData?.songTitle}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm(deleteAlertData)}>
                        Eliminar
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
 {reviewAlertData && (
  <CustomEditAlert>
    <EditAlertContent>
      <EditAlertTitle>{reviewAlertData?.songTitle} review</EditAlertTitle>
      <EditAlertText>
        <Label style={{marginBottom: '10px', marginTop: '10px'}}>Rating</Label>
        <Rating
          name="review-rating"
          value={rating}
          precision={0.5}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <Label style={{marginBottom: '0px', marginTop: '10px'}}>Review description</Label>
        <Input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </EditAlertText>
      <EditAlertButtonContainer>
        <StyledButtonSecondary onClick={() => setReviewAlertData(null)}>Close</StyledButtonSecondary>
        <StyledButton onClick={handleSaveReview}>Save</StyledButton>
      </EditAlertButtonContainer>
    </EditAlertContent>
  </CustomEditAlert>
)}
        </>
        
    );
}

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { 
    cardStyle, 
    TitleContainer, 
    IconContainer,
    StyledAddCircle, 
    StyledEditIcon, 
    StyledDeleteIcon,
    StyledCard,

} from './styles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';

export default function MediaControlCard({client, songs, setSongs, setDeleteAlertData, setReviewAlertData}) {
    const user = useSelector((state) => state.user.user);
    const [userHistorial, setUserHistorial] = useState(null);
    const [value, setValue] = useState(2);
    const [hover, setHover] = useState(-1);

    const handleDelete = (songId, index) => {
        const songToDelete = songs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.title,
          indexToRemove: index,
        });
      };

    const fetchUserHistorial = () => {
        if (user && user.id) {
            client.get(`/api/historiales-usuario/${user.id}`)
            .then(response => {
                setUserHistorial(response.data);
            })
            .catch(error => {
                console.error('Error fetching user historial:', error);
            });
        }
    };
      

  
    useEffect(() => {

        fetchUserHistorial();
    }, [user]);


    const isSongInHistorial = (songId) => {
        if (userHistorial && userHistorial.canciones) {
            return userHistorial.canciones.some((cancion) => cancion._id === songId);
        }
        return false;
    };

    const handleFavoriteClick = async (songId) => {
        const isSongInHistorial = userHistorial && userHistorial.canciones.some((cancion) => cancion._id === songId);
    
        if (isSongInHistorial) {
            const updatedCanciones = userHistorial.canciones.filter((cancion) => cancion._id !== songId);
            userHistorial.canciones = updatedCanciones;
        } else {
            if (!userHistorial.canciones) {
                userHistorial.canciones = {};
            }
            const songToAdd = songs.find((cancion) => cancion._id === songId);
            userHistorial.canciones.push(songToAdd);
        }
    
        try {

            await client.patch(`/api/historiales/${userHistorial._id}/`, userHistorial);
            setUserHistorial({ ...userHistorial });
        } catch (error) {
            console.error('Error al actualizar el historial:', error);
        }
    };
    const handleReview = (songId, index, newRating) => {
        const song = songs[index];
        const updatedSongs = songs.map((s, i) => 
          i === index ? {...s, userRating: newRating} : s
        );
        setSongs(updatedSongs);
        
        setReviewAlertData({
          songId: songId,
          songTitle: song.title,
          indexToRemove: index,
          currentRating: newRating,
          reviewId: song.reviewId || '', 
          currentReview: song.userReview || ''
        });
    };

    const handleCommentClick = (song, index) => {
        if (song.userReview || song.userRating) {
            setReviewAlertData({
                songId: song._id,
                songTitle: song.title,
                indexToRemove: index,
                currentRating: song.userRating || 0,
                reviewId: song.reviewId,
                currentReview: song.userReview || ''
            });
        }
    };

    return (
        <>
            <TitleContainer>
                <h1 style={{color: 'white'}}>Songs</h1>
                <IconContainer>
                    {user.isAdmin && (
                    <Link to={{ pathname: `/song/${0}` }}>
                        <StyledAddCircle sx={{ color: '#FFA130'}} />
                    </Link>)}
                </IconContainer>
            </TitleContainer>
            <React.Fragment>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap:5 }}>
                    {songs.map((song, index) => (
                        <StyledCard key={index} sx={{ display: 'flex', width: 300, marginBottom: 5, marginLeft:2, borderRadius: '10px' }}>
                        <Box sx={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5" color="white">
                                    {song.title}
                                </Typography>
                                <Typography variant="subtitle1" color="white" component="div">
                                    {song.artist.name}
                                </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 1, pb: 1}}>
                                {user.isAdmin && (
                                    <IconButton aria-label="delete" onClick={() => handleDelete(song._id, index)}>
                                        <StyledDeleteIcon sx={{ color: 'white' }} />
                                    </IconButton>
                                )}
                                {user.isAdmin && (
                                    <IconButton aria-label="edit">
                                        <Link to={{ pathname: `/song/${song._id}` }}>
                                            <StyledEditIcon sx={{ color: 'white' }} />
                                        </Link>
                                    </IconButton>
                                )}
                                <Rating
                                    name={`rating-${song._id}`}
                                    value={song.userRating || 0}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        handleReview(song._id, index, newValue);
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                    }}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <IconButton 
                                    onClick={() => handleReview(song._id, index, song.userRating || 0)}
                                    sx={{
                                        padding: 0,
                                        marginLeft: 2,
                                        marginRight: 2,
                                    }}
                                >
                                    <CommentIcon
                                        sx={{
                                            height: 25,
                                            width: 25,
                                            color: (song.userReview || song.userRating) ? 'white' : 'grey',
                                            cursor: (song.userReview || song.userRating) ? 'pointer' : 'default',
                                            '&:hover': {
                                                color: (song.userReview || song.userRating) ? '#ffa130' : 'grey',
                                            }
                                        }}
                                    />
                                </IconButton>
                            </Box>
                            
                        </Box>
                        <CardMedia
                            component="img"
                            sx={{ width: 160 }}
                            src={song.artist.picture}
                            alt={`${song.title} album cover`}
                        />
                        </StyledCard>
                    ))}
                </Box>
            </React.Fragment>
        </>
        
    );
}

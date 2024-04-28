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

export default function Body({ client }) {
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [songs, setSongs] = React.useState([]);

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const user = useSelector(state => state.user.user);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [reviewAlertData, setReviewAlertData] = useState(null);

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
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Review description</Label>
                                <Input
                                    type="text"
                                    value={""}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary >Cancel</StyledButtonSecondary>
                                <StyledButton >Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
            )}
        </>
        
    );
}

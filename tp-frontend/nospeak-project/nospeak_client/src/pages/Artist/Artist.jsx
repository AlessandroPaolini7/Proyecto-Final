import React from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js';
import {
    CollectionContainer,
    CardContainer,
    TableContainerStyled,
    StyledH1
} from '../Song/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledDeleteIcon, StyledEditIcon } from '../../styled-components/Body/styles';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from '../../styled-components/Body/styles';
import { 
    StyledButton, 
    StyledButtonSecondary,
    Input,
    Label
} from '../../styled-components/styles';
import { 
    CardRightContainer, 
    ImageCollection, 
    CardLeftContainer, 
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from './styles';
import { Navigate } from 'react-router-dom';


const columns = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'genre', label: 'Genre', minWidth: 100}
  ];


const ArtistPage = ({client}) => {

    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const { artistId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [deleteArtistAlertData, setDeleteArtistAlertData] = React.useState(null);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [editedArtist, setEditedArtist] = useState({
        name: '',
        nationality: '',
        followers: '',
        cover: '',
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);

    const user = useSelector(state => state.user.user);


    useEffect(() => {

        client.get(`/api/artists/${artistId}/`)
          .then(response => {
            setArtist(response.data)
            setEditedArtist(response.data)
          })
          .catch(error => console.error('Error fetching artist:', error));
        
        client.get(`/api/songs-artist/${artistId}/`)
          .then(response => setSongs(response.data))
          .catch(error => console.error('Error fetching artist songs:', error));
      }, [artistId]);

      const handleDeleteSong = (songId, index) => {
        const songToDelete = songs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.title,
          indexToRemove: index,
        });
        }

    const handleDeleteConfirm = async () => {
        const updatedSongs = songs.filter(song => song._id !== deleteAlertData.songId);
        setSongs(updatedSongs);

        try {
            await client.delete(`/api/songs/${deleteAlertData.songId}/`);
            setDeleteAlertData(null);
        } catch (error) {
            console.error('Error updating songs of artist:', error);
        }
    };
    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
        setDeleteArtistAlertData(null);
      };

    const handleDeleteArtist = () => {
        setDeleteArtistAlertData(true);
    }

    const handleDeleteArtistConfirm = async () => {
        try {
            await client.delete(`/api/artists/${artistId}/`);
            setDeleteAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }
    
    const formatFollowers = (followers) => {
        return followers.toLocaleString();
    };

    const handleEditButtonClick = () => {
        setIsEditAlertOpen(true);
      };

      const handleCloseAlert = () => {
        setIsEditAlertOpen(false);
      };

      const handleSaveButtonClick = async () => {
        try {
            await client.patch(`/api/artists/${artistId}/`, editedArtist);
            setArtist(editedArtist);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating artist:', error);
        }
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar />
                <BodyContainer css={`align-items: center;`}>
                    <CollectionContainer>
                    {artist ? (
                        <CardContainer>
                            <CardLeftContainer>
                                <ImageCollection src={artist.cover}></ImageCollection>
                            </CardLeftContainer>

                            <CardRightContainer style={{ paddingBottom: '30px' }}>
                                <p style={{ marginBottom: '0', marginTop: '20px' }}>Artista</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em' }}>{artist.name}</StyledH1>
                                <p style={{ margin: '0' }}>{artist.nationality}</p>
                                <p style={{ margin: '0' }}>{formatFollowers(artist.followers)} followers.</p>
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {user.isAdmin && (
                                    <>
                                        <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick} />
                                        <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeleteArtist()}/>
                                    </>)}
                                    </div>
                            </div>
                        </CardContainer>

                        ) : (
                            <p>Loading user information...</p>
                        )}
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table  sx={{ margin: 0 }}>
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                  key={column.id}
                                                  align={column.align}
                                                  style={{ minWidth: column.minWidth, backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold' }}
                                                >
                                                  {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {songs.map((song, rowIndex) => ( 
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song.code}>
                                                {columns.map((column, columnIndex) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                    >
                                                        {column.id === 'option' && columnIndex === 0 && user.isAdmin ? (
                                                            <StyledDeleteIcon fontSize="small" cursor="pointer" onClick={() => handleDeleteSong(song.id, rowIndex)}/>
                                                        ) : null}
                                                        {column.id === 'title' && columnIndex === 1 ? (
                                                            <span>{song.title}</span>
                                                        ) : null}
                                                        {column.id === 'genre' && columnIndex === 2 ? (
                                                            <span>{song.genre}</span>
                                                        ) : null}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TableContainerStyled>
                    </CollectionContainer>
                </BodyContainer>
            </SpotifyBody>
          {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Delete song</AlertTitle>
                    <AlertText>
                        Are you sure you want to delete the song "{deleteAlertData?.songTitle}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancel</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm()}>
                        Delete
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
            {isEditAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Edit artist</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Name</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.name}
                                    onChange={event => setEditedArtist({ ...editedArtist, name: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nationality</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.nationality}
                                    onChange={event => setEditedArtist({ ...editedArtist, nationality: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Followers</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.followers}
                                    onChange={event => setEditedArtist({ ...editedArtist, followers: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Input
                                    type="text"
                                    value={editedArtist.cover}
                                    onChange={event => setEditedArtist({ ...editedArtist, cover: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
                // </Overlay>
                
            )}
            {deleteArtistAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Delete artist</AlertTitle>
                    <AlertText>
                        Are you sure you want to delete the artist "{artist?.name}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancel</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteArtistConfirm()}>
                        Delete
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
    )
}

export default ArtistPage;


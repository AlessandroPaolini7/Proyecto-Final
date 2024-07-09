import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar.jsx'
import { BodyContainer } from '../../styled-components/Body/styles.js';
import { SpotifyBody } from '../Home/styles.js'
import { CollectionContainer, CardContainer, TableContainerStyled, CardRightContainer} from './styles.js';
import { CardLeftContainer, ImageCollection } from '../Song/styles.js';
import {StyledH1, UsuarioContainer} from './styles.js';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledDeleteIcon } from '../../styled-components/Body/styles.js';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import { StyledEditIcon } from '../../styled-components/Body/styles.js';
import { format } from 'date-fns';
import {
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
  } from '../../styled-components/Body/styles.js';
import { StyledButton, StyledButtonSecondary, Input, Label } from '../../styled-components/styles.js';
import{
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../Artist/styles.js';
import { Navigate } from 'react-router-dom';


const columns = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'artist', label: 'Artist', minWidth: 170 },
    { id: 'genre', label: 'Genre', minWidth: 100}
  ];

const columnsAlert = [
    { id: 'option', label: '', minWidth: 10 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'artist', label: 'Artist', minWidth: 170 }
  ];


const Collection = ({client}) => {
    const { collectionId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [collection, setCollection] = useState([]);
    const [collectionSongs, setCollectionSongs] = useState([]);
    const [allSongs, setAllSongs] = useState([]);

    const [showAddSongsAlert, setShowAddSongsAlert] = useState(false);

    const [selectedSongs, setSelectedSongs] = useState([]);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [deleteCollectionAlertData, setDeleteCollectionAlertData] = React.useState(null);

    const [editedCollection, setEditedCollection] = useState({
        titulo: '',
        descripcion: '',
        portada: '',
        usuario: '',
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);

    

    const handleAddSongsClick = () => {
        try{
            client.get('/api/songs/')
            .then(response => {
                const songsNotInCollection = response.data.filter(song => !collectionSongs.some(collectionSong => collectionSong._id === song._id));
                setAllSongs(songsNotInCollection);
                setShowAddSongsAlert(true);
            })
        } catch (error){
            console.error('Error fetching songs:', error);
        }
        
    };



    const fetchCollectionAndSongs = async (collectionId) => {
        try {
          const response = await client.get(`/api/collections/${collectionId}/`);
          console.log(response.data);
          console.log(response.data.songs);
          setCollection(response.data);    
          setCollectionSongs(response.data.songs);
          response.data.user = response.data.user._id

          response.data.songs = response.data.songs.map(song => ({
            ...song,
            artist: song.artist._id,
        }));

          setEditedCollection(response.data)
        } catch (error) {
          console.error('Error fetching collection info:', error);
        }
      };
    
      useEffect(() => {
        fetchCollectionAndSongs(collectionId);
      }, [collectionId]);
    

    

    const handleDeleteSong = (songId, index) => {
        const songToDelete = collectionSongs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.title,
          indexToRemove: index,
        });
        }

        const handleDeleteConfirm = async () => {
            const updatedSongs = collectionSongs.filter(song => song._id !== deleteAlertData.songId);
            setCollectionSongs(updatedSongs);
        
            const songsToUpdate = updatedSongs.map(song => ({
                ...song,
                artist: song.artist._id,
            }));
        
            try {
                await client.patch(`/api/collections/${collectionId}/`, { songs: songsToUpdate });
                setDeleteAlertData(null);
            } catch (error) {
                console.error('Error updating collection:', error);
            }
        };
    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
        setDeleteCollectionAlertData(null);
      };

    const handleDeleteCollection = () => {
        setDeleteCollectionAlertData(true);
    }

    const handleDeleteCollectionConfirm = async () => {
        try {
            await client.delete(`/api/collections/${collectionId}/`);
            setDeleteCollectionAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting collection:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }

    const handleAddSongToCollection = async (songId) => {
        const updatedSongs = [...collectionSongs, allSongs.find(song => song._id === songId)];
        
        setCollectionSongs(updatedSongs);
        setAllSongs(allSongs.filter(song => song._id !== songId))
      
        const songsToUpdate = updatedSongs.map(song => ({
          ...song,
          artist: song.artist._id,
        }));
      
        try {
          await client.patch(`/api/collections/${collectionId}/`, { songs: songsToUpdate });
          setSelectedSongs([]);

        } catch (error) {
          console.error('Error updating collection:', error);
        }
      };

      const handleEditButtonClick = () => {
        setIsEditAlertOpen(true);
      };

      const handleCloseAlert = () => {
        setIsEditAlertOpen(false);
      };

      const handleSaveButtonClick = async () => {
        try {
            await client.patch(`/api/collections/${collectionId}/`, editedCollection);
            setCollection(editedCollection);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating collection:', error);
        }
    };
      
    
    return (
        <>
            <SpotifyBody>
                <Sidebar/>
                <BodyContainer css={`align-items: center;`}>
                    <CollectionContainer>
                        <CardContainer>
                            <CardLeftContainer>
                                <ImageCollection src={collection.portada}></ImageCollection>
                            </CardLeftContainer>
                            
                            <CardRightContainer style={{paddingBottom: '30px'}}>
                                <p>Collection</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em'}}>{collection.title}</StyledH1>
                                <p>{collection.description}</p>
                                {collection.user ? (
                                    <UsuarioContainer className="user-date-container">
                                        <p className="user">{collection.user.name}</p>
                                        <p className="date">Created on: {format(new Date(collection.creation_date), 'MMMM dd, yyyy')}</p>
                                    </UsuarioContainer>
                                ) : (
                                    <p>Loading user information...</p>
                                )}
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick}/>
                                    <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeleteCollection()} />
                                </div>
                            </div>
                        </CardContainer>
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440}}>
                                <Table  sx={{margin: 0}}>
                                    <TableHead >
                                        <TableRow >
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
                                    {collectionSongs
                                        .map((song, rowIndex) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song._id}>
                                            {columns.map((column, columnIndex) => (
                                                <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                >
                                                {column.id === 'option' && columnIndex === 0 ? (
                                                    <StyledDeleteIcon fontSize="small" cursor="pointer" onClick={() => handleDeleteSong(song._id, rowIndex)}/>
                                                ) : null}
                                                {column.id === 'title' && columnIndex === 1 ? (
                                                    <span>{song.title}</span>
                                                ) : null}
                                                {column.id === 'artist' && columnIndex === 2 ? (
                                                    <span>{song.artist.name}</span>
                                                ) : null}
                                                {column.id === 'genre' && columnIndex === 3 ? (
                                                    <span>{song.genre}</span>
                                                ) : null}
                                                </TableCell>
                                            ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ButtonContainer style={{justifyContent: 'end', paddingRight: '40px'}}>
                                <StyledButton style={{width: '20%'}} onClick={handleAddSongsClick}>Add songs</StyledButton>
                            </ButtonContainer>
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
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancelar</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteConfirm()}>
                        Delete
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
            {showAddSongsAlert && (
                <Overlay>
                    <AlertContainer style={{backgroundColor: '#242424', width: '30%'}}>
                    <AlertTitle style={{marginBottom: '20px'}}>Add songs</AlertTitle>
                    <TableContainer sx={{ maxHeight: 440, marginBottom: '20px'}}>
                                <Table  sx={{margin: 0}}>
                                    <TableHead >
                                        <TableRow >
                                            {columnsAlert.map((column) => (
                                                <TableCell
                                                key={columnsAlert.id}
                                                align={columnsAlert.align}
                                                style={{ minWidth: columnsAlert.minWidth, backgroundColor: 'transparent', color: '#fff', fontWeight: 'bold' }}
                                                
                                                >
                                                {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {allSongs
                                        .map((song, rowIndex) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={song._id}>
                                            {columnsAlert.map((column, columnIndex) => (
                                                <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                >
                                                {column.id === 'option' && columnIndex === 0 ? (
                                                    <PlaylistAdd
                                                    onClick={() => handleAddSongToCollection(song._id)}
                                                    style={{
                                                      cursor: 'pointer',
                                                      color: selectedSongs.includes(song._id) ? 'green' : 'inherit',
                                                    }}
                                                  />
                                                ) : null}
                                                {column.id === 'title' && columnIndex === 1 ? (
                                                    <span>{song.title}</span>
                                                ) : null}
                                                {column.id === 'artist' && columnIndex === 2 ? (
                                                    <span>{song.artist.name}</span>
                                                ) : null}
                                                </TableCell>
                                            ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                    </TableContainer>
                    <ButtonContainer style={{marginTop: '20px'}}>
                        <StyledButtonSecondary style={{marginRight: '5px'}} onClick={() => setShowAddSongsAlert(false)}>Cancel</StyledButtonSecondary>
                        <StyledButton style={{marginLeft: '5px'}} onClick={() => setShowAddSongsAlert(false)}>Save</StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
                )}
                {isEditAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Edit collection</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Title</Label>
                                <Input
                                    type="text"
                                    value={editedCollection.title}
                                    onChange={event => setEditedCollection({ ...editedCollection, title: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Description</Label>
                                <Input
                                    type="text"
                                    value={editedCollection.description}
                                    onChange={event => setEditedCollection({ ...editedCollection, description: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Input
                                    type="text"
                                    value={editedCollection.cover}
                                    onChange={event => setEditedCollection({ ...editedCollection, cover: event.target.value })}
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
            {deleteCollectionAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Delete collection</AlertTitle>
                    <AlertText>
                        Are you sure you want to delete the collection "{collection?.title}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancel</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteCollectionConfirm()}>
                        Delete
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>  
        );
}

export default Collection;
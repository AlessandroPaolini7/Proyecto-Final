import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar.jsx'
import { BodyContainer } from '../../styled-components/Body/styles.js';
import { SpotifyBody } from '../Home/styles.js'
import { CollectionContainer, CardContainer, TableContainerStyled, CardRightContainer} from '../Collection/styles.js';
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
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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


const ListenList = ({client}) => {
    const { listenListId } = useParams();

    const [deleteAlertData, setDeleteAlertData] = React.useState(null);

    const [listenList, setListenList] = useState([]);
    const [listenListSongs, setListenListSongs] = useState([]);
    const [allSongs, setAllSongs] = useState([]);

    const [showAddSongsAlert, setShowAddSongsAlert] = useState(false);

    const [selectedSongs, setSelectedSongs] = useState([]);

    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);

    const [deleteListenListAlertData, setDeleteListenListAlertData] = React.useState(null);

    const [editedListenList, setEditedListenList] = useState({
        title: '',
        description: '',
        cover: '',
        user: '',
    });

    const [goToLibrary, setGoToLibrary] = React.useState(false);

    

    const handleAddSongsClick = () => {
        try{
            client.get('/api/songs/')
            .then(response => {
                const songsNotInListenList = response.data.filter(song => !listenListSongs.some(listenListSong => listenListSong._id === song._id));
                setAllSongs(songsNotInListenList);
                setShowAddSongsAlert(true);
            })
        } catch (error){
            console.error('Error fetching songs:', error);
        }
        
    };



    const fetchListenListAndSongs = async (listenListId) => {
        try {
          const response = await client.get(`/api/listenLists/${listenListId}/`);
          console.log(response.data);
          console.log(response.data.songs);
          console.log(listenList.picture)
          setListenList(response.data);    
          setListenListSongs(response.data.songs);
          response.data.user = response.data.user._id

          response.data.songs = response.data.songs.map(song => ({
            ...song,
            artist: song.artist._id,
        }));

          setEditedListenList(response.data)
        } catch (error) {
          console.error('Error fetching listenlist info:', error);
        }
      };
    
      useEffect(() => {
        fetchListenListAndSongs(listenListId);
      }, [listenListId]);
    

    

    const handleDeleteSong = (songId, index) => {
        const songToDelete = listenListSongs[index];
        setDeleteAlertData({
          songId: songToDelete._id,
          songTitle: songToDelete.title,
          indexToRemove: index,
        });
        }

        const handleDeleteConfirm = async () => {
            const updatedSongs = listenListSongs.filter(song => song._id !== deleteAlertData.songId);
            setListenListSongs(updatedSongs);
        
            const songsToUpdate = updatedSongs.map(song => ({
                ...song,
                artist: song.artist._id,
            }));
        
            try {
                await client.patch(`/api/listenLists/${listenListId}/`, { songs: songsToUpdate });
                setDeleteAlertData(null);
            } catch (error) {
                console.error('Error updating listenList:', error);
            }
        };
    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
        setDeleteListenListAlertData(null);
      };

    const handleDeleteListenList = () => {
        setDeleteListenListAlertData(true);
    }

    const handleDeleteListenListConfirm = async () => {
        try {
            await client.delete(`/api/listenLists/${listenListId}/`);
            setDeleteListenListAlertData(null);
            setGoToLibrary(true);

        } catch (error) {
            console.error('Error deleting listenList:', error);
        }
    };

    if (goToLibrary) {
        return <Navigate to="/library" />;
    }

    const handleAddSongToListenList = async (songId) => {
        const updatedSongs = [...listenListSongs, allSongs.find(song => song._id === songId)];
        
        setListenListSongs(updatedSongs);
        setAllSongs(allSongs.filter(song => song._id !== songId))
      
        const songsToUpdate = updatedSongs.map(song => ({
          ...song,
          artist: song.artist._id,
        }));
      
        try {
          await client.patch(`/api/listenLists/${listenListId}/`, { songs: songsToUpdate });
          setSelectedSongs([]);

        } catch (error) {
          console.error('Error updating listenList:', error);
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
            await client.patch(`/api/listenLists/${listenListId}/`, editedListenList);
            setListenList(editedListenList);
            setIsEditAlertOpen(false);
        } catch (error) {
            console.error('Error updating listenList:', error);
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
                                <ImageCollection src={"https://picsum.photos/id/222/300/300"}></ImageCollection>
                            </CardLeftContainer>
                            
                            <CardRightContainer style={{paddingBottom: '30px'}}>
                                <p>ListenList</p>
                                <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em'}}>{listenList.title}</StyledH1>
                                <p>{listenList.description}</p>
                                {listenList.user ? (
                                    <UsuarioContainer className="user-date-container">
                                        <p className="user">{listenList.user.name}</p>
                                        <p className="date">Created on: {format(new Date(listenList.creation_date), 'MMMM dd, yyyy')}</p>
                                    </UsuarioContainer>
                                ) : (
                                    <p>Loading user information...</p>
                                )}
                            </CardRightContainer>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:'20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StyledEditIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={handleEditButtonClick}/>
                                    <StyledDeleteIcon style={{ color: 'white', margin: '5px', fontSize: '36px' }} onClick={() => handleDeleteListenList()} />
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
                                    {listenListSongs
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
                                                    onClick={() => handleAddSongToListenList(song._id)}
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
                            <EditAlertTitle style={{marginBottom: '10px', marginTop: '0px'}}>Edit ListenList</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '20px'}}>Title</Label>
                                <Input
                                    type="text"
                                    value={editedListenList.title}
                                    onChange={event => setEditedListenList({ ...editedListenList, title: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Description</Label>
                                <Input
                                    type="text"
                                    value={editedListenList.description}
                                    onChange={event => setEditedListenList({ ...editedListenList, description: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        >
                                        Upload file
                                        <VisuallyHiddenInput type="file" />
                                </Button>
                            </EditAlertText>
                            <EditAlertButtonContainer style={{marginBottom: '0px'}}>
                                <StyledButtonSecondary style={{marginBottom: '0px'}} onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton style={{marginBottom: '0px'}} onClick={handleSaveButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
                // </Overlay>
                
            )}
            {deleteListenListAlertData && (
                <Overlay>
                    <AlertContainer>
                    <AlertTitle>Delete ListenList</AlertTitle>
                    <AlertText>
                        Are you sure you want to delete the ListenList "{listenList?.title}"?
                    </AlertText>
                    <ButtonContainer>
                        <StyledButtonSecondary style={{width: '50%', marginRight: '5px'}} onClick={handleDeleteCancel}>Cancel</StyledButtonSecondary>
                        <StyledButton style={{backgroundColor: '#FF5630', width: '50%', marginLeft: '5px'}} onClick={() => handleDeleteListenListConfirm()}>
                        Delete
                        </StyledButton>
                    </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>  
        );
}

export default ListenList;
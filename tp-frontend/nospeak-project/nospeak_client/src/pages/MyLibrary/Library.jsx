import React, { useState, useEffect } from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer} from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Header from '../../styled-components/Body/Header';
import { NavContainer, NavItem, CollectionBox, CollectionDescription, CollectionGrid, CollectionImage, CollectionName } from './styles';
import { ArtistBox, ArtistImage, ArtistName, TableContainerStyled,
ComboBoxContainer, ComboBoxOption, ComboBoxOptions } from './styles';
import { Navigate, useLocation } from 'react-router-dom';
import { StyledAddCircle, IconContainer } from '../../styled-components/Body/styles';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { 
    EditAlertTitle,
    CustomEditAlert,
    EditAlertButtonContainer,
    EditAlertContent,
    EditAlertText, 
} from '../Artist/styles';
import { 
    StyledButton, 
    StyledButtonSecondary,
    Input,
    Label
} from '../../styled-components/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledH1 } from '../Collection/styles';

const columns = [
    { id: 'titulo', label: 'Titulo', minWidth: 170 },
    { id: 'artista', label: 'Artista', minWidth: 170 }
  ];

const Library = ({client}) => {

    const categories = ['Collections', 'Artists', 'ListenLists', 'Made for You'];

    const location = useLocation();

    const [goToCollection, setGoToCollection] = React.useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0]); 
    const [goToArtist, setGoToArtist] = React.useState(false);

    const [collectionData, setCollectionData] = useState([]);
    const [artists, setArtists] = useState([]);

    const [listenlistData, setListenListData] = useState([]);

    const [isComboBoxOpen, setIsComboBoxOpen] = useState(false);

    const [isCreateArtistAlertOpen, setIsCreateArtistAlertOpen] = useState(false);

    const [isCreateListenListAlertOpen, setIsCreateListenListAlertOpen] = useState(false);

    const [isCreateCollectionAlertOpen, setIsCreateCollectionAlertOpen] = useState(false);

    const [newArtista, setNewArtista] = useState({
        name: '',
        nationality: '',
        followers: '',
        cover: '',
    });

    const [newListenList, setNewListenList] = useState({
        title: '',
        cover: '',
    });

    const user = useSelector(state => state.user.user);

    const [newCollection, setNewCollection] = useState({
        songs: [],
        title: '',
        description: '',
        cover: '',
        user: user.id
    });

    // TODO: Fetch user reviews

    const [recommendedSongs, setRecommendedSongs] = useState([]);

    useEffect(() => {

        client.get(`/api/collections-user/${user.id}`)
            .then(response => {
                setCollectionData(response.data);
            })
            .catch(error => {
                console.error('Error fetching collections:', error);
            });
    

        client.get('/api/listenlists/')
            .then(response => {
                setListenListData(response.data);
            })
            .catch(error => {
                console.error('Error fetching listenlists:', error);
            });
    

        client.get('/api/artists/')
            .then(response => {
                setArtists(response.data);
            })
            .catch(error => {
                console.error('Error fetching artists:', error);
            });
    }, []);

    // const fetchUserHistorial = () => {
    //     if (user && user.id) {
    //       client
    //         .get(`/api/historiales-usuario/${user.id}`)
    //         .then((response) => {
    //           setUserHistorial(response.data);
  
    //           const lastFiveSongs = response.data.canciones
    //             .slice(-5)
    //             .map((cancion) => cancion.titulo);
  
    //           client
    //             .post('http://127.0.0.1:8000/nospeak-app/api/recomendaciones/', {
    //                 song_names: lastFiveSongs,
    //             })
    //             .then((response) => {
    //               setRecommendedSongs(response.data.recommended_songs);
    //             })
    //             .catch((error) => {
    //               console.error('Error fetching recommendations:', error);
    //             });
    //         })
    //         .catch((error) => {
    //           console.error('Error fetching user historial:', error);
    //         });
    //     }
    //   };
      

  
    // useEffect(() => {

    //     fetchUserHistorial();
    // }, [user]);
    

      if (goToArtist && location.pathname !== "/artist") {
        return <Navigate to="/artist" />;
    }

    if (goToCollection && location.pathname !== "/collection") {
        return <Navigate to="/collection" />;
    }

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };



    const handleComboBoxButtonClick = () => {
        if (user.isAdmin) {
          setIsComboBoxOpen(!isComboBoxOpen);
        } else {
            if(activeCategory === 'Collections')
                handleOptionClick('collection');
        }
      };

    const handleOptionClick = (option) => {
        if(option === 'collection'){
            setIsCreateCollectionAlertOpen(true)

        }
        if(option === 'artist'){
            setIsCreateArtistAlertOpen(true)
        }
        if(option === 'listenlist'){
            setIsCreateListenListAlertOpen(true)

        }
        setIsComboBoxOpen(false);
    };

    const handleCloseAlert = () => {
        setIsCreateArtistAlertOpen(false);
        setIsCreateListenListAlertOpen(false);
        setIsCreateCollectionAlertOpen(false)
      };

      const handleSaveArtistaButtonClick = async () => {
        try {
            await client.post(`/api/artists/`, newArtista);
            setNewArtista({
                name: '',
                nationality: '',
                followers: '',
                cover: '',
            });
            setIsCreateArtistAlertOpen(false);
        } catch (error) {
            console.error('Error creating artist:', error);
        }
    };

    const handleSaveListenListButtonClick = async () => {
        try {
            await client.post(`/api/listenlists/`, newListenList);
            setNewListenList({
                title: '',
                cover: ''
            });
            setIsCreateListenListAlertOpen(false);
        } catch (error) {
            console.error('Error creating listenlist:', error);
        }
    };

    const handleSaveCollectionButtonClick = async () => {
        try {
            await client.post(`/api/collections/`, newCollection);
            setNewCollection({
                songs: [],
                title: '',
                description: '',
                cover: '',
                user: user.id
            });
            setIsCreateCollectionAlertOpen(false);
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar client={client}/>
                <BodyContainer css={`align-items: center;`}>
                    <Header/>
                    <h1 style={{color: '#fff', marginLeft: '10px'}}>Library</h1>

                    <NavContainer>
                        {categories.map(category => (
                            <NavItem
                                key={category}
                                onClick={() => handleCategoryChange(category)} 
                                active={category === activeCategory}
                            >
                            {category}
                            </NavItem>
                        ))}
                        
                        <IconContainer>
                            <StyledAddCircle   sx={{
            color: user.isAdmin || activeCategory === 'Collections' ? '#FFA130' : 'gray',
            cursor: user.isAdmin || activeCategory === 'Collections' ? 'pointer' : 'not-allowed',
        }}
         onClick={handleComboBoxButtonClick}/>
                            {isComboBoxOpen && (
                                <ComboBoxContainer>
                                    <ComboBoxOptions>
                                        <ComboBoxOption onClick={() => handleOptionClick('collection')}>
                                        Create collection
                                        </ComboBoxOption>
                                        <ComboBoxOption onClick={() => handleOptionClick('artist')}>
                                        Create artist
                                        </ComboBoxOption>
                                        <ComboBoxOption onClick={() => handleOptionClick('listenlist')}>
                                        Create Listenlist
                                        </ComboBoxOption>
                                    </ComboBoxOptions>
                                </ComboBoxContainer>
                                )}
                        </IconContainer>
                    </NavContainer>
                    <CollectionGrid>
                        {activeCategory === 'Collections' && (
                            collectionData.map((collection, index) => (
                            <Link key={index} to={`/collection/${collection._id}`}>
                                <CollectionBox key={index}>
                                    <CollectionImage src={collection.cover}></CollectionImage>
                                    <CollectionName>{collection.title}</CollectionName>
                                    <CollectionDescription>{collection.user.name}</CollectionDescription>
                                </CollectionBox>
                            </Link>
                        ))
                        )}
                        
                        {activeCategory === 'Artists' && (
                            artists.map((artist, index) => (
                                <Link key={index} to={`/artist/${artist._id}`}>
                                    <ArtistBox key={index}>
                                        <ArtistImage src={artist.cover} alt={artist.name} onClick={() => {setGoToArtist(true);}} />
                                        <ArtistName>{artist.name}</ArtistName>
                                    </ArtistBox>
                                </Link>
                            ))
                        )}
                        {activeCategory === 'ListenLists' && (
                            listenlistData.map((listenlist, index) => (
                                <Link key={index} to={`/listenlist/${listenlist._id}`}>
                                    <CollectionBox key={index}>
                                        <CollectionImage src={listenlist.cover}></CollectionImage>
                                        <CollectionName>{listenlist.title}</CollectionName>
                                    </CollectionBox>
                                </Link>
                            ))
                        )}
                        
                    </CollectionGrid>
                    {activeCategory === 'Made for You' && (
                            <TableContainerStyled>
                                <StyledH1 style={{color: 'white', fontSize: '2em', marginLeft: '10px', marginBottom: '5px'}}>Canciones recomendadas para añadir basadas en tus favoritos</StyledH1>
                            <TableContainer sx={{ maxHeight: 440 }}>
                              <Table sx={{ margin: 0 }}>
                                <TableHead>
                                  <TableRow>
                                    {columns.map((column) => (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                          minWidth: column.minWidth,
                                          backgroundColor: 'transparent',
                                          color: '#fff',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {column.label}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {recommendedSongs.map((song, rowIndex) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                      {columns.map((column, columnIndex) => (
                                        <TableCell
                                          align={column.align}
                                          sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                          key={column.id}
                                        >
                                          {column.id === 'title' && columnIndex === 0 ? (
                                            <span style={{ color: 'white' }}>{song.title}</span>
                                          ) : null}
                                          {column.id === 'artist' && columnIndex === 1 ? (
                                            <span>{song.artist}</span>
                                          ) : null}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </TableContainerStyled>
                          
                        )}
                </BodyContainer>
            </SpotifyBody>
            {isCreateArtistAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Create artist</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Name</Label>
                                <Input
                                    type="text"
                                    value={newArtista.name}
                                    onChange={event => setNewArtista({ ...newArtista, name: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Nationality</Label>
                                <Input
                                    type="text"
                                    value={newArtista.nationality}
                                    onChange={event => setNewArtista({ ...newArtista, nationality: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Followers</Label>
                                <Input
                                    type="text"
                                    value={newArtista.followers}
                                    onChange={event => setNewArtista({ ...newArtista, followers: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Input
                                    type="text"
                                    value={newArtista.cover}
                                    onChange={event => setNewArtista({ ...newArtista, cover: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveArtistaButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>

            )}
            {isCreateListenListAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Create Listenlist</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Title</Label>
                                <Input
                                    type="text"
                                    value={newListenList.title}
                                    onChange={event => setNewListenList({ ...newListenList, title: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Input
                                    type="text"
                                    value={newListenList.cover}
                                    onChange={event => setNewListenList({ ...newListenList, cover: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveListenListButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
            )}
            {isCreateCollectionAlertOpen && (
                // <Overlay>
                    <CustomEditAlert>
                        <EditAlertContent>
                            <EditAlertTitle>Create Collection</EditAlertTitle>
                            <EditAlertText>
                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Title</Label>
                                <Input
                                    type="text"
                                    value={newCollection.title}
                                    onChange={event => setNewCollection({ ...newCollection, title: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Description</Label>
                                <Input
                                    type="text"
                                    value={newCollection.description}
                                    onChange={event => setNewCollection({ ...newCollection, description: event.target.value })}
                                />

                                <Label style={{marginBottom: '0px', marginTop: '10px'}}>Cover</Label>
                                <Input
                                    type="text"
                                    value={newCollection.cover}
                                    onChange={event => setNewCollection({ ...newCollection, cover: event.target.value })}
                                />
                            </EditAlertText>
                            <EditAlertButtonContainer>
                                <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
                                <StyledButton onClick={handleSaveCollectionButtonClick}>Save</StyledButton>
                            </EditAlertButtonContainer>
                        </EditAlertContent>
                    </CustomEditAlert>
            )}
        </>
    )
}

export default Library
import React, { useState, useEffect } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Header from '../../styled-components/Body/Header';
import { NavContainer, NavItem, CollectionBox, CollectionDescription, CollectionGrid, CollectionImage, CollectionName } from './styles';
import { ArtistBox, ArtistImage, ArtistName, TableContainerStyled, ComboBoxContainer, ComboBoxOption, ComboBoxOptions } from './styles';
import { Navigate, useLocation } from 'react-router-dom';
import { StyledAddCircle, IconContainer } from '../../styled-components/Body/styles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  Label,
} from '../../styled-components/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { StyledH1 } from '../Collection/styles';

import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx'; // Importa tu componente de carga
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'artist', label: 'Artist', minWidth: 170 },
];

const Library = ({ client }) => {
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
    description: '',
    cover: '',
    songs: [],
  });

  const user = useSelector((state) => state.user.user);

  const [newCollection, setNewCollection] = useState({
    songs: [],
    title: '',
    description: '',
    cover: '',
    user: user.id,
  });
  const [userReviews, setUserReviews] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    client
      .get(`/api/collections-user/${user.id}`)
      .then((response) => {
        setCollectionData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching collections:', error);
        setLoading(false);
      });

    client
      .get('/api/listenlists/')
      .then((response) => {
        setListenListData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching listenlists:', error);
        setLoading(false);
      });

    client
      .get('/api/artists/')
      .then((response) => {
        setArtists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching artists:', error);
        setLoading(false);
      });
  }, []);

  const fetchUserReviews = async () => {
    if (user && user.id) {
      try {
        // Obtener las reviews del usuario
        const response = await client.get(`/api/reviews-user/${user.id}`);
        const reviews = response.data;
  
        // Filtrar reviews con score >= 3
        const filteredReviews = reviews.filter(review => review.score >= 3);
  
        // Obtener las últimas 5 reviews filtradas
        const lastFiveReviews = filteredReviews.slice(-5);
  
        // Formatear los datos para el endpoint de recomendaciones
        const songNames = lastFiveReviews.map(review => ({
          trackname: review.song.title,
          score: review.score
        }));

        console.log('Canciones para recomendar:', songNames);
  
        // Hacer la llamada al endpoint de recomendaciones
        const recommendationResponse = await client.post(
          'http://127.0.0.1:8000/nospeak-app/api/recomendaciones/',
          { song_names: songNames }
        );

        console.log('Recomendaciones:', recommendationResponse.data);
  
        // Actualizar el estado con las recomendaciones
        setRecommendedSongs(recommendationResponse.data.recommended_songs);
      } catch (error) {
        console.error('Error fetching user historial or recommendations:', error);
      }
    }
  };
  
  useEffect(() => {
    fetchUserReviews();
  }, [user]);
  

  if (loading) {
    return <CircularIndeterminate />;
  }

  if (goToArtist && location.pathname !== '/artist') {
    return <Navigate to="/artist" />;
  }

  if (goToCollection && location.pathname !== '/collection') {
    return <Navigate to="/collection" />;
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleComboBoxButtonClick = () => {
    if (user.isAdmin) {
      setIsComboBoxOpen(!isComboBoxOpen);
    } else {
      if (activeCategory === 'Collections') handleOptionClick('collection');
      if (activeCategory === 'ListenLists') handleOptionClick('listenlist');
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'collection') {
      setIsCreateCollectionAlertOpen(true);
    }
    if (option === 'artist') {
      setIsCreateArtistAlertOpen(true);
    }
    if (option === 'listenlist') {
      setIsCreateListenListAlertOpen(true);
    }
    setIsComboBoxOpen(false);
  };

  const handleCloseAlert = () => {
    setIsCreateArtistAlertOpen(false);
    setIsCreateListenListAlertOpen(false);
    setIsCreateCollectionAlertOpen(false);
  };

  const handleSaveArtistaButtonClick = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newArtista.name);
      formData.append('nationality', newArtista.nationality);
      formData.append('followers', newArtista.followers);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      // Logs para verificar el contenido de formData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await client.post(`/api/artists/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      const formData = new FormData();
      formData.append('title', newListenList.title);
      formData.append('description', newListenList.description);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      formData.append('user', user.id);

      // Logs para verificar el contenido de formData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await client.post(`/api/listenlists/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewListenList({
        title: '',
        description: '',
        cover: '',
        songs: [],
      });
      setIsCreateListenListAlertOpen(false);
    } catch (error) {
      console.error('Error creating listenlist:', error);
    }
  };

  const handleSaveCollectionButtonClick = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newCollection.title);
      formData.append('description', newCollection.description);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      formData.append('user', user.id);

      // Logs para verificar el contenido de formData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await client.post(`/api/collections/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setNewCollection({
        songs: [],
        title: '',
        description: '',
        cover: '',
        user: user.id,
      });
      setIsCreateCollectionAlertOpen(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  return (
    <>
      <SpotifyBody>
        <Sidebar client={client} />
        <BodyContainer css={`align-items: center;`}>
          <Header client={client}/>
          <h1 style={{ color: '#fff', marginLeft: '10px' }}>Library</h1>

          <NavContainer>
            {categories.map((category) => (
              <NavItem
                key={category}
                onClick={() => handleCategoryChange(category)}
                active={category === activeCategory}
              >
                {category}
              </NavItem>
            ))}

            <IconContainer>
              <StyledAddCircle
                sx={{
                  color: user.isAdmin || activeCategory === 'Collections' || activeCategory === 'ListenLists' ? '#FFA130' : 'gray',
                  cursor: user.isAdmin || activeCategory === 'Collections' || activeCategory === 'ListenLists' ? 'pointer' : 'not-allowed',
                }}
                onClick={handleComboBoxButtonClick}
              />
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
            {activeCategory === 'Collections' &&
              collectionData.map((collection, index) => (
                <Link key={index} to={`/collection/${collection._id}`}>
                  <CollectionBox key={index}>
                    <CollectionImage src={collection.picture}></CollectionImage>
                    <CollectionName>{collection.title}</CollectionName>
                    <CollectionDescription>{collection.user.name}</CollectionDescription>
                  </CollectionBox>
                </Link>
              ))}

            {activeCategory === 'Artists' &&
              artists.map((artist, index) => (
                <Link key={index} to={`/artist/${artist._id}`}>
                  <ArtistBox key={index}>
                    <ArtistImage
                      src={artist.picture}
                      alt={artist.name}
                      onClick={() => {
                        setGoToArtist(true);
                      }}
                    />
                    <ArtistName>{artist.name}</ArtistName>
                  </ArtistBox>
                </Link>
              ))}
            {activeCategory === 'ListenLists' &&
              listenlistData.map((listenlist, index) => (
                <Link key={index} to={`/listenlist/${listenlist._id}`}>
                  <CollectionBox key={index}>
                    <CollectionImage src={`https://picsum.photos/id/222/300/300`}></CollectionImage>
                    <CollectionName>{listenlist.title}</CollectionName>
                  </CollectionBox>
                </Link>
              ))}
          </CollectionGrid>
          {activeCategory === 'Made for You' && (
            <TableContainerStyled>
              <StyledH1 style={{ color: 'white', fontSize: '2em', marginLeft: '10px', marginBottom: '5px' }}>
                Canciones recomendadas para añadir basadas en tus favoritos
              </StyledH1>
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
                            {column.id === 'title' && columnIndex === 0 ? <span style={{ color: 'white' }}>{song.titulo}</span> : null}
                            {column.id === 'artist' && columnIndex === 1 ? <span>{song.artista}</span> : null}
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
        <CustomEditAlert>
          <EditAlertContent>
            <EditAlertTitle>Create artist</EditAlertTitle>
            <EditAlertText>
              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Name</Label>
              <Input
                type="text"
                value={newArtista.name}
                onChange={(event) => setNewArtista({ ...newArtista, name: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Nationality</Label>
              <Input
                type="text"
                value={newArtista.nationality}
                onChange={(event) => setNewArtista({ ...newArtista, nationality: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Followers</Label>
              <Input
                type="text"
                value={newArtista.followers}
                onChange={(event) => setNewArtista({ ...newArtista, followers: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Cover</Label>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </EditAlertText>
            <EditAlertButtonContainer>
              <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
              <StyledButton onClick={handleSaveArtistaButtonClick}>Save</StyledButton>
            </EditAlertButtonContainer>
          </EditAlertContent>
        </CustomEditAlert>
      )}
      {isCreateListenListAlertOpen && (
        <CustomEditAlert>
          <EditAlertContent>
            <EditAlertTitle>Create Listenlist</EditAlertTitle>
            <EditAlertText>
              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Title</Label>
              <Input
                type="text"
                value={newListenList.title}
                onChange={(event) => setNewListenList({ ...newListenList, title: event.target.value })}
              />
              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Description</Label>
              <Input
                type="text"
                value={newListenList.description}
                onChange={(event) => setNewListenList({ ...newListenList, description: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Cover</Label>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </EditAlertText>
            <EditAlertButtonContainer>
              <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
              <StyledButton onClick={handleSaveListenListButtonClick}>Save</StyledButton>
            </EditAlertButtonContainer>
          </EditAlertContent>
        </CustomEditAlert>
      )}
      {isCreateCollectionAlertOpen && (
        <CustomEditAlert>
          <EditAlertContent>
            <EditAlertTitle>Create Collection</EditAlertTitle>
            <EditAlertText>
              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Title</Label>
              <Input
                type="text"
                value={newCollection.title}
                onChange={(event) => setNewCollection({ ...newCollection, title: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Description</Label>
              <Input
                type="text"
                value={newCollection.description}
                onChange={(event) => setNewCollection({ ...newCollection, description: event.target.value })}
              />

              <Label style={{ marginBottom: '0px', marginTop: '10px' }}>Cover</Label>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </EditAlertText>
            <EditAlertButtonContainer>
              <StyledButtonSecondary onClick={handleCloseAlert}>Cancel</StyledButtonSecondary>
              <StyledButton onClick={handleSaveCollectionButtonClick}>Save</StyledButton>
            </EditAlertButtonContainer>
          </EditAlertContent>
        </CustomEditAlert>
      )}
    </>
  );
};

export default Library;

import './App.css';
import Inicio from './pages/Inicio/Inicio';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Account from './pages/Account/Account';
import Playlist from './pages/Playlist/Playlist';
import Search from './pages/Search/Search';
import Song from './pages/Song/Song';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Library from './pages/MyLibrary/Library';
import Artist from './pages/Artist/Artist';
import Album from './pages/Album/Album';
import RecommendedUsers from './pages/RecommendedUsers/RecommendedUsers';
import FollowingUsers from './pages/FollowingUsers/FollowingUsers';
import { useSelector } from 'react-redux';
import axios from './interceptors/axiosConfig';


export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFA130',
    },
  },
});


function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login client={axios} />} />
            <Route path="/home" element={<Home client={axios} />} />
            <Route path="/register" element={<Register client={axios} />} />
            <Route path="/account" element={<Account client={axios} />} />
            <Route path="/playlist/:playlistId" element={<Playlist client={axios}/>} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library client={axios} />} />
            <Route path="/artist/:artistId" element={<Artist  client={axios} />} />
            <Route path="/song/:songId" element={<Song client={axios}/>} />
            <Route path="/album/:albumId" element={<Album  client={axios} />} />
            <Route path="/recommended-users" element={<RecommendedUsers  client={axios} />} /> 
            <Route path="/following-users" element={<FollowingUsers  client={axios} />} />
            {/* En estas ult 2 rutas faltaria pasarle el id de usuario para tener las busquedas personalizadas x usuario, pero esto es un mero bosquejo de frontend */}
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;

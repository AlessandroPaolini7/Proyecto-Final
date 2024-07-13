import React, { useEffect, useState } from 'react';
import { SidebarContainer, Playlists, NavContainer, NavBrand, ChoicesContainer } from './styles.js';
import SidebarChoice from './SidebarChoice.jsx';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { Navigate, useLocation } from "react-router-dom";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from '../../interceptors/axiosConfig.js';

export default function Sidebar() {
  const [collections, setCollections] = useState([]);
  const user = useSelector(state => state.user.user);
  const location = useLocation();
  const [goToPlaylist, setGoToPlaylist] = useState(false);
  const [goToSearch, setGoToSearch] = useState(false);
  const [goToHome, setGoToHome] = useState(false);
  const [goToLibrary, setGoToLibrary] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [goToRecommendedUsers, setGoToRecommendedUsers] = useState(false);
  const [goToSongs, setGoToSongs] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (windowWidth <= 798) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    if (user) {
      axios.get(`/api/collections-user/${user.id}`)
        .then(response => {
          setCollections(response.data);
        })
        .catch(error => {
          console.error('Error fetching collections:', error);
        });
    }
  }, [user]);

  if (goToPlaylist && location.pathname !== '/playlist') {
    return <Navigate to="/playlist" />;
  }
  if (goToSearch && location.pathname !== '/search') {
    return <Navigate to="/search" />;
  }
  if (goToHome && location.pathname !== '/home') {
    return <Navigate to="/home" />;
  }
  if (goToLibrary && location.pathname !== '/library') {
    return <Navigate to="/library" />;
  }
  if (goToRecommendedUsers && location.pathname !== '/recommended-users') {
    return <Navigate to="/recommended-users" />;
  }
  if (goToSongs && location.pathname !== '/songs') {
    return <Navigate to="/songs" />;
  }

  return (
    <>
      {showNavbar ? (
        <NavContainer>
          <NavBrand>
            <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '160px', height: '70px', marginLeft: '55px' }} />
          </NavBrand>
          <ChoicesContainer>
            <SidebarChoice Icon={HomeIcon} onClick={() => setGoToHome(true)} isActive={location.pathname === '/home'} />
            <SidebarChoice Icon={SearchIcon} onClick={() => setGoToSearch(true)} isActive={location.pathname === '/search'} />
            <SidebarChoice onClick={() => setGoToLibrary(true)} Icon={LibraryMusicIcon} isActive={location.pathname === '/library'} />
            <SidebarChoice Icon={ConnectWithoutContactIcon} onClick={() => setGoToRecommendedUsers(true)} isActive={location.pathname === '/recommended-users'} />
            <SidebarChoice Icon={QueueMusicIcon} onClick={() => setGoToSongs(true)} isActive={location.pathname === '/songs'} />
          </ChoicesContainer>
        </NavContainer>
      ) : (
        <SidebarContainer>
          <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '160px', height: '70px', marginLeft: '55px' }} />
          <SidebarChoice title="Home" Icon={HomeIcon} onClick={() => setGoToHome(true)} isActive={location.pathname === '/home'} />
          <SidebarChoice title="Search" Icon={SearchIcon} onClick={() => setGoToSearch(true)} isActive={location.pathname === '/search'} />
          <SidebarChoice title="Library" onClick={() => setGoToLibrary(true)} Icon={LibraryMusicIcon} isActive={location.pathname === '/library'} />
          <SidebarChoice title="People like you" Icon={ConnectWithoutContactIcon} onClick={() => setGoToRecommendedUsers(true)} isActive={location.pathname === '/recommended-users'} />
          <SidebarChoice title="Songs" Icon={QueueMusicIcon} onClick={() => setGoToSongs(true)} isActive={location.pathname === '/songs'} />
          <br />
          <br />
          <Playlists>COLLECTIONS</Playlists>
          <hr />
          {collections.map((collection, index) => (
            <Link key={index} to={`/collection/${collection._id}`} style={{ textDecoration: 'none' }}>
              <SidebarChoice key={collection.id} title={collection.title} />
            </Link>
          ))}
        </SidebarContainer>
      )}
    </>
  );
}

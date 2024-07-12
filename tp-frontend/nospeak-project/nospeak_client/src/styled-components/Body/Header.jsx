import React, { useState, useEffect } from 'react';
import { HeaderContainer, HeaderLeft, HeaderRight, SearchInput } from './styles.js';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = ({ users, setFilteredUsers, songs=null, setFilteredSongs=null }) => {
  const [goToAccount, setGoToAccount] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const user = useSelector(state => state.user.user);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    if (location.pathname === "/recommended-users" || location.pathname === "/following-users" || location.pathname === "/home") {
      setPlaceholder("Search for users");
    } else {
      setPlaceholder("Search for any song or album you want");
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);

    if (location.pathname !== "/library" && location.pathname !== "/recommended-users" && location.pathname !== "/following-users" && location.pathname !== "/home") {
      const filteredSongs = songs.filter((song) => 
        song.titulo.toLowerCase().includes(searchText.toLowerCase()) || 
        song.artista.nombre.toLowerCase().includes(searchText.toLowerCase()) || 
        song.album.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSongs(filteredSongs);
    }

    if (location.pathname === "/recommended-users" || location.pathname === "/following-users" || location.pathname === "/home") {
      const filteredUsers = users.filter((user) => 
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    }
  };

  if (goToAccount) {
    return <Navigate to="/account" />;
  }

  return (
    <HeaderContainer>
      <HeaderLeft>
        <SearchIcon style={{ color: 'white' }} />
        <SearchInput 
          type="text" 
          placeholder={placeholder} 
          value={searchTerm} 
          onChange={handleSearch} 
        />
      </HeaderLeft>
      <HeaderRight>
        <Avatar />
        {user && (
          <h4 style={{ color: 'white' }} onClick={() => setGoToAccount(true)}>
            {user.name}
          </h4>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
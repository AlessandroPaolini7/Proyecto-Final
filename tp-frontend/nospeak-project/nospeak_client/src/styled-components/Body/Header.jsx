import React, { useState } from 'react';
import { HeaderContainer, HeaderLeft, HeaderRight, SearchInput } from './styles.js';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';


const Header = ({ users, setFilteredUsers, songs, setFilteredSongs }) => {
    const [goToAccount, setGoToAccount] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const user = useSelector(state => state.user.user);
    React.useEffect(() => {
        if (location.pathname === "/library" && location.pathname !== "/search" && location.pathname !== "/recommended-users" && location.pathname !== "/following-users") {
          setFilteredSongs(songs);
          setFilteredUsers([]);
        }
      }, [setFilteredUsers, songs]);
      
    if (goToAccount) {
        return <Navigate to="/account" />;
    }

    const handleSearch = (e) => {
        if (location.pathname !== "/library" && location.pathname !== "/recommended-users" && location.pathname !== "/following-users") {
            const searchText = e.target.value;
            setSearchTerm(searchText);

            const filteredSongs = songs.filter((song) =>
                song.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                song.artista.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
                song.album.titulo.toLowerCase().includes(searchText.toLowerCase())
            );

            setFilteredSongs(filteredSongs);
        }
        if (location.pathname === "/recommended-users" || location.pathname === "/following-users") {
            const searchText = e.target.value;
            setSearchTerm(searchText);

            const filteredUsers = users.filter((user) =>
              user.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filteredUsers);
          } 
    };

    return (
        <HeaderContainer>
            <HeaderLeft>
                <SearchIcon style={{ color: 'white' }} />
                <SearchInput
                    type="text"
                    placeholder="Search for artist, song, or user"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </HeaderLeft>
            <HeaderRight>
                <Avatar />
                <h4 style={{ color: 'white' }} onClick={() => setGoToAccount(true)}>
                    {user.nombre}
                </h4>
            </HeaderRight>
        </HeaderContainer>
    );
};

export default Header;
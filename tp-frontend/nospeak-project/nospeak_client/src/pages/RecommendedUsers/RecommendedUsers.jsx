import React, { useState, useEffect } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../Home/styles';
import Header from '../../styled-components/Body/Header';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Container, 
    UserInfo, 
    UserContainer, 
    Username, 
    Stats, 
    HeaderRU, 
    HeaderText, 
    PopularText, 
    StyledTableCell, 
    StyledTableRow, 
    AvatarContainer, 
    Reviews,
    FollowButton,
    FollowButtonText } from './styles';
import { useSelector } from 'react-redux';
import {
    CollectionContainer,
    CardContainer,
    TableContainerStyled,
    StyledH1
} from '../Song/styles';
import {
    CardRightContainer,
    ImageCollection,
    CardLeftContainer,
} from '../User/styles';
import { StyledButton, StyledButtonSecondary, Input, Label } from '../../styled-components/styles.js';
import { Link } from 'react-router-dom';
import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx'; // Importa tu componente de carga
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { 
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
} from '../../styled-components/Body/styles';

const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'followers', label: 'Followers', minWidth: 100, align: 'center' },
    { id: 'reviews', label: 'Reviews', minWidth: 100, align: 'center' },
    { id: 'actions', label: '', minWidth: 100, align: 'center' },
];

const RecommendendUsers = ({ client }) => {
    const user = useSelector(state => state.user.user);
    const [usersToShow, setUsersToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteAlertData, setDeleteAlertData] = useState(null);
    const [goToUser, setGoToUser] = useState(false);

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                console.log('User:', user.id);
                const response = await client.get(`/api/user/not-following/${user.id}`);
                setUsersToShow(response.data.filter(user => !user.name.includes("admin")).reverse());
                console.log('Following users:', response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching following users:', error);
                setLoading(false);
            }
        };

        fetchFollowingUsers();
    }, [client, user.id]);

    const handleFollow = async (followingId) => {
        try {
          console.log('Follower ID:', user.id);
          console.log('Following ID:', followingId);
            await client.post('/api/followrelation/', {
              followerId: user.id,
              followingId: followingId,
          });
          setUsersToShow((prevUsers) =>
              prevUsers.filter((user) => user._id !== followingId)
          );
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    if (loading) {
        return <CircularIndeterminate />;
    }

    return (
        <>
            <SpotifyBody>
                <Sidebar client={client} />
                <BodyContainer css={`align-items: center;`}>
                    <CollectionContainer>
                    <div style={{paddingLeft: '10px'}}>
                        <Header users={usersToShow} setFilteredUsers={setUsersToShow} client={client}/>
                        <CardContainer style={{flexDirection: 'column', padding: '10px', paddingLeft: '10px', marginBottom: '10px'}}>
                        <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '2em', color: 'white' }}>Music lovers and critics  — find members like you.</StyledH1>
                            <div style={{ marginBottom: '15px', marginTop: '10px' }}>
                                <PopularText style={{color: 'white'}} >POPULAR THIS WEEK</PopularText>
                            </div>
                            <div style={{ display: 'flex' }}>
                                {usersToShow.slice(0, 5).map((user) => (
                                    <Link key={user._id} to={`/user/${user._id}`} style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', marginRight: '30px'}}>
                                        <UserContainer key={user._id}>
                                            <Avatar sx={{ height: '100px', width: '100px' }} src={user.picture} />
                                            <UserInfo>
                                                <Username style={{marginBottom: '5px'}}>{user.name}</Username>
                                                <Stats style={{color:'white'}}>
                                                    {user.followersCount} followers
                                                    <br />
                                                    {user.reviewsCount} reviews
                                                </Stats>
                                            </UserInfo>
                                        </UserContainer>
                                    </Link>
                                ))}
                            </div>
                        </CardContainer>
                    </div>
                        <TableContainerStyled>
                            <TableContainer sx={{ maxHeight: 440 }} style={{width: '96%'}}>
                                <Table sx={{ margin: 0, padding: '10px' }}>
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
                                    <TableBody >
                                        {usersToShow.map((user, index) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={user._id} >
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{ backgroundColor: 'transparent', color: '#fff'}}
                                                    >
                                                        {column.id === 'username' ? (
                                                            <Link key={index} to={`/user/${user._id}`} style={{ width: 100, textDecoration: 'none', color: 'inherit' }}>
                                                                <AvatarContainer>
                                                                    <Avatar src={user.picture} />
                                                                    <UserInfo>
                                                                        <Username>{user.name}</Username>
                                                                        <Reviews>{user.collectionCount} collections</Reviews>
                                                                    </UserInfo>
                                                                </AvatarContainer>
                                                            </Link>
                                                        ) : null}
                                                        {column.id === 'followers' ? (
                                                            <span>{user.followersCount}</span>
                                                        ) : null}
                                                        {column.id === 'reviews' ? (
                                                            <span>{user.reviewsCount}</span>
                                                        ) : null}
                                                        {column.id === 'actions' ? (
                                                            <PersonAddIcon style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleFollow(user._id)} />
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
        </>
    );
};

export default RecommendendUsers;

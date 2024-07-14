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
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
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

const FollowingUsers = ({ client }) => {
    const user = useSelector(state => state.user.user);
    const [usersToShow, setUsersToShow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteAlertData, setDeleteAlertData] = useState(null);
    const [goToUser, setGoToUser] = useState(false);
    const [notFollowingUsersFlag, setNotFollowingUsersFlag] = useState(false);

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            try {
                const response = await client.get(`/api/user/following/${user.id}`);
                setUsersToShow(response.data.reverse());
                console.log('Following users:', response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching following users:', error);
                setLoading(false);
            }
        };

        fetchFollowingUsers();
    }, [client, user.id]);

    useEffect(() => {
        if (usersToShow.length === 0) {
            setNotFollowingUsersFlag(true);
        } else {
            setNotFollowingUsersFlag(false);
        }
    }, [usersToShow]);

    const handleUnfollow = async (followingId) => {
        try {
            await client.delete('/api/followrelation/', {
                data: {
                    followerId: user.id,
                    followingId: followingId,
                },
            });
            setUsersToShow((prevUsers) =>
                prevUsers.filter((user) => user._id !== followingId)
            );
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleUnfollowClick = (userId) => {
        setDeleteAlertData({
            followingId: userId,
        });
    };

    const handleDeleteConfirm = async () => {
        await handleUnfollow(deleteAlertData.followingId);
        setDeleteAlertData(null);
    };

    const handleDeleteCancel = () => {
        setDeleteAlertData(null);
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
                        <Header users={usersToShow} setFilteredUsers={setUsersToShow}/>
                        <CardContainer style={{flexDirection: 'column', padding: '10px', paddingLeft: '10px', marginBottom: '10px'}}>
                        <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '2em', color: 'white' }}>Friends, critics you like and good people — members you care about.</StyledH1>
                            <div style={{ marginBottom: '15px', marginTop: '10px', minHeight: '30px' }}>
                                {notFollowingUsersFlag ? (null) :(
                                    <PopularText style={{color: 'white'}} >LAST PEOPLE FOLLOWED</PopularText>
                                )}
                            </div>
                            <div style={{ display: 'flex' }}>
                                {usersToShow.slice(0, 5).map((user) => (
                                    <Link key={user._id} to={`/user/${user._id}`} style={{textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', marginRight: '30px'}}>
                                        <UserContainer key={user._id}>
                                            <Avatar sx={{ height: '100px', width: '100px' }} src={user.picture} />
                                            <UserInfo>
                                                <Username>{user.name}</Username>
                                                <Stats>
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
                                {notFollowingUsersFlag ? (
                                    <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
                                        <p>You are not following any users yet. Visit our <Link to="/recommended-users" style={{ color: '#ffb13b', textDecoration: 'underline' }}>People like you</Link> tab to find similar people.</p>
                                    </div>
                                ) : (
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
                                                                <PersonAddDisabledIcon style={{ color: 'white', cursor: 'pointer' }} onClick={() => handleUnfollowClick(user._id)} />
                                                            ) : null}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </TableContainer>
                        </TableContainerStyled>
                    </CollectionContainer>
                </BodyContainer>
            </SpotifyBody>
            {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                        <AlertTitle>Unfollow user</AlertTitle>
                        <AlertText>
                            Are you sure you want to unfollow this user?
                        </AlertText>
                        <ButtonContainer style={{marginBottom: '0px', paddingBottom: '0px'}}>
                            <StyledButtonSecondary style={{ width: '50%', marginRight: '5px' , paddingBottom: '0px', marginBottom: '0px'}} onClick={handleDeleteCancel}>Cancel</StyledButtonSecondary>
                            <StyledButton style={{ backgroundColor: '#FF5630', width: '50%', marginLeft: '5px', paddingBottom: '0px', marginBottom: '0px'}} onClick={handleDeleteConfirm}>
                                Unfollow
                            </StyledButton>
                        </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
    );
};

export default FollowingUsers;

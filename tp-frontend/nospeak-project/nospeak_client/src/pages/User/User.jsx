import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer, ComboBoxList } from '../../styled-components/Body/styles';
import { SpotifyBody } from '../../pages/Home/styles.js';
import {
    CollectionContainer,
    CardContainer,
    TableContainerStyled,
    StyledH1
} from '../Song/styles';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    CardRightContainer,
    ImageCollection,
    CardLeftContainer,
} from './styles';

import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx'; // Importa tu componente de carga
import Alert from '@mui/material/Alert';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';

import { 
    Overlay,
    AlertContainer,
    AlertTitle,
    AlertText,
    ButtonContainer,
} from '../../styled-components/Body/styles';
import { 
    StyledButton, 
    StyledButtonSecondary
} from '../../styled-components/styles';
import { Navigate } from 'react-router-dom';

const columns = [
    { id: 'song_name', label: 'Song', minWidth: 5 },
    { id: 'artist', label: 'Artist', minWidth: 5 },
    { id: 'score', label: 'Score', minWidth: 1 },
    { id: 'review', label: 'Review', minWidth: 8 }
];

const User = ({ client }) => {
    const user = useSelector(state => state.user.user);
    const [currentUser, setCurrentUser] = useState(null);
    const [reviewsUser, setReviewsUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteAlertData, setDeleteAlertData] = useState(false);
    const { currentUserId } = useParams();
    const [goToHome, setGoToHome] = useState(false);
    console.log('Current user:', currentUserId);

    useEffect(() => {
        console.log('client:', client);
        client.get(`/api/reviews-user/${currentUserId}/`)
            .then(response => {
                console.log('Response:', response.data);
                if (response.data.length > 0) {
                    setCurrentUser(response.data[0].user);
                    setReviewsUser(response.data);
                } else {
                    client.get(`/api/user/${currentUserId}/`)
                        .then(userResponse => {
                            console.log('User Response:', userResponse.data);
                            setCurrentUser(userResponse.data);
                        })
                        .catch(userError => console.error('Error fetching user:', userError));
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                setLoading(false);
            });
    }, [client, currentUserId]);

    const handleUnfollow = async () => {
        try {
            await client.delete('/api/followrelation/', {
                data: {
                    followerId: user.id,
                    followingId: currentUser._id,
                },
            });
            setGoToHome(true);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    if (loading) {
        return <CircularIndeterminate />;
    }

    if (goToHome) {
        return <Navigate to="/home" />;
    }

    return (
        <>
            <SpotifyBody>
                <Sidebar />
                <BodyContainer css={`align-items: center;`}>
                    <CollectionContainer>
                        {currentUser ? (
                            <>
                                <CardContainer>
                                    <CardLeftContainer>
                                        <ImageCollection src={`https://i.pravatar.cc/150?u=${currentUser.name}`} />
                                    </CardLeftContainer>

                                    <CardRightContainer style={{ paddingBottom: '30px', width: '80%' }}>
                                        <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em' }}>{currentUser.name}</StyledH1>
                                        <p style={{ margin: '0' }}>{currentUser.followersCount} followers.</p>
                                        <p style={{ margin: '0' }}>{currentUser.reviewsCount} reviews.</p>
                                    </CardRightContainer>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '10%' }}>
                                        <PersonAddDisabledIcon 
                                            style={{ color: 'white', cursor: 'pointer', width: '40%', height: '40%' }} 
                                            onClick={() => setDeleteAlertData(true)} 
                                        />
                                    </div>
                                </CardContainer>
                                <TableContainerStyled>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table sx={{ margin: 0 }}>
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
                                            <TableBody>
                                                {reviewsUser ? (
                                                    <>
                                                        {reviewsUser.map((review, rowIndex) => (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                                                {columns.map((column) => (
                                                                    <TableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                                    >
                                                                        {column.id === 'song_name' ? (
                                                                            <span>{review.song.title}</span>
                                                                        ) : null}
                                                                        {column.id === 'artist' ? (
                                                                            <span>{review.song.artist.name}</span>
                                                                        ) : null}
                                                                        {column.id === 'score' ? (
                                                                            <span>{review.score}</span>
                                                                        ) : null}
                                                                        {column.id === 'review' ? (
                                                                            <span>{review.description}</span>
                                                                        ) : null}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </>
                                                ) : (null)}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TableContainerStyled>
                            </>
                        ) : (
                            <CircularIndeterminate />
                        )}
                    </CollectionContainer>
                </BodyContainer>
            </SpotifyBody>
            {deleteAlertData && (
                <Overlay>
                    <AlertContainer>
                        <AlertTitle>Unfollow user</AlertTitle>
                        <AlertText>
                            Are you sure you want to unfollow "{currentUser.name}"?
                        </AlertText>
                        <ButtonContainer>
                            <StyledButtonSecondary style={{ width: '50%', marginRight: '5px' }} onClick={() => setDeleteAlertData(false)}>Cancel</StyledButtonSecondary>
                            <StyledButton style={{ backgroundColor: '#FF5630', width: '50%', marginLeft: '5px' }} onClick={handleUnfollow}>
                                Unfollow
                            </StyledButton>
                        </ButtonContainer>
                    </AlertContainer>
                </Overlay>
            )}
        </>
    );
}

export default User;

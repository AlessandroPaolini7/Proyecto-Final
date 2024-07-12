import React, { useEffect, useState } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import { BodyContainer } from '../../styled-components/Body/styles';
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
import { Navigate } from 'react-router-dom';
import {
    CardRightContainer,
    ImageCollection,
    CardLeftContainer,
} from './styles';

const columns = [
    { id: 'song_name', label: 'Song', minWidth: 5 },
    {id: 'artist', label: 'Artist', minWidth: 5},
    { id: 'score', label: 'Score', minWidth: 1 },
    { id: 'review', label: 'Review', minWidth: 8 }
];

const User = ({ client }) => {
    const { userId } = useParams();
    const user = useSelector(state => state.user.user);

    const staticUser = [
        { name: 'Matias Daniel Ferullo', songs_reviewed: [
            { title: 'Mujeres', artist:'Ricardo Arjona', score: 4.5, review: 'Temaiken' },
            { title: 'Pétalo de sal', artist:'Fito Páez', score: 5, review: 'FURIOSO PÉTALO DE SAL' },
            { title: 'La rueda mágica', artist:'Fito Páez', score: 4, review: 'es la rueda mágica pendejo boludo' },
        ], reviews: 884, nacionality: 'Argentina', followers: 1000},
      ];

    const currentUser = staticUser[0];  // Aquí obtenemos el primer elemento del array

    const formatFollowers = (followers) => {
        return followers.toLocaleString();
    };

    return (
        <>
            <SpotifyBody>
                <Sidebar />
                <BodyContainer css={`align-items: center;`}>
                    <CollectionContainer>
                        {currentUser ? (
                            <CardContainer>
                                <CardLeftContainer>
                                    <ImageCollection src={`https://i.pravatar.cc/150?u=${currentUser.name}`} />
                                </CardLeftContainer>

                                <CardRightContainer style={{ paddingBottom: '30px' }}>
                                    <StyledH1 style={{ marginTop: '0px', marginBottom: '0px', fontSize: '3em' }}>{currentUser.name}</StyledH1>
                                    <p style={{ margin: '0' }}>{currentUser.nacionality}</p>
                                    <p style={{ margin: '0' }}>{formatFollowers(currentUser.followers)} followers.</p>
                                    <p style={{ margin: '0' }}>{currentUser.reviews} reviews.</p>
                                </CardRightContainer>
                            </CardContainer>
                        ) : (
                            <p>Loading user information...</p>
                        )}
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
                                        {currentUser.songs_reviewed.map((review, rowIndex) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        sx={{ backgroundColor: 'transparent', color: '#fff' }}
                                                    >
                                                        {column.id === 'song_name' ? (
                                                            <span>{review.title}</span>
                                                        ) : null}
                                                        {column.id === 'artist' ? (
                                                            <span>{review.artist}</span>
                                                        ) : null}
                                                        {column.id === 'score' ? (
                                                            <span>{review.score}</span>
                                                        ) : null}
                                                        {column.id === 'review' ? (
                                                            <span>{review.review}</span>
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
}

export default User;
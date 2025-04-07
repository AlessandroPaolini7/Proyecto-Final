import React, { useState, useEffect } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import Header from '../../styled-components/Body/Header';
import { Avatar } from '@mui/material';
import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx';
import { useSelector } from 'react-redux';
import {
    SpotifyBody,
    BodyContainer,
    CollectionContainer,
    CardContainer,
    StyledH1,
    ReviewCard,
    UserInfo,
    ReviewContent,
    SongInfo,
    Score,
    DateInfo,
    Username,
    ReviewDescription,
    ArtistInfo,
    SongTitle,
    SongDetails,
    StyledLink
} from './styles';

const FollowingUsers = ({ client }) => {
    const user = useSelector(state => state.user.user);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFollowingUsersReviews = async () => {
            try {
                const response = await client.get(`/api/user/following/${user.id}`);
                const allReviews = response.data
                    .filter(user => user.lastReview)
                    .map(user => ({
                        ...user.lastReview,
                        user: {
                            _id: user._id,
                            name: user.name,
                            picture: user.picture
                        }
                    }));
                setReviews(allReviews.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching following users reviews:', error);
                setLoading(false);
            }
        };

        fetchFollowingUsersReviews();
    }, [client, user.id]);

    if (loading) {
        return <CircularIndeterminate />;
    }

    return (
        <SpotifyBody>
            <Sidebar client={client} />
            <BodyContainer>
                <CollectionContainer>
                    <Header client={client}/>
                    <CardContainer>
                        <StyledH1>Latest Reviews from People You Follow</StyledH1>
                        {reviews.length === 0 ? (
                            <p>No reviews yet from the users you're following. Follow more users or wait for their reviews!</p>
                        ) : (
                            reviews.map((review) => (
                                <ReviewCard key={review._id}>
                                    <UserInfo>
                                        <StyledLink to={`/user/${review.user._id}`}>
                                            <Avatar src={review.user.picture} alt={review.user.name} />
                                        </StyledLink>
                                        <Username>{review.user.name}</Username>
                                    </UserInfo>
                                    <ReviewContent>
                                        <ReviewDescription>{review.description}</ReviewDescription>
                                        <Score>Score: {review.score}</Score>
                                    </ReviewContent>
                                    <SongInfo>
                                        <SongDetails>
                                            <StyledLink to={`/song/${review.song._id}`}>
                                                <SongTitle>{review.song.title}</SongTitle>
                                            </StyledLink>
                                            <ArtistInfo>
                                                <StyledLink to={`/artist/${review.song.artist._id}`}>
                                                    {review.song.artist.name}
                                                </StyledLink>
                                            </ArtistInfo>
                                        </SongDetails>
                                        <Avatar src={review.song.artist.picture} alt={review.song.artist.name} />
                                    </SongInfo>
                                    <DateInfo>
                                        {new Date(review.creationDate).toLocaleString()}
                                    </DateInfo>
                                </ReviewCard>
                            ))
                        )}
                    </CardContainer>
                </CollectionContainer>
            </BodyContainer>
        </SpotifyBody>
    );
};

export default FollowingUsers;

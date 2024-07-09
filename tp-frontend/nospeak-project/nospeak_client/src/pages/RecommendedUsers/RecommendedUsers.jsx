import React, { useState, useEffect } from 'react'
import Sidebar from '../../styled-components/Sidebar/Sidebar'
import { BodyContainer} from '../../styled-components/Body/styles';
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


const RecommendedUsers = ({client}) => {

  // const [filteredUsers, setFilteredUsers] = useState([]);

const staticUsers = [
    { name: 'James', songs: 1000, reviews: 884 },
    { name: 'Mario Pergolini', songs: 1400, reviews: 1600 },
    { name: 'Zoë Rose Bryant', songs: 4800, reviews: 2300 },
    { name: 'Ricardo Darín', songs: 2600, reviews: 1800 },
    { name: 'Samid', songs: 2700, reviews: 185 },
  ];

const otherUsers = [
    { name: 'Rober galati', reviews: 1088, follows: 1544, lists: 47, likes: 1854 },
    { name: 'el turco garcia', reviews: 616, follows: 2096, lists: 1, likes: 240232 },
    { name: 'gbeder', reviews: 1215, follows: 2853, lists: 196, likes: 13076 },
    { name: 'luquitarod', reviews: 1215, follows: 2853, lists: 196, likes: 13076 },
    { name: 'ALFA', reviews: 1215, follows: 2853, lists: 196, likes: 13076 },

  ];
  const [usersToShow, setUsersToShow] = useState(otherUsers);

  const handleFollowToggle = (index) => {
    setUsersToShow((prevUsers) =>
        prevUsers.map((user, i) =>
            i === index ? { ...user, isFollowing: !user.isFollowing } : user
        )
    );
};
    return (
        <>
            <SpotifyBody>
                <Sidebar client={client}/>
                <BodyContainer css={`align-items: center;`}>
                    <Header users={otherUsers} setFilteredUsers={setUsersToShow}/>
                    <Container>
                        <HeaderRU>
                            <HeaderText >Music lovers, critics and friends — find members like you.</HeaderText>
                        </HeaderRU>
                        <div style={{marginBottom:'15px'}}>
                            <PopularText >POPULAR THIS WEEK</PopularText>
                        </div>
                        <div style={{ display: 'flex' }}>
                            {staticUsers.map((user) => (
                                <UserContainer  key={user.name}>
                                <Avatar sx={{height:'100px', width:'100px'}} src={`https://i.pravatar.cc/150?u=${user.name}`} />
                                <UserInfo>
                                    <Username>{user.name}</Username>
                                    <Stats>
                                    {user.songs} songs 
                                    <br />
                                    {user.reviews} reviews
                                    </Stats>
                                </UserInfo>
                                </UserContainer>
                            ))}
                            </div>
                        </Container>

                        <TableContainer>
    <Table aria-label="popular members table">
      <TableHead>
        <TableRow>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell sx={{color:'white'}} align="right">Followers</StyledTableCell>
          <StyledTableCell sx={{color:'white'}} align="right">Lists</StyledTableCell>
          <StyledTableCell sx={{color:'white'}} align="right"></StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {usersToShow.map((user, index) => (
          <StyledTableRow key={user.name}>
            <StyledTableCell>
              <AvatarContainer>
                <Avatar src={`https://i.pravatar.cc/150?u=${user.name}`} />
                <UserInfo>
                  <Username>{user.name}</Username>
                  <Reviews>{user.reviews} reviews</Reviews>
                </UserInfo>
              </AvatarContainer>
            </StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell sx={{color:'white'}} align="right">{user.follows}</StyledTableCell>
            <StyledTableCell sx={{color:'white'}} align="right">{user.lists}</StyledTableCell>
            <StyledTableCell align="right"> 
                <FollowButton variant="contained" onClick={() => handleFollowToggle(index)}>
                  <FollowButtonText>{user.isFollowing ? 'Following' : 'Follow'}</FollowButtonText>
                </FollowButton>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
                </BodyContainer>
            </SpotifyBody>
        </>
    )
}

export default RecommendedUsers




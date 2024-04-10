import styled from "styled-components";
import {TableCell, TableRow, Button } from '@mui/material';



// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #222;
  padding: 16px;
  color: #fff;
`;

const HeaderRU = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HeaderText = styled.h2`
  margin: 0;
`;

const PopularText = styled.span`
  font-size: 14px;
  color: #999;
`;



const UserContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 30px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const Username = styled.span`
  color: white;
  font-size: 16px;
    font-weight: bold;
`;

const Stats = styled.span`
  font-size: 14px;
  color: #999;
`;

const StyledTableCell = styled(TableCell)`
  color: white;
  padding: 8px;
  border-bottom: none;
`;

const StyledTableRow = styled(TableRow)`
  background-color: #222;

  &:nth-of-type(even) {
    background-color: #333;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Reviews = styled.span`
  font-size: 12px;
  color: #999;
`;

const FollowButton = styled(Button)`
  background-color: #e50914;
  color: #fff;
  text-transform: none;
  font-weight: 600; // Aumentamos el grosor de la fuente
  border-radius: 4px;

  &:hover {
    background-color: #f40612;
  }
`;

const FollowButtonText = styled.span`
  text-transform: capitalize; // Convertimos el texto a minúsculas
`;

export { Container, 
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
    FollowButtonText};
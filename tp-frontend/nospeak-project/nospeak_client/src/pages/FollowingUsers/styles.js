import styled from "styled-components";
import { Link } from 'react-router-dom';

export const SpotifyBody = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  color: white;
  overflow: hidden;
`;

export const BodyContainer = styled.div`
  flex: 1;
  background: linear-gradient(transparent, rgba(0, 0, 0, 1));
  background-color: rgb(35, 35, 35);
  overflow-y: overlay;
  padding: 10px;
`;

export const CollectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  background-image: linear-gradient(to bottom, #faa130, #000);
  font-family: var(--font-family,CircularSp,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 0;
  background-color: transparent;
  gap: 16px;
`;

export const StyledH1 = styled.h1`
  font-size: 35px;
  color: white;
  margin-bottom: 20px;

  @media (max-width: 500px) {
    font-size: 29px;
  }
`;

export const ReviewCard = styled.div`
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .MuiAvatar-root {
    margin-right: 12px;
    width: 32px;
    height: 32px;
  }

  a {
    text-decoration: none;
  }
`;

export const Username = styled.span`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ReviewContent = styled.div`
  margin-bottom: 12px;
  color: #fff;
`;

export const ReviewDescription = styled.p`
  color: #fff;
  margin: 0;
  font-size: 14px;
`;

export const SongInfo = styled.div`
  margin-bottom: 8px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SongTitle = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

export const Score = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 14px;
`;

export const DateInfo = styled.div`
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
`;

export const ArtistInfo = styled.div`
  margin-top: 4px;
  
  a {
    color: #b3b3b3;
    text-decoration: none;
    font-size: 12px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: #fff;
  }
`;

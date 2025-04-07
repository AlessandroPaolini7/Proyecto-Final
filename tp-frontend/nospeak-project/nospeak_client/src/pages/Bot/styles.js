import styled from "styled-components";
import { SpotifyBody as BaseSpotifyBody } from '../Home/styles';
import { SidebarContainer as BaseSidebarContainer } from '../../styled-components/Sidebar/styles';
import { BodyContainer as BaseBodyContainer } from '../../styled-components/Body/styles';

export const SpotifyBody = styled(BaseSpotifyBody)`
  height: 100vh;
  overflow: hidden;
`;

export const Sidebar = styled(BaseSidebarContainer)`
  overflow: hidden;
`;

export const BodyContainer = styled(BaseBodyContainer)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  padding-bottom: 80px; // Add space for the input container

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }

  .input-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 20px;
    background-color: #232323;
    border-top: 1px solid #333;
    height: 40px;
  }
`;

import styled from "styled-components";

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #000;
  height: 8%;
  padding: 0 20px;
  overflow: hidden;
  width: 100%;
  color: white;
  position: fixed;
  top: 0;
  z-index: 1;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: start;
  margin-right: 10px;
  & img {
    max-width: 50%;
    max-height: 80px;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100vh;
  background-color: #000;
  min-width: 240px;
  color: #fff;
  overflow: hidden;
  & img {
    height: 70px;
    padding: 10px;
    margin-right: auto;
  }

  & hr {
    border: 1px solid smokegray;
    width: 90%;
    margin: 10px auto;
  }
  @media (max-width: 798px) {
    display: none;
  }
`;

const Playlists = styled.div`
  margin: 5px 10px;
`;

const Choices = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.isActive ? 'white' : 'gray')};
  height: 40px;
  cursor: pointer;
  transition: 300ms color ease-in;
  margin: 5px 10px;
  &:hover {
    color: #fff;
  }
  & h5 {
    margin: 10px 0 0 20px;
  }

  @media (max-width: 798px) {
    flex-direction: row;
    width: auto;
  }
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-right: 15px;
`;

export { SidebarContainer, Playlists, Choices, ChoicesContainer, NavContainer, NavBrand };

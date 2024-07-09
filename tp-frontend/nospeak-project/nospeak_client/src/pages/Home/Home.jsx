import React from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import Body from '../../styled-components/Body/Body';
import { SpotifyBody, HomeContainer } from './styles.js';
import {useSelector} from 'react-redux';
import {Navigate} from "react-router-dom";



export default function Home({client}) {
    
    const user = useSelector(state => state.user);
    
    console.log(user);
    if (!user.isAuthenticated) {
        return <Navigate to="/login" />;;
    }
    return (
        <HomeContainer>
            <SpotifyBody>
                <Sidebar client={client}/>
                <Body client={client}/>
            </SpotifyBody>
        </HomeContainer>
        );
    
}

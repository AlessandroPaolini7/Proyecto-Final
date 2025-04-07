import React, { useState, useEffect } from 'react';
import Sidebar from '../../styled-components/Sidebar/Sidebar';
import Body from '../../styled-components/Body/Body';
import { SpotifyBody, HomeContainer } from './styles.js';
import {useSelector} from 'react-redux';
import {Navigate} from "react-router-dom";
import CircularIndeterminate from '../../styled-components/Extras/CircularIndeterminate.jsx';



export default function Home({client}) {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);
    
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    console.log(user);
    if (!user.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <CircularIndeterminate />;
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

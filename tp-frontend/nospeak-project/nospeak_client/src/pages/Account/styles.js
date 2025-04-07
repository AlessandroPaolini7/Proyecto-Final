import styled from "styled-components";
import { LoginInput} from '../Login/styles';
import { DateInput, StyledSelect } from '../Register/styles';
import { Paper, Card, TextField, Box } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

const AccountContainer = styled.div`
    display: flex;
    background-color: #000;
    border-radius: 10px;
    margin: 10px 10px 0px 10px;
    height: 100%;
    align-items: center;
    color: white;
    padding: 10px;

    @media (max-width: 991px) {
        flex-direction: column;
        width: 80%;
        align-self: center;
    }
`;

const StyledH1 = styled.h1`
    padding: 30px;
    font-size: 40px;
    margin: 0px;
    text-align: center;
    @media (max-width: 991px) {
        font-size: 32px;
    }
`;

const AccountInput = styled(LoginInput)`
    display: block;
    margin-block: 0px;
    width: 100%;

    @media (max-width: 991px) {
        width: auto;
    }
`;

const AccountDateInput = styled(DateInput)`
    width: 80px;
    margin-left: 0px;

    @media (max-width: 991px) {
        width: auto;
    }
`;

const AccountStyledSelect = styled(StyledSelect)`
    width: 120px;

    @media (max-width: 991px) {
        width: auto;
    }
`;


const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 65%;
    align-items: center;

    @media (max-width: 991px) {
        width: 100%;
    }
`;

const AccountContainerLeft = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #101010;
    border-radius: 10px;
    height: 100%;
    width: 60%;
    align-items: center;
    justify-content: top;
    color: white;
    padding: 0px;
    margin-right: 10px;

    @media (max-width: 991px) {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10px; 
    }
`;

const AccountContainerRight = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #101010;
    border-radius: 10px;
    height: 100%;
    color: white;
    padding: 0px;
    width: 40%;
    margin: 0 auto;

    @media (max-width: 991px) {
        width: 100%;
    }
`;

export const StyledPaper = muiStyled(Paper)(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: 'rgba(16, 16, 16, 0.0)',
    color: 'white', 
    padding: theme.spacing(3),
    borderRadius: '10px',
    height: '93.5%',
}));

export const ProfileCard = styled(Card)`
    box-shadow: none;
    background-color: rgba(16, 16, 16, 0.0);
    color: white;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    margin-bottom: 0px;
    padding-top: 40px;
    height: 93.5%;
`;

export const StyledTextField = muiStyled(TextField)({
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& label': {
        color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#fff',
        },
        '&:hover fieldset': {
            borderColor: '#fff',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ffa130',
        },
    },
    marginBottom: '20px',
});

export const StatsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 20px 0;
`;

export const StatItem = styled.div`
    text-align: center;
    padding: 10px;
`;

export const ReviewsContainer = styled.div`
    margin-top: 10px;
    width: 100%;
`;

export const ReviewCard = styled(Card)`
    background-color: rgba(16, 16, 16, 0.2);
    color: white;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;

    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.0);

    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    &:hover {
        transform: scale(1.01);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 16px;
`;

export const PageContainer = styled(Box)`
    padding: 10px;
    background-image: linear-gradient(to bottom, #d48417, #000);
    position: relative;
    width: 100%;
    overflow-y: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: inherit;
        filter: blur(300px);
        z-index: -1;
    }
`;

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: transparent;
    gap: 10px;
    margin-top: 0px;
    height: 100%;

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
    }
`;

export const TabPanel = styled.div`
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export const ReviewContent = styled.div`
    margin-top: 16px;
`;

export const SongInfo = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: white;
`;

export const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ReviewDate = styled.span`
    color: #fff;
    font-size: 0.875rem;
`;

export const Score = styled.div`
    display: inline-block;
    background-color: #ffa130;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
`;

const SpotifyBody = styled.div`
display:flex;
flex-direction: row;
height: 30%;
`

export {
    AccountContainer,
    StyledH1,
    AccountInput,
    AccountDateInput,
    AccountStyledSelect,
    AccountContainerLeft,
    AccountContainerRight,
    FormContainer,
    SpotifyBody
};
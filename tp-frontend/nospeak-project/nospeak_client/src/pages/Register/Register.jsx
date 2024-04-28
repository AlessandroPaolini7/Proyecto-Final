import React, { useState } from 'react';
import {FormLogin, FormLoginContainer, NavLogin, LoginButton, LoginInput, StyledH1, StyledSpan, StyledLink} from '../Login/styles';
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';
import { ErrorMessage, SuccessMessage, LoginContainer } from '../Register/styles';



export default function Register({client}) {
  const dispatch = useDispatch();
  const [user_name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isArtist, setIsArtist] = useState(false);


  const [goToHome, setGoToHome] = useState(false);
  if (goToHome) {
    return <Navigate to="/home" />;
  }

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };


  const handleRegister = async () => {
    
    if (!user_name && !email && !password && !repeatPassword) {
      setNameError('Please enter a username');
      setEmailError('Please enter an email');
      setPasswordError('Please enter a password');
      setRepeatPasswordError('Please repeat the password');
      return;
    }
    
    if (!email) {
      setEmailError('Please enter an email');
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!user_name) {
      setNameError('Please enter a username');
      return;
    }
    
    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (!repeatPassword) {
      setRepeatPasswordError('Please repeat your password');
      return;
    }

    if (password !== repeatPassword) {
      setPasswordError('Passwords do not match');
      setRepeatPasswordError('Passwords do not match');
      return;
    }

    try {
      const response_register = await client.post('/api/user/', {
        name: user_name,
        email: email,
        password,
        isAdmin: false,
        phone_number: "1234", // agregar campo para numero de telefono
      });

      


        if (response_register.status === 201) {

          setNameError('');
          setEmailError('');
          setPasswordError('');
          setRepeatPasswordError('');

          setRegistrationSuccess(true);
                      

          const response_login = await client.post('/api/user-login/', {
            name: user_name,
            password,
          });

          const { token, userId, name } = response_login.data;
          localStorage.setItem('token', token);


          dispatch(loginSuccess({
            isAuthenticated: true,
            user: { id: userId, name },
          }));

          setTimeout(() => {
            setGoToHome(true);
          }, 5000);

          
      } else {
        console.error('Error al registrar el usuario:', response_register.data.message);
      }
    } catch (error) {
      console.error('Error al registrarse:', error);
    }
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    setNameError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    setRepeatPasswordError('');
  };

  return (
    <FormLoginContainer>
      <NavLogin>
        <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '130px', height: '60%' }}/>
      </NavLogin>
      <FormLogin>
        <StyledH1>Sign up for NoSpeak</StyledH1>
        <span>What’s your email address?</span>
        <LoginInput value={email} onChange={handleEmailChange} type="email" placeholder="Email" />
        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        <span>What should we call you?</span>
        <LoginInput value={user_name} onChange={handleNameChange} type="text" placeholder="Username" />
        {nameError && <ErrorMessage>{nameError}</ErrorMessage>} 
        <span>Create a password</span>
        <LoginInput value={password} onChange={handlePasswordChange} type="password" placeholder="Password" />
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        <span>Repeat password</span>
        <LoginInput value={repeatPassword} onChange={handleRepeatPasswordChange} type="password" placeholder="Password" />
        {repeatPasswordError && <ErrorMessage>{repeatPasswordError}</ErrorMessage>}
        {registrationSuccess && <SuccessMessage>Registration successful! Logging In....</SuccessMessage>}
        <LoginButton onClick={(e) => { handleRegister(e); }}>
          Sign up
        </LoginButton>
        <LoginContainer>
          <StyledSpan>Already have an account?</StyledSpan>
          <StyledLink to='/login'>Log in</StyledLink>
        </LoginContainer>
      </FormLogin>
    </FormLoginContainer>
  );
}
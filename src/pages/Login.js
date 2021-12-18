/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMoralis } from "react-moralis";
import Logo from "../kokkow-logo.png";
import MetamaskLogo from "../metamask-logo.png";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';

function Login(props) {
  const { authenticate, isAuthenticating, isAuthenticated } = useMoralis();

  const redirectToMetamask = () => {
    window.location.href = "https://medium.com/@alias_73214/guide-how-to-setup-metamask-d2ee6e212a3e"
  }

  const redirectToHome = () => {
    authenticate();
  }

  useEffect(() => {
    if (isAuthenticated) {
      isAuthenticated && props.history.push('/');
    }
  },[isAuthenticating, isAuthenticated])

  return (
    <div
      style={{
        backgroundColor: '#14101b',
        height: '100vh'
      }}>
      <div style={{paddingTop: '150px'}}>
        <img src={Logo} style={{ margin: 'auto', display: 'block' }} alt="logo"/>
        <p style={{
          color: '#fff',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>Socialize to Earn</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isAuthenticating
            ?
            <CircularProgress size={70}/>
            :
            <button
              onClick={() => redirectToHome()}
              style={{
                marginTop: '100px',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '30px',
                paddingRight: '30px',
                fontWeight: 'bold',
                display: 'flex',
                backgroundColor: '#14101b',
                border: '1px #fff solid'
              }}
            >
              <img
                src={MetamaskLogo}
                style={{
                  width: '50px',
                  marginRight: '20px'
                }}
                alt="metamask logo"
              />
              <p
                style={{
                  color: '#fff'
                }}>
                Login with Metamask
              </p>
            </button>
          }
        </div>
        <p
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: '12px'
          }}>
          No Metamaks yet?
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button onClick={redirectToMetamask}>
            <p style={{color: '#fff', fontSize: '14px'}}>Metamask Setup Guide</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login;
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMoralis } from "react-moralis";
import Coin from '../../src/kowcoin.png';
import CircularProgress from '@material-ui/core/CircularProgress';
import MetamaskLogo from "../metamask-logo.png";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    maxWidth: '460px',
    backgroundColor: '#fff',
    padding: theme.spacing(1, 1, 1),
    borderRadius: 4,
    height: '300px',
    width: '90%'
  },
}));

function SignInModal(props) {
  const { authenticate, isAuthenticating, isAuthenticated } = useMoralis();
  const classes = useStyles();

  const redirectToHome = () => {
    authenticate();
  }
  
  useEffect(() => {
    const { handleClose } = props
    if (isAuthenticated) {
      handleClose();
    }
  },[isAuthenticated])

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.handleOpen}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.handleOpen}>
        <div className={classes.paper}>
          <img src={Coin} alt="kowcoin"
            style={{
            height: '100px',
            width: '100px',
            marginLeft: 'auto',
              marginRight: 'auto',
            marginTop: '-50px',
            display: 'block'
          }}/>
          <p
            style={{
            color: '#14101b',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            To get the most out of the app, you must first log in.
          </p>

          <p
            style={{
            color: '#14101b',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            Upload videos, Like Posts and Socialize To Earn!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {isAuthenticating
              ?
              <CircularProgress size={70}/>
              :
              <button
                onClick={() => redirectToHome()}
                style={{
                  marginTop: '20px',
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
        </div>
      </Fade>
    </Modal>
  )
}

export default SignInModal;
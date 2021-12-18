import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisFile, useMoralisQuery } from "react-moralis";
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 1),
    borderRadius: 4,
  },
}));

function UploadModal(props) {
  const { Moralis } = useMoralis();
  const {
    isUploading,
    saveFile,
  } = useMoralisFile();
  const classes = useStyles();
  const [file, setFile] = useState('');
  const [selectedFile, selectFile] = useState('')
  const [description, setDescription] = useState('');
  const [error, setErrorMessage] = useState('');
  const { data } = useMoralisQuery("User");
  const selectVideo = (event) => {
    if (event && event.size > 67108864) {
      setErrorMessage('File size should not exceed 64MB');
    } else {
      setErrorMessage('');
    }

    if (event) {
      setFile(event);
      selectFile(URL.createObjectURL(event)); 
    }
  }

  useEffect(() => {
    selectFile('');
  }, [props.handleClose]);

  const userId = String(data.map((data) => data.id));
  const userName = String(data.map((data) => data.attributes.username));
  const profilePicture = String(data.map((data) => data.attributes.profilePicture))
  const metadata = { createdById: userId, createdByUser: userName }
  const newPost = new Moralis.Object("Posts");

  const postStatus = async () => {
    const params = { userId: userId };
    const result = await Moralis.Cloud.run("updateEarnings", params);
    console.log(result)
    const fileName = encodeURI(file.name.replace(/ *\([^)]*\) */g, ""));
    const media = await saveFile(fileName, file, { metadata, saveIPFS: true });
    newPost.set('createdById', userId);
    newPost.set('assetUrl', media._ipfs);
    newPost.set('createdByUser', userName);
    newPost.set('description', description);
    newPost.set('profilePicture', profilePicture);
    newPost.save();
    selectFile('');
    props.handleClose();
  };

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
          <div style={{display: 'inline-flex'}}>
            <div style={{
              backgroundColor: '#efefef',
              height: '50px',
              width: '50px',
              borderRadius: '50px',
              marginTop: '9px'
            }}>
              {profilePicture !== '' ?
                <img
                  alt="DP"
                  src={profilePicture}
                  style={{
                    objectFit: 'cover',
                    height: '50px',
                    width: '50px',
                    borderRadius: '50px'
                  }} />
                :
                <PersonIcon style={{ color: '#3e3d3d', marginTop: '13px', marginLeft:'13px'}}/>
              }
            </div>
            <textarea
              rows="4"
              maxLength="50"
              style={{
                marginTop: '12px',
                marginLeft: 10,
                fontFamily: 'sans-serif',
                padding: '10px', border: 'none',
                height: '25px',
                outline: 'none',
              }}
              placeholder="Write a caption..."
              onChange={(event) => setDescription(event.target.value)}
            />
            <div
              style={{
                height: '70px',
                width: '70px',
                backgroundColor: selectedFile ? '#000' : '#efefef',
                display: 'flex',
                justifyContent: 'center',
                marginLeft: '10px'
              }}>
              <video
                src={selectedFile}
                style={{
                  height: '70px',
                  width: '70px',
                  position: 'absolute'
                }}></video>
              <VideocamOutlinedIcon
                fontSize={'large'}
                style={{
                  margin: 'auto',
                  zIndex: 999,
                  color: selectedFile ? '#fff' : 'black'
                }} />
              <p style={{
                position: 'absolute',
                fontSize: '8px',
                paddingTop: '45px',
                fontWeight: 'bold',
                display: selectedFile ? 'none': 'block'
              }}>Select Video</p>
              <input
                type="file"
                accept="video/*"
                onChange={(event) => selectVideo(event.target.files[0])}
                style={{
                  width: '70px',
                  paddingBottom: '70px',
                  position: 'absolute',
                  opacity: 0,
                  zIndex: 9999
                }} />
            </div>
          </div>
          <br />
          <p style={{
            color: 'red',
            textAlign: 'center',
            padding: '0px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>{error}</p>
          {isUploading ?
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={50}/>
            </div>
            :
            <Button
              style={{
                width: '100%',
                backgroundColor: error !== '' || selectedFile === ''  || description === '' ? '#d3d3d3' : '#14101b',
                color: '#fff',
                marginTop: '0px',
                fontWeight: 'bold'
              }}
              disabled={error !== '' || selectedFile === '' || description === '' ? true : false}
              onClick={postStatus}
            >
              Share
            </Button>
          }
        </div>
      </Fade>
    </Modal>
  )
}

export default UploadModal;
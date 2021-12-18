import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 0),
    borderRadius: 4,
    width: '80%'
  },
}));

export default function AlertModal(props) {
  const classes = useStyles();
  
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.openModalAction(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title"
              style={{ textAlign: 'center' }}>
              Are you sure you want to delete this video?
            </h2>
            <div style={{display: 'inline-flex', width: '100%'}}>
              <Button
                style={{
                  fontSize: '18px',
                  width: '50%',
                  paddingTop: '20px',
                  paddingBottom: '20px'
                }}
                onClick={() => props.action}
              >
                Yes
              </Button>
              <Button
                style={{
                  fontSize: '18px',
                  width: '50%',
                  paddingTop: '20px',
                  paddingBottom: '20px'
                }}
                onClick={() => props.openModalAction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Button } from '@material-ui/core';

function Users(props) {
  const { Moralis } = useMoralis();
  const { data } = useMoralisQuery("User");
  const [users, setUsers] = useState();
  const [updated, setUpdate] = useState(false);
  const [followers, setFollowers] = useState();
  const [currentUser, setCurrentUser] = useState();
  //const currentUserId = currentUser && currentUser[0].id;
  // const isCurrentUser = String(data.map((data) => data.id)) === currentUserId;
  const loggedUserId = data && String(data.map((data) => data.id));
  const isFollowing = _.includes(followers, loggedUserId) ? true : false;

  const checkUserFollowers = async () => {
    const params =  { userId: props.match.params.userId };
    const result = await Moralis.Cloud.run("checkUserFollowers", params);
    setFollowers(result.length > 0 ? result[0].attributes.followedBy : []);
  }
  
  const getUser = async () => {
    const params = { userId: props.match.params.userId };
    const result = await Moralis.Cloud.run("getUser", params);
    setCurrentUser(result);
    console.log(currentUser)
  }

  const getFollowers = async () => {
    const params =  { userId: props.match.params.userId };
    const result = await Moralis.Cloud.run("getAllFollowers", params);
    setUsers(result);
  }

  const getFollowing = async () => {
    const params = { userId: props.match.params.userId };
    const result = await Moralis.Cloud.run("getAllFollowing", params);
    setUsers(result);
  }

  const goToUserProfile = (userId) => {
    props.history.push(`/profile/${userId}`)
  }

  const followUser = async () => {
    const params =  { userId: props.match.params.userId };
    const result = await Moralis.Cloud.run("checkUserFollowers", params);
    const newFollower = new Moralis.Object("Followers");
    if (result.length === 0 ) {
      newFollower.set('userId', props.match.params.userId);
      newFollower.addUnique('followedBy', loggedUserId);
      await newFollower.save();
      setUpdate(!updated);
    } else if (!_.includes(result[0].attributes.followedBy, loggedUserId)) {
      result[0].addUnique('followedBy', loggedUserId);
      await result[0].save();
      setUpdate(!updated);
    } else if (_.includes(result[0].attributes.followedBy, loggedUserId)) {
      result[0].remove('followedBy', loggedUserId);
      await result[0].save();
      setUpdate(!updated);
    }
  }

  useEffect(() => {
    if (props.match.path === '/following/:userId') {
      getFollowing(); 
    } else {
      getFollowers();
    }
    getUser();
    checkUserFollowers();
  },[updated, data])
  return (
    <div style={{maxWidth: '500px', margin: '0 auto'}}>
      {users && users.map((res) => 
        <div
          onClick={() => goToUserProfile(res.id)}
          style={{
            // width: '100%',
            height: '44px',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'stretch',
            alignItems: 'center',
            marginLeft: '20px',
            marginTop: '10px'
          }}>
            <div
              style={{
              backgroundColor: '#fff',
              height: '45px',
              width: '45px',
              borderRadius: '45px',
              marginRight: '10px'
            }}>
              {res.attributes.profilePicture &&
                <img
                  alt="DP"
                  src={res.attributes.profilePicture}
                  style={{
                    objectFit: 'cover',
                    height: '45px',
                    width: '45px',
                    borderRadius: '30px'
                  }} />
              }
            </div>
            <div
              style={{
                width: '50%'
              }}
            >
              <p
                style={{
                  margin: '0px',
                  color: '#000'
                }}
              >{res.attributes.username}</p>
            </div>
            {/* {!isCurrentUser && */}
              <Button
                onClick={() => followUser()}
                style={{
                backgroundColor: isFollowing ? '#d0cccd' : '#fe2c55',
                display: 'block',
                margin: '0 auto',
                color: '#fff'
              }}>
              {isFollowing? 'Unfollow' : 'Follow'}
              </Button>
            {/* } */}
        </div>
      )}
    </div>
  )
}

export default Users;
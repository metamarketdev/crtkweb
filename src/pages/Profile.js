/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import _ from "lodash";
import { useMoralis, useMoralisQuery, useMoralisFile } from "react-moralis";
import GridOnIcon from "@material-ui/icons/GridOn";
import FavoriteIcon from "@material-ui/icons/Favorite";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VideoThumbnails from "../components/VideoThumbnails";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { Input } from "@material-ui/core";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CircularProgress from "@material-ui/core/CircularProgress";
import PersonIcon from "@material-ui/icons/Person";
//import { useParams } from "react-router-dom";

//For PopOver
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FollowingFollowers from "../components/FollowingFollowers";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
    fontSize: "14px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

function Profile(props) {
  //For PopOver
  const classes = useStyles();
  const { data } = useMoralisQuery("User");
  const [anchorEl, setAnchorEl] = useState(null);
  const { Moralis } = useMoralis();
  const [currentUser, setCurrentUser] = useState();
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [likes, setLikes] = useState();
  const [updated, setUpdate] = useState(false);
  const [isOwned, setIsOwned] = useState(true);
  const loggedUserId = data && String(data.map((data) => data.id));
  const isFollowing = _.includes(followers, loggedUserId);
  const userFromProps = props.match.params.userId;

  useEffect(() => {
    setIsOwned(true);
  }, [props.match.params.userId]);

  const logOut = () => {
    logout();
    props.history.push("/");
  };

  const [isFollowersOpen, setIsFollowersOpen] = useState({
    tabIndex: 0,
    status: false,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getUser = async () => {
    try {
      const params = { userId: userFromProps };
      const result = await Moralis.Cloud.run("getUser", params);
      setCurrentUser(result);
    } catch (error) {}
  };

  const followUser = async () => {
    const params = { userId: userFromProps };
    const result = await Moralis.Cloud.run("checkUserFollowers", params);
    const newFollower = new Moralis.Object("Followers");
    if (result.length === 0) {
      newFollower.set("userId", userFromProps);
      newFollower.addUnique("followedBy", loggedUserId);
      await newFollower.save();
      setUpdate(!updated);
    } else if (!_.includes(result[0].attributes.followedBy, loggedUserId)) {
      result[0].addUnique("followedBy", loggedUserId);
      await result[0].save();
      setUpdate(!updated);
    } else if (_.includes(result[0].attributes.followedBy, loggedUserId)) {
      result[0].remove("followedBy", loggedUserId);
      await result[0].save();
      setUpdate(!updated);
    }
  };

  // const goToFollowing = (userId) => {
  //   props.history.push(`/following/${userId}`);
  // };

  // const goToFollowers = (userId) => {
  //   props.history.push(`/followers/${userId}`);
  // };

  const getFollowers = async () => {
    const params = { userId: userFromProps };
    const result = await Moralis.Cloud.run("checkUserFollowers", params);
    setFollowers(result.length > 0 ? result[0].attributes.followedBy : []);
  };

  const getFollowing = async () => {
    const params = { userId: userFromProps };
    const result = await Moralis.Cloud.run("checkUserFollowing", params);
    setFollowing(result.map((data) => data.attributes.userId));
  };

  const getLikes = async () => {
    const params = { userId: userFromProps };
    const result = await Moralis.Cloud.run("checkUserLikes", params);
    setLikes(result.length);
  };

  useEffect(() => {
    getUser();
    getFollowers();
    getFollowing();
    getLikes();
  }, [updated, data, userFromProps]);

  useEffect(() => {
    setIsOwned(true);
  }, [updated]);

  const renderPopOver = () => {
    return (
      <div style={{ position: "absolute" }}>
        <Button aria-describedby={id} onClick={handleClick}>
          <MoreHorizIcon />
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Button style={{ textTransform: "none" }} onClick={() => logOut()}>
            <ExitToAppIcon />
            <Typography className={classes.typography}>Log Out</Typography>
          </Button>
        </Popover>
      </div>
    );
  };

  //For Data Management
  const [edit, setEditUser] = useState(false);
  const [username, setUsername] = useState("");
  const { setUserData, logout } = useMoralis();
  const [error, setErrorMessage] = React.useState("");
  const { isUploading, saveFile } = useMoralisFile();
  const userName = String(data.map((data) => data.attributes.username));
  const currentUserId = currentUser && currentUser[0]?.id;
  const isCurrentUser = String(data.map((data) => data.id)) === currentUserId;
  const currentUserProfilePicture =
    currentUser && currentUser[0]?.attributes.profilePicture;
  const currentUsername = currentUser && currentUser[0]?.attributes.username;
  const followersCount =
    followers && followers.length > 0 ? followers.length : 0;
  const followingCount =
    following && following.length > 0 ? following.length : 0;
  //const likesCount = likes ? likes.length : 0;

  const updateUsername = () => {
    if (username !== "") {
      setUserData({
        username: username,
      });
    }
    setEditUser(false);
  };

  const selectProfilePhoto = async (event) => {
    if (event && event.size > 67108864) {
      setErrorMessage("File size should not exceed 64MB");
    } else {
      setErrorMessage("");
    }

    if (event && event.name) {
      const media = await saveFile(event.name, event, { saveIPFS: true });
      setUserData({
        profilePicture: media._ipfs,
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        width: "100vw",
      }}
    >
      <FollowingFollowers
        setIsFollowersOpen={setIsFollowersOpen}
        isFollowersOpen={isFollowersOpen}
        userId={userFromProps}
        setUpdate={setUpdate}
        updated={updated}
        callBack={props}
      />

      <div
        style={{
          display: "grid",
          width: "100%",
          height: "44px",
          borderBottom: "1px solid #d0d1d8",
        }}
      >
        <p
          style={{
            margin: "12px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Profile
        </p>
        {renderPopOver()}
      </div>
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            height: "100px",
            width: "100px",
            backgroundColor: "#6275fb",
            borderRadius: "100px",
            alignSelf: "center",
            margin: "0 auto",
          }}
        >
          {isUploading && (
            <CircularProgress
              style={{
                position: "absolute",
                zIndex: "999",
              }}
              size={100}
            />
          )}
          {currentUserProfilePicture !== undefined ? (
            <img
              alt="DP"
              src={currentUserProfilePicture}
              style={{
                height: "100px",
                width: "100px",
                objectFit: "cover",
                position: "absolute",
                borderRadius: "100px",
              }}
            />
          ) : (
            <PersonIcon
              style={{
                color: "#3e3d3d",
                marginTop: "13px",
                marginLeft: "15px",
                position: "absolute",
                fontSize: "70px",
              }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => selectProfilePhoto(event.target.files[0])}
            disabled={!isCurrentUser}
            style={{
              width: "70px",
              paddingBottom: "70px",
              position: "absolute",
              opacity: 0,
              zIndex: 9999,
            }}
          />
          {isCurrentUser && (
            <div
              style={{
                height: "50px",
                width: "100px",
                backgroundColor: "#bfbfbf6b",
                position: "absolute",
                marginTop: "50px",
                borderBottomLeftRadius: "100px",
                borderBottomRightRadius: "100px",
                textAlign: "center",
              }}
            >
              <CameraAltIcon style={{ marginTop: "10px", color: "#fff" }} />
            </div>
          )}
        </div>
        <p
          style={{
            color: "red",
            textAlign: "center",
            padding: "0px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
        {!isCurrentUser && (
          <Button
            onClick={() => followUser()}
            style={{
              backgroundColor: isFollowing ? "#d0cccd" : "#fe2c55",
              display: "block",
              margin: "0 auto",
              color: "#fff",
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
        <div style={{ textAlign: "center" }}>
          {edit ? (
            <Input
              onBlur={() => updateUsername()}
              onChange={(event) => setUsername(event.target.value)}
              disabled={!isCurrentUser}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                outline: "none",
                fontSize: "18px",
                marginTop: "3px",
                marginBottom: "12px",
                paddingBottom: "5px",
                width: "150px",
              }}
              maxLength="20"
              placeholder={`@${userName}`}
            />
          ) : (
            <Button
              onClick={() => setEditUser(true)}
              disabled={!isCurrentUser}
              style={{
                textTransform: "none",
              }}
            >
              <p
                style={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  marginRight: "3px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#000",
                }}
              >
                @{currentUsername}
              </p>

              {isCurrentUser && (
                <CreateOutlinedIcon style={{ fontSize: "18px" }} />
              )}
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: "inline-flex", width: "100%", marginTop: "10px" }}>
        <div style={{ width: "20%" }}></div>
        <div
          onClick={() =>
            followingCount > 0 &&
            setIsFollowersOpen({ tabIndex: 0, status: true })
          }
          style={{
            width: "20%",
            height: "40px",
            borderRight: "1px solid #d0d1d8",
          }}
        >
          <p style={{ fontWeight: "bold", margin: "0px", textAlign: "center" }}>
            {followingCount}
          </p>
          <p
            style={{
              margin: "0px",
              color: "#83848a",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Following
          </p>
        </div>
        <div
          onClick={() =>
            followersCount > 0 &&
            setIsFollowersOpen({ tabIndex: 1, status: true })
          }
          style={{
            width: "20%",
            height: "40px",
            borderRight: "1px solid #d0d1d8",
          }}
        >
          <p style={{ fontWeight: "bold", margin: "0px", textAlign: "center" }}>
            {followersCount}
          </p>
          <p
            style={{
              margin: "0px",
              color: "#83848a",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Followers
          </p>
        </div>
        <div style={{ width: "20%", height: "40px" }}>
          <p style={{ fontWeight: "bold", margin: "0px", textAlign: "center" }}>
            {likes}
          </p>
          <p
            style={{
              margin: "0px",
              color: "#83848a",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Likes
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "44px",
          borderTop: "1px solid #d0d1d8",
          borderBottom: "1px solid #d0d1d8",
        }}
      >
        <Button
          style={{ width: "50%", height: "44px" }}
          onClick={() => setIsOwned(true)}
        >
          <GridOnIcon style={{ color: isOwned && "#f05842" }} />
        </Button>
        {!isCurrentUser ? (
          <Button style={{ width: "50%", height: "44px" }} disabled>
            <VisibilityOffIcon style={{ color: !isOwned && "#f05842" }} />
          </Button>
        ) : (
          <Button
            style={{ width: "50%", height: "44px" }}
            onClick={() => setIsOwned(false)}
          >
            <FavoriteIcon style={{ color: !isOwned && "#f05842" }} />
          </Button>
        )}
      </div>

      <VideoThumbnails
        isOwned={isOwned}
        setIsOwned={setIsOwned}
        userId={userFromProps}
        updated={updated}
      />
    </div>
  );
}

export default Profile;

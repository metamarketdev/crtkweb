import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { VideoCtx } from "./VideoDrawer";

const VideoProfile = ({
  video,
  isDrawer,
  setIsCommentsOpen,
  isCommentsOpen,
  currentComments,
  allComments,
}) => {
  const history = useHistory();
  const { Moralis } = useMoralis();
  const { currentUser, setIsDrawerOpen } = useContext(VideoCtx);
  const { data } = useMoralisQuery("User");
  const currentUserId = String(data.map((data) => data.id));
  const [updated, setUpdated] = useState();
  const [videoData, setVideoData] = useState({});

  useEffect(() => {
    if (video.length > 0) {
      setVideoData(video[0]);
    } else {
      setVideoData(video);
    }
  }, [video]);

  useEffect(() => {
    const nav = document.getElementById("navigation");
    if (isCommentsOpen.status) {
      setTimeout(() => {
        nav.style = "transform: translateY(50px)";
      }, 100);
    } else {
      nav.style = "transform: translateY(0px)";
    }
  }, [isCommentsOpen]);

  const { isAuthenticated } = useMoralis();

  const likeStatus = async (post) => {
    if (!_.includes(post.attributes.likedBy, currentUserId)) {
      post.increment("likes");
      post.addUnique("likedBy", currentUserId);
      await post.save();
      setUpdated(!updated);
    } else {
      post.decrement("likes");
      post.remove("likedBy", currentUserId);
      await post.save();
      setUpdated(!updated);
    }
  };

  const followUser = async () => {
    const params = { userId: videoData?.data.attributes.createdById };
    const result = await Moralis.Cloud.run("checkUserFollowers", params);
    const newFollower = new Moralis.Object("Followers");
    if (result.length === 0) {
      newFollower.set("userId", videoData?.data.attributes.createdById);
      newFollower.addUnique("followedBy", currentUserId);
      await newFollower.save();
      // setUpdate(!updated);
    } else if (!_.includes(result[0].attributes.followedBy, currentUserId)) {
      result[0].addUnique("followedBy", currentUserId);
      await result[0].save();
      // setUpdate(!updated);
    } else if (_.includes(result[0].attributes.followedBy, currentUserId)) {
      result[0].remove("followedBy", currentUserId);
      await result[0].save();
      // setUpdate(!updated);
    }
  };

  const handleProfileClick = () => {
    const userId = videoData?.userId || currentUserId;
    history.push(isAuthenticated ? `/profile/${userId}` : "/login");
    isDrawer && setIsDrawerOpen({ data: null, status: false });
  };

  const handleIsLiked = () => {
    return handleCheckProperty("likedBy")
      ? videoData?.data?.attributes.likedBy.findIndex(
          (liker) => liker === currentUserId
        ) >= 0
      : false;
  };

  const handleCheckProperty = (prop) => {
    return videoData?.data?.attributes.hasOwnProperty(prop);
  };

  return (
    <section className="video-profile">
      <div
        style={{
          width: "50px",
          height: "24px",
          marginTop: "10px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {(
          isDrawer && currentUser
            ? currentUser.attributes.profilePicture
            : video[0]?.profilePicture
        ) ? (
          <img
            alt="DP"
            src={
              videoData?.profilePicture ||
              currentUser?.attributes.profilePicture
            }
            style={{
              objectFit: "cover",
              height: "48px",
              width: "48px",
              position: "absolute",
              borderRadius: "100px",
            }}
            onClick={handleProfileClick}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#efefef",
              height: "48px",
              width: "48px",
              borderRadius: "50px",
              position: "absolute",
            }}
          >
            <PersonIcon
              style={{
                color: "#3e3d3d",
                marginTop: "13px",
                marginLeft: "13px",
              }}
            />
          </div>
        )}

        {(videoData?.data?.attributes.createdById || videoData.userId) !==
          currentUserId && (
          <button
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "#fff",
              position: "relative",
              marginLeft: "13px",
              marginTop: "36px",
              borderRadius: "24px",
              padding: "0px",
              border: "0px",
            }}
            onChange={followUser}
          >
            <AddCircleIcon
              style={{
                position: "relative",
                color: "red",
                fontSize: "24px",
              }}
            />
          </button>
        )}
      </div>

      <div
        style={{
          width: "50px",
          height: "24px",
          marginTop: "45px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <button
          onClick={() =>
            isAuthenticated
              ? likeStatus(videoData?.data || videoData)
              : history.push("/login")
          }
          style={{
            backgroundColor: "transparent",
            marginLeft: "5px",
            padding: "0px",
            border: "0px",
          }}
        >
          <FavoriteIcon
            className="fav-icon"
            style={{
              color: isDrawer ? "red " : handleIsLiked() ? "red " : "#fff",
              // color: "#fff",
              fontSize: "40px",
            }}
          />
        </button>
        <p
          style={{
            margin: "0px",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {handleCheckProperty("likes") ? video[0]?.data.attributes.likes : 0}
        </p>
      </div>

      <div
        style={{
          width: "40px",
          height: "24px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: "20px",
          marginTop: "30px",
        }}
      >
        <button
          id=""
          style={{
            backgroundColor: "transparent",
            padding: "0px",
            border: "0px",
          }}
          onClick={() => {
            isAuthenticated
              ? setIsCommentsOpen({ data: videoData, status: true })
              : history.push("/login");
          }}
        >
          <ChatIcon
            style={{
              color: "#fff",
              fontSize: "40px",
            }}
          />
        </button>
        <p
          style={{
            margin: "0px",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {allComments.length || 0}
        </p>
      </div>
    </section>
  );
};

export default VideoProfile;

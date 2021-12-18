/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Logo } from "../Logo";
import VideoPlayer from "./VideoPlayer";
import { VideoCtx } from "./VideoDrawer";
import { useMoralis } from "react-moralis";
import SignInModal from "../SignInModal";

const VideoWrapper = ({ videos, setGetNewVideos }) => {
  const { isOpen, isDrawer } = useContext(VideoCtx);
  const { isAuthenticated } = useMoralis();
  const [scroll, setScroll] = useState(0);
  const [wrapper, setWrapper] = useState(null);
  const [videosHeight, setVideosHeight] = useState(0);
  const [videosData, setVideosData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    videos.length > 0 &&
      setVideosData(
        videos.filter((video) => video.length > 0 || video !== null || video)
      );
  }, [videos]);

  useEffect(() => {
    if (wrapper && isOpen) {
      const selected_video = document.getElementById(isOpen.data?.idx);
      selected_video &&
        isOpen &&
        selected_video.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [isOpen, videosHeight, wrapper]);

  const vid_wrapper = document.getElementById("video-wrapper");

  useEffect(() => {
    if (vid_wrapper) {
      setWrapper(vid_wrapper);
      vid_wrapper.addEventListener("scroll", handleScrollEvent);
    }
    return () => {
      vid_wrapper &&
        vid_wrapper.removeEventListener("scroll", handleScrollEvent);
    };
  }, [vid_wrapper]);

  useEffect(() => {
    if (!isOpen.status) {
      const total_vid_length = videos.length - 1;
      const total_height =
        document.body.clientHeight * total_vid_length - total_vid_length * 49;
      if (isAuthenticated && scroll === total_height) {
        setGetNewVideos(true);
      }

      if (!isAuthenticated && scroll === total_height) {
        handleOpen(true);
      }
    }
  }, [scroll]);

  // const getFollowing = async () => {
  //   const params = { userId: userFromProps };
  //   const result = await Moralis.Cloud.run("checkUserFollowing", params);
  //   setFollowing(result.map((data) => data.attributes.userId));
  // };

  const handleScrollEvent = (event) => {
    const scroll = event.target.scrollTop;
    setScroll(scroll);
  };
  return (
    <section className="video-wrapper" id="video-wrapper">
      <Logo isDrawer={isDrawer} />
      <SignInModal handleOpen={open} handleClose={handleClose} />
      {videosData.map((video, idx) => (
        <VideoPlayer
          key={video[0]?.data.id || video.id}
          video={video}
          idx={idx}
          scroll={scroll}
          setVideosHeight={setVideosHeight}
          wrapper={wrapper}
        />
      ))}
    </section>
  );
};

export default VideoWrapper;

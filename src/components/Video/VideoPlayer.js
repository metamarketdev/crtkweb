/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import VideoCaption from "./VideoCaption";
import { VideoCtx } from "./VideoDrawer";
import VideoProfile from "./VideoProfile";
import Moralis from "moralis";
// import { HomeCtx } from "./../../pages/Home";
import { AppCtx } from "./../../App";
import _ from "lodash";
import CommentsDrawer from "./CommentsDrawer";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { PauseOutlined, PlayArrow } from "@material-ui/icons";

const VideoPlayer = ({
  video,
  idx,
  scroll,
  setVideosHeight,
  wrapper,
  loggedOutUser,
}) => {
  const vid_player = useRef(null);
  const { isAuthenticated } = useMoralis();
  const { currentUser } = useContext(AppCtx);
  const { isOpen, isDrawer } = useContext(VideoCtx);
  const [vidPlayer, setVidPlayer] = useState("");
  const [videoHeight, setVideoHeight] = useState(0);
  const [comments, setComments] = useState([]);
  const [allPostsComments, setAllPostsComments] = useState([]);
  const [isCommentsOpen, setIsCommentsOpen] = useState({
    data: null,
    status: false,
  });

  const [isPlaying, setIsPlaying] = useState(true);

  const { isFetching } = useMoralisQuery(
    "Comments",
    (query) => query.descending("createdAt").limit(5),
    [],
    {
      live: true,
    }
  );

  useEffect(() => {
    if (isCommentsOpen.status) {
      wrapper.style = "overflow: hidden;";
    } else {
      wrapper.style = "overflow: auto;";
    }
  }, [wrapper, isCommentsOpen.status]);

  useEffect(() => {
    handleGetComments();
  }, [isFetching]);

  useEffect(() => {
    if (!vidPlayer) {
      const vid_player = document.getElementById("video-0");
      setVidPlayer(vid_player);
    }
  }, [vidPlayer]);

  useEffect(() => {
    if (vidPlayer) {
      const video_height = vidPlayer.clientHeight;
      setVideoHeight(video_height);
      setVideosHeight(video_height);
    }
  }, [vidPlayer]);

  // TODO: GET ALL POST'S COMMENTS
  const handleGetComments = async () => {
    const params = { postId: video[0]?.data.id || video.id };

    try {
      const res = await Moralis.Cloud.run("getComments", params);
      setAllPostsComments(res);
      const comms = [];

      res.forEach((data) => {
        if (!data.comment.attributes.repliedTo) {
          const com = {
            main_comment: data,
            replies: res.filter(
              (r) => r.comment.attributes.repliedTo === data.comment.id
            ),
          };

          return comms.push(com);
        }
      });
      setComments(comms);
    } catch (error) {
      console.log({ error });
    }
  };

  const current_idx = idx + 1;
  const video_height_idx = videoHeight * current_idx - videoHeight;
  const start_playing =
    scroll >= video_height_idx && scroll < videoHeight * current_idx;

  const handlePlayCount = async (state, post) => {
    const vid = post?.data ? post.data : post;
    const isCurrentUser =
      (currentUser.length > 0 ? currentUser[0].id : loggedOutUser) ===
      vid.attributes.createdById;
    if (
      parseInt(state.playedSeconds) === 3 &&
      !_.includes(vid.attributes.viewCount) &&
      !isCurrentUser &&
      isAuthenticated
    ) {
      vid.increment("viewCount");
      await vid.save();
    }
  };

  const handlePausePlay = (e) => {
    const play_pause_wrapper = document.getElementById(
      `play-pause-wrapper-${idx}`
    );
    play_pause_wrapper.classList.add("animate");
    isPlaying
      ? play_pause_wrapper.classList.add("play-visible")
      : play_pause_wrapper.classList.remove("play-visible");

    setTimeout(() => {
      play_pause_wrapper.classList.remove("animate");
    }, 300);

    setIsCommentsOpen({ data: null, status: false });
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    start_playing && setIsPlaying(true);
  }, [start_playing]);

  return (
    <div id={`video-${idx}`} className="video-player-wrapper">
      {start_playing && (
        <CommentsDrawer
          key={video[0]?.data.id || video.id}
          comments={comments}
          allComments={allPostsComments}
          video={video}
          getComments={handleGetComments}
          setIsCommentsOpen={setIsCommentsOpen}
          isCommentsOpen={isCommentsOpen}
        />
      )}
      {video && (
        <>
          <div
            id={`play-pause-wrapper-${idx}`}
            className="play-pause-wrapper"
            onClick={handlePausePlay}
          >
            {isPlaying ? <PauseOutlined /> : <PlayArrow />}
          </div>
          <ReactPlayer
            ref={vid_player}
            id="video-player"
            url={
              video[0]?.data.attributes.assetUrl || video?.attributes.assetUrl
            }
            loop={true}
            playing={
              isDrawer
                ? isOpen?.status && start_playing
                : start_playing && isPlaying
            }
            width="100%"
            height="100vh"
            style={{
              backgroundColor: "#000",
              objectFit: "fill",
              opacity: isCommentsOpen.status ? 0.3 : 1,
              transition: "all 230ms ease",
            }}
            controls={false}
            light={!start_playing}
            // light={true}
            onProgress={(state) => handlePlayCount(state, video[0] || video)}
            pip={false}
            playsinline={true}
            config={{
              file: { attributes: { preload: "metadata" } },
            }}
          />
        </>
      )}

      {(video || video[0]) && (
        <>
          <VideoProfile
            video={video}
            isDrawer={isDrawer}
            setIsCommentsOpen={setIsCommentsOpen}
            isCommentsOpen={isCommentsOpen}
            currentComments={comments}
            allComments={allPostsComments}
          />
          <VideoCaption details={video} />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;

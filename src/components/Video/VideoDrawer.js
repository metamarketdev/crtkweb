/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createContext } from "react";
import VideoWrapper from "./VideoWrapper";
//import _ from "lodash";

import { useMoralis } from "react-moralis";
// import { useParams } from "react-router";
import { Close } from "@material-ui/icons";
// import { ProfileCtx } from "../../pages/Profile";

export const VideoCtx = createContext({
  currentUser: null,
  isOpen: { data: null, status: false },
  isDrawer: false,
});

const VideoDrawer = ({ isOpen, setIsDrawerOpen, mediaData, userId }) => {
  // let { userId } = useParams();
  const { Moralis } = useMoralis();

  // const [userVideos, setUserVideos] = useState(mediaData);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUser();
  }, [userId]);

  useEffect(() => {
    console.log({ VideoDrawer: currentUser });
  }, [currentUser]);

  // useEffect(() => {
  //   setUserVideos(mediaData);
  // }, [mediaData]);

  const getUser = async () => {
    try {
      const params = { userId };
      const result = await Moralis.Cloud.run("getUser", params);
      setCurrentUser(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`video-drawer${isOpen.status ? " open-drawer" : ""}`}>
      <Close
        className="drawer-close-btn"
        onClick={() => setIsDrawerOpen({ data: null, status: false })}
      />
      <VideoCtx.Provider
        value={{ currentUser, isOpen, isDrawer: true, setIsDrawerOpen }}
      >
        <VideoWrapper videos={mediaData} />
      </VideoCtx.Provider>
    </div>
  );
};

export default VideoDrawer;

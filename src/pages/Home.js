/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import _ from "lodash";
import VideoWrapper from "../components/Video/VideoWrapper";

export const HomeCtx = createContext({
  currentVideoPlaying: null,
  setCurrentVideoPlaying: () => {},
  CurrentUser: null,
});

const Home = ({ currentUser, isRandomVideos }) => {
  const { Moralis, isAuthenticated } = useMoralis();
  const [currentVideoPlaying, setCurrentVideoPlaying] = useState(null);
  const [getNewVideos, setGetNewVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [allPosts, setAllPost] = useState([]);

  const { data, isFetching } = useMoralisQuery(
    "Posts",
    (query) => query.descending("createdAt").limit(20),
    [],
    {
      live: true,
    }
  );

  const loggedOutVideos =
    data &&
    data.map((res) => {
      return [
        {
          data: res,
          profilePicture: res.attributes.profilePicture,
          user: res.attributes.createdByUser,
          userId: res.attributes.createdById,
        },
      ];
    });

  useEffect(() => {
    if (isAuthenticated) {
      isRandomVideos ? getAllPosts(0) : getFollowingVideos(0);
      setAllPost([]);
    }
  }, [isRandomVideos, isFetching, data, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      if (getNewVideos && isRandomVideos) {
        setCurrentPage(currentPage + 1);
        getAllPosts(currentPage + 1);
      } else if (getNewVideos && !isRandomVideos) {
        setCurrentPage(currentPage + 1);
        getFollowingVideos(currentPage + 1);
      }
    }
  }, [getNewVideos, isAuthenticated]);

  const getFollowingVideos = async (page) => {
    const params = { userId: currentUser[0]?.id, skip: page * 200, limit: 200 };
    const postsFromFollowing = await Moralis.Cloud.run(
      "getAllPostFromFollowing",
      params
    );

    const all_posts = postsFromFollowing
      .map((result) => {
        return _.compact(result);
      })
      .filter((post) => post.length > 0);

    const post_videos = [
      ...allPosts,
      ..._.orderBy(
        all_posts,
        [
          (obj) => {
            return new Date(obj[0]?.data.createdAt);
          },
        ],
        ["asc"]
      ),
    ].filter((post) => post.length > 0);

    setAllPost(page > 0 ? post_videos : all_posts);
    setGetNewVideos(false);
  };

  const getAllPosts = async (page) => {
    const params = {
      skip: page * 200,
      limit: 200,
    };

    const posts = await Moralis.Cloud.run("getAllPosts", params);

    const all_posts = posts.map((result) => {
      return _.compact(result);
    });

    const post_videos = [
      ...allPosts,
      ..._.orderBy(
        all_posts,
        [(obj) => new Date(obj[0].data.createdAt)],
        ["asc"]
      ),
    ];
    setAllPost(page > 0 ? post_videos : all_posts);
    setGetNewVideos(false);
  };

  return (
    <HomeCtx.Provider
      value={{
        currentVideoPlaying,
        setCurrentVideoPlaying,
        setGetNewVideos,
      }}
    >
      <div
        style={{
          height: "100vh",
          margin: "0 auto",
        }}
      >
        <div className={`loading${getNewVideos ? " show" : ""}`}>
          Getting new videos...
        </div>
        <VideoWrapper
          videos={isAuthenticated ? allPosts : loggedOutVideos}
          loggedOutUser={currentUser}
          setGetNewVideos={setGetNewVideos}
        />
      </div>
    </HomeCtx.Provider>
  );
};

export default Home;

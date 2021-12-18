/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useMoralisQuery, useMoralis } from "react-moralis";
import ReactPlayer from "react-player/lazy";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";
import VideoDrawer from "./Video/VideoDrawer";

const VideoThumbnails = ({ userId, isOwned }) => {
  const { Moralis } = useMoralis();
  const [mediaData, setMediaData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState({
    data: null,
    status: false,
  });

  const [likedPosts, setLikedPosts] = useState([]);
  const [ownPosts, setOwnPosts] = useState([]);

  const { data } = useMoralisQuery(
    "Posts",
    (query) => query.descending("createdAt"),
    [10],
    {
      live: true,
    }
  );

  useEffect(() => {
    setMediaData([]);
    setLikedPosts([]);
    setOwnPosts([]);
  }, [userId]);

  useEffect(() => {
    likedPosts.length <= 0 && getLikedPosts();
  }, [likedPosts, userId]);

  useEffect(() => {
    OwnPosts();
  }, [data, userId]);

  const OwnPosts = () => {
    const own_posts = data.filter(
      (data) => data.attributes.createdById === userId
    );
    setOwnPosts(own_posts);
  };

  const getLikedPosts = async () => {
    try {
      const params = { userId };
      const result = await Moralis.Cloud.run("getLikedPosts", params);
      setLikedPosts(result);
    } catch (error) {}
  };

  useEffect(() => {
    (ownPosts.length > 0 || likedPosts.length > 0) &&
      setMediaData(
        _.orderBy(
          _.compact(isOwned ? ownPosts : likedPosts),
          [
            (obj) => {
              return new Date(
                !obj[0]
                  ? obj.attributes.createdAt
                  : obj[0].data.attributes.createdAt
              );
            },
          ],
          ["desc"]
        )
      );
  }, [data, isOwned, ownPosts, likedPosts, userId]);

  return (
    <div className="video-thumbs-wrapper" style={{paddingBottom: '60px'}}>
      {mediaData.length > 0 ? (
        mediaData.map((data, idx) => (
          <div key={data.id}>
            <section
              style={{ position: "relative" }}
              onClick={() => {
                setIsDrawerOpen({
                  data: { ...data, idx: `video-${idx}` },
                  status: true,
                });
              }}
            >
              <div className="play-count">
                <PlayArrowOutlinedIcon />
                <span>
                  {data[0]
                    ? data[0].data.attributes.viewCount
                    : data.attributes.viewCount}
                </span>
              </div>
              <ReactPlayer
                className="thumbnail"
                url={
                  data[0]
                    ? data[0].data.attributes.assetUrl
                    : data.attributes.assetUrl
                }
                height="150px"
                width="100%"
                style={{
                  backgroundColor: "black",
                }}
                controls={false}
              />
            </section>

            {/* <VideoWrapper posts={mediaData} /> */}
          </div>
        ))
      ) : (
        <span>Loading...</span>
      )}
      <VideoDrawer
        isOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        mediaData={mediaData}
        userId={userId}
      />
    </div>
  );
};

export default VideoThumbnails;

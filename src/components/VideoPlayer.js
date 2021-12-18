import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import ReactPlayer from 'react-player/lazy';
import { useMoralis, useMoralisQuery } from "react-moralis";
import Logo from "../kokkow-logo.png";
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';
// import DeleteIcon from '@material-ui/icons/Delete';
// import AlertModal from '../components/AlertModal';
import { Waypoint } from 'react-waypoint';

function VideoPlayer(props) {
  const { Moralis, isLoading } = useMoralis();
  const [allPost, setAllPost] = useState([]);
  const { data } = useMoralisQuery("User");
  const currentUserId = String(data.map((data) => data.id));
  const [updated, setUpdate] = useState(false);
  // const [openDeleteModal, setDeleteModal] = useState(false);
  // const [doDelete, setDeletePost] = useState(false);

  const { isFetching, ...StatusPosts } = useMoralisQuery(
    "Posts",
    query =>
      query.descending("createdAt"),
      [10],
    {
      live: true
    }
  )

  //TODO: fix Waypoint for autoplay
  // const [shouldPlay, updatePlayState] = useState(false);
  const listInnerRef = useRef(null);
  const videoRef = useRef(null);

  // const [scrollState, setScrollState] = useState();
  // const [videoRefState, setVideoRefState] = useState();

  // const handleEnterViewport = function (e) {
  //   const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
  //   if (e.waypointTop === scrollTop) {
  //     updatePlayState(true);
  //   } else {
  //     updatePlayState(false);
  //   }
  // }

  const handleExitViewport = function (e) {
    updatePlayState(false);
  }

  // const vidHeight = [667, 1334, 2001]

  const getAllPosts = async () => {
    const posts = await Moralis.Cloud.run("getAllPosts");
    const allPosts = posts.map((result) => {
      return _.compact(result)
    })
    setAllPost(_.orderBy(allPosts, [(obj) => new Date(obj[0].data.createdAt)], ['desc']));
  }

  const likeStatus = async (post) => {
    if (!_.includes(post.attributes.likedBy, currentUserId)) {
      post.increment('likes');
      post.addUnique('likedBy', currentUserId);
      await post.save();
      setUpdate(!updated);
    } else {
      post.decrement('likes');
      post.remove('likedBy', currentUserId);
      await post.save();
      setUpdate(!updated);
    }
  };

  const goToProfile = (userId) => {
    props.history.push(`/profile/${userId}`)
  }

  //TODO: Implement Delete Post in the Future
  // const openDelete = (post) => {
  //   setDeleteModal(!openDeleteModal);
  //   if (doDelete) {
  //     deletePost(post);
  //   }
  // }


  //TODO: Implement Delete Post in the Future
  // const deletePost = async (post) => {
  //   post.destroy(post);
  //   await post.save();
  //   setUpdate(!updated); 
  // }
  
  useEffect(() => {
    getAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StatusPosts.data, updated]);

  const onScroll = () => {
    const { scrollTop } = listInnerRef.current;
    // console.log('videoRef====>', videoRef.current.offsetParent.scrollTop)
    // console.log('scrollTop', scrollTop)

    if (scrollTop === videoRef.current.offsetParent.scrollTop) {
      updatePlayState(true);
    } else {
      updatePlayState(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'scroll',
        scrollSnapType: 'y'
      }}
      onScroll={() => onScroll()} ref={listInnerRef}
    >
      {allPost.map((data) =>
        isLoading || isFetching ? <CircularProgress /> :
          // <Waypoint
          //   // onEnter={(e) => handleEnterViewport(e)}
          //   // topOffset="80%"
          //   // onLeave={(e) => handleExitViewport(e)}
          // >
          <div
            key={data[0].data.id}
            style={{
              width: '100%',
              height: '100vh',
              position: 'relative',
              scrollSnapAlign: 'start'
            }}
            ref={videoRef}
          >
            {/* <AlertModal
              action={() => setDeletePost}
              open={openDeleteModal}
              openModalAction={() => setDeleteModal}
            /> */}
            <div>
              <div
                style={{
                  marginTop: '20px',
                  marginLeft: '20px',
                  paddingRight: '50px',
                  position: 'absolute'
                }}>
                <img src={Logo} style={{ width: '30%' }} alt="logo" />
                <p
                  style={{
                    color: '#fff',
                    marginTop: '10px',
                    fontWeight: 'bold',
                    marginBottom: '0px',
                    fontSize: '14px'
                  }}>
                  @{data[0].user}
                </p>
              </div>
              <ReactPlayer
                key={data[0].data.id}
                url={data[0].data.attributes.assetUrl}
                loop={true}
                playing={false}
                controls={true}
                width='100%'
                height='100vh'
                style={{ backgroundColor: '#000', objectFit: 'fill' }}
              />
              <div
                style={{
                  position: 'absolute',
                  width:'360px',
                  height: '60px',
                  marginTop: '-200px',
                  left: '20px'
                }}
              >
                <p
                  style={{
                    color: '#fff',
                    marginTop: '10px',
                    fontWeight: 'bold',
                    marginBottom: '0px',
                  }}>
                  @{data[0].user}
                </p>
                <p
                  style={{
                    color: '#fff',
                    marginTop: '5px',
                  }}>
                  {data[0].data.attributes.description}
                </p>
              </div>
              <div style={{
                height: '350px',
                width: '60px',
                position: 'absolute',
                marginTop: '-450px',
                right: 0
              }}>
                <div
                  onClick={() => goToProfile(data[0].data.attributes.createdById)}
                  style={{
                    width: '50px',
                    height: '24px',
                    marginTop: '10px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  {data[0].profilePicture ?
                    <img
                      alt="DP"
                      src={data[0].profilePicture}
                      style={{
                        objectFit: 'cover',
                        height: '48px',
                        width: '48px',
                        position: 'absolute',
                        borderRadius: '100px'
                      }}
                    />
                    :
                    <div
                      style={{
                        backgroundColor: '#efefef',
                        height: '48px',
                        width: '48px',
                        borderRadius: '50px',
                        position: 'absolute'
                      }}
                    >
                      <PersonIcon style={{ color: '#3e3d3d', marginTop: '13px', marginLeft: '13px' }} />
                    </div>
                  }
            
                  <button
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#fff',
                      position: 'relative',
                      marginLeft: '13px',
                      marginTop: '36px',
                      borderRadius: '24px',
                      padding: '0px',
                      border: '0px'
                    }}>
                    <AddCircleIcon
                      style={{
                        position: 'relative',
                        color: 'red',
                        fontSize: '24px'
                      }} />
                  </button>
                </div>
            
                <div
                  style={{
                    width: '50px',
                    height: '24px',
                    marginTop: '45px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  <button
                    onClick={() => likeStatus(data[0].data)}
                    style={{
                      backgroundColor: 'transparent',
                      marginLeft: '5px',
                      padding: '0px',
                      border: '0px'
                    }}>
                    <FavoriteIcon
                      style={{
                        color: _.includes(data[0].data.attributes.likedBy, currentUserId) ? 'red ' : '#fff',
                        fontSize: '40px'
                      }} />
                  </button>
                  <p
                    style={{
                      margin: '0px',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                    {data[0].data.attributes.likes > 0 ? data[0].data.attributes.likes : 0}
                  </p>
                </div>

                <div
                  style={{
                    width: '40px',
                    height: '24px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingTop: '20px',
                    marginTop: '30px'
                  }}>
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      padding: '0px',
                      border: '0px'
                    }}>
                    <ChatIcon
                      style={{
                        color: '#fff',
                        fontSize: '40px'
                      }} />
                  </button>
                  <p
                    style={{
                      margin: '0px',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>0</p>
                </div>

                {/* {data[0].data.attributes.createdById === currentUserId &&
              <div
                style={{
                  width: '40px',
                  height: '24px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  paddingTop: '20px',
                  marginTop: '30px'
                }}>
                <button
                  onClick={() => openDelete(data[0].data)}
                  style={{
                    backgroundColor: 'transparent',
                    padding: '0px',
                    border: '0px'
                  }}>
                  <DeleteIcon style={{fontSize: '40px', color: '#fff'}}/>
                </button>
              </div>
            } */}
            
              </div>
            </div>
          </div>
          // </Waypoint>
      )}
    </div>
  )
}

export default VideoPlayer;
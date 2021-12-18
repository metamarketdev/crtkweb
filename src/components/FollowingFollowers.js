/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useContext, useEffect } from "react";
//import _ from 'lodash';
import { Tab, Tabs } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ArrowBack } from "@material-ui/icons";
import { useMoralis } from "react-moralis";
import { AppCtx } from "./../App";

const FollowingFollowers = ({ isFollowersOpen, setIsFollowersOpen, userId, setUpdate, updated, callBack }) => {
  const { Moralis } = useMoralis();
  const { currentUser } = useContext(AppCtx);
  const [current, setCurrentUser] = useState();
  const [value, setValue] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    getFollowersFollowing();
  }, [userId, updated]);

  useEffect(() => {
    setValue(isFollowersOpen.tabIndex);
  }, [isFollowersOpen]);

  const getFollowersFollowing = async () => {
    try {
      const params = { userId };
      const user = await Moralis.Cloud.run("getUser", params);
      const followers = await Moralis.Cloud.run("getAllFollowers", params);
      const following = await Moralis.Cloud.run("getAllFollowing", params);
      setCurrentUser(user[0]?.attributes.username);
      setFollowers(followers);
      setFollowings(following);
    } catch (error) {
      console.log(error);
    }
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleChange = () => {
    setValue(value !== 0 ? 0 : 1);
  };

  return (
    <section
      className={`following-followers${isFollowersOpen.status ? " open" : ""}`}
    >
      <div className="follow-header">
        <ArrowBack
          onClick={() => setIsFollowersOpen({ tabIndex: 0, status: false })}
        />
        <span>{current}</span>
        {/* <PersonAdd /> */}
      </div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            variant="fullWidth"
            indicatorColor="primary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Following" {...a11yProps(0)} />
            <Tab label="Followers" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value}
          index={0} data={followings}
          setIsFollowersOpen={setIsFollowersOpen}
          callBack={callBack}
          currentUser={currentUser}
          setUpdate={setUpdate}
          updated={updated}
          userId={userId}
        />
        <TabPanel
          value={value}
          index={1}
          data={followers}
          setIsFollowersOpen={setIsFollowersOpen}
          callBack={callBack}
          currentUser={currentUser}
          setUpdate={setUpdate}
          updated={updated}
          userId={userId} />
      </Box>
    </section>
  );
};

const TabPanel = (props) => {
  //const { Moralis } = useMoralis();

  const {
    data,
    value,
    index,
    following,
    userId,
    setUpdate,
    updated,
    currentUser,
    callBack,
    setIsFollowersOpen,
    ...other
  } = props;
  //const currentUserId = String(currentUser.map((data) => data.id))

  const goToProfile = (id) => {
    callBack.history.push(`/profile/${id}`)
    setUpdate(!updated)
    setIsFollowersOpen({ tabIndex: 0, status: false })
  }

  // const checkIfFollowing = async (id) => {
  //   const params = { userId: id };
  //   const result = await Moralis.Cloud.run("checkUserFollowers", params);
  //   const followerList = result[0].attributes.followedBy;
  //   // console.log('currentUserId===>', _.includes(followerList, currentUserId))
  //   return _.includes(followerList, currentUserId) ? true : false; 
  // }

  useEffect(() => {
  }, [updated, data])

  // const followUser = async (id) => {
  //   const params = { userId: id };
  //   const result = await Moralis.Cloud.run("checkUserFollowers", params);
  //   const newFollower = new Moralis.Object("Followers");
  //   if (result.length === 0) {
  //     newFollower.set("userId", id);
  //     newFollower.addUnique("followedBy", currentUserId);
  //     await newFollower.save();
  //     setUpdate(!updated);
  //   } else if (!_.includes(result[0].attributes.followedBy, currentUserId)) {
  //     result[0].addUnique("followedBy", currentUserId);
  //     await result[0].save();
  //     setUpdate(!updated);
  //   } else if (_.includes(result[0].attributes.followedBy, currentUserId)) {
  //     result[0].remove("followedBy", currentUserId);
  //     await result[0].save();
  //     setUpdate(!updated);
  //   }
  // };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <section>
          {data.map((d) => {
            return (
              <div className="user-row" key={d.id} onClick={() => goToProfile(d.id)}>
                <div className="dp-wrapper">
                  <img src={d.attributes.profilePicture} alt="" />
                </div>
                <div className="user-name">{d.attributes.username}</div>
                {/* {currentUserId !== d.id &&
                  <button
                    className={`follow-btn${checkIfFollowing(d.id) ? " following" : ""}`}
                    onClick={() => followUser(d.id)}
                >
                    {checkIfFollowing(d.id) ? "Unfollow" : "Follow"}
                  </button>
                } */}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default FollowingFollowers;

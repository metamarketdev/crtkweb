/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchNavigation from '../components/SearchNavigation';
import { useMoralis } from "react-moralis";

function Search(props) {
  const [searchText, setSearchText] = useState();
  const [famousUsers, setFamousUsers] = useState();

  const { Moralis } = useMoralis();

  const goToSearchResult = (userId) => {
    props.history.push(`/profile/${userId}`)
  }

  const getMostFollowedUsers = async () => {
    const result = await Moralis.Cloud.run("getUserWithMostFollowers");
    setFamousUsers(_.orderBy(result, ['followers'],['desc']))
  }

  useEffect(() => {
    getMostFollowedUsers();
  },[])
  return (
    <div style={{maxWidth: "100%"}}>
      <SearchNavigation setSearchText={setSearchText} searchText={searchText} {...props} />
      <div style={{ paddingTop: '50px'}}>
        <p style={{
          marginLeft: '20px',
          marginBottom: '10px',
          color: '#000',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>Look who's famous!</p>

        <div style={{paddingBottom: '60px', overflow: 'hidden'}}>
          {famousUsers && famousUsers.map((data) =>
            <div
              key={data.id}
              onClick={() => goToSearchResult(data.userId)}
              style={{
                width: '100%',
                height: '65px',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'flex-start',
                alignContent: 'stretch',
                alignItems: 'center',
                marginLeft: '20px',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignContent: 'stretch',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    height: '50px',
                    width: '50px',
                    borderRadius: '50px',
                    marginTop: '9px',
                    marginRight: '10px'
                  }}>
                  {data.profilePicture &&
                    <img
                      alt="DP"
                      src={data.profilePicture}
                      style={{
                        objectFit: 'cover',
                        height: '50px',
                        width: '50px',
                        borderRadius: '50px'
                      }} />
                  }
                </div>
                <div>
                  <p
                    style={{
                      margin: '0px',
                      color: '#000',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >{data.username}</p>
                  <p style={{ margin: '0px', fontSize: '12px', color: '#757575' }}>@{data.username}, {data.followers} {data.followers > 1 ? 'Followers' : 'Follower'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search;
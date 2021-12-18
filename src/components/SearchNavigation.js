/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
  useMoralis,
  //useMoralisQuery
} from "react-moralis";
// import { Redirect } from "react-router-dom";
// import PersonIcon from '@material-ui/icons/Person';
// import CancelIcon from '@material-ui/icons/Cancel';
// import { Button } from '@material-ui/core';

function SearchNavigation(props) {
  const { Moralis } = useMoralis();
  const [onFocus, setFocus] = useState(false);
  console.log(onFocus)
  const [searchResult, setSearchResult] = useState();

  const searchAll = async () => {
    const params =  { searchText: props.searchText };
    const result = await Moralis.Cloud.run("searchAll", params);
    setSearchResult(result);
  }

  const goToSearchResult = (userId) => {
    props.history.push(`/profile/${userId}`)
  }

  useEffect(() => {
    searchAll()
  }, [props.searchText])

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '55px',
          borderBottom: '0.5px solid #a9a7a7',
          position: 'fixed',
          backgroundColor: '#fff',
          maxWidth: '100%',
        }}>
        <div style={{marginLeft: '20px', width: '100%'}}>
          <SearchIcon
            style={{
              color: '#a9a7a7',
              position: 'absolute',
              top: '17px',
              marginLeft: '5px'
            }}
          />
          <input placeholder="Discover users"
            onChange={(e) => props.setSearchText(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
              height: '35px',
              width: '90%',
              marginTop:'10px',
              backgroundColor: '#f3f3f3',
              border: 'none',
              outline: 'none',
              paddingLeft: '30px',
              color: '#757575',
            }}
          />
          {/* <button
            style={{
              position: 'absolute',
              marginRight: '30px',
              top: '17px',
              height: '0px',
              padding: '0px',
              border: '0px'
            }}
          >
            <CancelIcon
              style={{
                color: '#a9a7a7',
                padding: '0px',
                fontSize: '22px'
              }}
            />
          </button> */}
        </div>
      </div>

      {searchResult && searchResult.length > 0 &&
        <div
          style={{
            marginTop: '56px',
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 9999
          }}>
          {searchResult && searchResult.map((res) => 
            <div
              onClick={() => goToSearchResult(res.id)}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'flex-start',
                alignContent: 'stretch',
                alignItems: 'center',
                marginLeft: '20px',
              }}>
                <div
                  style={{
                    width: '80%'
                  }}
                >
                  <p
                    style={{
                      margin: '0px',
                      color: '#000'
                    }}
                  >{res.attributes.username}</p>
                </div>
                <div
                  style={{
                  backgroundColor: '#fff',
                  height: '30px',
                  width: '30px',
                  borderRadius: '30px',
                  marginTop: '9px'
                }}>
                  {res.attributes.profilePicture &&
                    <img
                      alt="DP"
                      src={res.attributes.profilePicture}
                      style={{
                        objectFit: 'cover',
                        height: '30px',
                        width: '30px',
                        borderRadius: '30px'
                      }} />
                  }
                </div>
              </div>
          )}
        </div>
      }
    </div>
  )
}

export default SearchNavigation;
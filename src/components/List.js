import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useMoralisQuery } from "react-moralis";
import Coin from '../../src/kowcoin.png';

function List() {
  const [mediaData, setMediaData] = useState([])
  const { ...userData } = useMoralisQuery("User");
  const currentUserId = String(userData.data.map((data) => data.id));
  const { data } = useMoralisQuery(
    "Posts",
    query =>
      query.descending("createdAt"),
      [10],
    {
      live: true
    }
  )

  useEffect(() => {
    const isOwnPost = data.map(data => {
      if (data.attributes.createdById === currentUserId) {
        return data
      } else {
        return null
      }
    })
    setMediaData(_.orderBy(_.compact(isOwnPost), [(obj) => new Date(obj.attributes.createdAt)], ['desc']))
  }, [data, currentUserId]);

  const DateConverter = (date) => {
    return date?.toISOString("MM-DD-YYYY").split("T")[0];
  };

  return (
    <div style={{paddingBottom: '100px'}}>
      {mediaData.map((post) => 
        <div
          key={post.id}
          style={{
            width: '95%',
            marginTop: '10px',
            border: '1px solid #ced0da',
            borderRadius: '10px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
          <div
            style={{
              margin: '12px'
            }}
          >
            <p
              style={{
                margin: '0px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
              {post.attributes.description}
            </p>
            <p
              style={{
                margin: '0px',
                fontSize: '14px'
              }}>
              You received {post.attributes.earning} Kowcoin
            </p>
            
            <div style={{display: 'inline-flex', marginTop: '10px'}}>
              <img
                alt="Kowcoin"
                src={Coin}
                style={{
                  width: '25px',
                  height: '25px',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
              <p
                style={{
                  margin: '0px',
                  fontWeight: 'bold',
                  fontSize: '22px',
                  color: 'green'
                }}>
                +{post.attributes.earning}
              </p>
            </div>

            <p
              style={{
                marginTop: '5px',
                fontSize: '12px'
            }}>
              {DateConverter(post.attributes.createdAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default List;
import React from 'react';
//import _ from 'lodash';
import { useMoralisQuery } from "react-moralis";
import ReactPlayer from 'react-player/lazy';
// import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';

function HastagThumbnails(props) {
  const { ...mediaData } = useMoralisQuery(
    "Posts",
    query =>
      query.descending("createdAt"),
      [10],
    {
      live: true
    }
  )


  return (
    <div
      style={{
        marginTop: '20px'
      }}
    >
      <div style={{display: 'inline-flex'}}>
        <div>
          <p style={{margin: '0px'}}>#JohnMayer</p>
          <p
            style={{
              margin: '0px',
              fontSize: '12px',
              color: '#757575'
            }}>
            Trending hashtag
          </p>
        </div>
      </div>

      <div style={{
        overflow: 'auto',
        whiteSpace: 'nowrap',
        marginTop: '10px'
      }}>
        {mediaData.data.map((data) =>
          <div style={{ marginRight: '3px', display: 'inline-block' }} key={data.id}>
            {/* <div style={{ position: 'absolute', marginTop: '100px', display: 'inline-flex' }}>
              <PlayArrowOutlinedIcon style={{ color: '#fff', fontSize: '30px' }} />
              <p style={{marginTop: '7px', color: '#fff', fontWeight: 'bold'}}>30M</p>
            </div> */}
            <ReactPlayer
              url={data.attributes.assetUrl}
              height='150px'
              width='100px'
              style={{
                backgroundColor: 'black',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default HastagThumbnails;
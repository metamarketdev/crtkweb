/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import { useMoralisQuery } from "react-moralis";
import List from '../components/List';
import Coin from '../../src/kowcoin.png';

function Balance() {
  //For Data Management
  const [mediaData, setMediaData] = useState([])
  const { isFetching, ...userData } = useMoralisQuery("User");
  // const [tokenPrice, getTokenPrice] = useState();
  // const userName = String(userData.data.map((data) => data.attributes.username));
  const currentUserId = String(userData.data.map((data) => data.id));
  //const { Moralis } = useMoralis();
  const { data } = useMoralisQuery(
    "Posts",
    query =>
      query.descending("createdAt"),
      [10],
    {
      live: true
    }
  )

  // const getKowcoinPrice = async () => {
  //   const options = {
  //     address: "0xd971489056113baa19c4a92d2d3fa0f0df01caa4",
  //     chain: "matic",
  //     exchange: "quickswap"
  //   };
  //   const price = await Moralis.Web3API.token.getTokenPrice(options);
  //   getTokenPrice(price.usdPrice.toFixed(2));
  // }

  // useEffect(() => {
  //   getKowcoinPrice()
  // }, [])

  useEffect(() => {
    const isOwnPost = data.map(data => {
      if (data.attributes.createdById === currentUserId) {
        return data.attributes.earning
      } else {
        return null
      }
    })
    setMediaData(_.orderBy(_.compact(isOwnPost)))
  }, [data, currentUserId]);

  return (
    <div
      style={{
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      <div style={{
        display:'grid',
        width: '100%',
        height: '44px',
        borderBottom: '1px solid #d0d1d8'
      }}>
        <p
          style={{
            margin: '12px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
          Balance
        </p>
      </div>

      <div style={{backgroundColor: '#14101b'}}>
        <div style={{display: 'inline-flex', width: '100%', paddingTop: '30px', paddingBottom: '30px'}}>
          <div style={{padding: '10px', width: '50%'}}>
            <img
              alt="Kowcoin"
              src={Coin}
              style={{
                width: '50px',
                height: '50px',
                margin: '0 auto',
                display: 'block'
              }} />
            <p
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#f05842'
              }}>
              Kowcoin: {_.sum(mediaData).toFixed(2)}
            </p>
            <p
              style={{
                textAlign: 'center',
                margin: '0px',
                color: '#fff'
              }}>
              Auto Staked Earnings
            </p>
            <p
              style={{
                textAlign: 'center',
                margin: '0px',
                color: '#fff'
              }}>
              (7 Days Locked)
            </p>
          </div>
          <div
            style={{
              padding: '10px',
              width: '50%'
            }}>
            <img
              alt="Kowcoin"
              src={Coin}
              style={{
                width: '50px',
                height: '50px',
                margin: '0 auto',
                display: 'block'
              }} />
            <p
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                color: '#f05842'
              }}>
              Kowcoin: {_.sum(mediaData).toFixed(2)}
            </p>
            <p
              style={{
                textAlign: 'center',
                color: '#fff',
                margin: '0px'
              }}>
              Withdrawable Earnings
            </p>
            <p
              style={{
                textAlign: 'center',
                margin: '0px',
                color: '#fff'
              }}>
              (0 Days Locked)
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            width: '100%',
            paddingBottom: '30px'
          }}
        >
          <div
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              style={{
                color: '#fff',
                border: '1px solid #fff',
                width: '80%',
                padding: '10px'
              }}
              disabled
            >
                Stake
            </Button>
          </div>
          <div
            style={{
              width: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              style={{
                color: '#fff',
                border: '1px solid #fff',
                width: '80%',
                padding: '10px'
              }}
              disabled
            >
                Withdraw
            </Button>
          </div>
        </div>
      </div>

      {isFetching ? null :
        <div style={{
          width: '100%',
          height: '44px',
          borderTop: '1px solid #d0d1d8',
          borderBottom: '1px solid #d0d1d8'
        }}>
          <Button
            style={{
              width: '50%',
              height: '44px',
              color: '#f05842',
              fontWeight: 'bold'
            }}
          >
            History
          </Button>
          <Button
            style={{
              width: '50%',
              height: '44px',
              fontWeight: 'bold'
            }}
            disabled
          >
            Withdrawals
          </Button>
        </div>
      }

      <List/>
    </div>
  )
}

export default Balance;
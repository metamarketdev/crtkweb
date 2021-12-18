/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
//import _ from 'lodash';
import { Button } from '@material-ui/core';
import { useMoralis, useMoralisQuery } from "react-moralis";
//import List from '../components/List';
import Coin from '../../src/coin.png';

function MarketPlace() {
  //For Data Management
  const { Moralis } = useMoralis();
  const [balanceData, setbalanceData] = useState([])
  const { isFetching, ...userData } = useMoralisQuery("User");
  const [tokenPrice, getTokenPrice] = useState();
  const currentUserEthAddress = String(userData.data.map((res) => res.attributes.ethAddress));
  const kowcoinWei = balanceData.map((data) => data.attributes.balance)

  console.log('kowcoinWei--->', kowcoinWei)

  const tokenValue = (value, decimals) => (decimals ? value / Math.pow(10, decimals) : value);

  const kowcoin = tokenValue(Number(kowcoinWei), 18)
  

  const getUserBalance = async () => {
    const params = {userEthAddress: currentUserEthAddress}
    const balance = await Moralis.Cloud.run("getKowcoinBalance", params);
    setbalanceData(balance);
  }

  const subscribe = async (amount) => {
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token(`${amount}`, "18"), 
      receiver: "0xc1Ba89B7a42E812D8A73c703E4EAE6eb682D354a",
      contract_address: "0xc090ddb8e961fbf73fd4de65c10a25844e69d6f9"}
    const result = await Moralis.transfer(options)
    console.log(result)
  }

  const getKowcoinPrice = async () => {
    const options = {
      address: "0xd971489056113baa19c4a92d2d3fa0f0df01caa4",
      chain: "matic",
      exchange: "quickswap"
    };
    const price = await Moralis.Web3API.token.getTokenPrice(options);
    getTokenPrice(price.usdPrice.toFixed(2));
  }

  const goToQuickSwap = () => {
    window.location.href = 'https://quickswap.exchange/#/swap?inputCurrency=0xc090ddb8e961fbf73fd4de65c10a25844e69d6f9'
  }

  useEffect(() => {
    getKowcoinPrice()
  },[])

  useEffect(() => {
    getUserBalance();
  }, [currentUserEthAddress])

  return (
    <div
      style={{
        backgroundColor: '#14101b',
        //height: '100vh',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      <div style={{
        display:'grid',
        width: '100%',
        height: '44px',
        borderBottom: '1px solid #d0d1d8',
        // backgroundColor: '#14101b',
      }}>
        <p
          style={{
            margin: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff'
          }}>
          Marketplace
        </p>
      </div>

      <div
        style={{
          width: '142px',
          margin: '0 auto',
          paddingTop: '20px'
        }}
      >
        <img
          alt="Kowcoin"
          src={Coin}
          style={{
            width: '50px',
            height: '50px',
            margin: '0 auto',
            display: 'block'
          }}
        />
        <p
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#f05842'
          }}
        >Kowcoin: {Math.round(kowcoin)}</p>
        
        <p style={{ color: '#fff', textAlign: 'center' }}>100,000 Kowcoin = $ {tokenPrice}</p>

        <Button
          onClick={goToQuickSwap}
          style={{
            backgroundColor: '#f05842',
            height: '35px',
            color: '#fff',
            width: '142px'
          }}
        >
          Buy Kowcoin
        </Button>
      </div>

      <div style={{ backgroundColor: '#14101b', width: '100%' }}>
        <div style={{marginTop: '30px'}}>
          <p style={{ textAlign: 'center', margin: '0px', color: '#fff', fontSize: '14px' }}>Choose from these packages to start earning!</p>
          <p style={{textAlign: 'center', margin: '0px', color:'#fff', fontSize: '9px'}}>Note: You will earn every time you upload, like, comment and share videos.</p>
        </div>

        <div style={{width: '90%', margin: '0 auto', paddingTop: '20px'}}>
          <div
            style={{
              width: '100%',
              // height: '100px',
              backgroundColor: 'transparent',
              margin: '0 auto',
              borderRadius: '10px',
              border: '1px solid #1578fb',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                marginLeft: '15px',
                padding: '5px'
              }}
            >
              <p
                style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '5px'
              }}>
                Basic
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                Video uploads: 5x / day.
                Comments: 5x / day. <br></br>
                Liking videos: 5x / day. <br></br>
                Sharing videos: 5x / day. <br></br>
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                (One time payment)
              </p>
            </div>
            
            <div
              style={{
                marginRight: '20px',
                marginTop: '15px'
              }}
            >
              <Button
                onClick={() => subscribe(100000)}
                style={{
                  backgroundColor: '#1578fb',
                  border: '1px solid #1578fb',
                  height: '60px',
                  color: '#fff'
                }}>
                100,000 Kowcoin
              </Button>
            </div>
          </div>
        </div>

        <div style={{width: '90%', margin: '0 auto', paddingTop: '20px'}}>
          <div
            style={{
              width: '100%',
              // height: '100px',
              backgroundColor: 'transparent',
              margin: '0 auto',
              borderRadius: '10px',
              border: '1px solid #151cfbab',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                marginLeft: '15px',
                padding: '5px'
              }}
            >
              <p
                style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '5px'
              }}>
                Advanced
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                Video uploads: 5x per day.
                Comments: 10x / day. <br></br>
                Liking videos: 15x / day <br></br>
                Sharing videos: 20x / day. <br></br>
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                (One time payment)
              </p>
            </div>
            
            <div
              style={{
                marginRight: '20px',
                marginTop: '15px'
              }}
            >
              <Button
                onClick={() => subscribe(200000)}
                style={{
                  backgroundColor: '#151cfbab',
                  height: '60px',
                  color: '#fff',
                  // right: '5px'
                }}>
                200,000 Kowcoin
              </Button>
            </div>
          </div>
        </div>

        <div style={{width: '90%', margin: '0 auto', paddingTop: '20px', marginBottom: '100px'}}>
          <div
            style={{
              width: '100%',
              // height: '100px',
              backgroundColor: 'transparent',
              margin: '0 auto',
              borderRadius: '10px',
              border: '1px solid #8500ff',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                marginLeft: '15px',
                padding: '5px'
              }}
            >
              <p
                style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '5px'
              }}>
                Premium
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                Video uploads: 5x / day. 
                Comments: 10x / day. <br></br>
                Liking videos: 40x / day. <br></br>
                Sharing videos: 25x / day. <br></br>
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#fff',
                  margin: '5px'
                }}
              >
                (One time payment)
              </p>
            </div>
            
            <div
              style={{
                marginRight: '20px',
                marginTop: '15px'
              }}
            >
              <Button
                onClick={() => subscribe(300000)}
                style={{
                  backgroundColor: '#8500ff',
                  height: '60px',
                  color: '#fff',
                  // right: '5px'
                }}>
                300,000 Kowcoin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketPlace;
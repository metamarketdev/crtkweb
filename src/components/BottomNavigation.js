import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { useMoralis, useMoralisQuery } from "react-moralis";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import PersonIcon from "@material-ui/icons/Person";
import ControlPointIcon from "@material-ui/icons/ControlPoint";

function BottomNavigation(props) {
  const { data } = useMoralisQuery(
    "User",
    (query) => query.descending("createdAt"),
    [10],
    {
      live: true,
    }
  );

  const { isAuthenticated } = useMoralis();

  const currentTier = String(data.map((data) => data.attributes.currentTier));
  const userId = String(data.map((data) => data.id));

  return (
    <nav className="navigation" id="navigation">
      <div
        style={{
          backgroundColor: "black",
          borderBottom: "1px solid black",
          zIndex: 1004,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "49px",
          }}
        >
          <Button
            style={{
              height: "35px",
              width: "20%",
            }}
          >
            <Link to="/">
              <HomeIcon
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </Link>
          </Button>
          <Button
            style={{
              height: "35px",
              width: "20%",
            }}
          >
            <Link to={isAuthenticated ? "/search" : "login"}>
              <SearchIcon
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </Link>
          </Button>
          <Button
            onClick={() => currentTier !== "none" && isAuthenticated && props.openUploadModal()}
            style={{
              height: "35px",
              width: "20%",
            }}
          >
            <Link to={
              !isAuthenticated ? '/login'
              : currentTier !== "none" ? "/"
              : "/marketplace"
            }>
              <ControlPointIcon
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </Link>
          </Button>
          <Button
            style={{
              height: "35px",
              width: "20%",
            }}
          >
            <Link to={ isAuthenticated ? "/balance" : "/login" }>
              <AccountBalanceWalletIcon
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </Link>
          </Button>
          <Button
            style={{
              height: "35px",
              width: "20%",
            }}
          >
            <Link to={ isAuthenticated ? `/profile/${userId}` : "/login" }>
              <PersonIcon
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default BottomNavigation;

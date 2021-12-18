import React, { useContext } from "react";
import app_logo from "../kokkow-logo.png";
import { AppCtx } from "./../App";

export const Logo = ({ isDrawer = false }) => {
  const { setIsRandomVideos } = useContext(AppCtx);

  const handleActivePage = (e, tab) => {
    e.target.classList.add("active");
    setIsRandomVideos(tab === "random");

    tab === "random"
      ? e.target.previousSibling.previousSibling.classList.remove("active")
      : e.target.nextSibling.nextSibling.classList.remove("active");
  };

  return (
    <div className="logo-wrapper">
      <img src={app_logo} alt="logo" />

      {!isDrawer && (
        <section className="following-for-you" style={{margin: '0 auto'}}>
          <span onClick={(e) => handleActivePage(e, "following")}>
            Following
          </span>
          <div></div>
          <span
            className="active"
            onClick={(e) => handleActivePage(e, "random")}
          >
            Random
          </span>
        </section>
      )}
    </div>
  );
};
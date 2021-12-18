import React from "react";
import app_logo from "../../kokkow-logo.png";
import SearchIcon from "@material-ui/icons/Search";

const Header = () => {
  return (
    <section className="header">
      <div className="header-wrapper">
        <article className="header-logo">
          <img src={app_logo} alt="" />
        </article>

        <article className="header-search">
          <div className="search-wrapper">
            <input type="text" placeholder="Search accounts and videos" />
            <div className="loading" />
            <button className="search-btn">
              <SearchIcon />
            </button>
          </div>
        </article>

        <div className="header-profile"></div>
      </div>
    </section>
  );
};

export default Header;

import React, { useState, createContext } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useMoralis, useMoralisQuery } from "react-moralis";
import UploadModal from "./components/UploadModal";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Balance from "./pages/Balance";
import MarketPlace from "./pages/MarketPlace";
import Search from "./pages/Search";
import Users from "./pages/Users";
// import AdSense from 'react-adsense';
// import Header from "./components/WebView/Header";
// import Menu from "./components/WebView/Menu";

export const AppCtx = createContext({
  isCommentsOpen: { data: null, status: false },
  setIsCommentsOpen: () => {},
  currentUser: "",
  viewedVideos: [],
  setViewedVideos: () => {},
  isRandomVideos: false,
  setIsRandomVideos: () => {},
});

function App() {
  const { isAuthenticated } = useMoralis();
  const { data: currentUser } = useMoralisQuery("User");
  const [open, setOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState({
    data: null,
    status: false,
  });
  const [viewedVideos, setViewedVideos] = useState([]);
  const [isRandomVideos, setIsRandomVideos] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

//   const renderAdsense = () => {
//     return (
//       <AdSense.Google
//         client='pub-9494389547773936'
//         slot='6269294314'
//         style={{
//           display: 'block',
//           width: '100%',
//           position: 'fixed',
//           bottom: 50,
//           //zIndex: 9999
//         }}
//         format='auto'
//         responsive='true'
//         layoutKey='-gw-1+2a-9x+5c'
//       />
//     )
//   }
  // if (isAuthenticated) {
  //   window.location.href('/')
  // }

  document.addEventListener("contextmenu", (event) => event.preventDefault());

  return (
    <AppCtx.Provider
      value={{
        isCommentsOpen,
        setIsCommentsOpen,
        currentUser,
        viewedVideos,
        setViewedVideos,
        setIsRandomVideos,
        isRandomVideos,
      }}
    >
      <section className="app">
        {/*renderAdsense() */}
        {/* <Header /> */}
        <div className="wrapper">
          {/* <Menu /> */}
          <article className="main" style={{ width: "100vw" }}>
            <Router>
              <UploadModal handleClose={handleClose} handleOpen={open} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <Home
                      {...props}
                      currentUser={currentUser}
                      isRandomVideos={isRandomVideos}
                      isAuthenticated={isAuthenticated}
                    />
                  )}
                />
                <Route
                  exact
                  path="/login"
                  render={(props) => <Login {...props} />}
                />
                <Route
                  exact
                  path="/profile/:userId"
                  render={(props) => <Profile {...props} />}
                />
                <Route
                  exact
                  path="/balance"
                  render={(props) => <Balance {...props} />}
                />
                <Route
                  exact
                  path="/marketplace"
                  render={(props) => <MarketPlace {...props} />}
                />
                <Route
                  exact
                  path="/search"
                  render={(props) => <Search {...props} />}
                />
                <Route
                  exact
                  path="/following/:userId"
                  render={(props) => <Users {...props} />}
                />
                <Route
                  exact
                  path="/followers/:userId"
                  render={(props) => <Users {...props} />}
                />
              </Switch>
              <BottomNavigation
                openUploadModal={handleOpen}
                isAuthenticated={isAuthenticated}
              />
            </Router>
          </article>
        </div>
      </section>
    </AppCtx.Provider>
  );
}

export default App;

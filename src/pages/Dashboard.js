import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
import loadingImage from "../images/preloader.gif";
import { GithubContext } from "../context/context";
import { useContext } from "react";
const Dashboard = () => {
  const { loading } = useContext(GithubContext);
  if (loading)
    return (
      <main>
        <Navbar />
        <Search />
        <img className='loading-img' src={loadingImage} alt='loading spinner' />
      </main>
    );
  return (
    <main>
      <Navbar />
      <Search />
      <Info />
      <User />
      <Repos />
    </main>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

export const GithubContext = React.createContext();

export const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState({ show: false, msg: "" });

  const checkRequests = async () => {
    try {
      const { data } = await axios(rootUrl + "/rate_limit");
      const {
        rate: { remaining },
      } = data;
      if (remaining === 0) {
        toggleError(true, "Забагато");
      }
      setRequests(remaining);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async (user) => {
    setLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`).catch((e) =>
      console.log(e)
    );

    if (response) {
      const { login } = response.data;
      setGithubUser(response.data);
      axios(`${rootUrl}/users/${login}/repos?per_page=100`)
        .then((response) => setRepos(response.data))
        .catch((e) => console.log(e));
      axios(`${rootUrl}/users/${login}/followers?per_page=100`)
        .then((response) => setFollowers(response.data))
        .catch((e) => console.log(e));
    } else {
      toggleError(true, `there's no user with username "${user}"  `);
    }
    checkRequests();
    setLoading(false);
  };
  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };
  useEffect(() => {
    checkRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        fetchUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

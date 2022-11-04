import React from "react";
import { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useContext(GithubContext);
  const chartData = repos.reduce((chart, repo) => {
    const { language, stargazers_count } = repo;
    if (!language) return chart;
    if (!chart[language]) {
      chart[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      chart[language] = {
        ...chart[language],
        value: chart[language].value + 1,
        stars: chart[language].stars + stargazers_count,
      };
    }
    return chart;
  }, {});

  let { repoForks, repoStars } = repos.reduce(
    (chart, repo) => {
      const { forks, stargazers_count: stars, name } = repo;
      chart.repoForks[forks] = { label: name, value: forks };
      chart.repoStars[stars] = { label: name, value: stars };
      return chart;
    },
    {
      repoForks: {},
      repoStars: {},
    }
  );

  repoForks = Object.values(repoForks)
    .slice(-5)
    .sort((a, b) => b.value - a.value);

  repoStars = Object.values(repoStars)
    .slice(-5)
    .sort((a, b) => b.value - a.value);

  const languages = Object.values(chartData)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const stars = Object.values(chartData)
    .sort((a, b) => b.stars - a.stars)
    .map((item) => ({ ...item, value: item.stars }));
  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={languages} />
        <Column3D data={repoStars} />
        <Doughnut2D data={stars} />
        <Bar3D data={repoForks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }import { GithubContext } from './../context/context';

`;

export default Repos;

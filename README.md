# Tech Layoffs Dashboard
A live dashboard tracking tech industry layoffs, built with React.
Live site: https://tech-layoffs.netlify.app/

## What it does

- Fetches current layoff data on load using Claude AI with web search
- Shows stats, trends, and a breakdown by company and sector
- Includes a Perspective tab with grounding reminders and tools for anyone currently job searching

## Stack

- React
- Recharts for data visualization
- Anthropic Claude API (with web search) for live data fetching

## Data sources
layoffs.fyi · trueup.io · skillsyncer.com · Crunchbase · TechCrunch
Data is fetched live at page load via Claude AI web search. Seed data is used as a fallback if the fetch fails.

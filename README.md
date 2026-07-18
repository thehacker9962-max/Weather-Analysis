# Weather Analysis & CSV Reporting Dashboard

## Internship Project Overview

This project was developed as part of my internship to turn raw weather data into clear, useful, and interactive reports. It demonstrates the complete data-analysis workflow: understanding a dataset, analysing it with Python, and presenting the results through browser-based dashboards.

The project also includes a reusable CSV Report Studio. It allows a user to upload their own CSV file, build visuals, review insights, and download a PowerPoint report without sending data to a server.

## Project Objectives

- Analyse historical weather data to identify patterns in temperature, humidity, wind speed, visibility, and weather conditions.
- Build explainable derived features that turn raw readings into operational indicators.
- Present the findings in an accessible interactive dashboard.
- Build a reusable tool that can create reports from any CSV dataset.
- Practice data cleaning, exploratory data analysis, visual communication, and web deployment skills.

## Features

### Weather Dashboard

- Interactive weather charts and date filters.
- Key performance indicators for average temperature, humidity, and the most common weather condition.
- Visual comparisons for temperature, dew point, humidity, wind speed, visibility, and weather categories.
- Engineered-condition indicators: temperature–dew-point spread, wind chill, comfort band, visibility band, weather family, season/hour, and a transparent 0–5 severity score.

### CSV Report Studio

- Upload a CSV file from the browser.
- Automatically preview rows, columns, and numeric values.
- Choose the category column, numeric column, aggregation, and chart type.
- Generate KPIs and plain-language data insights.
- Download the current report as a PowerPoint (`.pptx`) file.
- Keeps uploaded data in the browser; no backend upload is required.

## Technologies Used

- **Python / Pandas** for data preparation and exploratory analysis.
- **Jupyter Notebook** for documenting the analysis workflow.
- **HTML, CSS, and JavaScript** for the dashboard interfaces.
- **Chart.js** for interactive charts.
- **PptxGenJS** for PowerPoint report generation.
- **Render** configuration for static-site deployment.

## Project Structure

```text
.
├── Weather_analysis.ipynb       # Data analysis notebook
├── Weather_data.csv.csv         # Source weather dataset
├── weather_data.json            # Dashboard-ready data
├── weather_dashboard.html       # Interactive weather dashboard
├── csv_report_studio.html       # CSV upload and reporting tool
├── index.html                   # Dashboard landing page
└── render.yaml                  # Static deployment configuration
```

## How to Run

1. Clone or download this repository.
2. Run `python scripts/build_weather_data.py` to regenerate the dashboard dataset from the source CSV.
3. Open `index.html` in a modern web browser.
4. Choose **Weather Dashboard** to explore the prepared weather dataset.
5. Choose **CSV Report Studio** to upload another CSV file and create a visual report.

For the most reliable experience, serve the folder with a local static server instead of opening files directly. The dashboard uses browser libraries loaded from CDNs, so an internet connection is needed for charting and PowerPoint export.

## Internship Learning Outcomes

Through this project, I strengthened my ability to:

- Clean, explore, and interpret structured datasets.
- Convert analytical findings into understandable KPIs and charts.
- Build responsive front-end interfaces for data-driven applications.
- Design a workflow from raw data through analysis to reporting.
- Create downloadable, presentation-ready outputs for stakeholders.

## Future Improvements

- Add date-range and multi-column filters to the CSV Report Studio.
- Support Excel (`.xlsx`) files in addition to CSV.
- Add more report slides and automated trend analysis.
- Allow users to save dashboard configurations.

## Deployment

The project is deployable as a static site on Render using the included `render.yaml`.

1. Push the repository to GitHub.
2. In Render, select **New → Blueprint** and connect the repository.
3. Render reads `render.yaml`, publishes the repository root, and creates preview deployments for pull requests.

The GitHub Actions workflow validates the engineered dataset on every push and pull request. Since the dashboard is static, no API keys, server process, or database are required.

### Feature engineering notes

`scripts/build_weather_data.py` is the source of truth for derived fields. It parses timestamp into hour/month/season; groups raw weather descriptions into weather families; derives comfort and visibility bands, temperature–dew-point spread, and in-range wind chill; and scores operational severity from weather family plus visibility. The severity score is an explainable descriptive signal, not a predictive weather-risk model.

---

Created as an internship data analytics and web-dashboard project.

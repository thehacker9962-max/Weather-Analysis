# FinVision Analytics

**Internship Project** · **Author: Dinesh Kumar**

FinVision Analytics is a React and TypeScript business intelligence dashboard for uploading CSV data, calculating financial and operational metrics, detecting anomalies, generating forecasts, and producing executive-ready reports.

## Project objectives

- Build a practical CSV analytics workflow for business users.
- Convert raw tabular data into KPIs, charts, forecasts, and risk indicators.
- Provide an AI-assisted executive report and analyst Q&A experience through a server-side OpenRouter integration.
- Export analysis for presentation and documentation purposes.

## Features

- CSV upload and schema-aware parsing
- Executive summary with KPI cards and recommendations
- Interactive financial dashboard
- ML-style forecasting and anomaly detection
- Risk matrix and scenario simulation
- Data table for inspecting uploaded records
- AI-generated executive reports and follow-up Q&A
- DOCX and PDF report export

## Technology stack

- React 19, TypeScript, Vite, Tailwind CSS
- Express server with Node.js
- Recharts, PapaParse, XLSX, jsPDF, and DOCX
- OpenRouter API for optional server-side AI analysis

## Running locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

For a production build:

```bash
npm run lint
npm run build
npm start
```

## Environment variables

Create a `.env` file only when server-side AI features are required:

```env
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=your_preferred_model
```

The API key is read by the server and is not exposed to the browser. The dashboard’s local calculations and sample datasets work without an API key.

## Data and analysis pipeline

1. A user selects a sample dataset or uploads a CSV.
2. The parser normalizes columns and converts usable values into typed records.
3. The analytics engine calculates summaries, KPIs, forecasts, anomalies, and risk indicators.
4. The dashboard presents the processed dataset through report, dashboard, ML, risk, scenario, and table views.
5. The optional AI service receives a limited dataset summary and returns an executive report.
6. The user reviews, asks follow-up questions, and exports the final report.

See [docs/PIPELINE.md](docs/PIPELINE.md) for the detailed workflow, deployment notes, and internship deliverables.

## Deploy on Render

1. Push this repository to GitHub.
2. In Render, choose **New > Blueprint** and select the repository.
3. Render will read `render.yaml` and create the web service.
4. Add `OPENROUTER_API_KEY` in the service environment settings.
5. Deploy and open the generated Render URL.

The service uses `npm ci && npm run build` to build the Vite client and server bundle, then starts with `npm start`. Verify the deployment at `/api/health`.

## Project structure

```text
src/
  components/       Dashboard and report UI components
  data/             Built-in sample datasets
  utils/            CSV parsing and analytics logic
  App.tsx           Application state and workflow orchestration
server.ts           Express API and Vite production server
docs/PIPELINE.md    Pipeline and project documentation
```

## Internship deliverables

- Working analytics dashboard with reusable components
- Data ingestion and transformation workflow
- Forecasting, anomaly, and risk analysis modules
- AI-assisted reporting API
- Exportable executive report
- Build, validation, and deployment documentation

## Author

Developed by **Dinesh Kumar** as an internship project.

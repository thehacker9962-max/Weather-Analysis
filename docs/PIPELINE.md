# FinVision Analytics: Pipeline Documentation

## 1. End-to-end workflow

```text
CSV or sample data
        |
        v
Parser and type inference
        |
        v
Processed dataset and column summaries
        |
        +--> KPI calculations
        +--> Forecast generation
        +--> Anomaly detection
        +--> Risk scoring
        +--> Scenario simulation
        |
        v
Dashboard and executive report
        |
        +--> Optional server-side AI report
        +--> Analyst Q&A
        +--> PDF/DOCX export
```

## 2. Data ingestion pipeline

`FileUploadModal` accepts a CSV file and passes parsed rows to `processRawDataset` in `src/utils/mlEngine.ts`. `src/utils/csvParser.ts` handles CSV parsing and basic value conversion. Sample datasets use the same processing path, which keeps uploaded and demo data behavior consistent.

The processed dataset contains:

- Dataset name and description
- Row and column counts
- Normalized records
- Column summaries and detected numeric fields
- Calculated metrics
- Forecast values
- Anomaly records
- Risk and scenario inputs

## 3. Analytics pipeline

The client-side engine calculates deterministic metrics locally so the dashboard remains useful without external services. It derives KPIs, descriptive statistics, trend values, forecasts, anomaly indicators, and risk scores. The dashboard components then consume the processed dataset rather than re-parsing the original file.

## 4. AI pipeline

AI requests are sent to the Express server at `/api/ai-analyze` and `/api/ai-chat`. The browser sends dataset metadata, a small sample of records, calculated metrics, and risk summaries. The server calls OpenRouter using `OPENROUTER_API_KEY`, validates the response, and returns the report to the client.

Only summarized data and a small sample should be sent to the AI provider. Do not upload confidential or personally identifiable information without authorization.

## 5. Export pipeline

The report view provides the finalized report model to `ExportReportModal`. The export layer creates PDF and DOCX documents containing the executive summary, KPIs, risk observations, and recommendations.

## 6. Validation and release pipeline

Run the following checks before delivery:

```bash
npm run lint
npm run build
```

The build produces the Vite client bundle and bundles `server.ts` into `dist/server.cjs`. In production, Express serves the generated `dist` directory. The health endpoint is available at `/api/health`.

## 7. Deployment checklist

1. Install dependencies with `npm ci`.
2. Configure `OPENROUTER_API_KEY` securely in the hosting provider.
3. Set `NODE_ENV=production`.
4. Run `npm run build`.
5. Start the service with `npm start`.
6. Verify `/api/health`, CSV upload, report generation, and export flows.

## 8. Internship learning outcomes

This project demonstrates component-based frontend development, typed data processing, API integration, basic predictive analytics, error handling, report generation, environment-based configuration, and production build practices.

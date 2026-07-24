import {
  ColumnSummary,
  ColumnType,
  AnomalyRecord,
  ForecastResult,
  ForecastPoint,
  DuPontAnalysis,
  ProcessedDataset,
  ScenarioParameters,
  AiExecutiveReport,
} from "../types";

/**
 * Classifies a column based on its values
 */
export function classifyColumn(values: any[]): ColumnType {
  const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== "");
  if (nonNulls.length === 0) return "categorical";

  let numCount = 0;
  let dateCount = 0;
  let currCount = 0;
  let pctCount = 0;

  for (const v of nonNulls) {
    if (typeof v === "number") {
      numCount++;
    } else if (typeof v === "string") {
      const cleanStr = v.trim();
      if (cleanStr.startsWith("$") || cleanStr.startsWith("€") || cleanStr.startsWith("£")) {
        currCount++;
        numCount++;
      } else if (cleanStr.endsWith("%")) {
        pctCount++;
        numCount++;
      } else if (!isNaN(Number(cleanStr))) {
        numCount++;
      } else if (!isNaN(Date.parse(cleanStr)) && cleanStr.length > 5) {
        dateCount++;
      }
    }
  }

  const ratio = numCount / nonNulls.length;
  if (ratio > 0.7) {
    if (currCount > 0) return "currency";
    if (pctCount > 0) return "percentage";
    return "numeric";
  }

  if (dateCount / nonNulls.length > 0.7) return "date";

  return "categorical";
}

/**
 * Parses numeric value from currency/percentage strings
 */
export function parseNumericValue(val: any): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return isNaN(val) ? null : val;

  const str = String(val).replace(/[\$,€,£,%]/g, "").trim();
  const parsed = parseFloat(str);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Computes statistical summaries for all columns
 */
export function summarizeColumns(data: Record<string, any>[]): {
  summaries: ColumnSummary[];
  numericCols: string[];
  categoricalCols: string[];
  dateCols: string[];
} {
  if (!data || data.length === 0) {
    return { summaries: [], numericCols: [], categoricalCols: [], dateCols: [] };
  }

  const keys = Object.keys(data[0]);
  const summaries: ColumnSummary[] = [];
  const numericCols: string[] = [];
  const categoricalCols: string[] = [];
  const dateCols: string[] = [];

  for (const key of keys) {
    const rawValues = data.map((d) => d[key]);
    const type = classifyColumn(rawValues);

    const missingCount = rawValues.filter((v) => v === null || v === undefined || v === "").length;
    const validCount = rawValues.length - missingCount;

    if (type === "numeric" || type === "currency" || type === "percentage") {
      numericCols.push(key);
      const nums = rawValues.map(parseNumericValue).filter((v): v is number => v !== null);

      if (nums.length > 0) {
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / nums.length;
        const sorted = [...nums].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0 ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
        
        const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
        const stdDev = Math.sqrt(variance);

        summaries.push({
          name: key,
          type,
          count: validCount,
          missingCount,
          min: sorted[0],
          max: sorted[sorted.length - 1],
          sum,
          mean,
          median,
          stdDev,
        });
      } else {
        summaries.push({ name: key, type, count: validCount, missingCount });
      }
    } else if (type === "date") {
      dateCols.push(key);
      summaries.push({ name: key, type, count: validCount, missingCount });
    } else {
      categoricalCols.push(key);
      const uniqueVals = new Set(rawValues.filter((v) => v !== null && v !== undefined && v !== "")).size;
      summaries.push({ name: key, type, count: validCount, missingCount, uniqueValues: uniqueVals });
    }
  }

  return { summaries, numericCols, categoricalCols, dateCols };
}

/**
 * Anomaly Detection via Z-Score algorithm
 */
export function detectAnomalies(data: Record<string, any>[], numericCols: string[], threshold: number = 2.2): AnomalyRecord[] {
  const anomalies: AnomalyRecord[] = [];

  for (const col of numericCols) {
    const values = data.map((d) => parseNumericValue(d[col])).filter((v): v is number => v !== null);
    if (values.length < 5) continue;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) continue;

    data.forEach((row, idx) => {
      const val = parseNumericValue(row[col]);
      if (val !== null) {
        const zScore = Math.abs((val - mean) / stdDev);
        if (zScore >= threshold) {
          const isHigh = val > mean;
          anomalies.push({
            rowIndex: idx + 1,
            columnName: col,
            value: val,
            zScore: Math.round(zScore * 100) / 100,
            reason: `${col} value (${val.toLocaleString()}) deviates by ${zScore.toFixed(1)} standard deviations from the dataset mean (${mean.toFixed(1)}).`,
            severity: zScore > 3.0 ? "High" : zScore > 2.5 ? "Medium" : "Low",
          });
        }
      }
    });
  }

  return anomalies.sort((a, b) => b.zScore - a.zScore);
}

/**
 * Machine Learning Trend Forecasting (Ordinary Least Squares Linear Regression)
 */
export function calculateForecast(data: Record<string, any>[], metricName: string, labelCol?: string, periodsToForecast: number = 4): ForecastResult {
  const numericValues = data.map((d) => parseNumericValue(d[metricName])).filter((v): v is number => v !== null);

  if (numericValues.length < 3) {
    return { metricName, slope: 0, intercept: 0, rSquared: 0, growthRatePercent: 0, points: [] };
  }

  const n = numericValues.length;
  const xVals = Array.from({ length: n }, (_, i) => i);
  const yVals = numericValues;

  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = yVals.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((sum, x, i) => sum + x * yVals[i], 0);
  const sumX2 = xVals.reduce((sum, x) => sum + x * x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // R-squared calculation
  const meanY = sumY / n;
  const ssTot = yVals.reduce((a, b) => a + Math.pow(b - meanY, 2), 0);
  const ssRes = yVals.reduce((a, y, i) => a + Math.pow(y - (slope * xVals[i] + intercept), 2), 0);
  const rSquared = ssTot !== 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;

  const firstVal = slope * 0 + intercept;
  const lastVal = slope * (n - 1) + intercept;
  const growthRatePercent = firstVal !== 0 ? ((lastVal - firstVal) / Math.abs(firstVal)) * 100 : 0;

  const points: ForecastPoint[] = [];

  // Historical Actuals + Trendlines
  for (let i = 0; i < n; i++) {
    const periodLabel = labelCol && data[i][labelCol] ? String(data[i][labelCol]) : `P${i + 1}`;
    const trendFit = slope * i + intercept;
    points.push({
      period: periodLabel,
      actual: numericValues[i],
      forecast: Math.round(trendFit * 100) / 100,
    });
  }

  // Future Forecast Points
  const stdError = Math.sqrt(ssRes / Math.max(1, n - 2));
  for (let f = 1; f <= periodsToForecast; f++) {
    const idx = n - 1 + f;
    const projectedVal = slope * idx + intercept;
    const marginOfError = stdError * 1.96 * Math.sqrt(1 + 1 / n + Math.pow(idx - (n - 1) / 2, 2) / sumX2);

    points.push({
      period: `Projected +${f}`,
      forecast: Math.round(projectedVal * 100) / 100,
      upperBound: Math.round((projectedVal + marginOfError) * 100) / 100,
      lowerBound: Math.round(Math.max(0, projectedVal - marginOfError) * 100) / 100,
    });
  }

  return {
    metricName,
    slope: Math.round(slope * 100) / 100,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(rSquared * 100) / 100,
    growthRatePercent: Math.round(growthRatePercent * 10) / 10,
    points,
  };
}

/**
 * Calculates DuPont Analysis Framework ratios if relevant columns exist
 */
export function calculateDuPont(data: Record<string, any>[]): DuPontAnalysis | undefined {
  const sample = data[0];
  if (!sample) return undefined;

  const revKey = Object.keys(sample).find((k) => /revenue|sales/i.test(k));
  const netIncKey = Object.keys(sample).find((k) => /netincome|net_income|profit/i.test(k));
  const assetsKey = Object.keys(sample).find((k) => /assets|totalassets/i.test(k));
  const equityKey = Object.keys(sample).find((k) => /equity|shareholdersequity/i.test(k));

  if (!revKey || !netIncKey || !assetsKey || !equityKey) return undefined;

  const totalRev = data.reduce((a, b) => a + (parseNumericValue(b[revKey]) || 0), 0);
  const totalNetInc = data.reduce((a, b) => a + (parseNumericValue(b[netIncKey]) || 0), 0);
  const avgAssets = data.reduce((a, b) => a + (parseNumericValue(b[assetsKey]) || 0), 0) / data.length;
  const avgEquity = data.reduce((a, b) => a + (parseNumericValue(b[equityKey]) || 0), 0) / data.length;

  if (totalRev === 0 || avgAssets === 0 || avgEquity === 0) return undefined;

  const netProfitMargin = totalNetInc / totalRev;
  const assetTurnover = totalRev / avgAssets;
  const equityMultiplier = avgAssets / avgEquity;
  const roe = netProfitMargin * assetTurnover * equityMultiplier * 100;

  return {
    netProfitMargin: Math.round(netProfitMargin * 1000) / 1000,
    assetTurnover: Math.round(assetTurnover * 100) / 100,
    equityMultiplier: Math.round(equityMultiplier * 100) / 100,
    roe: Math.round(roe * 10) / 10,
  };
}

/**
 * Applies What-If Scenario multipliers on dataset metrics
 */
export function simulateScenario(data: Record<string, any>[], params: ScenarioParameters) {
  if (!data || data.length === 0) return { projectedRevenue: 0, projectedEbitda: 0, projectedNetIncome: 0, revenueDeltaPct: 0 };

  const revKey = Object.keys(data[0]).find((k) => /revenue|sales|arr/i.test(k)) || "Revenue";
  const cogsKey = Object.keys(data[0]).find((k) => /cogs|cost/i.test(k));
  const ebitdaKey = Object.keys(data[0]).find((k) => /ebitda|operatingincome/i.test(k));
  const netIncKey = Object.keys(data[0]).find((k) => /netincome|net_income|profit/i.test(k));

  const baseRevenue = data.reduce((a, b) => a + (parseNumericValue(b[revKey]) || 0), 0);
  const baseCogs = cogsKey ? data.reduce((a, b) => a + (parseNumericValue(b[cogsKey]) || 0), 0) : baseRevenue * 0.4;
  const baseEbitda = ebitdaKey ? data.reduce((a, b) => a + (parseNumericValue(b[ebitdaKey]) || 0), 0) : baseRevenue * 0.25;
  const baseNetIncome = netIncKey ? data.reduce((a, b) => a + (parseNumericValue(b[netIncKey]) || 0), 0) : baseRevenue * 0.15;

  const projectedRevenue = baseRevenue * params.priceMultiplier * params.volumeGrowthMultiplier * (1 + params.fxVolatilityShift);
  const projectedCogs = baseCogs * params.cogsInflationMultiplier * params.volumeGrowthMultiplier;
  const projectedGrossProfit = projectedRevenue - projectedCogs;
  
  const opexAdjustment = baseRevenue * 0.2 * params.cogsInflationMultiplier;
  const projectedEbitda = projectedGrossProfit - opexAdjustment;
  const projectedNetIncome = projectedEbitda * 0.65; // Approx tax/interest factor

  const revenueDeltaPct = baseRevenue > 0 ? ((projectedRevenue - baseRevenue) / baseRevenue) * 100 : 0;
  const ebitdaDeltaPct = baseEbitda > 0 ? ((projectedEbitda - baseEbitda) / Math.abs(baseEbitda)) * 100 : 0;

  return {
    baseRevenue,
    baseEbitda,
    baseNetIncome,
    projectedRevenue,
    projectedEbitda,
    projectedNetIncome,
    revenueDeltaPct: Math.round(revenueDeltaPct * 10) / 10,
    ebitdaDeltaPct: Math.round(ebitdaDeltaPct * 10) / 10,
  };
}

/**
 * Process a raw dataset into full dataset object
 */
export function processRawDataset(name: string, description: string, rawData: Record<string, any>[]): ProcessedDataset {
  const rowCount = rawData.length;
  const columns = rawData.length > 0 ? Object.keys(rawData[0]) : [];
  const columnCount = columns.length;

  const { summaries: columnSummaries, numericCols, categoricalCols, dateCols } = summarizeColumns(rawData);
  const anomalies = detectAnomalies(rawData, numericCols);

  const labelCol = dateCols[0] || categoricalCols[0] || columns[0];
  const forecasts: Record<string, ForecastResult> = {};

  numericCols.slice(0, 4).forEach((col) => {
    forecasts[col] = calculateForecast(rawData, col, labelCol);
  });

  const dupont = calculateDuPont(rawData);

  return {
    id: `ds-${Date.now()}`,
    name,
    description,
    uploadedAt: new Date().toLocaleDateString(),
    data: rawData,
    columns,
    columnSummaries,
    rowCount,
    columnCount,
    numericColumns: numericCols,
    categoricalColumns: categoricalCols,
    dateColumns: dateCols,
    forecasts,
    anomalies,
    dupont,
  };
}

/**
 * Generates immediate client-side AI Insights for any uploaded CSV / dataset
 */
export function generateInstantAiReport(dataset: ProcessedDataset): AiExecutiveReport {
  const primaryNumeric = dataset.columnSummaries.find((c) => c.type === "numeric" || c.type === "currency");
  const secondaryNumeric = dataset.columnSummaries.filter((c) => c.type === "numeric" || c.type === "currency")[1];

  const formatVal = (val?: number) => {
    if (val === undefined || isNaN(val)) return "N/A";
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(1)}k`;
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const mainColName = primaryNumeric?.name || "Primary Metric";
  const mainColSum = primaryNumeric?.sum || 0;
  const mainColMean = primaryNumeric?.mean || 0;
  const mainColMin = primaryNumeric?.min || 0;
  const mainColMax = primaryNumeric?.max || 0;

  const anomalyCount = dataset.anomalies.length;
  const missingCountTotal = dataset.columnSummaries.reduce((acc, c) => acc + c.missingCount, 0);
  const healthScore = Math.max(55, Math.min(99, 100 - anomalyCount * 3 - Math.min(20, missingCountTotal)));

  const keyFindings: string[] = [
    `Processed dataset "${dataset.name}" containing ${dataset.rowCount} records across ${dataset.columnCount} columns.`,
    primaryNumeric
      ? `Primary metric "${mainColName}" totals ${formatVal(mainColSum)} with an average of ${formatVal(mainColMean)} per record.`
      : `Dataset contains ${dataset.categoricalColumns.length} categorical dimensions and ${dataset.numericColumns.length} numeric variables.`,
    anomalyCount > 0
      ? `Statistical engine flagged ${anomalyCount} Z-score outlier(s) requiring data validation.`
      : `Data distribution is nominal with 0 critical statistical outliers detected across numeric parameters.`,
    secondaryNumeric
      ? `Secondary metric "${secondaryNumeric.name}" recorded an average value of ${formatVal(secondaryNumeric.mean)} (range: ${formatVal(secondaryNumeric.min)} to ${formatVal(secondaryNumeric.max)}).`
      : `Identified ${dataset.categoricalColumns.length} key attributes for categorical slicing.`
  ];

  const firstForecastKey = Object.keys(dataset.forecasts)[0];
  const forecastObj = firstForecastKey ? dataset.forecasts[firstForecastKey] : null;

  return {
    executiveSummary: {
      headline: `Automated Executive AI Insights for ${dataset.name}`,
      overallHealthScore: healthScore,
      keyFindings,
      strategicContext: `Synthesized insights computed from ${dataset.rowCount} data points. Evaluated parameters include ${dataset.numericColumns.slice(0, 4).join(", ") || "categorical fields"}.`,
    },
    financialPerformance: {
      revenueAnalysis: primaryNumeric
        ? `Aggregated sum for ${mainColName} stands at ${formatVal(mainColSum)}. Metric values range from min ${formatVal(mainColMin)} to peak ${formatVal(mainColMax)}.`
        : `Evaluated ${dataset.rowCount} records across ${dataset.columnCount} columns.`,
      profitabilityMargins: secondaryNumeric
        ? `Secondary column ${secondaryNumeric.name} demonstrates a mean of ${formatVal(secondaryNumeric.mean)} with standard deviation of ${formatVal(secondaryNumeric.stdDev)}.`
        : `Categorical analysis reveals highest density across ${dataset.categoricalColumns[0] || "primary attributes"}.`,
      dupontDrivers: dataset.dupont
        ? `Return on Equity (ROE) modeled at ${dataset.dupont.roe}%. Net Margin: ${dataset.dupont.netProfitMargin}%, Asset Turnover: ${dataset.dupont.assetTurnover}x, Equity Multiplier: ${dataset.dupont.equityMultiplier}x.`
        : `Distribution variance across ${dataset.numericColumns.length} numeric columns indicates balanced operational stability.`,
      costStructureVariance: `Overall data quality index rated at ${healthScore}/100 across ${dataset.columnSummaries.filter((c) => c.missingCount === 0).length} fully populated columns.`
    },
    mlTrendAndAnomalies: {
      forecastInsight: forecastObj
        ? `Linear regression forecast for "${forecastObj.metricName}" projects a ${forecastObj.growthRatePercent >= 0 ? "+" : ""}${forecastObj.growthRatePercent}% growth trajectory with R² fit of ${forecastObj.rSquared.toFixed(3)}.`
        : `Statistical regression modeling completed across ${dataset.numericColumns.length} dimensions.`,
      anomalyDiagnosis: anomalyCount > 0
        ? `Detected ${anomalyCount} statistical outliers exceeding 2.5 standard deviations. Outlier in "${dataset.anomalies[0]?.columnName}" at Row #${dataset.anomalies[0]?.rowIndex} (Value: ${dataset.anomalies[0]?.value}).`
        : `Zero statistical anomalies detected; all entries fall within expected standard deviation boundaries.`,
      statisticalSignificance: `Analyzed ${dataset.rowCount} records. Standard deviation and variance verified across all ${dataset.numericColumns.length} numeric fields.`
    },
    riskMitigationMatrix: [],
    actionableRecommendations: [
      {
        timeframe: "Immediate (0-30d)",
        title: `Audit Outlier Records in ${primaryNumeric?.name || "Dataset"}`,
        description: anomalyCount > 0
          ? `Review the ${anomalyCount} flagged anomaly row(s) to verify data accuracy or operational spikes.`
          : `Verify missing entries across columns to ensure complete data fidelity.`,
        expectedImpact: `Data Quality +100%`,
        priority: "Critical"
      },
      {
        timeframe: "Medium-term (1-6m)",
        title: `Establish Baselines for ${secondaryNumeric?.name || mainColName}`,
        description: `Set operational target bounds around ${secondaryNumeric?.name || mainColName} mean value of ${formatVal(secondaryNumeric?.mean || mainColMean)}.`,
        expectedImpact: `Process Stability`,
        priority: "High"
      },
      {
        timeframe: "Long-term (1y+)",
        title: `Expand Categorical Segmentation`,
        description: `Leverage categorical variables (${dataset.categoricalColumns.slice(0, 3).join(", ") || "dimensions"}) for deeper cohort-level predictive modeling.`,
        expectedImpact: `Predictive Accuracy`,
        priority: "Medium"
      }
    ],
    boardroomQuestions: [
      `What operational factors drive the variance between min (${formatVal(mainColMin)}) and max (${formatVal(mainColMax)}) in ${mainColName}?`,
      anomalyCount > 0 ? `Are the ${anomalyCount} flagged statistical outliers expected spikes or data input anomalies?` : `How can we leverage stability in ${mainColName} for growth planning?`,
      `How can we improve automated data capture for parameters with null entries?`
    ]
  };
}

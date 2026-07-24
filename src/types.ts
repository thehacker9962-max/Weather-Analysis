export type ColumnType = "numeric" | "categorical" | "date" | "currency" | "percentage";

export interface ColumnSummary {
  name: string;
  type: ColumnType;
  count: number;
  missingCount: number;
  uniqueValues?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  sum?: number;
}

export interface AnomalyRecord {
  rowIndex: number;
  columnName: string;
  value: number;
  zScore: number;
  reason: string;
  severity: "High" | "Medium" | "Low";
}

export interface ForecastPoint {
  period: string | number;
  actual?: number;
  forecast?: number;
  upperBound?: number;
  lowerBound?: number;
}

export interface ForecastResult {
  metricName: string;
  slope: number;
  intercept: number;
  rSquared: number;
  growthRatePercent: number;
  points: ForecastPoint[];
}

export interface DuPontAnalysis {
  netProfitMargin: number; // Net Income / Revenue
  assetTurnover: number; // Revenue / Total Assets
  equityMultiplier: number; // Total Assets / Shareholders' Equity
  roe: number; // Return on Equity (%)
}

export interface RiskMatrixItem {
  category: string;
  riskFactor: string;
  likelihood: number; // 1 to 5
  impact: number; // 1 to 5
  rootCause: string;
  mitigationAction: string;
  estimatedRiskCost: string;
}

export interface RecommendationItem {
  timeframe: "Immediate (0-30d)" | "Medium-term (1-6m)" | "Long-term (1y+)" | string;
  title: string;
  description: string;
  expectedImpact: string;
  priority: "Critical" | "High" | "Medium";
}

export interface AiExecutiveReport {
  executiveSummary: {
    headline: string;
    overallHealthScore: number;
    keyFindings: string[];
    strategicContext: string;
  };
  financialPerformance: {
    revenueAnalysis: string;
    profitabilityMargins: string;
    dupontDrivers: string;
    costStructureVariance: string;
  };
  mlTrendAndAnomalies: {
    forecastInsight: string;
    anomalyDiagnosis: string;
    statisticalSignificance: string;
  };
  riskMitigationMatrix: RiskMatrixItem[];
  actionableRecommendations: RecommendationItem[];
  boardroomQuestions: string[];
}

export interface ScenarioParameters {
  priceMultiplier: number; // e.g. 1.05 = +5%
  cogsInflationMultiplier: number; // e.g. 1.03 = +3%
  volumeGrowthMultiplier: number; // e.g. 1.10 = +10%
  fxVolatilityShift: number; // e.g. -0.02 = -2% FX impact
}

export interface ProcessedDataset {
  id: string;
  name: string;
  description: string;
  uploadedAt: string;
  data: Record<string, any>[];
  columns: string[];
  columnSummaries: ColumnSummary[];
  rowCount: number;
  columnCount: number;
  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
  forecasts: Record<string, ForecastResult>;
  anomalies: AnomalyRecord[];
  dupont?: DuPontAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

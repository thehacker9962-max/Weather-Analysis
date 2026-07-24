export interface SampleDatasetDefinition {
  id: string;
  name: string;
  category: "MNC Corporate Financials" | "SaaS & Unit Economics" | "Supply Chain & Operational Risk";
  description: string;
  data: Record<string, any>[];
}

export const SAMPLE_DATASETS: SampleDatasetDefinition[] = [
  {
    id: "global-tech-mnc",
    name: "🏢 Global Tech Corp - Quarterly P&L & Regional Financials",
    category: "MNC Corporate Financials",
    description: "8 quarters of enterprise P&L data across North America, Europe, APAC, and LATAM including COGS, R&D, Capex, and FX Hedging Rates.",
    data: [
      { Quarter: "2024-Q1", Region: "North America", Revenue: 42500000, COGS: 16800000, OpEx: 11200000, R_D: 5400000, EBITDA: 14500000, NetIncome: 9100000, Assets: 180000000, Equity: 110000000, FxRiskPct: 1.2, DefectPPM: 42 },
      { Quarter: "2024-Q1", Region: "Europe", Revenue: 31200000, COGS: 13900000, OpEx: 8900000, R_D: 3200000, EBITDA: 8400000, NetIncome: 5200000, Assets: 130000000, Equity: 78000000, FxRiskPct: 3.4, DefectPPM: 58 },
      { Quarter: "2024-Q1", Region: "APAC", Revenue: 28400000, COGS: 11800000, OpEx: 7100000, R_D: 2900000, EBITDA: 9500000, NetIncome: 6600000, Assets: 115000000, Equity: 70000000, FxRiskPct: 2.8, DefectPPM: 38 },
      { Quarter: "2024-Q1", Region: "LATAM", Revenue: 14200000, COGS: 6900000, OpEx: 4100000, R_D: 1100000, EBITDA: 3200000, NetIncome: 2100000, Assets: 55000000, Equity: 32000000, FxRiskPct: 5.6, DefectPPM: 85 },

      { Quarter: "2024-Q2", Region: "North America", Revenue: 46200000, COGS: 17900000, OpEx: 11800000, R_D: 5800000, EBITDA: 16500000, NetIncome: 10700000, Assets: 188000000, Equity: 114000000, FxRiskPct: 1.1, DefectPPM: 39 },
      { Quarter: "2024-Q2", Region: "Europe", Revenue: 33800000, COGS: 15100000, OpEx: 9400000, R_D: 3500000, EBITDA: 9300000, NetIncome: 5800000, Assets: 135000000, Equity: 80000000, FxRiskPct: 3.9, DefectPPM: 62 },
      { Quarter: "2024-Q2", Region: "APAC", Revenue: 31900000, COGS: 12900000, OpEx: 7800000, R_D: 3100000, EBITDA: 11200000, NetIncome: 7800000, Assets: 122000000, Equity: 74000000, FxRiskPct: 2.5, DefectPPM: 32 },
      { Quarter: "2024-Q2", Region: "LATAM", Revenue: 15800000, COGS: 7800000, OpEx: 4300000, R_D: 1200000, EBITDA: 3700000, NetIncome: 2400000, Assets: 58000000, Equity: 34000000, FxRiskPct: 6.2, DefectPPM: 91 },

      { Quarter: "2024-Q3", Region: "North America", Revenue: 49800000, COGS: 19100000, OpEx: 12400000, R_D: 6100000, EBITDA: 18300000, NetIncome: 12200000, Assets: 195000000, Equity: 120000000, FxRiskPct: 0.9, DefectPPM: 35 },
      { Quarter: "2024-Q3", Region: "Europe", Revenue: 32100000, COGS: 16200000, OpEx: 9900000, R_D: 3600000, EBITDA: 6000000, NetIncome: 3400000, Assets: 138000000, Equity: 81000000, FxRiskPct: 4.8, DefectPPM: 115 }, // Anomaly in Europe Q3
      { Quarter: "2024-Q3", Region: "APAC", Revenue: 35600000, COGS: 14100000, OpEx: 8400000, R_D: 3400000, EBITDA: 13100000, NetIncome: 9100000, Assets: 130000000, Equity: 80000000, FxRiskPct: 2.1, DefectPPM: 29 },
      { Quarter: "2024-Q3", Region: "LATAM", Revenue: 16900000, COGS: 8200000, OpEx: 4600000, R_D: 1300000, EBITDA: 4100000, NetIncome: 2700000, Assets: 61000000, Equity: 36000000, FxRiskPct: 5.9, DefectPPM: 88 },

      { Quarter: "2024-Q4", Region: "North America", Revenue: 54200000, COGS: 20500000, OpEx: 13100000, R_D: 6500000, EBITDA: 20600000, NetIncome: 13900000, Assets: 205000000, Equity: 128000000, FxRiskPct: 1.0, DefectPPM: 31 },
      { Quarter: "2024-Q4", Region: "Europe", Revenue: 36500000, COGS: 16100000, OpEx: 9800000, R_D: 3800000, EBITDA: 10600000, NetIncome: 6900000, Assets: 142000000, Equity: 85000000, FxRiskPct: 3.5, DefectPPM: 52 },
      { Quarter: "2024-Q4", Region: "APAC", Revenue: 39800000, COGS: 15600000, OpEx: 9100000, R_D: 3800000, EBITDA: 15100000, NetIncome: 10800000, Assets: 140000000, Equity: 88000000, FxRiskPct: 1.8, DefectPPM: 26 },
      { Quarter: "2024-Q4", Region: "LATAM", Revenue: 18500000, COGS: 8900000, OpEx: 4900000, R_D: 1400000, EBITDA: 4700000, NetIncome: 3100000, Assets: 65000000, Equity: 39000000, FxRiskPct: 5.2, DefectPPM: 79 },

      { Quarter: "2025-Q1", Region: "North America", Revenue: 58100000, COGS: 21800000, OpEx: 13800000, R_D: 7100000, EBITDA: 22500000, NetIncome: 15200000, Assets: 215000000, Equity: 136000000, FxRiskPct: 0.8, DefectPPM: 28 },
      { Quarter: "2025-Q1", Region: "Europe", Revenue: 38900000, COGS: 17200000, OpEx: 10200000, R_D: 4100000, EBITDA: 11500000, NetIncome: 7500000, Assets: 148000000, Equity: 90000000, FxRiskPct: 3.1, DefectPPM: 48 },
      { Quarter: "2025-Q1", Region: "APAC", Revenue: 43200000, COGS: 16800000, OpEx: 9800000, R_D: 4200000, EBITDA: 16600000, NetIncome: 11900000, Assets: 150000000, Equity: 95000000, FxRiskPct: 1.5, DefectPPM: 22 },
      { Quarter: "2025-Q1", Region: "LATAM", Revenue: 19800000, COGS: 9400000, OpEx: 5200000, R_D: 1500000, EBITDA: 5200000, NetIncome: 3500000, Assets: 70000000, Equity: 42000000, FxRiskPct: 4.8, DefectPPM: 72 },
    ],
  },
  {
    id: "saas-unit-economics",
    name: "🛍️ CloudScale SaaS Inc - ARR, Unit Economics & Churn",
    category: "SaaS & Unit Economics",
    description: "Monthly customer metrics including ARR, Net Revenue Retention (NRR), CAC, LTV, Active Logos, and Churn %.",
    data: [
      { Month: "2025-01", ARR: 12400000, CAC: 4800, LTV: 28500, NRR_Pct: 112, MonthlyChurnPct: 1.8, MarketingSpend: 820000, GrossMarginPct: 78, ActiveLogos: 1420 },
      { Month: "2025-02", ARR: 13100000, CAC: 4650, LTV: 29200, NRR_Pct: 114, MonthlyChurnPct: 1.6, MarketingSpend: 850000, GrossMarginPct: 79, ActiveLogos: 1490 },
      { Month: "2025-03", ARR: 13900000, CAC: 4500, LTV: 30100, NRR_Pct: 115, MonthlyChurnPct: 1.5, MarketingSpend: 890000, GrossMarginPct: 80, ActiveLogos: 1570 },
      { Month: "2025-04", ARR: 14800000, CAC: 4420, LTV: 31200, NRR_Pct: 117, MonthlyChurnPct: 1.4, MarketingSpend: 920000, GrossMarginPct: 81, ActiveLogos: 1660 },
      { Month: "2025-05", ARR: 15600000, CAC: 4350, LTV: 32000, NRR_Pct: 118, MonthlyChurnPct: 1.3, MarketingSpend: 960000, GrossMarginPct: 81, ActiveLogos: 1740 },
      { Month: "2025-06", ARR: 16500000, CAC: 4200, LTV: 33100, NRR_Pct: 120, MonthlyChurnPct: 1.2, MarketingSpend: 1020000, GrossMarginPct: 82, ActiveLogos: 1830 },
      { Month: "2025-07", ARR: 17400000, CAC: 4150, LTV: 34000, NRR_Pct: 121, MonthlyChurnPct: 1.1, MarketingSpend: 1080000, GrossMarginPct: 83, ActiveLogos: 1920 },
      { Month: "2025-08", ARR: 18100000, CAC: 5400, LTV: 31500, NRR_Pct: 108, MonthlyChurnPct: 3.4, MarketingSpend: 1350000, GrossMarginPct: 76, ActiveLogos: 1960 }, // Anomaly month
      { Month: "2025-09", ARR: 19200000, CAC: 4050, LTV: 35200, NRR_Pct: 122, MonthlyChurnPct: 1.1, MarketingSpend: 1120000, GrossMarginPct: 83, ActiveLogos: 2080 },
      { Month: "2025-10", ARR: 20400000, CAC: 3950, LTV: 36500, NRR_Pct: 124, MonthlyChurnPct: 1.0, MarketingSpend: 1180000, GrossMarginPct: 84, ActiveLogos: 2210 },
      { Month: "2025-11", ARR: 21800000, CAC: 3880, LTV: 37800, NRR_Pct: 125, MonthlyChurnPct: 0.9, MarketingSpend: 1240000, GrossMarginPct: 85, ActiveLogos: 2350 },
      { Month: "2025-12", ARR: 23200000, CAC: 3800, LTV: 39000, NRR_Pct: 127, MonthlyChurnPct: 0.8, MarketingSpend: 1310000, GrossMarginPct: 85, ActiveLogos: 2500 },
    ],
  },
  {
    id: "supply-chain-risk",
    name: "🏥 PharmaGlobal - Supply Chain & Operational Risk Matrix",
    category: "Supply Chain & Operational Risk",
    description: "Operational metrics tracking vendor reliability, lead times, inventory turnover, defect rates, and disruption risk scores.",
    data: [
      { VendorID: "VND-101", Location: "Germany", Category: "Active Ingredients", LeadTimeDays: 14, OnTimeDeliveryPct: 98.2, QualityScore: 96, DefectPPM: 12, InventoryTurnover: 12.4, DisruptionIncidents: 0, TariffRatePct: 2.1 },
      { VendorID: "VND-102", Location: "Switzerland", Category: "Biologics", LeadTimeDays: 18, OnTimeDeliveryPct: 97.5, QualityScore: 98, DefectPPM: 8, InventoryTurnover: 10.8, DisruptionIncidents: 0, TariffRatePct: 1.8 },
      { VendorID: "VND-103", Location: "India", Category: "Generic Actives", LeadTimeDays: 32, OnTimeDeliveryPct: 88.4, QualityScore: 89, DefectPPM: 110, InventoryTurnover: 7.2, DisruptionIncidents: 3, TariffRatePct: 6.5 },
      { VendorID: "VND-104", Location: "China", Category: "Packaging & Vials", LeadTimeDays: 45, OnTimeDeliveryPct: 82.1, QualityScore: 84, DefectPPM: 240, InventoryTurnover: 5.1, DisruptionIncidents: 5, TariffRatePct: 12.4 },
      { VendorID: "VND-105", Location: "USA", Category: "Cold Chain Logistics", LeadTimeDays: 5, OnTimeDeliveryPct: 99.1, QualityScore: 99, DefectPPM: 2, InventoryTurnover: 18.2, DisruptionIncidents: 0, TariffRatePct: 0.0 },
      { VendorID: "VND-106", Location: "Japan", Category: "Precision Equipment", LeadTimeDays: 22, OnTimeDeliveryPct: 96.8, QualityScore: 97, DefectPPM: 15, InventoryTurnover: 9.5, DisruptionIncidents: 1, TariffRatePct: 3.2 },
      { VendorID: "VND-107", Location: "Singapore", Category: "Reagents", LeadTimeDays: 12, OnTimeDeliveryPct: 95.4, QualityScore: 94, DefectPPM: 28, InventoryTurnover: 11.1, DisruptionIncidents: 0, TariffRatePct: 1.5 },
      { VendorID: "VND-108", Location: "Vietnam", Category: "Standard Materials", LeadTimeDays: 38, OnTimeDeliveryPct: 84.0, QualityScore: 86, DefectPPM: 185, InventoryTurnover: 6.0, DisruptionIncidents: 4, TariffRatePct: 8.9 },
    ],
  },
];

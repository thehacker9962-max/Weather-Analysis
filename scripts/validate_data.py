"""Lightweight CI check for the generated static dashboard dataset."""
import json
from pathlib import Path

records = json.loads((Path(__file__).resolve().parents[1] / "weather_data.json").read_text(encoding="utf-8"))
required = {"Date/Time", "Temp_C", "weather_family", "comfort_band", "visibility_band", "severity_score"}
assert records, "Dataset is empty"
assert required <= records[0].keys(), f"Missing fields: {required - records[0].keys()}"
assert all(0 <= record["severity_score"] <= 5 for record in records), "Severity must be 0–5"
print(f"Validated {len(records):,} records and engineered features.")

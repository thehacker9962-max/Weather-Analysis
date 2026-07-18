"""Create the dashboard dataset with reproducible weather features.

Run from the repository root: ``python scripts/build_weather_data.py``.
The script deliberately uses only the Python standard library so a static-site
deployment does not depend on a notebook kernel or an untracked local setup.
"""

import csv
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Weather_data.csv.csv"
TARGET = ROOT / "weather_data.json"


def number(value):
    return float(value) if value not in (None, "") else None


def weather_family(label):
    label = (label or "").lower()
    if "thunder" in label:
        return "Thunderstorm"
    if "snow" in label or "ice" in label or "freezing" in label:
        return "Snow / ice"
    if "rain" in label or "drizzle" in label or "shower" in label:
        return "Rain"
    if "fog" in label or "haze" in label or "mist" in label:
        return "Low visibility"
    if "cloud" in label or "overcast" in label:
        return "Cloudy"
    return "Clear"


def visibility_band(visibility):
    if visibility is None:
        return "Unknown"
    if visibility < 1:
        return "Very low (<1 km)"
    if visibility < 5:
        return "Reduced (1–5 km)"
    return "Good (≥5 km)"


def comfort_band(temp):
    if temp is None:
        return "Unknown"
    if temp < 0:
        return "Freezing"
    if temp < 10:
        return "Cool"
    if temp < 24:
        return "Comfortable"
    return "Warm"


def wind_chill(temp, wind):
    """Canadian wind-chill index; undefined outside its documented range."""
    if temp is None or wind is None or temp > 10 or wind <= 4.8:
        return None
    value = 13.12 + .6215 * temp - 11.37 * wind ** .16 + .3965 * temp * wind ** .16
    return round(value, 1)


def severity(family, visibility):
    base = {"Clear": 0, "Cloudy": 1, "Rain": 2, "Snow / ice": 3,
            "Low visibility": 3, "Thunderstorm": 4}.get(family, 0)
    visibility_penalty = 2 if visibility is not None and visibility < 1 else 1 if visibility is not None and visibility < 5 else 0
    return min(5, base + visibility_penalty)


def transform(row):
    parsed = datetime.strptime(row["Date/Time"], "%m/%d/%Y %H:%M")
    temp = number(row["Temp_C"])
    dew = number(row["Dew Point Temp_C"])
    wind = number(row["Wind Speed_km/h"])
    visibility = number(row["Visibility_km"])
    family = weather_family(row.get("Weather"))
    row.update({
        "hour": parsed.hour,
        "month": parsed.strftime("%Y-%m"),
        "season": ["Winter", "Spring", "Summer", "Autumn"][(parsed.month % 12) // 3],
        "temp_dew_spread_c": round(temp - dew, 1) if temp is not None and dew is not None else None,
        "wind_chill_c": wind_chill(temp, wind),
        "comfort_band": comfort_band(temp),
        "visibility_band": visibility_band(visibility),
        "weather_family": family,
        "severity_score": severity(family, visibility),
    })
    return row


with SOURCE.open(encoding="utf-8-sig", newline="") as handle:
    records = [transform(row) for row in csv.DictReader(handle)]

TARGET.write_text(json.dumps(records, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Wrote {len(records):,} engineered records to {TARGET.name}")

"""Illustrative SPI-like standardization from monthly precipitation CSV.
Input CSV must contain a numeric column named precipitation_mm.
For scientific SPI, fit a gamma distribution to a long-term monthly series
and validate against a recognized drought-monitoring methodology.
"""
import argparse
import pandas as pd

parser = argparse.ArgumentParser()
parser.add_argument("csv_path")
args = parser.parse_args()
df = pd.read_csv(args.csv_path)
if "precipitation_mm" not in df:
    raise SystemExit("CSV must include precipitation_mm")
values = pd.to_numeric(df["precipitation_mm"], errors="coerce")
mu, sigma = values.mean(), values.std(ddof=1)
if not sigma or pd.isna(sigma):
    raise SystemExit("Not enough valid precipitation observations")
df["standardized_precipitation_demo"] = (values - mu) / sigma
out = args.csv_path.rsplit(".", 1)[0] + "_processed.csv"
df.to_csv(out, index=False)
print(f"Saved {out}; this z-score is a teaching/demo calculation, not full SPI.")

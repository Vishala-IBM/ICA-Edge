# Refining-Operations-Agent – Sample Data Dictionary
Synthetic data. Refinery codes match the plant codes used in Supply-Planning and Logistics data: R100 Prairie Refinery (AB), R200 Lakehead Refinery (ON), R300 Saint-Laurent Refinery (QC). Product names match Commercial-Marketing product_portfolio.csv.

## refinery_output.csv (500)
Key fields: Refinery, Product, Input, Output. 25 refinery-product lines x 20 months (2025-01 to 2026-08). Units: m3 per month.
Input = crude oil allocated to that product line (pro-rata to output); Output = finished product volume. Output/Input is about 1.02 (volume gain).
Extra: Period, Refinery_Name, Province, Product_Category, Unit.

## yield_analysis.csv (300)
Key fields: Product, Yield_Percent. Last 12 months (2025-09 to 2026-08) x the same 25 lines. Yield_Percent = Output / total crude input of that refinery-month x 100 (derived from refinery_output.csv; sums to about 101-103% per refinery-month because of volume gain).
Extra: Refinery, Period, Product_Category, Target_Yield_Percent, Variance_Pct_Points, Crude_Slate. Seasonal products (asphalt, heating oil, gasoline) deviate from target by design.

## refinery_performance.csv (300)
Key fields: Refinery, Throughput, Efficiency. Daily records, 3 refineries x 100 days (2026-06-30 to 2026-10-07). Throughput = crude processed, m3/day. Efficiency = overall operating efficiency, % (composite of availability, performance and quality; lower after outages).
Extra: Date, Refinery_Name, Capacity_m3d (R100 22,000; R200 14,000; R300 20,000), Utilization_Pct, Energy_Intensity_GJ_per_m3, Unplanned_Outage_Hrs, Event (includes a 12-day FCC outage at R200 in Aug 2026).

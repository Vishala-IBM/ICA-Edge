# ESG-Agent – Sample Data Dictionary
Synthetic data. Reporting boundary = 25 facilities: refineries R100/R200/R300 and the 22 largest upstream facilities by volume from Upstream-Operations production_metrics.csv (FAC-12, FAC-20 and FAC-24, the three smallest, fall outside the boundary). Monthly, 2025-01 to 2026-08 (20 months). Emissions and water scale with facility production volumes, downtime (flaring and blowdowns) and refinery crude input from the earlier agents' data.

## emissions.csv (500)
Key fields: Facility, CO2, Methane. CO2 = tonnes CO2 per month; Methane = tonnes CH4 per month. CO2e_Total = CO2 + 28 x CH4 (AR5 GWP100).
Extra: Period, Facility_Name, Facility_Type, Province, Activity_Volume (boe for upstream, m3 crude for refineries), Activity_Unit, CO2e_Total, GHG_Intensity_kgCO2e_per_unit, Primary_Methane_Source.
Typical intensities: SAGD about 74 kg CO2/boe, gas plants 43, batteries 26; refineries about 250 kg CO2/m3 crude. Methane declines over time as leak-detection and electrification programs progress.

## water_consumption.csv (500)
Key fields: Facility, Water_Used. Water_Used = total process water used, m3 per month = Fresh_Water_Withdrawn_m3 + Saline_Water_m3 + Recycled_Water_m3.
Extra: Period, Facility_Name, Facility_Type, Province, the three components, Recycle_Rate_Pct, Primary_Water_Source, Activity_Volume, Activity_Unit, Fresh_Water_Intensity_m3_per_unit. SAGD facilities recycle about 85-91% of water.

## sustainability_targets.csv (100)
Key fields: KPI, Target_Value, Actual_Value. 100 unique KPIs across Climate, Water, Safety, Environment, Social, Governance and Supply Chain. Actual_Value is the last twelve months (2025-09 to 2026-08).
33 KPIs (Data_Source = emissions.csv or water_consumption.csv) are calculated from the two files above (enterprise, refinery, facility-type and province intensities); baselines and targets for those are set relative to the actual. The rest are synthetic.
Extra: KPI_ID, Category, Unit, Better_When (Lower/Higher), Baseline_Value, Baseline_Year, Target_Year, Progress_Pct (share of baseline-to-target gap closed), Status (Achieved / On track / At risk / Off track, comparing progress with the time elapsed), Framework, Scope, Reporting_Period, Data_Source.

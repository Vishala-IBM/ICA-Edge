# Upstream-Operations-Agent – Sample Data Dictionary
Synthetic data (Western Canada: AB, BC, SK). Not real wells, rigs or facilities.

## wells.csv (300)
Key fields: Well_ID, Field, Production_BPD. Production_BPD = current rate in barrels of oil equivalent per day (boe/d; 6 mcf gas = 1 boe); 0 for non-producing wells.
Extra: Province, Formation, Well_Type, Status (Producing/Shut-in/Suspended/Standing/Drilling-Completing), Spud_Date, Surface_Location (LSD-section-township-range-meridian), Facility (FK to production_metrics.Facility).

## drilling_operations.csv (300)
Key fields: Rig_ID, Location, Cost. Cost = drilling cost per well in CAD (drill only, escalated ~1.2%/yr). One record per well; Rig_ID repeats (48 rigs, 8 contractors).
Extra: Drilling_ID (unique), Well_ID (FK to wells), Field, Rig_Contractor, Spud_Date, Rig_Release_Date, Days_Drilled, Measured_Depth_m, Status. Location equals the well's Surface_Location.

## production_metrics.csv (500)
Key fields: Facility, Volume, Downtime. 25 facilities x 20 months (2025-01 to 2026-08). Volume = monthly production in boe; Downtime = hours lost in the month.
Extra: Period, Facility_Type (Gas Plant / Oil Battery / SAGD CPF), Field, Province, Avg_Daily_boe, Downtime_Cause.
Facility volumes are scaled up from the sampled wells (the 300 wells are a subset of each facility's wells), so they will not sum exactly to wells.csv.

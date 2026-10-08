# Asset-Reliability-Agent – Sample Data Dictionary
Synthetic data. Sites reuse earlier codes: refineries R100/R200/R300, upstream facilities FAC-01..FAC-25 (same as Upstream production_metrics.csv), terminals T100..T800.

## asset_master.csv (500)
Key fields: Asset_ID, Asset_Name, Asset_Type. 210 refinery assets, 200 upstream facility assets (8 per facility), 90 terminal assets. 28 asset types (pumps, compressors, heat exchangers, fired heaters, vessels, valves, tanks, motors, separators, OTSG steam generators, loading racks, etc.).
Extra: Site, Site_Name, Province, Functional_Location (SAP-style), Manufacturer, Install_Date, Criticality (A/B/C), Status (Active/Standby/Mothballed/Decommissioned), Replacement_Value (CAD).

## maintenance_history.csv (1,000)
Key fields: Asset_ID, Work_Order, Cost. Work orders 2024-01-01 to 2026-10-07. Cost = total CAD (= Labour_Cost + Material_Cost; contractor spend included in labour).
Work_Order_Type (SAP PM order-type style): PM01 Preventive 272, PM02 Corrective 500, PM03 Condition-based 103, PM04 Turnaround 42, PM05 Regulatory inspection 83.
Extra: Order_Description, Priority, Start_Date, End_Date, Labour_Hours, Labour_Cost, Material_Cost, Status, Site. Decommissioned/mothballed assets have no work orders.

## failure_analysis.csv (500)
Key fields: Asset_ID, Failure_Mode, Root_Cause. One record per corrective (PM02) work order; Work_Order is a foreign key into maintenance_history. Failure modes and root causes are specific to asset type. 206 distinct assets fail (older, rotating and critical equipment fail more; some are repeat "bad actors").
Extra: Failure_ID, Work_Order, Failure_Date, Severity (Minor/Major/Critical), Downtime_Hrs, Detection_Method, Asset_Type, Site, Criticality.

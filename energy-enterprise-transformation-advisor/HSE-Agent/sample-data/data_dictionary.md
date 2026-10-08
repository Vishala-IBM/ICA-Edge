# HSE-Agent – Sample Data Dictionary
Synthetic data, 2025-01-01 to 2026-10-07. Sites use the same codes as earlier agents: refineries R100/R200/R300, upstream facilities FAC-01..FAC-25, terminals T100..T800, plus pipeline systems PL-01..PL-06, Calgary Head Office (HQ-CAL) and the Edmonton Distribution Centre (DC-EDM).

## incidents.csv (500)
Key fields: Incident_ID, Site, Severity. Severity: Minor / Moderate / Serious / Major (no Catastrophic or fatality events, consistent with the ESG fatalities KPI). Mix by type: process safety events (API RP 754 Tier 1: 19, Tier 2: 66, Tier 3: 25), reportable spills 60 and minor spills 15, injuries (first aid 40, medical treatment 66, restricted work 34, lost time 26), high-potential near misses, vehicle, fire, property damage, security, occupational health and air emission/flaring events. The last-12-month counts of Tier 1 events (11) and reportable spills match the ESG sustainability_targets KPIs.
Extra: Incident_Date, Incident_Type, Category, Description, Site_Name, Site_Type, Province, Potential_Severity, Injury_Classification, API_RP754_Tier, Person_Type, Lost_Days, Substance, Release_Volume_m3, Root_Cause, Asset_ID (foreign key to Asset-Reliability asset_master), Related_Work_Order (corrective work order from maintenance_history; set for equipment-failure events tied to a recorded major or critical failure), Reported_To_Regulator, Corrective_Actions, Status, Days_To_Close.

## safety_observations.csv (500)
Key fields: Observation_ID, Category (19 categories such as PPE, line of fire, LOTO, hot work, permit to work, process safety operating discipline).
Extra: Observation_Date, Site, Site_Name, Observation_Type (Safe behaviour, At-risk behaviour, Unsafe condition, Good catch, Stop-work intervention), Observer_Role, Person_Observed, Activity, Shift, Potential_Severity, Action_Required, Corrective_Action, Action_Status (Open/Closed/Overdue; N/A when no action is needed), Days_To_Close.

## compliance_audits.csv (300)
Key fields: Audit_ID, Location, Findings. Location is a site code; Findings = Critical + Major + Minor findings.
Extra: Audit_Date, Location_Name, Location_Type, Province, Audit_Type (11 types: regulatory inspection, ISO 14001 / 45001, PSM, COR, pipeline integrity, methane LDAR, contractor and others), Standard_Regulation, Auditor, Critical_Findings, Major_Findings, Minor_Findings, Opportunities_For_Improvement, Overall_Result, Compliance_Score_Pct, Action_Due_Date, Action_Closure_Status, Re_Audit_Required, Regulator_Notified.

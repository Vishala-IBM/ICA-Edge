# Data-Analytics-Agent – Sample Data Dictionary
Synthetic data describing the analytics landscape of an integrated Canadian energy company: SAP S/4HANA, IS-Oil, IBP, Ariba, SuccessFactors, BW/4HANA, SAP Datasphere, SAP Analytics Cloud, BusinessObjects WebI and Power BI, plus operational technology sources (PI historians, SCADA, LIMS). Domains match the agent folders. The three files link to each other (see Relationships).

## datasource_inventory.csv (150)
Key fields: Source_System, Owner, Domain. Owner is the owning business or IT team.
Extra: Source_ID (DS-001...), System_Type, Vendor, Interface, Refresh_Frequency, Hosting, Contains_PII, Approx_Size_GB, Ingestion_Method (how the data lands in Datasphere), Criticality, Data_Quality_Score (0-100), Status (Active/Planned/Decommissioning), Go_Live_Year.

## datasphere_objects.csv (300)
Key fields: Model_Name, Domain. Domain also includes "Shared Master Data" for conformed dimensions, hierarchies and lookups.
Layered design: L1_Acquisition (remote tables, replication flows, local tables), L2_Harmonization (SQL views, transformation flows), L3_BusinessLogic (fact and dimension graphical views, hierarchies, data access controls), L4_Consumption (analytic models for SAC and Power BI), plus Orchestration (task chains). Naming prefixes: RT_, RF_, HV_, FV_, DIM_, AM_, TC_, DAC_, HIER_, LT_. One space per domain (SP_xxx).
Extra: Object_ID, Space, Layer, Object_Type, Semantic_Usage, Subject_Area, Source_ID (foreign key to datasource_inventory), Depends_On (upstream model names or source systems, semicolon-separated), Persistence, Exposed_For_Consumption, Row_Count, Created_Date, Last_Deployed, Developer_Team, Status.

## report_catalog.csv (300)
Key fields: Report_Name, Tool, Owner. Built for report-rationalization analysis: 7 tools (SAC, WebI, Power BI, BEx / Analysis for Office, Fiori analytical apps, Crystal Reports, manual Excel). Report_Name plus Tool is unique; about 10% of reports are deliberate duplicates (same report rebuilt in another tool, or copies such as "(Copy)", "v2", "(Legacy)").
Extra: Report_ID, Domain, Subject_Area, Data_Source (a Datasphere model name for modern tools; a BW/4HANA query or similar for legacy tools), Run_Count_12M, Distinct_Users_12M, Last_Run_Date, Frequency, Complexity, Status (Active/Unused/Duplicate), Duplicate_Of, Rationalization_Recommendation (Retain / Migrate / Consolidate / Retire / Review), Target_Platform, Est_Migration_Effort_Days.

## Relationships
datasphere_objects.Source_ID -> datasource_inventory.Source_ID. report_catalog.Data_Source -> datasphere_objects.Model_Name (for reports on SAC, Power BI and Fiori). Subject areas mirror the sample datasets from the other agents (for example Refinery Output, Emissions, Revenue).

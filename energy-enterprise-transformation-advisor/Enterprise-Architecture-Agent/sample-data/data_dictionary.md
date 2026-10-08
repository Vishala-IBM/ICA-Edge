# Enterprise-Architecture-Agent – Sample Data Dictionary
Synthetic data. Applications reuse the systems in Data-Analytics datasource_inventory.csv (111 of the 200 applications; planning spreadsheets are excluded and site-level entries such as tank gauging, field SCADA regions and retail controllers are merged into one application each), plus other business, OT and IT applications.

## application_inventory.csv (200)
Key fields: Application_ID, Application_Name, Vendor.
Extra: Domain, Business_Capability, Hosting, Lifecycle_Status (Plan/Phase-in/Active/Phase-out/End-of-life), TIME_Disposition (Tolerate/Invest/Migrate/Eliminate), Business_Criticality, Technical_Fit_1to5, Functional_Fit_1to5, Primary_Technology and Database_Technology (foreign keys to technology_standards.Technology; blank for SaaS), Business_Owner, Go_Live_Year, Support_End_Date, Annual_Cost_CAD, Active_Users, Data_Classification, Contains_PII, SAP_Product. Applications on Retire/Prohibited technology get lower technical fit and Migrate/Eliminate dispositions.

## integration_inventory.csv (300)
Key fields: Source_System, Target_System, Interface. Source and Target are application names from application_inventory.csv, or "External - ..." parties (see Source_Type / Target_Type). About 100 rows are source-to-SAP Datasphere ingestion interfaces matching the data source inventory; the rest are operational flows (order-to-cash, procure-to-pay, maintenance, trading, OT-to-IT, ESG reporting, single sign-on, monitoring).
Extra: Interface_ID, Data_Object, Protocol, Integration_Pattern (Real-time/Event-driven/Batch), Middleware (SAP Integration Suite, SAP Process Orchestration 7.5 (being retired), MuleSoft, Azure API Management, MFT, direct), Frequency, Messages_per_Day, Criticality, Status, Source_Type, Target_Type, Error_Rate_Pct, Authentication, Last_Review_Year.

## technology_standards.csv (100)
Key fields: Technology, Category, Status. Status: Standard (54), Contained (22), Emerging (4), Retire (13), Prohibited (7). 12 categories: database, operating system, cloud, languages, integration, data and analytics, security, DevOps, collaboration, OT, geospatial and mobile.
Extra: Standard_ID, Vendor, License_Model, Architecture_Domain, Approved_Since_Year, Last_Review_Date, Next_Review_Date, Sunset_Date, Replacement_Technology, Applications_Using (count of applications referencing the technology, computed from application_inventory.csv), Rationale.

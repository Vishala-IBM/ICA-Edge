# Knowledge-Repository-Agent – Sample Data Dictionary

Synthetic data. Reuses earlier agents' names: the 20 domains map to the agent folders (e.g. Upstream-Operations-Agent), `Related_System` and `Source` are application names from Enterprise-Architecture `application_inventory.csv`, and pattern technologies come from `technology_standards.csv` (Standard_ID, status and usage counts carried over). Reference dates run to 2026-10-07.

## document_catalog.csv (500)
Key fields: **Document_ID** (DOC-00001..00500, numbered in creation order), **Title**, **Source** (repository holding the document: SharePoint Online - Knowledge & Policy Library 212x, Confluence 133x, SAP Signavio, SAP Cloud ALM, OpenText Documentum, SAP SuccessFactors Learning, SAP LeanIX, ServiceNow, SAP Help Portal).
462 internal documents (20 domains x 23-24, every subject has 2+ document types) plus 38 external standards and regulations (API, ISO, AER directives, GHG Protocol, IFRS S2, OGMP 2.0, SAP guides and others), classified Public and attributed to the publisher.
Extra: Doc_Type, Domain, Related_Agent, Related_System, Format, Version, Status (Published 369 / Under Review 46 / Draft 30 / Superseded 31 / Archived 24 - includes superseded external editions), Author_Team, Classification (Public / Internal / Confidential / Restricted), Created_Date, Last_Updated, Review_Cycle_Months, Next_Review_Date, Review_Status (Current / Due within 90 days / Overdue / N/A / Not yet reviewed), Page_Count, Language, Views_12M, Tags.
About 22% of documents are overdue for review, which is deliberate so the agent can flag stale content.

## architecture_patterns.csv (200)
Key fields: **Pattern_Name**, **Technology** (80 patterns; each pattern-technology pair is unique; 2-4 technologies per pattern).
Extra: Pattern_ID, Category (Integration, OT & Industrial, Data & Analytics, SAP Application, Cloud & DevOps, Security & Identity, Collaboration & Knowledge, Database, Languages & Frameworks, Operating System, Domain Reference), Intent, Architecture_Domain, Technology_Status and Standard_ID (from technology_standards), Pattern_Status (Recommended / Emerging / Contain / Migrate away / Prohibited, derived from the technology's status), Complexity, SAP_Coverage (Native SAP / Partial / Not provided by SAP), Applicable_Agents, Applications_Using_Technology, Reference_Doc_ID (foreign key to document_catalog), Owner, Last_Reviewed.

## best_practices.csv (300)
Key fields: **Process_Area**, **Practice** (25 areas x 12: the 20 agent domains plus Master Data Management, Turnaround & Shutdown Management, Joint Venture Accounting, Organizational Change Management, Vendor & Contractor Management).
Extra: Practice_ID, Practice_Type (Control / Governance / Technology / Process, keyword-derived), KPI, Source_Standard (API RP 754/580/1173, ISO 55001/14224/27001/31000, IFRS 9/15, COPAS, GHG Protocol, OGMP 2.0, DAMA-DMBOK, TOGAF, PMBOK, APICS SCOR, SAP Activate, internal standard), SAP_Module, SAP_Support (Standard 104 / Partial 137 / **Not provided by SAP** 59), Adoption_Status, Maturity_Level_1to5, Owner_Function, Last_Reviewed, Reference_Doc_ID (foreign key to document_catalog).

## Integrity checks
All Reference_Doc_ID values exist in document_catalog (only Published or Under Review documents); titles, Document_IDs, Pattern_ID and Practice_ID are unique; every Technology exists in technology_standards.

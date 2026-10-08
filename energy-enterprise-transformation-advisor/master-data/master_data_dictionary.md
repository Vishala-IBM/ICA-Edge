# Master Data Dictionary

Synthetic data. Currency is CAD unless stated. Dates are ISO (YYYY-MM-DD).

## customers.csv (200 records)

Primary key: **Customer_ID**.

- **Customer_ID, Customer_Name**: key and legal name as used in Sales-Trading (CUS-001..100) and Demand-Planning sales_forecast (CUS-101..200)
- **Customer_Type, Segment_Name, Segment_ID**: customer class derived from the name; segment name and the Commercial-Marketing Segment_ID for the customer's segment and region
- **Region_ID, Province, City**: home region (matches the region on the customer's orders), province code and city
- **Primary_Supply_Plant_ID**: plant that supplies the customer (the supply point on its orders; default by region otherwise)
- **Owning_Business_Unit_ID**: BU-RTL for retail fuel operators, BU-COM otherwise
- **Payment_Terms, Credit_Limit_CAD, Credit_Rating, Currency**: commercial terms; rating A (lowest risk) to D
- **Customer_Since, Status**: onboarding date; Active, On Hold or Inactive
- **Contract_Count, Order_Count_in_Agent_Data, Forecast_Lines_in_Agent_Data, Source_Dataset**: counts computed from contract_volume, customer_orders and sales_forecast, and the dataset the customer comes from

## suppliers.csv (200 records)

Primary key: **Supplier_ID**.

- **Supplier_ID, Supplier_Name, Category**: from Procurement supplier_master (28 spend categories)
- **Spend_Category_Group, Supplier_Type**: group of categories (for example Upstream Services and Materials) and Goods, Services or Both
- **Country, Province_State, City, Region_ID**: headquarters; Region_ID is blank for non-Canadian suppliers
- **Currency, Payment_Terms**: default invoicing currency and terms
- **Risk_Score, Risk_Tier**: score from supplier_master; tier Low (<30), Medium (30-44), High (45+)
- **Preference_Status**: Strategic (top 20 by contract and PO value), Preferred (next 80), Approved, Conditional (risk score 60 and above)
- **Safety_Prequalified, Indigenous_Owned_Flag, Onboarded_Year, Status**: qualification and ownership flags, onboarding year, Active or On Hold
- **PO_Count, PO_Value_CAD, Contract_Count, Contract_Value_CAD, Source_Dataset**: totals computed from purchase_orders and contracts

## products.csv (100 records)

Primary key: **Product_ID**.

- **Product_ID, Product_Name, Product_Category**: from Commercial-Marketing product_portfolio (12 categories)
- **Product_Group, Product_Type**: product family (Light Distillates, Middle Distillates, NGL and LPG ...) and Finished Product, Feedstock / Co-product, Service or Environmental Product
- **Owning_Business_Unit_ID**: commercial owner (BU-COM, BU-RTL, BU-REF for feedstocks, BU-LCN for low carbon and EV)
- **Primary_Plant_ID, Producing_Plant_IDs, Observed_Supply_Points**: main producing plant, plants that make the product in Supply-Planning and Refining data, and supply points seen on customer orders; blank for services
- **Base_Unit_of_Measure, Density_kg_per_m3**: unit used in the agent data (litres, tonnes, kWh and others) and typical density
- **UN_Number, TDG_Class, Packing_Group**: transportation of dangerous goods classification (indicative, for scenario work, not for regulatory use)
- **SAP_Material_Type, SAP_Product_Hierarchy**: FERT finished, HALB semi-finished, DIEN service; hierarchy code
- **Standard_Margin_Pct, Low_Carbon_Flag, Seasonal_Flag, Status**: margin from product_portfolio, low-carbon and seasonal flags, lifecycle status
- **Order_Lines_in_Agent_Data, Price_Records**: counts from customer_orders and pricing_strategy

## plants.csv (20 records)

Primary key: **Plant_ID**.

- **Plant_ID, Plant_Name, Plant_Type**: codes and names as in Supply-Planning (3 refineries, upgrader, 3 gas plants, lubricants, asphalt, renewable diesel, petrochemicals, NGL fractionation, 8 terminals)
- **Business_Unit_ID, Region_ID, Province, City, Latitude, Longitude**: organization and location
- **Nameplate_Capacity, Capacity_Unit**: refineries use the capacities in the Refining data (R100 22,000, R200 14,000, R300 20,000 m3 per day); other plants are indicative
- **Commissioning_Year, Operating_Status, Ownership_Pct, Operator**: life-cycle and ownership (G300 is 75% owned)
- **SAP_Plant_Code, SAP_Company_Code, API_RP754_Applicable**: SAP mapping and whether API RP 754 process safety reporting applies
- **Warehouse_IDs, Asset_Count, Products_Made_Or_Handled**: computed from warehouses, assets and the production data

## warehouses.csv (15 records)

Primary key: **Warehouse_ID**.

- **Warehouse_ID, Warehouse_Name, Warehouse_Type**: WH01-WH12 as in Warehouse-Agent; WH13-WH15 are new regional sites
- **Plant_ID, Business_Unit_ID, Region_ID, Province, City**: owning plant (SAP plant for the storage location), owner BU-SCM, location
- **Floor_Area_m2, Pallet_Positions, Hazmat_Rated, Operating_Model**: size, dangerous-goods rating, owned or third-party logistics
- **SAP_Plant_Code, SAP_Storage_Location, Status**: SAP mapping and status
- **Referenced_In_Agent_Data, Stock_Lines, Movement_Records, New_In_Master**: counts from inventory_stock and warehouse_movements; WH13-WH15 have no activity yet

## assets.csv (500 records)

Primary key: **Asset_ID**.

- **Asset_ID, Asset_Name, Asset_Type, Asset_Class**: from Asset-Reliability asset_master (25 asset types) with a class (Rotating, Static, Fired and Heat Transfer, Valves and Safety Devices, Instrumentation and Metering, Terminal Equipment)
- **Plant_ID, Facility_ID**: exactly one is filled: Plant_ID for refinery and terminal assets, Facility_ID for upstream FAC- assets
- **Business_Unit_ID, Region_ID, Province**: derived from the plant or facility; Province is the value in asset_master (differs from plants.csv for T200, T400, T800)
- **Functional_Location, Manufacturer, Install_Date, Criticality, Status, Replacement_Value_CAD**: as in asset_master
- **SAP_Maintenance_Plant**: plant code for plant-based assets
- **Work_Order_Count, Maintenance_Cost_CAD, Failure_Count, Incident_Count, Legacy_Site_Code**: computed from maintenance_history, failure_analysis and HSE incidents; the original Site code

## regions.csv (10 records)

Primary key: **Region_ID**.

- **Region_ID, Region_Name, Region_Type, Province_Codes, Country**: 8 sales regions and 2 export markets; Atlantic Canada = NS, NB, NL, PE; Northern Canada = NT, YT, NU
- **Pricing_Zone, Logistics_Zone, Climate_Zone**: zone groupings used by Commercial-Marketing (3 zones), Logistics (4 zones) and for seasonal analysis
- **Primary_Regulator, Industrial_Carbon_Pricing**: indicative regulator and industrial carbon pricing regime (verify before regulatory use)
- **Legacy_Names_Used, Status**: where the name appears in agent data; status

## business_units.csv (10 records)

Primary key: **Business_Unit_ID**.

- **Business_Unit_ID, Business_Unit_Name, Segment, Description, Executive_Owner_Role**: 10 Level-1 units; owners are roles, not people
- **Finance_BU_Codes, Finance_BU_Names, Strategy_Function_Labels**: legacy labels rolled up into the unit (see bu_crosswalk.csv)
- **SAP_Controlling_Area, SAP_Company_Code, Profit_Center_Prefix, Reporting_Level, Status**: SAP organization mapping
- **Revenue_in_Finance_Data_CAD, Operating_Cost_in_Finance_Data_CAD**: totals from revenue.csv and operating_cost.csv for the rolled-up codes, for reconciliation

## facilities.csv (33 records)

Primary key: **Facility_ID**.

- **Facility_ID, Facility_Name, Facility_Type, Field**: 25 upstream facilities FAC-01..25 (gas plants, oil batteries, SAGD CPFs), 6 pipeline systems, HQ-CAL and DC-EDM; names get a number suffix where two facilities share a field and type
- **Business_Unit_ID, Region_ID, Province, Latitude, Longitude, Operating_Status, Commissioning_Year**: organization and location (coordinates are approximate field centres)
- **Avg_Daily_boe, Wells_Connected, Asset_Count, ESG_Reporting_Boundary, Source**: computed from production_metrics, wells, asset_master and ESG emissions (FAC-12, FAC-20, FAC-24 are outside the ESG boundary)

## bu_crosswalk.csv (81 records)

Primary key: **Source_Dataset + Source_Column + Source_Value**.

- **Source_Dataset, Source_Column, Source_Value**: where the legacy business-unit label appears
- **Business_Unit_ID, Mapping_Type, Secondary_Business_Unit_ID**: target unit; Exact, Roll-up or Multi-BU (primary shown, second unit in the secondary column)

## data_relationship_matrix.csv (85 records)

One row per master file and dependent agent file column. Columns: Master_File, Master_Key, Dependent_Agent, Dependent_File, FK_Column, Join_Kind (ID, Name, Crosswalk, Province, Zone), Direction, Cardinality, Rows_in_File, Rows_with_Value, Rows_Matched, Coverage_Pct, Unmatched_Distinct_Values, Unmatched_Examples, Integration_Status, Notes.

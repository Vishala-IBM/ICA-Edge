# Logistics-Agent sample data: data dictionary

All data is synthetic, for a fictional integrated Canadian oil and gas company. Plant, terminal and warehouse codes match the Supply-Planning-Agent and Warehouse-Agent sample data. Carrier names are fictional. The first columns in each file are the key fields from the specification; columns after them are added context.

## shipments.csv (1,000 rows)
- Origin and Destination are location codes (table below). Mode: Pipeline, Rail, Truck (Tank), Truck (Flatbed/Van), Marine, Intermodal.
- Product, Quantity, Unit (kL, tonnes, TEU), Distance_km (approximate route distance) and Ship_Date (1 July to 7 October 2026) are added.
- Pipeline shipments are batches on the company's own and joint-venture pipelines. Trucks carry single loads, rail carries unit-train or manifest movements, marine carries tanker parcels.

## freight_costs.csv (500 rows)
- Covers 500 of the third-party carrier shipments (truck, rail, marine, intermodal) with an invoiced freight cost. Pipeline movements are excluded because they are tariff-based, and the remaining third-party shipments are not yet invoiced.
- Freight_Cost is in CAD. Carrier matches carrier_performance.csv and the carrier's mode matches the shipment mode. Carriers based in the origin region are favoured.

## carrier_performance.csv (200 carriers)
- On_Time_Rate: percent of deliveries on time. Damage_Rate: percent of shipments with damage, loss or product contamination.
- Mode and Home_Region (West, Prairies, Central, East) are added. Typical on-time rates: tank trucks about 93%, rail about 84%, marine about 82%.

## Location codes
| Code | Name | Province |
|---|---|---|
| R100 | Prairie Refinery | AB |
| R200 | Lakehead Refinery | ON |
| R300 | Saint-Laurent Refinery | QC |
| U100 | Athabasca Upgrader | AB |
| G100 | Foothills Gas Plant | AB |
| G200 | Peace Country Gas Plant | AB |
| G300 | Montney Gas Plant | BC |
| L100 | Western Lubricants Blend Plant | AB |
| A100 | Prairie Asphalt Plant | SK |
| B100 | Renewable Diesel Unit | AB |
| P100 | Petrochemical Complex | AB |
| C100 | NGL Fractionation Plant | AB |
| T100 | Western Products Terminal | AB |
| T200 | Coastal Marine Terminal | BC |
| T300 | Prairie Rail Terminal | SK |
| T400 | Lakeshore Products Terminal | ON |
| T500 | Capital Region Terminal | ON |
| T600 | St. Lawrence Terminal | QC |
| T700 | Atlantic Marine Terminal | NS |
| T800 | Western Airport Fuel Facility | AB |
| WH01 | Prairie Refinery Central Stores | AB |
| WH02 | Lakehead Refinery Stores | ON |
| WH03 | Saint-Laurent Refinery Stores | QC |
| WH04 | Athabasca Upgrader Stores | AB |
| WH05 | Foothills Gas Plant Warehouse | AB |
| WH06 | Montney Field Warehouse | BC |
| WH07 | Western Lubricants Finished Goods DC | AB |
| WH08 | Western Pipe Yard | AB |
| WH09 | Chemicals and Catalyst Warehouse | AB |
| WH10 | Ontario Regional Distribution Centre | ON |
| WH11 | Quebec Regional Distribution Centre | QC |
| WH12 | Dangerous Goods Warehouse | AB |
| RTL-AB | Retail Sites Alberta | AB |
| RTL-BC | Retail Sites British Columbia | BC |
| RTL-SK | Retail Sites Saskatchewan | SK |
| RTL-MB | Retail Sites Manitoba | MB |
| RTL-ON | Retail Sites Ontario | ON |
| RTL-QC | Retail Sites Quebec | QC |
| RTL-NS | Retail Sites Nova Scotia | NS |
| FARM-AB | Farm Bulk Customers Alberta | AB |
| FARM-SK | Farm Bulk Customers Saskatchewan | SK |
| FARM-MB | Farm Bulk Customers Manitoba | MB |
| MINE-BC | Mining Customers British Columbia | BC |
| MINE-SK | Mining Customers Saskatchewan | SK |
| MINE-ON | Mining Customers Ontario | ON |
| MINE-QC | Mining Customers Quebec | QC |
| MINE-NT | Mining Customers Northwest Territories | NT |
| OFS-AB | Oilfield Services Sites Alberta | AB |
| PAVE-AB | Paving Customers Alberta | AB |
| PAVE-ON | Paving Customers Ontario | ON |
| PCH-ON | Petrochemical Customers Ontario | ON |
| HEAT-AB | Heating Propane Customers Alberta | AB |
| HEAT-QC | Heating Oil Customers Quebec | QC |
| EXP-PAC | Pacific Export Terminal | BC |
| EXP-ATL | Atlantic Export Terminal | NS |

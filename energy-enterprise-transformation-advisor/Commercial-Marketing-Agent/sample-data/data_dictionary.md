# Commercial-Marketing-Agent sample data: data dictionary

All data is synthetic, for an integrated Canadian oil and gas company.

## customer_segments.csv (200 rows)
- Revenue: annual revenue in CAD.
- Region: Alberta, British Columbia, Saskatchewan, Manitoba, Ontario, Quebec, Atlantic Canada, Northern Canada.
- 25 segment types x 8 regions.

## product_portfolio.csv (100 rows)
- Margin: gross margin as a percentage of price (for example 6.5 = 6.5%).

## pricing_strategy.csv (300 rows = 100 products x 3 pricing zones)
- Price: list price in CAD, per the product's sales unit (table below).
- Discount: maximum contract or volume discount off list price, in percent.
- Pricing zones: Western Canada (AB, BC, SK, MB, Northern Canada), Central Canada (ON, QC), Eastern Canada (Atlantic Canada).

## Price units by category
| Category | Price unit(s) |
|---|---|
| Gasoline | CAD per litre |
| Diesel | CAD per litre |
| Jet and Marine | CAD per litre |
| LPG and NGL | CAD per cylinder; CAD per cylinder exchange; CAD per litre; CAD per tonne |
| Heating Oil | CAD per litre |
| Lubricants | CAD per litre (packaged/bulk) |
| Specialty Fluids | CAD per litre |
| Asphalt and Bitumen | CAD per tonne |
| Petrochemical Feedstock | CAD per tonne |
| Low-Carbon Fuels | CAD per GJ; CAD per kg; CAD per litre; CAD per litre premium; CAD per litre-equivalent |
| EV Charging | CAD per install; CAD per kWh; CAD per member per month; CAD per vehicle per month |
| Convenience and Retail Services | CAD per bundle; CAD per card per month; CAD per member per month; CAD per refill; CAD per wash |

## Price unit by product
| Product_ID | Product_Name | Price unit |
|---|---|---|
| PRD-001 | Regular Unleaded 87 | CAD per litre |
| PRD-002 | Mid-Grade Unleaded 89 | CAD per litre |
| PRD-003 | Premium Unleaded 91 | CAD per litre |
| PRD-004 | Premium Unleaded 94 | CAD per litre |
| PRD-005 | Regular E10 Ethanol Blend | CAD per litre |
| PRD-006 | Winter-Blend Regular 87 | CAD per litre |
| PRD-007 | Winter-Blend Premium 91 | CAD per litre |
| PRD-008 | Rack Gasoline 87 (Wholesale) | CAD per litre |
| PRD-009 | Racing Fuel 100 Octane | CAD per litre |
| PRD-010 | Non-Ethanol Recreational Gasoline 91 | CAD per litre |
| PRD-011 | Ultra-Low Sulphur Diesel No. 2 | CAD per litre |
| PRD-012 | Winter Diesel No. 1 | CAD per litre |
| PRD-013 | Arctic Grade Diesel | CAD per litre |
| PRD-014 | Biodiesel B5 Blend | CAD per litre |
| PRD-015 | Biodiesel B20 Blend | CAD per litre |
| PRD-016 | Renewable Diesel R99 | CAD per litre |
| PRD-017 | Dyed Off-Road Diesel | CAD per litre |
| PRD-018 | Premium Diesel with Additive | CAD per litre |
| PRD-019 | Marine Gas Oil | CAD per litre |
| PRD-020 | Locomotive Diesel | CAD per litre |
| PRD-021 | Mining-Grade Bulk Diesel | CAD per litre |
| PRD-022 | Farm Diesel Bulk Delivery | CAD per litre |
| PRD-023 | Jet A | CAD per litre |
| PRD-024 | Jet A-1 | CAD per litre |
| PRD-025 | Sustainable Aviation Fuel Blend 10% | CAD per litre |
| PRD-026 | Sustainable Aviation Fuel Blend 30% | CAD per litre |
| PRD-027 | Avgas 100LL | CAD per litre |
| PRD-028 | Very Low Sulphur Fuel Oil (VLSFO) | CAD per litre |
| PRD-029 | Marine Diesel Oil | CAD per litre |
| PRD-030 | Ground Support Equipment Diesel | CAD per litre |
| PRD-031 | Bulk Propane Residential | CAD per litre |
| PRD-032 | Bulk Propane Commercial | CAD per litre |
| PRD-033 | Autogas Propane | CAD per litre |
| PRD-034 | Cylinder Propane Exchange 20 lb | CAD per cylinder exchange |
| PRD-035 | Industrial Propane Cylinders | CAD per cylinder |
| PRD-036 | Butane | CAD per litre |
| PRD-037 | Propane-Butane Mix | CAD per litre |
| PRD-038 | Ethane Feedstock Supply | CAD per tonne |
| PRD-039 | Condensate and Diluent | CAD per tonne |
| PRD-040 | Light Heating Oil No. 2 | CAD per litre |
| PRD-041 | Bio-Heating Oil B10 | CAD per litre |
| PRD-042 | Commercial Furnace Oil | CAD per litre |
| PRD-043 | Kerosene K-1 | CAD per litre |
| PRD-044 | Synthetic Engine Oil 5W-30 | CAD per litre (packaged/bulk) |
| PRD-045 | Synthetic Engine Oil 0W-20 | CAD per litre (packaged/bulk) |
| PRD-046 | Conventional Engine Oil 10W-30 | CAD per litre (packaged/bulk) |
| PRD-047 | Heavy-Duty Diesel Engine Oil 15W-40 | CAD per litre (packaged/bulk) |
| PRD-048 | Full Synthetic Heavy-Duty 10W-30 | CAD per litre (packaged/bulk) |
| PRD-049 | Hydraulic Oil AW 32 | CAD per litre (packaged/bulk) |
| PRD-050 | Hydraulic Oil AW 46 | CAD per litre (packaged/bulk) |
| PRD-051 | Hydraulic Oil AW 68 | CAD per litre (packaged/bulk) |
| PRD-052 | Gear Oil 80W-90 | CAD per litre (packaged/bulk) |
| PRD-053 | Industrial Gear Oil ISO 220 | CAD per litre (packaged/bulk) |
| PRD-054 | Automatic Transmission Fluid | CAD per litre (packaged/bulk) |
| PRD-055 | Multipurpose Grease NLGI 2 | CAD per litre (packaged/bulk) |
| PRD-056 | High-Temperature Grease | CAD per litre (packaged/bulk) |
| PRD-057 | Compressor Oil ISO 100 | CAD per litre (packaged/bulk) |
| PRD-058 | Turbine Oil ISO 46 | CAD per litre (packaged/bulk) |
| PRD-059 | Transformer Insulating Oil | CAD per litre (packaged/bulk) |
| PRD-060 | Metalworking Fluid | CAD per litre (packaged/bulk) |
| PRD-061 | Wind Turbine Gear Oil | CAD per litre (packaged/bulk) |
| PRD-062 | Natural Gas Engine Oil | CAD per litre (packaged/bulk) |
| PRD-063 | Marine Cylinder Oil | CAD per litre (packaged/bulk) |
| PRD-064 | Diesel Exhaust Fluid (DEF) | CAD per litre |
| PRD-065 | Engine Coolant 50/50 | CAD per litre |
| PRD-066 | Windshield Washer Fluid -40 | CAD per litre |
| PRD-067 | Fuel System Cleaner | CAD per litre |
| PRD-068 | Diesel Anti-Gel Additive | CAD per litre |
| PRD-069 | Brake Fluid DOT 4 | CAD per litre |
| PRD-070 | Industrial Solvent | CAD per litre |
| PRD-071 | Drilling Fluid Base Oil | CAD per litre |
| PRD-072 | Asphalt Cement PG 58-28 | CAD per tonne |
| PRD-073 | Asphalt Cement PG 64-22 | CAD per tonne |
| PRD-074 | Asphalt Cement PG 70-28 | CAD per tonne |
| PRD-075 | Asphalt Cement PG 52-34 | CAD per tonne |
| PRD-076 | Cationic Asphalt Emulsion | CAD per tonne |
| PRD-077 | Medium-Cure Cutback Asphalt | CAD per tonne |
| PRD-078 | Naphtha | CAD per tonne |
| PRD-079 | Granular Sulphur | CAD per tonne |
| PRD-080 | Toluene | CAD per tonne |
| PRD-081 | Mixed Xylenes | CAD per tonne |
| PRD-082 | Polymer-Grade Propylene | CAD per tonne |
| PRD-083 | Petroleum Coke | CAD per tonne |
| PRD-084 | Renewable Natural Gas (RNG) Supply | CAD per GJ |
| PRD-085 | Compressed Hydrogen Supply | CAD per kg |
| PRD-086 | Carbon-Offset Fuel Program | CAD per litre premium |
| PRD-087 | Ethanol E85 | CAD per litre-equivalent |
| PRD-088 | Low-Carbon-Intensity Gasoline | CAD per litre-equivalent |
| PRD-089 | Renewable Propane | CAD per litre |
| PRD-090 | Clean Fuel Credit Bundle | CAD per litre premium |
| PRD-091 | DC Fast Charging 150 kW | CAD per kWh |
| PRD-092 | Level 2 Charging | CAD per kWh |
| PRD-093 | Fleet Charging Subscription | CAD per vehicle per month |
| PRD-094 | Home Charging Install Package | CAD per install |
| PRD-095 | Charging Membership Plan | CAD per member per month |
| PRD-096 | Loyalty Rewards Points Program | CAD per member per month |
| PRD-097 | Fleet Fuel Card Program | CAD per card per month |
| PRD-098 | Car Wash Service | CAD per wash |
| PRD-099 | Propane Cylinder Refill Service | CAD per refill |
| PRD-100 | Coffee and Food Service Bundle | CAD per bundle |

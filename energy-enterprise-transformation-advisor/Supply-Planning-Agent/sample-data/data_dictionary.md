# Supply-Planning-Agent sample data: data dictionary

All data is synthetic, for a fictional integrated Canadian oil and gas plant network. Product names match the Commercial-Marketing and Demand-Planning sample data where they overlap. The first columns in each file are the key fields from the specification; columns after them are added context.

## Plants (used in all three files)
| Plant | Name | Type | Province |
|---|---|---|---|
| R100 | Prairie Refinery | Refinery | Alberta |
| R200 | Lakehead Refinery | Refinery | Ontario |
| R300 | Saint-Laurent Refinery | Refinery | Quebec |
| U100 | Athabasca Upgrader | Upgrader | Alberta |
| G100 | Foothills Gas Plant | Gas Plant | Alberta |
| G200 | Peace Country Gas Plant | Gas Plant | Alberta |
| G300 | Montney Gas Plant | Gas Plant | British Columbia |
| L100 | Western Lubricants Blend Plant | Lubricants Blending | Alberta |
| A100 | Prairie Asphalt Plant | Asphalt Plant | Saskatchewan |
| B100 | Renewable Diesel Unit | Renewable Fuels | Alberta |
| P100 | Petrochemical Complex | Petrochemicals | Alberta |
| C100 | NGL Fractionation Plant | NGL Fractionation | Alberta |
| T100 | Western Products Terminal | Terminal | Alberta |
| T200 | Coastal Marine Terminal | Marine Terminal | British Columbia |
| T300 | Prairie Rail Terminal | Rail Terminal | Saskatchewan |
| T400 | Lakeshore Products Terminal | Terminal | Ontario |
| T500 | Capital Region Terminal | Terminal | Ontario |
| T600 | St. Lawrence Terminal | Marine Terminal | Quebec |
| T700 | Atlantic Marine Terminal | Marine Terminal | Nova Scotia |
| T800 | Western Airport Fuel Facility | Airport Fuel Facility | Alberta |

## inventory_plan.csv (500 rows, unique Material and Plant)
- Safety_Stock: target safety stock in the Unit column. Materials include crude and feedstocks, finished products, intermediates, additives and catalysts, packaging, and critical MRO spares. Quantities scale with plant size.
- Unit: kL (thousand litres), tonnes, e3m3 (thousand cubic metres of gas), kg, EA (each).

## supply_constraints.csv (250 rows)
- Impact: expected percentage reduction in the affected plant's throughput or available supply while the constraint lasts.
- Plant, Start_Date, Duration_Days: affected asset, start (October 2026 to October 2027) and length. Seasonal types follow the calendar: cold weather in winter, wildfire in summer, flooding in spring.

## production_plan.csv (500 rows = 100 plant-product pairs x 5 months)
- Planned_Qty: planned monthly production in the Unit column, November 2026 to March 2027.
- Month: YYYY-MM. Seasonal patterns: winter diesel and heating oil rise in winter, asphalt falls to a minimum in January and February, and coolant peaks in winter.

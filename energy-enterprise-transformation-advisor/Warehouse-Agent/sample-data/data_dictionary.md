# Warehouse-Agent sample data: data dictionary

All data is synthetic, for a fictional integrated Canadian oil and gas company. Plant and product names match the other agents' sample data where they overlap. The first columns in each file are the key fields from the specification; columns after them are added context.

## Warehouses
| Warehouse | Name | Province |
|---|---|---|
| WH01 | Prairie Refinery Central Stores | Alberta |
| WH02 | Lakehead Refinery Stores | Ontario |
| WH03 | Saint-Laurent Refinery Stores | Quebec |
| WH04 | Athabasca Upgrader Stores | Alberta |
| WH05 | Foothills Gas Plant Warehouse | Alberta |
| WH06 | Montney Field Warehouse | British Columbia |
| WH07 | Western Lubricants Finished Goods DC | Alberta |
| WH08 | Western Pipe Yard | Alberta |
| WH09 | Chemicals and Catalyst Warehouse | Alberta |
| WH10 | Ontario Regional Distribution Centre | Ontario |
| WH11 | Quebec Regional Distribution Centre | Quebec |
| WH12 | Dangerous Goods Warehouse | Alberta |

## inventory_stock.csv (500 rows, unique Material and Warehouse)
- Quantity: current book (system) stock in the Unit column.
- Unit: EA each, M metre, SET, DRUM (205 L), TOTE (1,000 L), PAIL, SACK (1 tonne), CASE, BOX, PAIR, BALE.
- Materials are discrete warehouse items (MRO spares, pipe and fittings, packaged chemicals and catalysts, packaged lubricants, PPE, packaged consumer products). Bulk tank inventory is in the Supply-Planning-Agent data.

## cycle_count.csv (500 rows, every stock line counted once)
- Expected_Qty equals the book quantity in inventory_stock.csv. Actual_Qty is the physical count.
- About 80% of lines match exactly. Differences are mostly 1% to 12%, slightly more often shortages than gains, with a few larger outliers.
- Warehouse, Count_Date (1 July to 5 October 2026) and Unit are added.

## warehouse_movements.csv (1,000 rows)
- Qty is signed: positive adds stock, negative removes it.
- Movement_Type uses SAP movement type codes: 101 goods receipt, 261 issue to maintenance order, 201 issue to cost centre, 301 plant transfer out, 311 storage transfer in, 122 return to vendor, 551 scrap, 701 inventory gain and 702 inventory loss.
- About 70% of cycle-count variances have a matching 701 or 702 adjustment posted within two days of the count.
- Posting_Date: 1 July to 7 October 2026. Warehouse and Unit are added.

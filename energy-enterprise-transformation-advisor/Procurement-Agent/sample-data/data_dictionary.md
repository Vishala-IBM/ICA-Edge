# Procurement-Agent sample data: data dictionary

All data is synthetic, for an integrated Canadian oil and gas company. Supplier names are fictional.

## supplier_master.csv (200 rows)
- Supplier_ID: SUP-0001 to SUP-0200.
- Category: 28 energy procurement categories (7 or 8 suppliers each).
- Risk_Score: composite supplier risk, 0 to 100, higher is riskier (financial, supply continuity, geopolitical, safety and ESG). Categories with long lead times or sole-source exposure, such as catalysts, tubulars and electrical equipment, score higher on average.

## purchase_orders.csv (500 rows)
- PO_Number: 10-digit number starting 4500, in the style of SAP purchasing documents.
- Supplier: Supplier_ID from supplier_master.csv.
- Material: description with the unit of measure in brackets (EA each, M metre, T tonne, L litre, M3 cubic metre, KG kilogram, BBL barrel, GJ gigajoule, HR hour, DAY, MONTH, YEAR, LS lump sum, and so on). Materials match the supplier's category.
- Quantity: in the unit shown in the Material.
- Value: total PO value in CAD.
- Spend per supplier is kept below 80% of that supplier's total contract value.

## contracts.csv (300 rows)
- Contract_ID: CTR-0001 to CTR-0300.
- Supplier: Supplier_ID. Every supplier has at least one contract; larger suppliers have several.
- Contract_Value: total value over the contract term in CAD, scaled to the supplier's category (for example EPC and turnaround contracts are large, PPE and lubricant contracts small).

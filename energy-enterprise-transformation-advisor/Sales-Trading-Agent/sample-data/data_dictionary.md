# Sales-Trading-Agent – Sample Data Dictionary
Synthetic data. Customers and counterparties are fictional. Products and prices come from Commercial-Marketing product_portfolio.csv and pricing_strategy.csv; supply points reuse refinery codes R100/R200/R300.

## customer_orders.csv (500)
Key fields: Order_ID, Customer, Product. B2B/bulk orders, 2026-01-01 to 2026-10-07, 96 customers.
Quantity is in litres or tonnes (see Unit). Unit_Price_CAD = list price for the customer's pricing zone less Discount_Pct; Order_Value_CAD = Quantity x Unit_Price_CAD.
About 73% of orders are called off an existing contract (Contract_ID filled and valid for the order date); the rest are spot orders (blank Contract_ID).
Extra: Order_Date, Quantity, Unit, Unit_Price_CAD, Order_Value_CAD, Discount_Pct, Requested_Delivery_Date, Supply_Point, Region, Status (Delivered/Confirmed/In Transit/Cancelled), Contract_ID, Customer_ID, Product_ID.

## trading_transactions.csv (1,000)
Key fields: Trade_ID, Commodity, Quantity. 13 commodities: WTI, WCS, Edmonton Par, Synthetic crude, Condensate, AECO natural gas, propane, butane, ethane, ULSD, gasoline, jet fuel, TIER/CFR carbon credits. Trades 2026-01-01 to 2026-10-07.
Quantity unit is in Unit: bbl, GJ (gas), tCO2e (credits). Price is per Unit in Currency (USD for crude/NGL/products, CAD for AECO gas and carbon credits). Trade_Value_CAD = Quantity x Price, converted at 1.37 USD/CAD when Currency is USD. Prices follow one simulated WTI path so differentials are consistent (WCS about 11-17 USD below WTI).
Extra: Trade_Date, Buy_Sell, Unit, Price, Currency, Trade_Value_CAD, Instrument, Delivery_Point, Delivery_Period, Counterparty, Desk.

## contract_volume.csv (500)
Key fields: Customer, Product, Contract_Volume. 500 unique customer-product pairs across 100 customers (14 customer types). Contract_Volume is annual volume in Unit (litres or tonnes).
Extra: Contract_ID, Customer_ID, Unit, Volume_Period, Start_Date, End_Date, Pricing_Basis, Take_Or_Pay_Pct, Region. Contract dates cover every linked order.

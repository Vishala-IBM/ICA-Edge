# Demand-Planning-Agent sample data: data dictionary

All data is synthetic, for an integrated Canadian oil and gas company. Product names match the Commercial-Marketing-Agent product_portfolio.csv. Customer names are fictional.

## demand_forecast.csv (1,000 rows = 10 products x 5 regions x 20 months)
- Month: YYYY-MM, November 2026 to June 2028.
- Region: Alberta, British Columbia, Saskatchewan, Ontario, Quebec.
- Forecast_Volume: monthly volume (see units table). Includes seasonality (for example winter diesel, propane and heating oil peak in winter, asphalt in summer), trends (EV charging and renewable diesel grow, gasoline declines slightly).

## sales_forecast.csv (1,000 rows)
- Customer: fictional customer in one of 15 customer types (trucking, farm co-ops, transit, aviation, mining, paving, oilfield services, jobbers, propane and heating, lubricant distributors, power, petrochemicals, marine, rail, government).
- Forecast_Qty: expected purchases over the next 12 months (see units table). Each customer buys 4 to 8 products suited to its type.

## demand_scenarios.csv (250 rows = 25 scenarios x 10 products)
- Demand_Impact: percent change in demand versus the baseline forecast over the scenario period (+ increases, - decreases).

## Units
| Unit | Products |
|---|---|
| kL (thousand litres) | all liquid fuels, lubricants and fluids |
| tonnes | asphalt and bitumen, naphtha, sulphur, aromatics, propylene, petroleum coke, ethane, condensate and diluent |
| MWh | EV charging (DC Fast Charging 150 kW, Level 2 Charging) |

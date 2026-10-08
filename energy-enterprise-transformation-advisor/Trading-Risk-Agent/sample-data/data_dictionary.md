# Trading-Risk-Agent – Sample Data Dictionary

Valuation date for all files: 2026-10-07. Consistent with Sales-Trading-Agent (WTI prices on trade dates match `trading_transactions.csv`; FX 1.37 USD/CAD; counterparties and desks reused).

## market_prices.csv (1,000 records = 10 commodities x 100 business days)
Key fields: **Commodity, Date, Price**. Extras: Unit, Currency, Benchmark, Price_Source, Daily_Change_Pct, Price_CAD, Volatility_20D_Annualized_Pct (rolling 20-day, annualized).
Commodities: WTI, WCS, Edmonton Par, Synthetic, Condensate, AECO gas, Propane, ULSD, Gasoline, Carbon credits (TIER/CFR). Differentials mean-revert to WTI; AECO has seasonal shape.

## hedging_positions.csv (500 records)
Key fields: **Hedge_ID (HDG-00001..), Commodity, Exposure**. Exposure = Remaining_Volume x last price x FX, in CAD (0 for matured/terminated hedges).
Extras: Instrument (swap, zero-cost collar, put, call, futures, fixed-price forward, basis swap), Direction, Hedged_Item, Business_Unit, dates, volumes, strike/cap/premium, Market_Price_At_Valuation, MTM_Value_CAD, Realized_PnL_CAD, Counterparty, Hedge_Accounting, Status (Active 264 / Matured 224 / Terminated 12), Desk, Valuation_Date.

## risk_exposure.csv (500 records = 25 risk lines x 20 month-ends, 2025-02-28..2026-09-30)
Key fields: **Risk_Category, Exposure_Value** (net CAD after hedges). Categories include commodity price, basis/differential, FX, interest rate, counterparty credit, carbon price and volumetric risk.
Extras: Period, Risk_Subcategory, Business_Unit, Risk_Metric, Gross_Exposure_CAD, Hedged_Amount_CAD, Hedge_Ratio_Pct, Limit_CAD, Limit_Utilization_Pct, Limit_Status (Within limit 436 / Warning 47 / Breach 17), Currency, Direction.

## Solution mapping
ETRM/hedge accounting and risk reporting: SAP Treasury and Risk Management (TRM) and Commodity Management (S/4HANA); market data via feeds (Platts/Argus, ICE/CME); SAP does not provide a native physical-and-financial energy ETRM with full forward-curve analytics, so third-party ETRM is typically integrated.

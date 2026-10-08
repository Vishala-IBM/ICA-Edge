# Finance-Agent – Sample Data Dictionary
Synthetic data, all amounts in CAD, monthly periods 2025-01 to 2026-08 (20 months). Business units, refineries (R100/R200/R300) and cost types are consistent with earlier agents; refining revenue is calculated from Refining-Operations refinery_output.csv volumes, and upstream revenue is scaled to Upstream-Operations production (~184k boe/d).

## revenue.csv (1,000)
Key fields: Period, Business_Unit, Revenue. 50 revenue streams x 20 months across 12 business units (Oil Sands, Conventional Oil, Natural Gas & NGL, Midstream & Terminals, three refineries, Retail, Commercial & Wholesale, Lubricants, Energy Trading, Low Carbon).
Extra: Business_Unit_Code, Revenue_Stream, GL_Account (revenue account 4xxxxx), Currency. About CAD 4.2B per month in total.

## operating_cost.csv (1,000)
Key fields: Cost_Center, Cost_Type, Amount. 25 cost centers x 2 cost types x 20 months. Covers selected operating cost lines (about CAD 0.64B per month), not the full cost of goods sold. Refinery maintenance and contract costs spike in months when that refinery's utilisation drops below 82%; energy cost follows utilisation and winter seasonality.
Extra: Period, Cost_Center_Name, Business_Unit (Corporate for CC-9xxx), GL_Account (6xxxxx), Cost_Behaviour (Fixed/Variable), Currency.

## budget_vs_actual.csv (500)
Key fields: Account, Budget, Actual. 25 GL accounts x 20 months: 10 revenue accounts (4xxxxx), 14 operating-cost accounts (6xxxxx), and 700100 Depreciation, Depletion & Amortization.
Actual for revenue and cost accounts equals the sum of revenue.csv or operating_cost.csv rows for that GL_Account and Period. 700100 is standalone. Budget is set with random plan variance (trading revenue is most volatile; maintenance and contract services tend to overrun).
Extra: Period, Account_Name, Account_Group, Variance (Actual - Budget), Variance_Pct, Currency. For cost accounts a positive variance is unfavourable.

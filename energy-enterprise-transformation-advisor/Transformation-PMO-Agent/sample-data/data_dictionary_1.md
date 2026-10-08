# Transformation-PMO-Agent – Sample Data Dictionary
Synthetic data. The portfolio combines the 100 projects in Corporate-Strategy investment_portfolio.csv (PRJ-1001 to PRJ-1100, same names and budgets) with 100 additional transformation backlog projects (PRJ-1101 to PRJ-1200). The 8 programs match the transformation_roadmap.csv workstreams. Dates are measured as of 2026-10-08.

## project_portfolio.csv (200)
Key fields: Project_ID, Program, Budget (CAD, approved or proposed budget at completion).
Extra: Project_Name, Program_ID, Sponsor, Project_Manager, Business_Unit, Priority, Phase (stage-gate: Select/Define/Execute/Close), Status (Proposed, Approved - Not Started, On Track, At Risk, Delayed, On Hold, Completed, Cancelled), Health_RAG, Start_Date, Planned_End_Date, Forecast_End_Date, Percent_Complete, Actual_Cost_To_Date, Forecast_At_Completion, Cost_Variance_Pct, Schedule_Variance_Days, SPI, CPI (earned value indices), Strategic_Goal_ID (foreign key to strategy_goals.Strategic_ID), Planned_Annual_Benefit (CAD, ties to benefits_tracking), Source.
Status mapping from the investment portfolio: Proposed -> Proposed; Approved -> Approved - Not Started; In Progress -> On Track / At Risk / Delayed (from SPI and CPI); Completed, On Hold unchanged. On Track needs SPI and CPI of 0.95 or more; At Risk 0.85 or more; Delayed below that.

## risk_register.csv (500)
Key fields: Risk_ID, Risk, Impact (Insignificant / Minor / Moderate / Major / Severe). 
Extra: Project_ID (foreign key), Program, Risk_Category (10 categories), Impact_Score (1-5), Probability and Probability_Score (1-5), Risk_Score (impact x probability), Risk_Level (Low <6, Medium 6-11, High 12-19, Critical 20+), Residual_Risk_Score, Status (Open/Mitigating/Closed/Occurred), Risk_Owner, Mitigation_Plan, Identified_Date, Target_Close_Date, Cost_Exposure_CAD, Schedule_Exposure_Days. Larger projects carry more risks.

## benefits_tracking.csv (300)
Key fields: Initiative (project name, matches project_portfolio.Project_Name), Planned_Benefit (CAD annual run-rate at full realization).
For the 100 projects from the investment portfolio, benefit lines sum exactly to the Benefit value in investment_portfolio.csv. Extra: Benefit_ID, Project_ID, Program, Benefit_Category (Cost reduction, Cost avoidance, Revenue growth, Productivity, Working capital), Benefit_KPI, Measurement_Unit, Realization_Start, Full_Run_Rate_Date, Actual_Benefit_To_Date, Planned_Benefit_To_Date, Forecast_Annual_Benefit, Realization_Pct, Benefit_Status (Not Started/On Track/At Risk/Off Track/Realized/Not Realized), Benefit_Owner, Confidence, Validated_By_Finance, Benefit_Period.

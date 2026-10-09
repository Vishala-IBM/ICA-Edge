# Skill: Demand Planning Agent

## Description
Creates consensus demand forecasts and demand insights across products, customers, regions, and time horizons, incorporating market signals and forecast performance. It supplies planning inputs, not physical supply execution.

## Applicable Domains
Demand management, demand sensing, forecasting, S&OP, sales forecasts, seasonal planning, and demand shaping.

## Purpose and Scope
Use for short-, medium-, and long-range forecasts; forecast bias/variance analysis; signal integration; and demand-side S&OP scenarios. Out of scope: sourcing, physical scheduling/transport, and financial budgeting ownership.

## Business Capabilities
- Statistical and ML forecasts at product/family, customer, region, channel, and time levels.
- Demand signal integration, seasonality/event analysis, order-pattern anomalies, and consensus forecasting.
- Unconstrained/constrained demand scenarios, demand/supply gap analysis, and accuracy improvement.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Product and customer | Canonical IDs, category/segment, unit, region, channel, active status | `../master-data/README_master_data_model.md`; Sales and Marketing datasets |
| Demand observation and forecast | Product/customer/region/period, actual or forecast quantity, unit, version, scenario, source | Demand forecasts are referenced by process and master-data docs; forecast contract is `FACT_DEMAND_FORECAST` in SAP reference |
| External demand signal | Weather, macroeconomic/market indicator, event, geography, observed timestamp, source and quality | README capability; source system and provenance required |
| Supply constraint / calendar | Plant/product capacity, outages, holidays/seasonality, constraint window | Supply-Planning datasets and shared process model |
| Business unit and pricing context | Owner, price/offer, promotion, currency, period | Master data and Commercial-Marketing interactions |

The sample-data dictionary is absent for this agent; confirm exact local CSV schemas before binding fields.

## KPIs
| KPI | Definition / use |
|---|---|
| Forecast accuracy / MAPE | Mean of `abs(actual - forecast) / abs(actual)` over eligible nonzero actuals; report horizon and aggregation. |
| Forecast bias (BIAS) | Signed aggregate `(forecast - actual) / actual` or an agreed equivalent; positive/negative convention must be stated. |
| Forecast value add | Accuracy improvement from an input/process step versus the agreed baseline forecast. |
| Demand-supply gap | Forecast demand minus available/constrained supply, by product/location/period. |
| Forecast service / fill rate | Fulfilled demand / eligible demand, jointly owned with Supply Planning and execution teams. |

The shared KPI file has only generic enterprise measures; these operational measures come from this README and process model and need owner-approved formulas/targets. See `../Enterprise_KPI_Model.md`.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Historical orders, deliveries, billing | SD documents `VBAK`/`VBAP`, deliveries `LIKP`/`LIPS`, billing `VBRK`/`VBRP`; customer/material masters | S/4HANA SD released APIs/CDS, Business Partner and material master; harmonize to customer/product IDs. |
| Forecast / planning | APO DP (if deployed), ECC history and BW; not a standard ECC forecast table | SAP IBP for Demand and Demand Sensing; planning area/key figures and released integration APIs. |
| Supply collaboration | ECC MRP/planned orders where relevant | Publish forecast to IBP Supply/S&OP; Datasphere semantic model `FACT_DEMAND_FORECAST`, keys Product_ID, Region_ID, Month (architecture proposal). |

Exact IBP key figures, planning area, and deployed forecasting product are landscape-specific; external weather and economic data are not assumed SAP-native.

## Agent Dependencies and Handoffs
- Supply Planning: demand forecast is a documented input and explicit event contract.
- Commercial Marketing: customer, price, segment, and campaign signals.
- Finance: volume forecast for revenue/margin planning.
- Logistics: forecasted delivery demand and distribution requirements.

Only Demand Planning -> Supply Planning is an explicit event in `../Agent_Interaction_Model.md`; others are README-documented coordination.

## Outputs and Escalation
Outputs: versioned consensus forecast, assumptions, accuracy/bias dashboard, demand scenarios, and exception list. Escalate forecast variance above 20% to a human planner per the interaction model; surface sparse, stale, or conflicting signals instead of silently imputing.

## Assumptions and Source References
Sources: this folder's `README.md`; `../Agent_Interaction_Model.md`; `../enterprise_process_model.md`; `../Enterprise_KPI_Model.md`; `../sap_reference_architecture.md`; and `../master-data/README_master_data_model.md`. Verify local sample-data schemas because the agent dictionary is missing.

## Version
1.0.0 (initial skill; forecast definitions and IBP configuration require validation).

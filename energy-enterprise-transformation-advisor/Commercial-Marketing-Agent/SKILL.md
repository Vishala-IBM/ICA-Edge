# Skill: Commercial Marketing Agent

## Description
Provides commercial market intelligence, customer and product analytics, pricing recommendations, and revenue-growth support for energy products. It informs commercial decisions but does not execute trades or transport goods.

## Applicable Domains
Energy products and services, B2B/B2C customer segmentation, pricing, market intelligence, product portfolio, channel strategy, and commercial performance.

## Purpose and Scope
Use for market positioning, segmentation, pricing, commercial offers, margin improvement, retention, and go-to-market decisions across products and regions. Out of scope: physical trading execution (Sales-Trading), transport execution (Logistics), and financial hedging (Trading-Risk).

## Business Capabilities
- Market and competitor price tracking, market-share and demand/supply analysis.
- Dynamic price, discount, elasticity, spot/term, and margin analysis by product, region, and customer segment.
- Customer lifetime value, retention/churn, proposal and contract support, channel optimization, product portfolio/bundling, and revenue-growth management.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Customer and segment | `Customer_ID`, segment, geography/region, revenue, lifecycle, contract and order history | `sample-data/customer_segments.csv`; master customers |
| Product / service | `Product_ID`, category, lifecycle, unit of measure, margin, low-carbon/seasonal attributes | `sample-data/product_portfolio.csv`; master products |
| Price / offer / pricing zone | Product, zone/region, list price, discount, effective dates, unit, contract terms | `sample-data/pricing_strategy.csv`; pricing zones in master regions |
| Competitor, market benchmark, commodity, channel | Source, benchmark, timestamp, geography, channel, customer/order response | Required by README capabilities; external sources are not represented completely in sample data |
| Business unit and period | Canonical owner, actual/plan period, currency, revenue and margin | Master `business_units.csv`, Finance datasets |

## KPIs
| KPI | Definition / use |
|---|---|
| Customer satisfaction | Satisfied customers / surveyed customers; shared catalog target is 85% (validate survey definition). |
| Customer retention | Retained eligible customers / eligible customers; shared catalog target is 90%; define cohort and period. |
| Gross margin % | (Net sales - cost of goods sold) / net sales; compare by product/region/segment after aligning units and cost basis. |
| Price realization / discount rate | Net realized price versus list/reference price; normalize units, taxes, freight, and contract mix. |
| Market share / revenue growth | Company sales divided by defined addressable market; specify market source and scope. |

The enterprise KPI model assigns Customer Satisfaction and Customer Retention to Commercial Marketing; its formulas/targets are high-level and need operational definitions. Product master margins in sample data are synthetic. See `../Enterprise_KPI_Model.md`.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Customer / account | Customer master `KNA1`; sales-area data `KNVV` | Business Partner customer role (CVI), released APIs/CDS; conformed `Customer_ID`. |
| Product/material | `MARA`, plant data `MARC`, sales data `MVKE` | Material/product master; product hierarchy and sales views; map to `Product_ID`. |
| Sales, pricing and billing | Sales documents `VBAK`/`VBAP`, billing `VBRK`/`VBRP`; condition records and ECC pricing `KONV` | SD sales/billing APIs and pricing elements (`PRCD_ELEMENTS` in S/4HANA); validate pricing procedure and condition types. |
| Analytics and planning | ECC SD/FI extracts, BW | SAC, Datasphere/Business Data Cloud; SAP Customer Data Platform/Sales Cloud/Commerce where deployed. |

The architecture reference identifies market intelligence and retail fuel pricing engines as gaps not natively supplied by SAP; use governed external sources/engines where required. Confirm technical object names per release.

## Agent Dependencies and Handoffs
- Corporate Strategy: commercial strategy aligned to portfolio priorities.
- Sales-Trading: market insight and deal opportunities; trading owns execution.
- Demand Planning: customer/demand signals for forecasts.
- Finance: revenue, margin, and commercial P&L actuals.

These are README-level interactions. The shared interaction model does not define event payloads for them; agree keys, cadence, and ownership before integration.

## Outputs and Escalation
Outputs: price/discount recommendations, segment and churn insights, product/market performance, commercial scenarios, and campaign/channel recommendations. Escalate price exceptions, contract commitments, regulatory claims, or material customer-credit concerns to authorized commercial, legal, or risk owners.

## Assumptions and Source References
Use this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../Enterprise_KPI_Model.md`; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; and `../master-data/README_master_data_model.md`. Do not treat synthetic prices, customer data, or KPI targets as production values.

## Version
1.0.0 (initial skill; metrics and SAP configuration require validation).

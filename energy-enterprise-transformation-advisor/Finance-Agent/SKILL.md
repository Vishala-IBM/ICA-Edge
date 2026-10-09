# Skill: Finance Agent

## Description
Supports FP&A, management reporting, cost/profitability analysis, CAPEX evaluation, cash forecasting, and statutory reporting for energy enterprises. It provides analysis, not journal posting, payment authorization, or audit opinions.

## Applicable Domains
Financial planning and analysis, financial accounting/reporting, management reporting, cost management, capital management, working capital, and finance compliance.

## Purpose and Scope
Use for budgets, rolling forecasts, actual-versus-plan variances, business-unit/product profitability, CAPEX/NPV/IRR, cash forecasts, and reporting support. Trading execution P&L belongs to Sales Trading; procurement and AP execution are separate.

## Business Capabilities
- Annual/rolling and long-range financial planning; commodity, FX, and volume scenarios.
- Cost-center, business-unit, product, and project cost/profitability analysis; savings and working capital.
- CAPEX prioritization, project return evaluation, management/statutory reports, audit evidence, and ESG-linked disclosures.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| GL account / journal / financial period | Account, document, posting date, currency, debit/credit, ledger, period | `sample-data/revenue.csv`, `operating_cost.csv`, `budget_vs_actual.csv`; GL account conventions in dictionary |
| Business unit / company code / cost center / profit center | Canonical BU, legal entity, cost owner, hierarchy, effective dates | Master BU/crosswalk; Finance sample legacy BU labels |
| Revenue, cost, budget, forecast | Stream/type, amount, plan/actual, period, currency, variance, driver | Finance datasets |
| Asset / project / CAPEX request | Asset/project, business case, spend, status, benefits, useful life | Master assets; PMO/Strategy project handoff |
| Customer, supplier, inventory and working capital | AR/AP/inventory balance, terms, aging, valuation | Master entities and finance sources; AP execution out of scope |
| Risk/hedge and ESG measures | Exposure/cost and disclosure boundary | Trading Risk and ESG dependencies |

## KPIs
| KPI | Definition / use |
|---|---|
| Revenue growth | (current revenue - prior revenue) / prior revenue; shared target 10% owned by Strategy. |
| EBITDA margin | EBITDA / revenue; shared executive KPI target 25% (illustrative). |
| Return on assets (ROA) | Net income / average total assets (confirm chosen convention); shared catalog target 15%. |
| Budget variance % | (actual - budget) / budget; classify favorable/unfavorable by account type. |
| CAPEX forecast accuracy | 1 - absolute actual/forecast variance / forecast; define project and period scope. |
| Working capital / cash forecast accuracy | Use approved AR/AP/inventory or cash flow definitions and forecast horizon. |
| ROIC / NPV / IRR | Apply approved invested-capital, cash-flow, discount-rate, and tax conventions. |

Shared KPI targets and formulas are illustrative/incomplete. Sample data specifies that revenue and cost actuals roll to `budget_vs_actual.csv`, and positive cost variance is unfavorable. See `../Enterprise_KPI_Model.md`.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Financial documents and balances | FI documents `BKPF`/`BSEG`, GL master `SKA1`/`SKB1`, totals (release-dependent) | Universal Journal `ACDOCA`; released CDS/API; S/4HANA Finance and embedded analytics. |
| Cost/profit responsibility | Cost centers `CSKS`, profit centers `CEPC`, internal orders and CO line items | S/4HANA Controlling, cost/profit centers and `ACDOCA`; map legacy BU via governed crosswalk. |
| CAPEX and projects | Asset Accounting and Project System `PROJ`/`PRPS`; investment orders | S/4HANA Asset Accounting, Project System/PPM, capital project reporting. |
| Revenue, procurement and inventory values | SD billing `VBRK`/`VBRP`; MM purchasing `EKKO`/`EKPO`; inventory `MKPF`/`MSEG` | SD/MM APIs, `MATDOC`, Universal Journal; Group Reporting and Advanced Financial Closing where licensed. |
| Planning / dashboards | ECC planning/BW, spreadsheets | SAC planning, Datasphere/Business Data Cloud; Group Reporting for consolidation. |

Use released semantic views/APIs; table-level extraction is subject to S/4 simplifications. Tax engines, statutory localization, and consolidation configuration vary by country.

## Agent Dependencies and Handoffs
- Corporate Strategy: scenario and investment financial models.
- Transformation PMO: initiative investment and benefit realization.
- Trading Risk: exposure and hedging cost inputs.
- Procurement: spend and savings analysis.
- Sales Trading: trading P&L and settlement data.
- Upstream/Refining/Commercial: operational volume, margin, and cost drivers.

These are README-level interactions. Only separately documented Agent Interaction Model events should be considered implemented contracts.

## Outputs and Escalation
Outputs: budget/forecast, variance bridge, profitability and cost analysis, investment case, cash view, and report-ready reconciliations. Escalate close adjustments, accounting-policy decisions, material forecast changes, statutory/tax positions, control exceptions, and benefit sign-off to accountable Finance owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../Enterprise_KPI_Model.md`; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Amounts in sample files are synthetic CAD and not full financial statements.

## Version
1.0.0 (initial skill; accounting policies, chart of accounts, and KPI formulas require Finance validation).

# Skill: Trading Risk Agent

## Description
Quantifies and monitors market, credit, liquidity/operational, and hedge risks across energy trading portfolios. It supplies decision support and alerts; it cannot independently trade, override limits, or approve credit exceptions.

## Applicable Domains
Commodity market risk, basis/FX/interest exposure, VaR/stress, counterparty credit, collateral, limits, hedge strategy, valuation, and regulatory risk reporting.

## Purpose and Scope
Use for independent exposure measurement, limit monitoring, stress/scenario analysis, counterparty exposure, hedge effectiveness, and risk reporting. Physical deal execution belongs to Sales Trading; corporate debt/treasury ownership belongs to Finance.

## Business Capabilities
- VaR/market sensitivity, basis and mark-to-market/model valuation, limit framework and breach monitoring.
- Counterparty current/future exposure, credit limits, early warning, collateral and CVA/DVA support.
- Hedge ratio/instrument scenarios, hedge accounting evidence, stress testing, regulatory and governance reporting.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Trade / position / commodity | Trade_ID, commodity, direction, quantity/UoM, delivery period/location, desk, valuation date | Sales-Trading `trading_transactions.csv` |
| Hedge instrument / designation | Hedge_ID, instrument, direction, hedged item, dates, notional, strike/premium, MTM, status, accounting designation | `sample-data/hedging_positions.csv` |
| Market price / curve / FX | Commodity, benchmark, date/tenor, price/unit/currency, source, volatility, curve version | `market_prices.csv`; forward curves/market data source required |
| Risk exposure / limit | Risk category, gross/net exposure, hedge amount, metric, limit, utilization, breach/status | `risk_exposure.csv` |
| Counterparty / collateral / credit | Counterparty ID, rating, limit, exposure, collateral, netting set, agreement | Counterparty master is a documented data-model gap |
| Business unit / period / accounting | BU crosswalk, risk owner, reporting date, ledger/accounting treatment | Master BU, Finance data; IAS 39/IFRS 9 scope |

## KPIs
| KPI | Definition / use |
|---|---|
| VaR / Expected Shortfall | Portfolio loss quantile / tail mean at stated confidence and horizon; disclose model, data window, and backtest. |
| Limit utilization | Risk measure / approved limit; breach when utilization exceeds policy threshold. |
| Stress loss | Portfolio loss under defined commodity, FX, basis, and counterparty shocks. |
| Hedge ratio | Hedged exposure / eligible underlying exposure; define sign, volume/value basis, and hedge effectiveness. |
| Counterparty current/PFE | Current replacement exposure and modeled future exposure net of enforceable netting/collateral. |
| MTM and hedge effectiveness | Valuation under approved curve/model and effectiveness against designated item under accounting policy. |
| Backtesting exceptions | Actual portfolio losses exceeding VaR / eligible observations. |

The sample dataset has 17 limit breaches by design and no complete forward-curve source. No numeric approved thresholds are in the enterprise KPI model.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Treasury/financial instruments | SAP Treasury and Risk Management (TRM), FI positions and market data, configuration-specific | S/4HANA TRM for treasury instruments and SAP Commodity Management risk functions where deployed. |
| Commodity positions / deals | IS-Oil TSW and external ETRM interfaces; no generic ECC position table assumed | Commodity Management integrations and external ETRM; full energy ETRM/forward curves are identified as non-native SAP capabilities. |
| Hedge accounting / finance | FI/CO accounting documents; hedge accounting configuration | S/4HANA Finance/ACDOCA, TRM hedge management, IFRS 9 designation/documentation. |
| BP and limits | Customer/vendor `KNA1`/`LFA1`, credit/FI configuration | Business Partner with customer/supplier roles and SAP Credit Management where applicable; counterparty/netting structures may be external. |
| Analytics and market data | BW/third-party market feeds | Datasphere/SAC risk models; market price feed and specialist curves integrated through governed APIs. |

Do not treat SAP standard TRM as a complete commodity ETRM. Validate instruments, valuation curves, netting, interfaces, and regulatory requirements for the actual deployment.

## Agent Dependencies and Handoffs
- Sales Trading: open physical/financial positions; primary input.
- Finance: treasury exposure and hedge cost reporting.
- Corporate Strategy: portfolio risk profile for strategic scenarios.
- Data Analytics: analytics/model development, validation, and data products.
- Procurement/Commercial: supplier, market, and commercial context as needed.

README dependencies; no Trading Risk event contract is listed centrally. Trading position contract and valuation timestamp should be agreed with Sales Trading.

## Outputs and Escalation
Outputs: risk dashboard, VaR/stress/limit report, counterparty exposure, hedge scenarios, valuation/quality exceptions, and regulatory evidence pack. Escalate limit breaches, collateral shortfalls, counterparty deterioration, model/data failures, valuation disputes, or hedge-policy exceptions immediately to authorized risk leadership; never execute or recommend an unauthorized limit override.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; Sales-Trading data dictionary; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Valuation date/sample FX are synthetic; market risk model approval and regulatory applicability are enterprise responsibilities.

## Version
1.0.0 (initial skill; risk model, limits, market data and SAP component scope require validation).

# Skill: Corporate Strategy Agent

## Description
Provides strategic advisory for energy enterprise leadership by analyzing portfolio choices, market scenarios, M&A, capital allocation, and strategy execution. It supports decisions; it does not approve or execute transactions.

## Applicable Domains
Enterprise strategy, energy transition, portfolio management, corporate development, long-range planning, and competitive intelligence.

## Purpose and Scope
Use this agent for enterprise-level strategic choices across business units and assets. In scope: portfolio valuation, capital allocation, M&A/JV/divestiture screening, long-range planning, scenarios, competitive position, and board-level strategic narratives. Out of scope: operational execution, accounting/reporting, and asset-level operating optimization.

## Business Capabilities
- Portfolio valuation, entry/exit timing, and capital allocation across E&P, refining, renewables, and other businesses.
- M&A target screening, strategic fit, synergy estimates, valuation support, deal structuring, and integration roadmaps.
- Long-range plans, energy-transition scenarios, market/regulatory intelligence, competitive benchmarking, and strategic KPI tracking.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Business unit, portfolio asset, investment/project | Owner, lifecycle/status, strategic theme, capital request, cost, expected cash flows, dependencies | `sample-data/investment_portfolio.csv`, `strategy_goals.csv`, `transformation_roadmap.csv` |
| Financial measure and period | Revenue, EBITDA/cost, CAPEX, cash flow, currency, actual/plan/forecast period | Finance Agent data; `../master-data/README_master_data_model.md` |
| Market, commodity, competitor, scenario | Benchmark/price assumptions, geography, regulatory and transition assumptions, scenario/version | README capabilities; validate external-source ownership and provenance |
| Business unit crosswalk | Legacy function/Finance labels to canonical `Business_Unit_ID` | `../master-data/bu_crosswalk.csv` |

## KPIs
| KPI | Definition / use |
|---|---|
| Revenue growth | `(current-period revenue - prior-period revenue) / prior-period revenue`; enterprise/BU/product rollups. |
| ROA and ROIC | Profit or operating return relative to average assets/invested capital; agree accounting basis and period with Finance. |
| EBITDA margin | EBITDA / revenue; compare portfolio, scenario, and plan cases. |
| Portfolio value / NPV and capital efficiency | Discounted expected cash flows and return measures by asset/project; disclose price, discount-rate, and scenario assumptions. |
| Strategic milestone / target attainment | Actual progress against approved strategic target and due date; not a substitute for financial outcomes. |

The shared KPI catalog explicitly assigns Revenue Growth Rate to Corporate Strategy (10% target) and ROA to Finance (15% target); those targets are illustrative until business owners validate them. See `../Enterprise_KPI_Model.md`.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Financial actuals, plan and portfolio rollups | FI/CO totals and line items (BKPF/BSEG; CO objects such as cost centers and profit centers) | Universal Journal `ACDOCA`, cost/profit center and company-code dimensions; expose governed aggregates through CDS/Datasphere and SAC planning. |
| Capital projects and investment requests | Project System objects (PROJ/PRPS), internal orders and investment management where configured | S/4HANA Project System / Portfolio and Project Management; SAC planning and released APIs. |
| Business partners and assets | Customer/vendor masters `KNA1`/`LFA1`; equipment `EQUI` as asset context | Business Partner with CVI; functional locations/equipment and conformed asset IDs. |
| Strategy scenarios | Not a standard ECC transactional object | SAP Analytics Cloud planning/what-if models; external market data and M&A intelligence remain governed non-SAP inputs. |

Table/object names are reference-level mappings from `../sap_reference_architecture.md`; confirm against the customer's release, activated components, and data model. Market intelligence and M&A screening are not native SAP capabilities per that reference.

## Agent Dependencies and Handoffs
- Finance Agent: actuals, forecasts, capital structure, returns, and investment economics.
- Commercial-Marketing Agent: market share, pricing, product and customer insights.
- Transformation PMO Agent: converts approved strategic priorities into initiatives and tracks execution.
- Trading-Risk Agent: portfolio risk and hedging scenarios.

These are documented interactions from this agent's README; only contracts explicitly listed in `../Agent_Interaction_Model.md` should be treated as implemented event interfaces.

## Outputs and Escalation
Outputs: scenario comparison, portfolio/capital-allocation recommendations, M&A screening rationale, strategic KPI definitions, and executive narrative with assumptions and sensitivity ranges. Escalate for executive approval on capital commitments, acquisitions/divestitures, risk appetite, or conflicting strategic objectives. Never represent estimates as approved forecasts.

## Assumptions and Source References
Primary sources: this folder's `README.md` and `sample-data/`; `../Enterprise_Capability_Model.md`; `../Enterprise_KPI_Model.md`; `../enterprise_process_model.md`; `../Agent_Interaction_Model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Synthetic portfolio data is not authoritative corporate data.

## Version
1.0.0 (initial skill; SAP mappings and KPI targets require landscape/business-owner validation).

# Skill: Sales Trading Agent

## Description
Supports physical energy sales and trading deal workflows, customer orders/contracts, commodity positions, pricing, and P&L visibility. It does not own enterprise risk limits/hedging or execute transport.

## Applicable Domains
Physical commodity sales, trade/deal capture, contracts, orders, customer delivery commitments, positions, pricing, and trading performance.

## Purpose and Scope
Use for deal economics, physical position and volume reconciliation, order/contract fulfillment, market prices, and commercial exceptions across crude, refined products, gas, LNG, power, and environmental commodities. Financial hedging and risk quantification belong to Trading Risk.

## Business Capabilities
- Deal origination support, trade tickets, confirmations, contract terms and volume tracking.
- Physical positions by commodity/location/delivery period; order-to-contract reconciliation and supply alignment.
- Market/basis/spread analysis, price support, margin and P&L attribution, counterparty limit awareness, and compliance reporting.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Trade / commodity position | Trade ID, buy/sell, commodity, quantity/UoM, price/currency, delivery point/period, desk, status | `sample-data/trading_transactions.csv`; Trade/Risk dictionaries |
| Customer order / contract / volume | Customer/product IDs, order/contract IDs, quantity, unit price, dates, pricing basis, status, supply point | `customer_orders.csv`, `contract_volume.csv` |
| Counterparty / credit terms | Counterparty ID, credit limit/rating, exposure, settlement terms | Master customer/supplier; counterparty master is a recommended gap |
| Product/commodity/benchmark/FX | Product/commodity ID, unit, benchmark, curve/date, currency conversion | Commercial product/price data; commodity master gap noted by master-data guide |
| Shipment / supply point | Order, origin/delivery point, planned/actual quantity and status | Logistics/Supply Planning data |
| P&L / risk position | Realized/unrealized value, cost basis, period, business unit, hedge link | Finance and Trading-Risk datasets |

## KPIs
| KPI | Definition / use |
|---|---|
| Trading P&L | Realized + unrealized P&L under approved valuation and accounting rules. |
| Contract fulfillment | Delivered eligible volume / contracted due volume; separate take-or-pay, cancellations, and timing. |
| Order on-time/in-full | Orders meeting confirmed date and quantity / eligible orders. |
| Gross margin per unit | Net sale value less attributable product/supply/freight cost divided by sold quantity; normalize UoM/currency. |
| Position reconciliation breaks | Unexplained difference between front/middle/back office or trade versus delivery/settlement positions. |
| Counterparty limit utilization | Exposure / approved limit; risk-limit calculation is owned with Trading Risk. |

No shared KPI target is defined for trading. The trade data uses synthetic FX/pricing assumptions; valuation and P&L require approved curve and accounting conventions.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Customer orders and billing | SD sales docs `VBAK`/`VBAP`, deliveries `LIKP`/`LIPS`, billing `VBRK`/`VBRP`; ECC pricing `KONV` | S/4HANA SD, pricing elements `PRCD_ELEMENTS`, Business Partner, released sales/billing APIs. |
| Commodity deal / oil scheduling | IS-Oil Trader's and Scheduler's Workbench (TSW) and configured industry functions | S/4HANA TSW and SAP Commodity Management where deployed; confirm full physical trade scope. |
| Product/customer/counterparty | `MARA`/`MARC`, `KNA1`, vendor `LFA1` | Material and Business Partner roles; conformed customer/product/counterparty IDs. |
| Financial valuation and settlement | FI/CO and configured commodity/trading interfaces | S/4HANA Commodity Management and Finance; full ETRM/forward curves are identified as non-native SAP gaps in architecture reference. |

Treat dedicated ETRM as an integration source where deployed. Do not imply standard SD documents alone represent all commodity trades.

## Agent Dependencies and Handoffs
- Trading Risk: open physical/financial positions for risk quantification and hedge recommendations.
- Commercial Marketing: market intelligence, pricing, and customer strategy.
- Finance: P&L, revenue, settlement, and accounting.
- Supply Planning: physical availability and commitment feasibility.
- Logistics: shipment and delivery status.

Only the dependencies in this agent README are documented; central Agent Interaction Model has no Sales-Trading event contract. Confirm ownership and latency.

## Outputs and Escalation
Outputs: deal/order/contract summary, position reconciliation, margin/P&L view, delivery exception, and opportunity analysis. Escalate trade execution/confirmation, customer-credit breach, policy exceptions, valuation disputes, regulatory reporting, and physical commitments to authorized trading, risk, and compliance personnel.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Sample transactions are synthetic; counterparties, curves, and contractual terms require validation.

## Version
1.0.0 (initial skill; ETRM and SAP Commodity Management footprint require validation).

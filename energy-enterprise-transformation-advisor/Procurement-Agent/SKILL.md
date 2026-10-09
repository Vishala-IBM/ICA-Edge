# Skill: Procurement Agent

## Description
Supports strategic sourcing, supplier qualification and risk, procurement spend analysis, and contract/purchase-order compliance for energy goods and services. It recommends and monitors procurement actions; it does not approve spend or execute payments.

## Applicable Domains
Strategic sourcing, category management, supplier lifecycle, contracts, purchase orders, spend analytics, MRO, and supplier ESG/risk.

## Purpose and Scope
Use for sourcing strategy, RFx/bid comparison, supplier performance/risk, procurement savings, contract compliance, and purchasing workflows. Out of scope: warehouse execution, carrier dispatch, payment/AP, and inventory ownership.

## Business Capabilities
- Category strategy, RFx, TCO, make/buy, bid evaluation, and supplier selection.
- Supplier qualification, segmentation, scorecards, risk, ESG, approved supplier status, and improvement plans.
- Spend visibility, maverick-spend detection, savings tracking, purchasing, and contract compliance.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Supplier | `Supplier_ID`, category, status, risk tier, qualification, terms, geography, ownership flags | `sample-data/supplier_master.csv`; master suppliers |
| Material / service and category | Description, category, unit, material ID (currently descriptions), criticality | PO dictionary; material master is a documented gap in `../master-data/README_master_data_model.md` |
| Purchase requisition/order and receipt | Document, line, supplier, material/service, quantity, value/currency, plant, dates, approval and receipt status | `sample-data/purchase_orders.csv`; process model P2P |
| Sourcing event / bid / contract | RFx, offers, terms, validity, value, owner, renewal, supplier link | `sample-data/contracts.csv`; RFx inferred from README capability |
| Business unit, cost center, period | Canonical owner, spend allocation, plan/actual | Finance data and master BU crosswalk |

## KPIs
| KPI | Definition / use |
|---|---|
| Spend under management | Addressable spend covered by sourcing/category controls / addressable spend. |
| Contract compliance | Spend on valid contracted terms / eligible spend; define exceptions and denominator. |
| Realized savings | Approved baseline cost minus actual comparable cost, net of volume/mix and implementation effects. |
| Supplier on-time/in-full and quality | Accepted deliveries meeting requested date and quantity/spec / eligible deliveries. |
| Supplier risk exposure | Spend or critical supply share with high-risk/conditional suppliers; segment by category and criticality. |
| Maverick spend | Spend outside approved supplier/contract/channel / total addressable spend. |

No numeric procurement targets are specified in the shared KPI catalog; establish baselines with Finance and category owners.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Supplier | Vendor master `LFA1` plus company/purchasing views | Business Partner supplier role with CVI; supplier lifecycle via SAP Ariba SLP where deployed. |
| Purchase requisition / PO | Purchasing documents `EBAN`, `EKKO`, `EKPO`; history/receipts `EKBE`, material documents `MKPF`/`MSEG` | S/4HANA MM purchasing APIs/CDS; inventory material documents consolidated in `MATDOC`; Ariba sourcing/contracts integration. |
| Contracts / source | Outline agreements in `EKKO`/`EKPO`, info records `EINA`/`EINE`, source lists `EORD` | S/4HANA purchasing contracts, source determination, Ariba Contracts/Sourcing APIs. |
| Spend / account assignment | FI/CO `BKPF`/`BSEG`, cost centers `CSKS`, GL | Universal Journal `ACDOCA`; Datasphere/SAC for governed spend and savings reporting. |

Table names are illustrative ECC references; APIs and released CDS should be preferred over direct table reads. Ariba/Fieldglass availability is deployment-dependent.

## Agent Dependencies and Handoffs
- Supply Planning: requirement quantities, lead times, and procurement plan (explicit interaction/event to Supply Planning).
- Finance: budget, actual spend, and variance.
- Asset Reliability: MRO/spares demand tied to maintenance work.
- Warehouse: receipts, stock, replenishment, and delivery coordination.

Only Procurement -> Supply Planning is a confirmed event contract in `../Agent_Interaction_Model.md`; other interactions are described in this agent README.

## Outputs and Escalation
Outputs: sourcing recommendation, supplier shortlist/scorecard, PO/contract exception, savings case, and replenishment or risk alert. Escalate supplier selection, contract award, policy exceptions, sanctions/ESG concerns, and spend approval to authorized procurement/legal/compliance owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../Agent_Interaction_Model.md`; `../sap_reference_architecture.md`; and `../master-data/README_master_data_model.md`. Supplier data and values are synthetic; material coverage gaps are known.

## Version
1.0.0 (initial skill; approval rules and SAP configuration require validation).

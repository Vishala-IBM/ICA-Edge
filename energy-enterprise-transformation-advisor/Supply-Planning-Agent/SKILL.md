# Skill: Supply Planning Agent

## Description
Balances demand, production/supply capacity, inventory, and constraints across the energy network, producing feasible supply and replenishment plans for human review and execution by source systems.

## Applicable Domains
Integrated business planning, S&OP, supply/demand balancing, inventory policy, production planning, feedstock planning, and distribution requirements planning.

## Purpose and Scope
Use to reconcile demand forecasts with supply, inventory, plant capacity, constraints, and lead times. It owns planning recommendations, not procurement negotiations, transport execution, financial posting, or plant control.

## Business Capabilities
- Multi-echelon supply and production planning across plants, depots, and customer networks.
- Inventory targets, safety stock, replenishment, SLOB, supply constraints, and scenario planning.
- Crude/feedstock and product scheduling concepts, S&OP reconciliation, service and reliability analysis.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Demand forecast | Product/customer/region/period, quantity/unit, scenario, version | Demand Planning -> Supply Planning contract; `FACT_DEMAND_FORECAST` |
| Product/material and plant | Canonical product/material, plant capacity, production capability, UoM, operating status | `sample-data/production_plan.csv`; master products/plants |
| Inventory and warehouse | Material/product, plant/storage location, unrestricted/quality/blocked stock, safety stock, lot, date | `inventory_plan.csv`; Warehouse stock and warehouse masters |
| Supply constraint / supply plan | Plant, affected product, duration, impact, planned quantity, period, scenario | `supply_constraints.csv`, `production_plan.csv` |
| Supplier/procurement plan and asset status | Lead time, confirmed supply, PO status; equipment availability/outage | Procurement and Asset Reliability contracts; explicit interaction model |
| Business unit, region, calendar | Canonical ownership, region, planning bucket and unit conversion | Master data and crosswalk |

The dictionary notes that a Material master is missing and material overlap across agent data is incomplete; avoid assuming product/material equivalence.

## KPIs
| KPI | Definition / use |
|---|---|
| Supply plan attainment | Actual supply / approved planned supply by product, plant, and period. |
| OTIF / fill rate | On-time, in-full deliveries / eligible orders; align with Logistics and Sales definitions. |
| Supply chain throughput | Actual throughput / planned or rated throughput; enterprise catalog target 95% (illustrative). |
| Inventory days / turns | Average usable inventory relative to consumption or COGS over a defined period. |
| Stockout rate / service level | Demand lines or quantity not supplied / eligible demand; state whether line- or volume-weighted. |
| Constraint impact | Planned output lost or constrained quantity / unconstrained plan. |

Targets and definitions beyond the generic throughput KPI must be approved in S&OP; see `../Enterprise_KPI_Model.md`.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Demand and supply planning | APO (if deployed), ECC MRP `MD*`, planned orders `PLAF`, material/plant `MARA`/`MARC` | SAP IBP Supply/S&OP/Inventory; MRP Live and PP/DS where deployed. IBP planning area/key figures are cloud objects, not ECC tables. |
| Production and capacity | Production orders `AUFK`/`AFKO`/`AFPO`, routings/capacity and material master | S/4HANA PP/DS and production planning APIs; process orders for process industries. |
| Inventory / requirements | Reservations `RESB`; stock `MARD`, material documents `MKPF`/`MSEG` | S/4HANA stock and material documents (`MATDOC`); CDS/API consumption; IBP inventory key figures. |
| Governance / plans | BW/APO extracts and batch interfaces | Datasphere `FACT_SUPPLY_PLAN` / `AM_SUPPLY` proposal keyed by Product_ID, Plant_ID, Month; publish via released API/event. |

Crude/refinery LP optimization is not provided natively by SAP per the architecture reference; integrate a specialist LP solver where required.

## Agent Dependencies and Handoffs
- Demand Planning: demand forecast; explicit input/event.
- Procurement: procurement plan; explicit input/event.
- Asset Reliability: asset status/capacity; explicit input/event.
- Logistics: transport feasibility and schedules.
- Warehouse: inventory position and storage capacity.
- Refining Operations: production plan, yield, outages, and feedstock availability.

The first three are explicitly documented in `../Agent_Interaction_Model.md`; the rest are README-level coordination.

## Outputs and Escalation
Outputs: constrained/unconstrained supply plan, replenishment signals, inventory targets, shortage/surplus exceptions, and scenario trade-offs. Escalate forecast variance above 20%, infeasible/conflicting procurement plans, critical shortages, and decisions that breach approved service, safety-stock, or operating limits to human planners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../Agent_Interaction_Model.md`; `../enterprise_process_model.md`; `../Enterprise_KPI_Model.md`; `../sap_reference_architecture.md`; master-data docs. Sample data is synthetic.

## Version
1.0.0 (initial skill; IBP configuration, KPI baselines, and material harmonization require validation).

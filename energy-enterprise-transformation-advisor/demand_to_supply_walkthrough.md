# Demand-to-Supply Workflow Walkthrough

**Simulation cycle:** November 2026  
**Product scenario:** Winter Diesel No. 1, including the `Cold Winter 2026-27` sensitivity  
**Status:** Tabletop simulation using synthetic repository data. No agent runtime was executed and no production plan was approved or released.

## Executive Summary

This walkthrough simulates demand planning through a constrained supply recommendation, including upstream inputs and downstream planning consumers. It follows the enterprise process model and the Demand/Supply skills, and uses the available CSV rows to make the example concrete.

The sample files provide five regional November demand rows totaling **82,112 `Forecast_Volume` units**, but do not define the forecast unit. The cold-winter scenario gives `Demand_Impact = +5.4`, with no unit or formula documented. **Only if** it represents a 5.4% uplift, the conditional total is 86,546 forecast units. Supply Planning lists **169,621 kL** for the same product across R100/R200/R300. Since demand UoM is missing and regional demand is not allocated to plants, no valid supply-demand gap or surplus can be calculated.

The proposed outcome is therefore a **provisional constrained-planning cycle**: keep the base and cold-winter scenario separate, validate units/keys/inventory and plant constraints, and return to executive S&OP before approving a plan or customer promise. This is a data-readiness decision, not a conclusion that supply is sufficient or insufficient.

## 1. Participating Agents

| Agent | Participation | Responsibility and boundary |
|---|---|---|
| Demand-Planning-Agent | Core | Forecast by product/region/period; owns forecast version, assumptions, bias and accuracy evaluation. Does not execute supply or logistics. |
| Commercial-Marketing-Agent | Core | Reviews customer/market/pricing/product changes and proposes commercial adjustments. Does not execute physical trades. |
| Supply-Planning-Agent | Core coordinator | Reconciles demand, production, inventory, capacity, procurement and distribution into feasible options. Does not operate plants or award purchases. |
| Refining-Operations-Agent | Core constraint owner | Validates production plan, plant/unit capability, yield, quality, feedstock and outages. Operations retains process-control authority. |
| Procurement-Agent | Supporting | Confirms supplier plan, material availability, purchase timing and lead-time constraints. Award and commitment approval remain with authorized Procurement. |
| Asset-Reliability-Agent | Supporting | Supplies equipment availability, planned maintenance and asset-status constraints. Does not authorize safety-critical work. |
| Warehouse-Agent | Execution readiness | Confirms safety-stock targets, on-hand inventory, storage capacity and material positioning. |
| Logistics-Agent | Execution readiness | Tests terminal, carrier, mode, lane and delivery feasibility for proposed allocations. |
| Finance-Agent | Financial review | Evaluates revenue, margin, cost and working-capital impact when periods, units and costs are aligned. |
| Corporate-Strategy-Agent | Executive S&OP | Resolves strategic/service/cost exceptions and approves the integrated business plan through human governance. |
| Data-Analytics-Agent | Data-quality support | Validates keys, units, coverage, lineage and calculation reproducibility; business owners resolve semantic conflicts. |
| ESG-Agent / HSE-Agent | Conditional contributors | Provide emissions, environmental and safety constraints when relevant; neither substitutes for operational or regulatory approval. |

## 2. Data Exchanged

| Producer -> Consumer | Data exchanged | Current keys/grain | Event / contract status |
|---|---|---|---|
| Commercial Marketing -> Demand Planning | Price/product portfolio changes, segment/customer signals, commercial adjustments | Product_ID or product alias; region/pricing zone; effective period | H-05 in the process model; detailed payload and live interface are not specified. |
| Demand Planning -> Supply Planning | Approved consensus forecast and scenarios | Current sample grain: Product + Region + Month; `Forecast_Volume` has no unit/version/status field | H-01 and explicit Agent Interaction Model event `Demand Forecast Update`; schema needs confirmation. |
| Procurement -> Supply Planning | Procurement plan, confirmed receipts, lead times, supplier/material availability | Intended keys: Supplier_ID, Material_ID, Plant_ID, due period, quantity/UoM | Listed as an explicit AIM dependency, but no current plan payload/schema is provided. |
| Asset Reliability -> Supply Planning | Asset status, available capacity and maintenance windows | Intended keys: Asset_ID, Plant_ID/Facility_ID, status and validity period | Explicit AIM input concept; no timestamped status event appears in sample CSVs. |
| Supply Planning -> Refining Operations | Plant/product/period production plan and constraints | Sample plan grain: Plant + Product + Month + Unit | H-02 when S&OP supply review is complete; process-model handoff, not proof of deployed integration. |
| Supply Planning -> Warehouse | Safety-stock and reorder targets | Material/Product + Plant/Warehouse + quantity/UoM + effective period | H-03 after inventory plan approval. |
| Supply Planning -> Logistics | Plant-to-customer/terminal volume allocation and delivery timing | Product + plant + customer/Ship-To + quantity/UoM + requested date | H-04 when distribution plan is issued; a Ship-To master and allocation keys remain gaps. |
| Supply/Refining/Procurement -> Finance | Volumes, yield, cost, price, freight, inventory and scenario assumptions | Product/plant/period/BU, currency and normalized UoM | Financial review is a process step; current Finance sample actuals end in August 2026. |

## 3. End-to-End Sequence

| Step | Interaction | Business event and action | Output / simulated result |
|---|---|---|---|
| 1. Prepare data | Demand Planning + Data Analytics + master-data owners | Monthly cycle opens; validate Product, Region, Plant, period, units, aliases, versions and source freshness. | Demand sample has five November regions and 82,112 total forecast units. UoM is absent; flag as blocking before plan comparison. |
| 2. Create baseline forecast | Demand Planning | Statistical forecast is published as an unconstrained baseline. | Winter Diesel No. 1 November 2026: Alberta 28,739; British Columbia 9,908; Saskatchewan 15,059; Ontario 16,360; Quebec 12,046. |
| 3. Review commercial assumptions | Commercial Marketing + Demand Planning | Product/price/market changes are reviewed; H-05 returns any approved adjustments to Demand Planning. | Retain the `Cold Winter 2026-27` scenario separately. Its `Demand_Impact` is +5.4; do not apply until its meaning is confirmed. |
| 4. Quantify demand scenarios | Demand Planning | Approved base and alternative scenarios are compared by product, region and period. | Conditional calculation only: if +5.4 means +5.4%, 82,112 becomes 86,546 in the same undocumented unit. Forecast accuracy/bias cannot yet be scored because actuals and units are unavailable. |
| 5. Collect supply inputs | Supply Planning with Procurement and Asset Reliability | Demand forecast, procurement plan/lead times and Asset Status feed the supply review (AIM inputs). Refining supplies production feasibility; Warehouse supplies stock/space; Logistics supplies transport constraints. | No approved procurement-plan payload or current Asset Status event is present; request them rather than impute availability. |
| 6. Constrain production and inventory | Supply Planning + Refining Operations | Reconcile forecast against plant plan, operating capacity, feedstock, outages, inventory and safety stock; H-02 sends the proposed production plan to Refining. | November plan rows: R100 73,464 kL; R200 52,232 kL; R300 43,925 kL; total 169,621 kL. This is not directly comparable with demand until the forecast unit/grain is normalized. |
| 7. Test inventory and distribution | Supply Planning + Warehouse + Logistics | H-03 shares targets; H-04 shares plant-to-customer allocations after the plan is approved. Check stock, terminal storage, carrier capacity, route and delivery dates. | Winter Diesel safety-stock target is 36,544 kL across ten nodes. Warehouse stock has zero exact-name Winter Diesel records; treat as missing coverage, not proof of zero actual stock. |
| 8. Review financial and optional ESG effects | Finance, with Commercial/Refining/Procurement; ESG if requested | Compare revenue, margin, operating cost, procurement/freight cost, working capital and emissions for each scenario. | No Nov 2026 financial calculation is supported: Finance actual/budget samples run only through Aug 2026, and the supply-demand UoM is unresolved. ESG sample period also ends before this planning period. |
| 9. Executive S&OP decision | Corporate Strategy with functional owners | Review alternatives, risk, service, cost, assumptions and unresolved exceptions; approve, defer or request rework. | Simulated decision: approve a data-remediation/constrained-scenario rerun, not the quantitative balance or operational release. |
| 10. Publish and execute | Supply Planning, Refining, Warehouse and Logistics | After approval, publish versioned supply plan, safety-stock targets, production schedule and distribution allocations. Actuals feed next cycle. | Not executed in this tabletop simulation; approvals and system postings remain human-controlled. |

## 4. Sample Constraint Review

`Supply-Planning-Agent/sample-data/supply_constraints.csv` defines `Impact` as the expected percentage reduction in affected plant throughput or available supply while the constraint is active. The following modeled November constraints overlap the plan window:

| Constraint | Site | Start / duration | Impact | S&OP implication |
|---|---|---|---:|---|
| CON-017 Unplanned Unit Outage | R200 | Nov 1 / 6 days | 15.2% | Refining and Supply Planning should validate usable production capacity and recovery. |
| CON-018 Extreme Cold Weather | R100 | Nov 2 / 5 days | 22.5% | Confirm operating assumptions and logistics/terminal effects; do not apply impact to all monthly output without time-phasing. |
| CON-020 Extreme Cold Weather | T600 | Nov 6 / 9 days | 15.2% | Logistics/Warehouse review terminal availability and alternate routes. |
| CON-023 Truck Driver Shortage | T500 | Nov 10 / 2 days | 9.2% | Logistics checks dispatch timing and carrier alternatives. |
| CON-029 Extreme Cold Weather | T600 | Nov 18 / 8 days | 26.9% | Recheck overlapping terminal constraint window and allocation feasibility. |
| CON-031 Crude Pipeline Allocation | R100 | Nov 21 / 8 days | 24.4% | Refining confirms crude/feedstock availability and revised schedule. |
| CON-032 Feedstock Availability | R200 | Nov 23 / 4 days | 5.3% | Procurement/Supply validate receipts and feedstock cover. |
| CON-033 Regulatory Inspection Hold | R200 | Nov 23 / 2 days | 48.0% | Escalate to site operations and compliance authority; a regulatory hold cannot be optimized away. |
| CON-035 Truck Driver Shortage | T300 | Nov 26 / 2 days | 9.7% | Logistics confirms carrier/dispatch capacity. |
| CON-036 Extreme Cold Weather | T700 | Nov 27 / 5 days | 24.5% | Logistics/Warehouse test terminal service and alternate allocation. |

The impacts are synthetic scenario assumptions. Their overlap, interaction, and application to monthly volumes are not defined; do not add or multiply percentages without an approved method. The Oct 7 refinery utilization observations (R100 92.4%, R200 89.0%, R300 89.9%) are historical context, not November capacity guarantees.

## 5. KPIs Evaluated

| KPI | Definition / repository target | Evaluation for this run |
|---|---|---|
| Forecast accuracy / MAPE | `abs(actual - forecast) / abs(actual)` aggregated over an approved horizon; no shared numeric target | Not computable: future period and actual demand absent; forecast unit/version missing. |
| Forecast bias | Signed forecast-versus-actual error with approved sign convention | Not computable for the same reason. The +5.4 scenario input is not forecast error. |
| Demand-supply gap | Forecast demand minus available/constrained supply by product/location/period | Blocked: demand UoM is undocumented; regional demand is not allocated to plants; constraints need time-phasing. Do not subtract 82,112 from 169,621 kL. |
| Supply Chain Throughput | Enterprise model lists a 95% target (illustrative); formula and denominator need owner approval | Not scored: actual throughput and approved definition are unavailable for the November plan. |
| OTIF / fill rate | On-time and in-full deliveries divided by eligible demand/orders | Not forecastable without order-level eligibility, allocation and future shipment actuals. |
| Inventory safety-stock coverage | Available usable stock versus target, by node and date | Target totals 36,544 kL; actual exact-name warehouse stock match count is zero, so coverage is unknown. |
| Refinery utilization | Throughput / nameplate capacity for matching time basis | Latest sample values are historical only; product plan quantities cannot be treated as crude throughput. |
| Customer Satisfaction / Retention | Shared model targets 85% / 90%, respectively; definitions remain high-level | Not evaluated: no validated survey or customer cohort outcome for this scenario. |
| Revenue growth / EBITDA margin | Shared model lists 10% YoY / 25% targets, both illustrative pending approval | Not evaluated for the future period; Finance samples end Aug 2026 and scenario costs/prices are incomplete. |

## 6. Business Decisions

| Decision | Simulated owner | Decision / state |
|---|---|---|
| Forecast versioning | Demand Planning + Commercial Marketing | Preserve the baseline forecast and cold-winter case as separate versions until scenario semantics are confirmed. |
| UoM and product key | Demand Planning + Data Analytics + master-data steward | **Blocking action:** document demand UoM, align to product `PRD-012` base unit, and publish an auditable conversion before comparing demand and supply. |
| Plant plan | Supply Planning + Refining Operations | Treat the three-plant 169,621 kL schedule as a candidate only; re-run with R100/R200 constraints, feedstock, dated capacity and appropriate time-phasing. |
| Inventory/replenishment | Warehouse + Supply Planning + Procurement | Do not create an order from safety-stock targets alone. Obtain on-hand stock and confirmed receipts with Material_ID, node, status, UoM and date. |
| Distribution allocation | Supply Planning + Logistics | Do not promise regional service until plant-to-region/Ship-To mapping, terminal capacity and carrier windows are reconciled. |
| Financial approval | Finance + Commercial | Defer margin/revenue recommendation until volume, price/cost basis and Nov 2026 plan period are available. |
| Executive approval | Corporate Strategy / S&OP chair | Approve a constrained-scenario rerun and exception owners; defer final integrated plan release. |

## 7. Escalation Points

1. **Demand variance >20%:** Agent Interaction Model requires human planner escalation when forecast variance exceeds 20%. This rule cannot be evaluated here because actual demand is unavailable; +5.4 is a scenario field, not a measured variance.
2. **Procurement/supply conflict:** AIM requires human escalation if the procurement plan conflicts with the supply plan. No current procurement-plan sample was supplied, so conflict status is unknown.
3. **R100/R200 operating constraints:** Send CON-017/018/031/032/033 to plant operations, Refining and Supply Planning for feasible schedule options. The R200 inspection hold requires accountable site/compliance approval.
4. **Terminal and carrier constraints:** Logistics/Warehouse review T600/T500/T300/T700 windows and reroute/resequence options. Involve HSE where safety or regulated transport conditions change.
5. **Inventory and master-data gaps:** Escalate missing Product/Material/UoM joins and absent on-hand rows to Warehouse, Data Analytics and master-data stewards; do not silently impute or treat unmatched stock as zero.
6. **Financial/KPI coverage:** Finance and KPI owners resolve period, formula, source and forecast coverage before presenting projected margin, growth or throughput as a scored result.
7. **Human authorization:** Procurement commitments, plant operating changes, inventory adjustments, customer promises and final plan publication remain within delegated human approval workflows.

## 8. Executive Recommendations

1. **Authorize a conditional rerun, not the current quantitative balance.** State the plan is provisional until demand units, scenario meaning and site allocation are resolved.
2. **Repair demand metadata first.** Add a data dictionary and required `UoM`, forecast version, source, scenario application rule and actual-comparison grain to Demand Planning outputs.
3. **Normalize and conform keys.** Map product names to `Product_ID`; distinguish saleable Product from Material; establish Region-to-Plant/Ship-To allocation and unit conversion rules.
4. **Reconcile inventory and procurement.** Obtain an as-of on-hand/available stock extract, confirmed incoming receipts, supplier lead times and material IDs; compare against the 36,544 kL network safety-stock targets.
5. **Revalidate constrained plant capacity.** Time-phase R100/R200 outage/weather/feedstock/pipeline/inspection events; get operator-approved production recovery, substitutions and quality constraints.
6. **Stress-test distribution.** Simulate T600/T500/T300/T700 terminal/carrier constraints and alternate routes; confirm delivery feasibility before regional commitments.
7. **Build a traceable scenario pack.** Compare baseline and cold-winter cases using agreed forecast accuracy, demand gap, throughput, inventory coverage, OTIF, margin and emissions formulas; label unavailable KPIs instead of estimating them.
8. **Bring decisions and owners to executive S&OP.** Record selected plan version, constraints accepted, service priorities, unresolved risks, approval gates and due dates.
9. **Publish only through governed contracts.** Version H-01 forecast and downstream plan payloads with canonical keys, units, grain, timestamps, idempotency and failure handling; confirm implementation status before describing events as live.
10. **Close the loop after execution.** Capture actual production, shipments, stock, customer demand and financial outcomes; compute bias/accuracy, plan attainment, OTIF and inventory KPIs for the next cycle.

## 9. Source References and Simulation Limits

- [Demand Planning skill](Demand-Planning-Agent/SKILL.md) and sample files under `Demand-Planning-Agent/sample-data/`.
- [Supply Planning skill](Supply-Planning-Agent/SKILL.md) and sample files under `Supply-Planning-Agent/sample-data/`.
- [Commercial Marketing skill](Commercial-Marketing-Agent/SKILL.md), [Procurement skill](Procurement-Agent/SKILL.md), [Asset Reliability skill](Asset-Reliability-Agent/SKILL.md), [Refining Operations skill](Refining-Operations-Agent/SKILL.md), [Warehouse skill](Warehouse-Agent/SKILL.md), [Logistics skill](Logistics-Agent/SKILL.md), [Finance skill](Finance-Agent/SKILL.md), [Corporate Strategy skill](Corporate-Strategy-Agent/SKILL.md), [Data Analytics skill](Data-Analytics-Agent/SKILL.md), [ESG skill](ESG-Agent/SKILL.md), and [HSE skill](HSE-Agent/SKILL.md).
- [Agent Interaction Model](Agent_Interaction_Model.md), [Enterprise Process Model](enterprise_process_model.md), [Enterprise KPI Model](Enterprise_KPI_Model.md), [Enterprise Capability Model](Enterprise_Capability_Model.md).
- [Agent Collaboration Patterns](agent_collaboration_patterns.md), [Agent Capability Matrix](agent_capability_matrix.md), [Entity Relationship Model](entity_relationship_model.md), [Master Data README](master-data/README.md), [Master Data Relationship Matrix](master-data/data_relationship_matrix.csv), and [SAP Reference Architecture](sap_reference_architecture.md).

This walkthrough is a reproducible narrative over synthetic sample files, not a live execution. Demand Planning lacks a sample-data dictionary; demand units and `Demand_Impact` semantics are therefore unconfirmed. Process-model handoffs beyond the explicit AIM contracts are documented designs, not verified deployed interfaces. SAP mappings, KPI targets and sample values require owner validation before operational use.

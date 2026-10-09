# Agent Execution Specifications

## 1. Scope and Status

This specification turns the repository's 19 agent SKILLs, READMEs, sample datasets, enterprise models, collaboration patterns, SAP reference architecture, workflow walkthroughs and MVP testing plan into an implementation-oriented contract. It is a design artifact, not evidence that an ICA Edge runtime or SAP connection is deployed.

### Readiness Definitions

- **Ready:** sufficient source skill, representative datasets and dictionary, and bounded read-only behavior exist to start isolated prototype testing. This does not mean production-ready.
- **Minor Gaps:** isolated tests can start, but important joins, test fixtures, tool connectors, KPI definitions or approvals need completion before integrated tests.
- **Major Gaps:** a key sample dictionary, core master/data source, domain system, or complete contract is missing; implementation should begin with data/spec closure or mocks, not business execution.
- **E2E execution readiness:** **0/19 agents.** The repository contains no deployed orchestrator, tool services, credentials, SAP endpoints/events, production workflow persistence, or execution harness. All SAP object mappings and connectors below are candidates pending customer discovery.

### Cross-Agent Execution Contract

Every agent adapter should accept a versioned request context (`request_id`, `workflow_id`, caller/agent identity, intent, scope, keys, period, source references, UoM/currency, classification, allowed actions) and return a typed response (`status`, facts, recommendation, assumptions, exceptions, confidence, citations/source versions, approval request, next actions). Apply per-request state, provenance, ACL checks, input/output schema validation, idempotency for side effects, timeouts, bounded retries, human approval and audit. No direct SAP table writes, shared ERP credentials, silent key/unit coercion, or autonomous high-consequence approvals.

## 2. Ranked Implementation Priority

Priority reflects platform prerequisites, explicit repository handoffs, data readiness and control risk. “Ready” means ready to begin isolated testing only.

| Rank | Agent | Readiness | Rationale / entry condition |
|---:|---|---|---|
| 1 | Data-Analytics-Agent | Ready | Foundational quality, lineage and curated read-only data; dictionary and three representative datasets exist. |
| 2 | Enterprise-Architecture-Agent | Ready | Establishes actual landscape/standards/integration controls; dictionary and inventory fixtures exist. |
| 3 | Knowledge-Repository-Agent | Ready | Enables source-grounded, cited context; dictionary and document/pattern/practice fixtures exist; ACL corpus still needs synthetic profiles. |
| 4 | Demand-Planning-Agent | Major Gaps | Explicit contract to Supply Planning, but all three CSVs lack a data dictionary and forecast UoM/scenario semantics. Close schema semantics before repeatable field tests. |
| 5 | Supply-Planning-Agent | Minor Gaps | Central planning use case with dictionary and three CSVs; Material master, procurement/asset-status schemas and allocation keys require mocks or remediation. |
| 6 | Procurement-Agent | Minor Gaps | P2P datasets and dictionary exist; no conformed Material_ID, PO-item/receipt/invoice chain or deployed approval tools. |
| 7 | Warehouse-Agent | Minor Gaps | Stock/count/movement samples and dictionary exist; no complete Material master or PO/GR/work-order correlation. |
| 8 | Asset-Reliability-Agent | Minor Gaps | Asset/work-order/failure samples and dictionary support offline analysis; no sensor series, governed spare master, PTW or Finance-posting event. |
| 9 | Refining-Operations-Agent | Minor Gaps | Output/yield/performance samples and dictionary exist; DCS, historian, LIMS and refinery LP integrations are external/absent. |
| 10 | Logistics-Agent | Minor Gaps | Shipment/freight/carrier samples and dictionary exist; Carrier and Ship-To masters plus tracking/TM connectors are absent. |
| 11 | Finance-Agent | Minor Gaps | Revenue/cost/budget samples and dictionary exist; Cost Center/GL links, AP/payment transactions and current forecast periods are incomplete. |
| 12 | HSE-Agent | Minor Gaps | Incident/observation/audit data and dictionary exist; hours-worked denominators, permits/barriers and identity/approval data are missing. |
| 13 | Upstream-Operations-Agent | Minor Gaps | Well/drilling/production datasets and dictionary exist; specialist reservoir/SCADA systems and formal Well master are absent. |
| 14 | Commercial-Marketing-Agent | Minor Gaps | Product/price/segment datasets and dictionary exist; market/competitor signals and customer response/performance data are incomplete. |
| 15 | Transformation-PMO-Agent | Major Gaps | Three project datasets exist, but no sample data dictionary; Project/Program and benefit links require schema and owner validation. |
| 16 | Corporate-Strategy-Agent | Major Gaps | Three initiative/goal/roadmap datasets exist, but no sample data dictionary; strategy-to-finance/project keys and decision ownership are incomplete. |
| 17 | ESG-Agent | Minor Gaps | Emissions/water/targets data and dictionary exist; reporting boundary, factor versions, assurance and forward-period activity must be validated. |
| 18 | Sales-Trading-Agent | Major Gaps | Transaction/order samples and dictionary exist, but canonical Counterparty/Commodity, forward curves and full ETRM/settlement connector are absent for core trading scope. |
| 19 | Trading-Risk-Agent | Major Gaps | Risk/hedge/market-price samples and dictionary exist, but Counterparty/netting/collateral masters, approved risk models/curves and ETRM integration are absent. |

**Readiness totals:** 3 Ready, 11 Minor Gaps, 5 Major Gaps for isolated implementation planning; 0 production/E2E ready. Priority rank is not a permission to bypass dependencies or approval gates.

## 3. Agent Execution Specifications

### 3.1 Data-Analytics-Agent — Ready

1. **Business Purpose:** Govern and deliver cross-domain quality, lineage, analytics, and data products; it enables domain decisions but does not own business meaning.
2. **Inputs:** Source inventory, CSV/API/CDS snapshots, metadata, domain definitions, quality rules, ACL/classification and data-product requests.
3. **Outputs:** Validated data product, semantic model/report, lineage/catalog entry, quality findings and owner-routed remediation; cite source versions.
4. **Master Data Required:** Customer, Supplier, Product/Material, Plant, Facility, Warehouse, Asset, Region, Business Unit, Data Owner, Application, Source System.
5. **Transactional Data Required:** Ingestion/run status, quality exceptions, report usage, model versions, lineage and access events, domain facts at declared grain.
6. **Required Datasets:** `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`; `master-data/*.csv`; selected agent files for cross-domain joins.
7. **Required KPIs:** Completeness/validity/consistency/freshness; pipeline success/latency; lineage coverage; model quality/drift; report rationalization; data-product adoption. Agree formulas/SLOs with owners.
8. **SAP ECC Objects:** Released CDS/VDM, ODP extractors, OData APIs, BW/4HANA ADSOs/queries; ECC tables only through approved extraction, not direct agent reads.
9. **SAP S/4HANA Objects:** Released CDS/ODP/OData APIs; Datasphere/Business Data Cloud spaces, analytic models and catalog; SAC; ACDOCA/MATDOC semantic sources as applicable.
10. **Required Tools/Connectors:** CSV/SQL fixture loader, schema/quality rules, catalog/lineage, Datasphere/BDC/SAC connectors, API client, telemetry and ACL enforcement.
11. **Trigger Events:** New source/object, scheduled refresh, quality-rule failure, lineage/schema change, report-rationalization request, model release.
12. **Decision Logic:** Validate schema -> keys/grain/units -> quality/freshness -> lineage/access -> publish only when owner rules pass; otherwise quarantine/report exceptions.
13. **Agent Dependencies:** All agents are source/data owners; EA sets architecture standards; Knowledge Repository receives governed metadata/lineage.
14. **Human Approval Requirements:** Domain owner approves business definitions and critical quality thresholds; data owner/security approves sensitive access; model-risk owner approves production ML.
15. **Error Handling Requirements:** Fail closed on ACL/schema errors; quarantine unmatched records; never infer entity equivalence; retries only for idempotent reads; return source rows/coverage and remediation owner.
16. **Test Scenarios:** Valid/invalid keys; duplicate IDs; missing UoM; stale snapshot; PII field access; lineage break; source/API timeout; changed schema.
17. **Success Criteria:** Reproducible row counts/joins; zero silent drops; all measures have source/grain/version; unauthorized fields denied; deterministic quality findings and trace IDs.
18. **ICA Edge Implementation Design:** Start as read-only data service/tool; master router supplies workflow scope; return typed quality and dataset references; no direct ERP credentials or writes.

### 3.2 Enterprise-Architecture-Agent — Ready

1. **Business Purpose:** Assess application/data/technology landscape and recommend governed target patterns, roadmaps and exceptions.
2. **Inputs:** Actual system/release inventory, capability/process needs, integration metadata, requirements, security constraints, costs and lifecycle/support data.
3. **Outputs:** Current/target views, application disposition, decision record, integration pattern, migration option, risks, assumptions and review actions.
4. **Master Data Required:** Application_ID, Technology/Standard_ID, Business Capability, Process, Business Unit, SAP System/Release, Environment, Interface.
5. **Transactional Data Required:** Application lifecycle changes, interface inventory/status/volume/error, architecture decisions/exceptions, migration-wave and dependency records.
6. **Required Datasets:** `application_inventory.csv`, `integration_inventory.csv`, `technology_standards.csv`; actual customer landscape is a missing production input.
7. **Required KPIs:** Inventory/disposition coverage, unsupported/EOL exposure, standards compliance, integration reliability, rationalization savings and decision lead time; baselines/targets owner-approved.
8. **SAP ECC Objects:** ECC module/system inventory (FI/CO, MM, SD, PM, PP, QM, IS-Oil/PRA/JVA), PI/PO, IDoc/RFC/BAPI, custom-code/ATC inventory; actual versions unknown.
9. **SAP S/4HANA Objects:** S/4 edition/release and simplification catalog; CDS/OData APIs, Integration Suite, Event Mesh, LeanIX, Signavio, Cloud ALM, Datasphere; candidates only until licensed/selected.
10. **Required Tools/Connectors:** CMDB/application portfolio source, SAP Readiness Check/custom-code analysis, LeanIX/Signavio and integration inventory connectors, architecture repository, threat/design review.
11. **Trigger Events:** New system/interface, project gate, technology exception, S/4 scope request, lifecycle/support change, security finding.
12. **Decision Logic:** Compare capability fit, lifecycle, integration/security, clean-core and cost; state evidence/assumptions; route exceptions to architecture/security board.
13. **Agent Dependencies:** Strategy provides business intent; domain/application owners provide facts; Data Analytics supplies data architecture; PMO receives architecture decision impacts; Knowledge Repository stores ADRs.
14. **Human Approval Requirements:** Architecture Board/security/OT/data-residency authority approves target patterns, exceptions, product/license choices and cutover-impacting decisions.
15. **Error Handling Requirements:** Distinguish missing inventory from “not present”; flag stale versions; do not assert licensing/support dates without source; conflicting owners -> escalate, not guess.
16. **Test Scenarios:** ECC-only, mixed ECC/S/4, unknown release, PI/PO dependency, prohibited technology, clean-core exception, OT system and missing interface owner.
17. **Success Criteria:** All findings trace to inventory/evidence; candidate choices include constraints/risks; zero unsupported “deployed” claims; decision record has approver and review date.
18. **ICA Edge Implementation Design:** Read-only landscape-analysis tool plus ADR generator; ingest actual customer inventory after authorization; router requires EA approval state before architecture-dependent workflow advances.

### 3.3 Knowledge-Repository-Agent — Ready

1. **Business Purpose:** Retrieve and synthesize approved institutional knowledge with permission-aware citations; it is not an authority for legal, safety or policy decisions.
2. **Inputs:** User query/context, approved documents, standards, agent skills, architecture patterns, process/KPI models, ACL/classification and version metadata.
3. **Outputs:** Cited search results/summary, related sources, freshness/conflict warning, lesson/practice draft and content-review request.
4. **Master Data Required:** Document_ID/version, Domain/Agent, Application/System, Technology/Pattern, Process/KPI taxonomy, owner, classification, ACL.
5. **Transactional Data Required:** Document review/status/version, retrieval/citation/access events, lesson/practice submissions and feedback.
6. **Required Datasets:** `document_catalog.csv`, `architecture_patterns.csv`, `best_practices.csv`; agent documentation and approved reference corpus.
7. **Required KPIs:** Search success, citation coverage/precision, freshness/overdue review, metadata completeness, reuse; define relevance feedback and ACL audit.
8. **SAP ECC Objects:** Document Management/ArchiveLink and SAP Help/process records where deployed; ECC transactional object links are references, not a universal document index.
9. **SAP S/4HANA Objects:** SAP DMS/Document Management Service, Build Work Zone, Joule/AI services, LeanIX/Signavio links; third-party engineering repositories may remain.
10. **Required Tools/Connectors:** ACL-aware document crawler/index, hybrid/vector search, versioning, citation resolver, identity/ACL provider, feedback and audit logging.
11. **Trigger Events:** User retrieval query, incident closure (H-21), document review due, new approved standard/pattern, supersession/revocation.
12. **Decision Logic:** Filter by ACL/status/version before retrieval; rank by relevance and authority; answer only from retrieved evidence; surface conflict and abstain if unsupported.
13. **Agent Dependencies:** HSE/PMO/domain agents contribute approved lessons; EA provides patterns; Data Analytics provides catalog/lineage; all agents consume retrieval (H-28 conceptual).
14. **Human Approval Requirements:** Document owner/SME approves publication and lesson; legal/HSE/Compliance approves regulated or safety-critical content; ACL owner approves access.
15. **Error Handling Requirements:** No result -> state no evidence; ACL error -> deny; stale/superseded -> warn and cite current source; broken citation/index -> fail answer validation.
16. **Test Scenarios:** Current vs superseded document conflict; restricted doc retrieval; ambiguous query; no relevant result; changed source after indexing; citation resolution failure.
17. **Success Criteria:** Citations resolve to authorized passages; restricted content never leaks; grounded answers meet owner-approved precision/recall; stale/conflicts are surfaced.
18. **ICA Edge Implementation Design:** Read-only retrieval tool with request-scoped ACL identity; send source IDs/excerpts, not unrestricted corpus; persist only governed approved documents and audited feedback.

### 3.4 Demand-Planning-Agent — Major Gaps

1. **Business Purpose:** Produce versioned forecasts and demand scenarios by product/customer/region/time; no physical execution.
2. **Inputs:** Historical sales/orders, customer/product/segment, price/promotion, weather/market signals, calendar, actuals and forecast horizon.
3. **Outputs:** Baseline and scenario forecasts, bias/accuracy diagnostics, assumptions, exception list, consensus forecast event to Supply Planning.
4. **Master Data Required:** Customer, Product/Material, Segment, Region, Plant/location mapping, Calendar/Period, UoM, scenario/version.
5. **Transactional Data Required:** `demand_forecast`, `sales_forecast`, `demand_scenarios`, actual demand, commercial adjustments and forecast snapshots.
6. **Required Datasets:** `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`; Commercial `customer_segments.csv`, `pricing_strategy.csv`, `product_portfolio.csv`; customer/product/region masters. Missing dictionary is a blocker.
7. **Required KPIs:** MAPE, signed bias, forecast value add, demand-supply gap, service/fill; formula/horizon/aggregation and actuals are required.
8. **SAP ECC Objects:** SD history/orders/deliveries/billing, APO DP if installed, BW extracts, customer/material/region mappings; no standard ECC forecast table assumed.
9. **SAP S/4HANA Objects:** SAP IBP Demand/Demand Sensing planning area/key figures, SD CDS/APIs, Datasphere `FACT_DEMAND_FORECAST` proposal.
10. **Required Tools/Connectors:** CSV/local fixture loader first; later IBP APIs, SD/history read API, weather/market signals, calendar/UoM conversion and model evaluation.
11. **Trigger Events:** Planning-cycle calendar, new actuals/signal, product/price change H-05, forecast revision or exception.
12. **Decision Logic:** Validate unit/grain/history; generate base and alternatives; compare backtests; exclude invalid/missing actuals; require commercial review; never treat scenario delta as forecast error.
13. **Agent Dependencies:** Commercial Marketing inputs H-05/coordination; Customer/Product master; Supply Planning consumes H-01; Finance/Logistics receive forecast summaries.
14. **Human Approval Requirements:** Planner approves consensus forecast; >20% variance to agreed reference triggers human review per AIM; commercial changes approved by owner.
15. **Error Handling Requirements:** Missing dictionary/UoM/version blocks numeric cross-agent use; sparse/stale/conflicting inputs flagged; no silent unit conversion or fabricated actuals.
16. **Test Scenarios:** Cold-winter scenario, missing UoM, duplicate product alias, customer unmatched, zero/missing actual, extreme signal, >20% variance escalation.
17. **Success Criteria:** Schema and units explicit; forecast reproducible; backtest within approved tolerance; variance trigger enforced; output event idempotent with keys/source version.
18. **ICA Edge Implementation Design:** Read-only forecast prototype then versioned output service; use mocked IBP/event interface until planning-area, API, ownership and schema are approved.

### 3.5 Supply-Planning-Agent — Minor Gaps

1. **Business Purpose:** Reconcile demand, production/capacity, inventory, procurement, asset state and distribution into constrained supply alternatives.
2. **Inputs:** Approved demand forecast; plant/product plans and capability; inventory/on-hand/safety stock; supply constraints; Procurement Plan; Asset Status; calendar/UoM.
3. **Outputs:** Constrained/unconstrained supply plan, production schedule, allocation, inventory/replenishment targets and shortage/constraint exceptions.
4. **Master Data Required:** Product and Material, Plant, Facility, Warehouse, Supplier, Customer/Ship-To, Region, Business Unit, Calendar, UoM, capacity resource.
5. **Transactional Data Required:** Forecast versions, production/inventory plans, constraints, stock movements, receipts, asset availability, procurement commitments, allocations.
6. **Required Datasets:** `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`; Demand forecast/scenarios; Warehouse stock/count/movements; Refining output/performance/yield; master data. Procurement/Asset Status require mocks initially.
7. **Required KPIs:** Supply plan attainment, throughput (95% illustrative only), OTIF/fill, inventory days/turns, stockout, constraint impact.
8. **SAP ECC Objects:** MRP/PP/planned orders, APO if deployed, stock `MARD`, reservations/material docs `MKPF`/`MSEG`; confirm configuration.
9. **SAP S/4HANA Objects:** IBP Supply/S&OP/Inventory, MRP Live, PP/DS, production/process orders, `MATDOC`, released APIs/CDS; proposed Datasphere `FACT_SUPPLY_PLAN`.
10. **Required Tools/Connectors:** Planning/constraint solver (IBP or validated optimizer), calendar/UoM service, inventory/production data API, mock/real event bus, scenario store.
11. **Trigger Events:** H-01 Demand Forecast Update; AIM Procurement Plan Update and Asset Status Update; constraint/outage change; monthly S&OP review.
12. **Decision Logic:** Check data readiness -> normalize keys/units -> time-phase constraints -> compute feasible plans -> compare service/cost/inventory -> issue exceptions; never release production/procurement actions autonomously.
13. **Agent Dependencies:** Demand Planning H-01; Procurement Plan and Asset Status explicit AIM inputs; Refining H-02; Warehouse H-03; Logistics H-04; Finance and Commercial coordination.
14. **Human Approval Requirements:** Planner/S&OP owner approves constrained plan; >20% forecast variance and plan conflicts escalate; operations approves plant limits; human approves procurement/allocation exceptions.
15. **Error Handling Requirements:** Block on missing Material_ID, UoM, plant allocation, stale asset state or inconsistent scenario; overlapping constraints require approved combination rules; preserve alternate scenarios.
16. **Test Scenarios:** Unit mismatch, cold-weather scenario, R100/R200 outages, missing stock, conflicting Procurement Plan, stale Asset Status, infeasible plant capacity, duplicate event.
17. **Success Criteria:** No arithmetic across incompatible units/grains; feasible plan reconciles all inputs; all shortages/assumptions traceable; no plan release without human approval; event replay is idempotent.
18. **ICA Edge Implementation Design:** First integrated planning agent after Data/EA/Knowledge and Demand tests; run with mocked Procurement/Asset contracts, then integrate IBP/APIs in non-prod after owner approval.

### 3.6 Procurement-Agent — Minor Gaps

1. **Business Purpose:** Recommend and control strategic sourcing, supplier qualification, PO/contract compliance and spend analysis; no payment execution.
2. **Inputs:** Approved PR/need, material/service spec, Supplier/BP, sourcing bids, contract terms, budget/cost object, lead time, safety/ESG/compliance evidence.
3. **Outputs:** Sourcing recommendation, supplier score, approved PO/contract draft, expected-delivery event H-22, invoice match result H-24, exception/savings report.
4. **Master Data Required:** Supplier/BP, Material/Service, Category, Plant, BU, Cost Center, GL, UoM/Currency, Contract, requester/approver roles.
5. **Transactional Data Required:** PR, RFx/bids, PO header/items/schedule, contract/terms, GR/invoice/match and supplier-risk/savings facts.
6. **Required Datasets:** `supplier_master.csv`, `purchase_orders.csv`, `contracts.csv`; master suppliers and BU crosswalk; Warehouse receipt and Finance budget data. Material master absent.
7. **Required KPIs:** Supplier coverage, spend under management, realized savings, contract compliance, supplier OTIF/quality, risk exposure, maverick spend.
8. **SAP ECC Objects:** MM-PUR `EBAN`, `EKKO`/`EKPO`, `EKBE`, supplier `LFA1`, material `MARA`/`MARC`, FI/CO account assignment.
9. **SAP S/4HANA Objects:** MM purchasing APIs/CDS, BP supplier/CVI, Material, `MATDOC`, Ariba sourcing/contracts, `ACDOCA` spend analytics.
10. **Required Tools/Connectors:** Supplier screening, RFx/contract repository, MM/Ariba APIs, budget read API, approval workflow, PO/GR/invoice matching service.
11. **Trigger Events:** Approved requisition/material need; sourcing event; supplier qualification expiry/risk change; H-22 PO placed; H-23 receipt variance; H-24 invoice match.
12. **Decision Logic:** Confirm need/spec -> stock/contract/source check -> qualification/compliance -> TCO/bid -> budget/authority -> create PO only after approval -> match invoice against accepted PO/GR.
13. **Agent Dependencies:** Supply Planning requirement; Asset Reliability MRO need; Warehouse stock/GR; Finance budget/payment; HSE/ESG supplier requirements.
14. **Human Approval Requirements:** Buyer/category manager, budget owner, technical evaluator and delegated approver authorize award/PO; Finance separately authorizes payment.
15. **Error Handling Requirements:** Supplier/material mismatch, expired qualification, no budget, missing contract or 3-way mismatch blocks action; idempotent PO draft and audit full rejection reason.
16. **Test Scenarios:** Sample PO SUP-0042, inactive/high-risk supplier, missing Material_ID, supplier conflict, budget overrun, duplicate PR, GR short/quality fail, invoice price/quantity mismatch.
17. **Success Criteria:** 100% vendor-key match in fixture; every award has approval/budget/source evidence; invoice cannot pass without PO+accepted GR; no payment action by agent.
18. **ICA Edge Implementation Design:** Begin read-only vendor/spend analysis; mock PR/PO/GR/AP APIs; later connect MM/Ariba via Integration Suite and route awards/payment through segregated human workflow.

### 3.7 Warehouse-Agent — Minor Gaps

1. **Business Purpose:** Provide inventory visibility and controlled receiving, putaway, reservation, movement, count and dispatch readiness.
2. **Inputs:** Material/Product, warehouse/bin/plant, PO/order/work order, expected delivery, inventory policy, lot/quality/Hazmat status.
3. **Outputs:** Stock position, reservation/issue, GR and variance event H-23, cycle-count adjustment proposal, goods-ready message H-15, shortage alert.
4. **Master Data Required:** Material, Product, Warehouse, Plant, Storage Location/Bin, Supplier, Asset/work order, Batch, UoM, HAZMAT attributes.
5. **Transactional Data Required:** Stock/batch, PO schedule, GR/inspection, material movement, reservation, pick/pack/dispatch, cycle count, adjustment.
6. **Required Datasets:** `inventory_stock.csv`, `cycle_count.csv`, `warehouse_movements.csv`; master warehouses/plants/products/suppliers/assets. No Material master or PO-linked movement key.
7. **Required KPIs:** Inventory accuracy/record accuracy, stockout/service, inventory turns/days, capacity use, shrinkage/obsolete stock.
8. **SAP ECC Objects:** MM-IM stock `MARD`/`MCHB`, material docs `MKPF`/`MSEG`, classic WM `LTAK`/`LTAP`, PO history `EKBE`.
9. **SAP S/4HANA Objects:** MM-IM/`MATDOC`, embedded/decentralized EWM bins/tasks/HUs, Business Partner supplier, EAM reservations and released APIs.
10. **Required Tools/Connectors:** Stock/WMS API, barcode/RFID if deployed, inventory reservation service, PO/GR integration, scanner role control, warehouse slot/capacity data.
11. **Trigger Events:** H-03 inventory plan/safety stock; H-08 spare request; H-14 sales allocation; H-22 PO expected delivery; goods receipt; count variance; H-15 goods ready.
12. **Decision Logic:** Resolve Material_ID/UoM -> check unrestricted/quality/blocked stock and reservation -> inspect receipt -> post only accepted movement -> alert on shortages, variance, capacity or Hazmat.
13. **Agent Dependencies:** Supply Planning, Procurement H-22/H-23, Asset Reliability H-08, Sales Trading H-14; downstream Logistics H-15 and Procurement receipt variance.
14. **Human Approval Requirements:** Receiver/inspector accepts; authorized inventory controller approves adjustments/write-offs; HSE approves hazardous handling exceptions.
15. **Error Handling Requirements:** Unknown material/warehouse, negative or incompatible quantities, duplicate movement, blocked stock or inspection fail must reject/hold; do not treat missing row as zero stock.
16. **Test Scenarios:** Cycle-count mismatch, PO receipt with short quantity, unapproved substitute, duplicate GR event, stock reservation conflict, HAZMAT location mismatch, stale inventory.
17. **Success Criteria:** Every movement has source document, material, location, UoM, quantity/status/time; physical/book discrepancy captured; no duplicate GR; unauthorized adjustment denied.
18. **ICA Edge Implementation Design:** Read-only inventory visibility first; mock movement/reservation APIs; later integrate EWM/MM-IM with idempotent H-22/H-23/H-15 event adapters.

### 3.8 Logistics-Agent — Minor Gaps

1. **Business Purpose:** Plan and monitor multimodal shipments, freight, carriers, routes, ETA and dangerous-goods controls.
2. **Inputs:** Approved allocation/order, origin/destination/Ship-To, product/material, quantity/UoM, carrier/mode, lane, time windows, HSE/customs rules.
3. **Outputs:** Feasible shipment/route, carrier choice, freight estimate, ETA/exceptions, POD/delivery confirmation H-16, emissions estimate.
4. **Master Data Required:** Carrier, Ship-To/location, Plant, Warehouse, Product/Material, Route/Lane, Region/logistics zone, UoM, dangerous-goods class.
5. **Transactional Data Required:** Shipment, freight order, carrier booking, tracking/ETA, freight charge, delivery/POD, customs and incident events.
6. **Required Datasets:** `shipments.csv`, `freight_costs.csv`, `carrier_performance.csv`; plants/warehouses/regions/products; HSE controls. Carrier/Ship-To masters absent.
7. **Required KPIs:** OTIF, damage/loss, freight cost per unit-distance, carrier score, load utilization, emissions intensity.
8. **SAP ECC Objects:** SD delivery `LIKP`/`LIPS`, LE-TRA `VTTK`/`VTTP` if used, IS-Oil T&D, MM/FI freight charges, GTS as deployed.
9. **SAP S/4HANA Objects:** TM freight units/orders/bookings/settlement, EWM loading/dispatch, Business Partner/locations, GTS, FI posting APIs.
10. **Required Tools/Connectors:** TM API, carrier EDI/API, maps/geospatial and route optimizer, shipment telemetry, customs/GTS, dangerous-goods classification.
11. **Trigger Events:** H-04 distribution plan, H-15 goods-ready dispatch, carrier delay/route closure, delivery/pod H-16.
12. **Decision Logic:** Validate location/product/cargo -> test mode/lane/capacity/time/safety -> rank feasible carriers by approved cost/service rules -> alert on infeasibility; do not route unsafely.
13. **Agent Dependencies:** Supply Planning allocation; Warehouse loading readiness; Procurement carrier terms; HSE dangerous-goods limits; Commercial customer promise; Finance consumes POD H-16.
14. **Human Approval Requirements:** Dispatch/exception owner approves carrier/reroute, hazardous route, customs exception or customer promise change.
15. **Error Handling Requirements:** Unknown Ship-To, invalid dangerous-goods data, stale ETA, unavailable carrier, unit/weight mismatch or no safe route -> block and escalate.
16. **Test Scenarios:** Shipment with missing destination, delayed truck, mode-capacity conflict, dangerous-goods route restriction, duplicate tracking event, freight invoice mismatch.
17. **Success Criteria:** Every plan has origin/destination, mode, carrier, ETA, cost basis and safety check; no infeasible shipment is dispatched; POD linked to order.
18. **ICA Edge Implementation Design:** Begin with CSV/mock carrier and route APIs; connect TM/Business Network/GTS only in approved non-prod; publish H-16 event with correlation IDs.

### 3.9 Upstream-Operations-Agent — Minor Gaps

1. **Business Purpose:** Analyze wells, drilling, facilities and production to support safe E&P operations and development decisions.
2. **Inputs:** Well/facility/field data, production/allocation, drilling status, reservoir/reserves, asset availability, HSE and economics.
3. **Outputs:** Production forecast/loss, well/facility exceptions, drilling/intervention options, reserves/development scenarios and upstream activity data to ESG/Supply/Finance.
4. **Master Data Required:** Well/Wellbore, Field, Facility, Plant, Asset, Business Unit, Region, JV/partner, contractor, UoM/currency. Well master is not separate.
5. **Transactional Data Required:** Well production, drilling operation, downtime, allocation, reserves, workover, AFE/capex and operating cost.
6. **Required Datasets:** `wells.csv`, `drilling_operations.csv`, `production_metrics.csv`; masters facilities/assets/plants/BUs; asset reliability/HSE/Finance data.
7. **Required KPIs:** Production vs plan, uptime, decline, lifting cost/boe, reserves/recovery, drilling cost/NPT; approved engineering definitions required.
8. **SAP ECC Objects:** IS-Oil PRA, JVA, PM/EAM, PS/AFE and FI/CO; specialist well/reservoir systems remain external.
9. **SAP S/4HANA Objects:** IS-Oil/PRA/JVA where supported, Project System, EAM, Datasphere/CDS integration; no universal S/4 well/reservoir master assumed.
10. **Required Tools/Connectors:** Read-only historian/SCADA aggregate, well/reservoir specialist APIs, production accounting/allocation, GIS and governed SAP interfaces.
11. **Trigger Events:** Daily/monthly production close, downtime/outage, drilling milestone, integrity alert, field-development review, HSE event.
12. **Decision Logic:** Validate allocation/working interest and measurement quality; compare actual/forecast; present alternatives and economics with assumptions; never issue control commands.
13. **Agent Dependencies:** Asset Reliability health, HSE controls, Finance cost/capex; downstream ESG H-17, Supply Planning and Finance coordination.
14. **Human Approval Requirements:** Operations/petroleum engineer approves operating changes, reserves classification, production allocation, drilling program and CAPEX.
15. **Error Handling Requirements:** Bad measurement, facility/well unmapped, stale historian, JV share conflict or missing UoM -> flag/block quantitative conclusion.
16. **Test Scenarios:** Well/facility join, production anomaly, downtime attribution, JV allocation ambiguity, stale SCADA snapshot, HSE risk constraint.
17. **Success Criteria:** Production totals reproduce from fixture, ownership/allocation explicit, no reserve/resource claims without source, safe abstention on bad telemetry.
18. **ICA Edge Implementation Design:** Offline production-analysis adapter over sample CSVs first; integrate specialist upstream/historian read APIs only after OT architecture and data ownership review.

### 3.10 Refining-Operations-Agent — Minor Gaps

1. **Business Purpose:** Analyze refinery schedule, throughput, feedstocks, yield, quality, energy, outage and turnaround options.
2. **Inputs:** Plant/unit capacity, supply plan, crude/feedstock availability/assay, product demand, asset windows, quality limits, HSE constraints and prices/costs.
3. **Outputs:** Production schedule options, yield/energy/outage analysis, feedstock scenario, off-spec exception and Finance/ESG measures.
4. **Master Data Required:** Refinery/Plant, Process Unit, Asset, Feedstock/Material, Product, Batch, quality spec, BU, UoM.
5. **Transactional Data Required:** Process/production order, output/input, yield, throughput, inspection/result, energy/utility, outage and turnaround work.
6. **Required Datasets:** `refinery_output.csv`, `refinery_performance.csv`, `yield_analysis.csv`; Supply plan/constraints, plants/assets and Finance costs.
7. **Required KPIs:** Throughput/utilization, yield, efficiency, energy intensity, outage/availability, margin, off-spec rate; owner definitions/targets needed.
8. **SAP ECC Objects:** PP-PI/PP, QM inspection lots/results, IS-Oil HPM, PM/EAM, material documents and MM stock.
9. **SAP S/4HANA Objects:** PP-PI/process orders, QM, IS-Oil HPM if available, `MATDOC`, EAM, released APIs/CDS, SAC.
10. **Required Tools/Connectors:** Production scheduling/optimizer or IBP, historian/DCS read aggregates, LIMS/quality interface, asset/maintenance API; no control-loop writes.
11. **Trigger Events:** Approved H-02 production plan, unit outage, feedstock change, quality/off-spec event, turnaround window.
12. **Decision Logic:** Check feedstock/unit capability/availability and spec; time-phase constraints; compare yield/energy/margin alternatives; send infeasible/off-spec to operator.
13. **Agent Dependencies:** Supply Planning H-02; Asset Reliability status; HSE controls; Upstream feedstock; outputs H-18 ESG and Finance coordination.
14. **Human Approval Requirements:** Site operator/technical authority approves schedule/process changes, quality release, turnaround and return to operation.
15. **Error Handling Requirements:** Missing assay/spec, unit mismatch, conflicting capacity or historian stale -> block optimization; never manipulate DCS/APC.
16. **Test Scenarios:** Yield reconciliation, outage scenario, feedstock constraint, quality-limit violation, energy-intensity missing denominator, non-SAP LP handoff.
17. **Success Criteria:** Input/output and period reconcile to sample; alternatives disclose constraints and formulas; no operating recommendation bypasses HSE/quality approval.
18. **ICA Edge Implementation Design:** Begin with historical read-only schedule analysis; use approved refinery LP/IBP connectors or mock solver; keep DCS/LIMS outside agent write path.

### 3.11 Asset-Reliability-Agent — Minor Gaps

1. **Business Purpose:** Prioritize maintenance and asset lifecycle actions using asset, failure, work-order and condition evidence.
2. **Inputs:** Equipment hierarchy, criticality, condition/historian observations, failure/incident history, PM plan, work backlog, material/labor and operating constraints.
3. **Outputs:** Health/failure assessment, ranked work-order recommendation, spares request H-08, JHA/PTW request H-09, cost actual H-11, Asset Status to Supply Planning.
4. **Master Data Required:** Asset_ID, equipment/functional location, Plant or Facility, Manufacturer, Criticality, Material/Spare, Supplier, BU, Region.
5. **Transactional Data Required:** Notification, work order/operation/confirmation, failure, measurement document, reservation/issue, downtime, cost, PTW and return-to-service state.
6. **Required Datasets:** `asset_master.csv`, `maintenance_history.csv`, `failure_analysis.csv`; HSE incidents/safety; Warehouse stock/movements; master assets/facilities/plants.
7. **Required KPIs:** MTBF, MTTR, availability, unplanned downtime, PM compliance, cost/asset, repeat-failure rate; operating-hour/scheduled-work denominators required.
8. **SAP ECC Objects:** PM/EAM equipment `EQUI`, functional location `IFLOT`, notifications `QMEL`, orders `AUFK`/`AFIH`, operations/confirmations, reservations `RESB`, measurements `IMRG`/`IMPTT`.
9. **SAP S/4HANA Objects:** EAM notifications/orders/operations/measurement APIs, APM/condition services, `MATDOC`, `ACDOCA`, Fiori maintenance apps.
10. **Required Tools/Connectors:** Historian/condition monitoring read adapter, EAM APIs, work-order scheduler, Warehouse material/reservation API, HSE/PTW workflow, telemetry.
11. **Trigger Events:** Condition threshold, failure, PM due, work order planned/completed, H-09/H-10 PTW, H-08 material request, Asset Status change.
12. **Decision Logic:** Rank by criticality × probability/consequence × confidence and constraints; compare PM/CBM/corrective alternatives; require engineering validation for diagnosis and deferrals.
13. **Agent Dependencies:** HSE H-10 permit; operations requirements; Warehouse H-08; Procurement for shortage; Finance H-11; Supply Planning receives Asset Status AIM.
14. **Human Approval Requirements:** Engineer approves diagnosis/work scope; HSE/Operations approves isolation/PTW; site authority accepts return-to-service; human approves work deferral/substitution.
15. **Error Handling Requirements:** Sensor calibration/staleness, asset/site mismatch, duplicate failure, missing operating hours or material key -> mark uncertain/block critical recommendation.
16. **Test Scenarios:** Reproduce linked incident INC-00020/WO 4000100353; major-failure triage; sensor missing; criticality A escalation; no spare stock; invalid PTW; cost reconciliation failure.
17. **Success Criteria:** Work/failure/asset joins reproduce; KPI denominators declared; recommendation cites evidence/uncertainty; no unauthorized work order or status mutation.
18. **ICA Edge Implementation Design:** Prototype historical failure ranking first; connect historian and EAM read APIs in sandbox; stage work-order/permit actions as human-approved workflow tasks, not direct agent writes.

### 3.12 Sales-Trading-Agent — Major Gaps

1. **Business Purpose:** Support physical commodity deal, order, contract, position, settlement and commercial decision workflows.
2. **Inputs:** Customer/Counterparty, product/commodity, price curves, trade/contract/order, supply point, delivery period, credit and market data.
3. **Outputs:** Deal economics, orders/contracts, position/reconciliation, delivery commitments, P&L and risk handoff to Trading Risk.
4. **Master Data Required:** Customer/BP, Counterparty, Product/Material, Commodity/Benchmark, Contract, Sales Area, Plant/Supply Point, Region, UoM/Currency.
5. **Transactional Data Required:** Trade/deal/ticket, customer order, contract volume, delivery, price/FX curve, settlement and realized/unrealized P&L.
6. **Required Datasets:** `customer_orders.csv`, `contract_volume.csv`, `trading_transactions.csv`; Marketing product/pricing, master customers/products/plants. Full ETRM/forward curve not present.
7. **Required KPIs:** Trading P&L, contract fulfillment, order OTIF, margin/unit, position breaks, credit utilization with Risk.
8. **SAP ECC Objects:** SD `VBAK`/`VBAP`, delivery/billing/pricing; IS-Oil TSW; external ETRM. SD alone does not cover full trade lifecycle.
9. **SAP S/4HANA Objects:** SD/BP/Material, Commodity Management/TSW where licensed; external ETRM position/curve/settlement API and Datasphere/SAC.
10. **Required Tools/Connectors:** ETRM/trade capture, market data/forward curves, pricing, BP/credit, SD order/delivery, FX and settlement integrations.
11. **Trigger Events:** Deal captured, customer order, credit decision H-13, supply allocation, trade confirmation, delivery/settlement.
12. **Decision Logic:** Validate commercial authority, price/terms, physical availability and credit gate; reconcile trade vs order/delivery/settlement; do not execute or confirm trades autonomously.
13. **Agent Dependencies:** Commercial Marketing, Supply Planning, Warehouse/Logistics; Trading Risk H-12/H-13; Finance P&L.
14. **Human Approval Requirements:** Authorized trader approves deal/commitment; Risk approves credit/limit; authorized approver handles exceptions and regulatory reporting.
15. **Error Handling Requirements:** Counterparty/product/commodity unmapped, stale price curve, duplicate trade, credit decline, missing confirmation or position break -> stop/route to trader/risk.
16. **Test Scenarios:** Order-to-contract reconciliation, price/FX missing, duplicate trade ID, credit decline, physical supply shortage, settlement mismatch.
17. **Success Criteria:** Every position/decision cites trade and valuation versions; no order proceeds after credit decline; reconciliation exceptions surfaced; no unsupported P&L claims.
18. **ICA Edge Implementation Design:** Read-only analysis on sample trades first; production requires approved ETRM as system of record, market-data license, BP/counterparty keys and segregated trade/approval APIs.

### 3.13 Finance-Agent — Minor Gaps

1. **Business Purpose:** Provide FP&A, cost/profitability, investment and reporting analysis; not journal posting, payment execution or audit opinion.
2. **Inputs:** Actual/budget/forecast, GL, cost center/BU, currency/period, revenue/cost drivers, CAPEX/project, settlements and domain measures.
3. **Outputs:** Forecast/budget, variance bridge, margin/cash/investment analysis, reconciliations, management report and benefit validation.
4. **Master Data Required:** Company Code, Chart of Accounts/GL, Cost Center, Profit Center, Business Unit, Asset, Project, Customer, Supplier, Currency, Fiscal Period.
5. **Transactional Data Required:** Journal/GL actuals, revenue, operating costs, budgets, forecast, CAPEX commitments, cash/AR/AP/inventory and settlement.
6. **Required Datasets:** `revenue.csv`, `operating_cost.csv`, `budget_vs_actual.csv`; BU/crosswalk and asset/project/supplier data. AP/payment transaction facts absent.
7. **Required KPIs:** Revenue growth, EBITDA margin, ROA/ROIC, budget variance, CAPEX forecast accuracy, working capital/cash forecast, NPV/IRR.
8. **SAP ECC Objects:** FI `BKPF`/`BSEG`, GL `SKA1`/`SKB1`, CO `CSKS`/`CEPC`, asset accounting, PS `PROJ`/`PRPS`, SD billing/MM purchasing.
9. **SAP S/4HANA Objects:** Universal Journal `ACDOCA`, Asset Accounting, cost/profit centers, Group Reporting, Advanced Financial Closing, SAC and released CDS/APIs.
10. **Required Tools/Connectors:** FI/CO read APIs/CDS, planning/analytics, FX/calendar, consolidation/reporting and controlled posting/workflow only if later authorized.
11. **Trigger Events:** Period close, budget cycle, forecast refresh, approved business case, invoice/payment event, domain actual arrival.
12. **Decision Logic:** Reconcile source periods/accounts/currency; classify favorable/unfavorable; compare scenario against approved baseline; abstain if unbalanced or accounting policy unresolved.
13. **Agent Dependencies:** Procurement spend H-24, Reliability cost H-11, Logistics POD H-16, Sales Trading P&L, strategy capital envelope H-06 and operations actuals.
14. **Human Approval Requirements:** Controller/CFO approves accounting policy, close adjustments, financial forecasts, statutory reports, investment/payment and benefits sign-off by delegated authority.
15. **Error Handling Requirements:** Imbalanced ledger, missing account/cost center/FX rate, stale period, duplicate invoice or unreconciled subledger -> block financial conclusion and escalate.
16. **Test Scenarios:** Revenue rollup vs budget, cost variance sign, BU crosswalk ambiguity, missing GL, currency conversion, period-close mismatch, mock duplicate invoice rejection.
17. **Success Criteria:** Reconciles to source totals within Finance-approved tolerance; formula and period traceable; no posting/payment without workflow authorization.
18. **ICA Edge Implementation Design:** Read-only reconciliation and scenario agent first; connect S/4 CDS/Datasphere; any write path uses separate Finance-controlled API and segregated approvals.

### 3.14 ESG-Agent — Minor Gaps

1. **Business Purpose:** Consolidate governed emissions, water, targets and social/governance data for sustainability analysis and disclosure support.
2. **Inputs:** Activity quantities, site/asset/period, emission factors/GWP, water use, incidents, boundaries, frameworks, targets and evidence.
3. **Outputs:** Scope totals/intensities, target progress, data-quality exceptions, disclosure drafts and assurance-ready lineage.
4. **Master Data Required:** Facility, Plant, Asset, Business Unit, Region, Supplier, Emission Factor, KPI/Target, Framework, Boundary, Period/UoM.
5. **Transactional Data Required:** Emissions, water, activity volumes, incidents/spills, target values/progress, offsets, disclosure evidence.
6. **Required Datasets:** `emissions.csv`, `water_consumption.csv`, `sustainability_targets.csv`; Upstream production, Refining energy and HSE incidents; master facilities/plants/assets.
7. **Required KPIs:** Total CO2e, Scope 1/2/3, GHG/methane intensity, water intensity/recycle, target progress and disclosure completeness.
8. **SAP ECC Objects:** EHS/environmental data and FI/activity sources as configured; no universal ECC ESG fact table assumed.
9. **SAP S/4HANA Objects:** S/4 EHS, Sustainability Control Tower, Sustainability Footprint Management, Datasphere/BTP integration where selected.
10. **Required Tools/Connectors:** Factor/method registry, GHG calculators, emissions/water/OT source APIs, document evidence repository, reporting framework and assurance workflow.
11. **Trigger Events:** Period close, operational data received, target breach, factor/boundary change, incident event H-19, disclosure deadline.
12. **Decision Logic:** Verify boundary, factor version, units, completeness and lineage; calculate only approved methodology; mark restatements and estimates.
13. **Agent Dependencies:** Upstream H-17, Refining H-18, HSE H-19; Strategy H-20; Finance, Procurement and Data Analytics coordination.
14. **Human Approval Requirements:** ESG owner approves method/boundary; Finance/Legal/assurance/executive approve external claims, restatements and filings.
15. **Error Handling Requirements:** Missing activity/factor, unit mismatch, boundary change or incomplete assurance -> block disclosure-ready status; do not use synthetic factor results as filings.
16. **Test Scenarios:** Scope boundary exclusion, missing methane factor, duplicate facility-period, unit conversion, target status formula, revised GWP, incident-to-ESG tie-out.
17. **Success Criteria:** Reproducible totals from approved factors; full source/boundary lineage; period and unit checks; disclosure cannot publish without approvals.
18. **ICA Edge Implementation Design:** Start on sample historic data with explicit formula version; integrate governed source measures and factor catalog in non-prod; add controlled disclosure workflow after assurance review.

### 3.15 Corporate-Strategy-Agent — Major Gaps

1. **Business Purpose:** Support enterprise portfolio, capital allocation, M&A/JV/divestiture and long-range energy-transition decisions; it does not approve or execute transactions.
2. **Inputs:** Strategy goals, investment portfolio, roadmap, finance actuals/forecasts, market/commodity scenarios, ESG pathways and portfolio risk.
3. **Outputs:** Portfolio/scenario comparison, investment recommendation, NPV/IRR sensitivities, strategic KPI proposal, executive narrative and approved priorities for PMO.
4. **Master Data Required:** Business Unit, portfolio asset, Project/Initiative, Company Code, Cost Center/Profit Center, Region, Product/Commodity and scenario version; Project/Market masters are incomplete.
5. **Transactional Data Required:** Strategy goal/target, investment case, capital request, financial model, scenario assumption, portfolio status, roadmap milestone.
6. **Required Datasets:** `investment_portfolio.csv`, `strategy_goals.csv`, `transformation_roadmap.csv`; Finance revenue/cost/budget; master BU/crosswalk. No sample data dictionary.
7. **Required KPIs:** Revenue growth, ROA/ROIC, EBITDA margin, portfolio NPV/IRR, strategic milestone/target attainment. Shared targets are illustrative and Finance owns accounting definitions.
8. **SAP ECC Objects:** FI/CO actuals (`BKPF`/`BSEG` and CO objects), Project System `PROJ`/`PRPS`, internal/investment orders where configured.
9. **SAP S/4HANA Objects:** Universal Journal `ACDOCA`, cost/profit centers, Project System/PPM, SAC planning, Group Reporting where licensed.
10. **Required Tools/Connectors:** Finance/CO read models, portfolio/project source, SAC scenario planning, governed market/commodity data, approved workflow for investment decisions.
11. **Trigger Events:** Annual strategy cycle, market/transition shock, investment proposal, M&A opportunity, executive S&OP exception, PMO milestone/ESG report.
12. **Decision Logic:** Compare risk-adjusted scenarios and strategic fit; expose assumptions/sensitivities; separate modeled value from approved forecast; route capital or portfolio decision to committee.
13. **Agent Dependencies:** Finance H-07 returns NPV/IRR while H-06 sends approved capital envelope; ESG H-20; PMO H-25; Commercial Marketing/Trading Risk/EA provide coordination inputs.
14. **Human Approval Requirements:** Executive/board/investment committee approves portfolio entry/exit, M&A, capital envelope, risk appetite and external strategic commitments.
15. **Error Handling Requirements:** Missing cash flows, incomparable currencies/periods, unresolved BU labels, stale market inputs or unapproved discount rates block valuation; do not invent market facts.
16. **Test Scenarios:** BU crosswalk ambiguity, NPV sensitivity to price/discount rate, competing CAPEX proposals, stale market input, ESG scenario conflict, milestone slip.
17. **Success Criteria:** Reproducible scenario assumptions; financial measures reconcile to Finance source; every recommendation lists risk/sensitivity and approval status; no modeled case labeled approved.
18. **ICA Edge Implementation Design:** Read-only strategy synthesis over approved Finance/ESG/market views; produce an investment-decision pack and workflow request, never execute M&A/capital actions.

### 3.16 Commercial-Marketing-Agent — Minor Gaps

1. **Business Purpose:** Analyze customer/product/market data and recommend pricing, segmentation and commercial growth actions; it does not execute trades or transport.
2. **Inputs:** Customer/segment history, product portfolio, pricing zones/conditions, market/competitor signals, demand forecasts, orders, contract terms and finance margin.
3. **Outputs:** Price/discount recommendations, segment and retention insights, product/market performance, commercial-adjusted demand input to Demand Planning (H-05), campaign/offer scenarios.
4. **Master Data Required:** Customer/BP, Segment, Product/Material, Region/Pricing Zone, channel, Business Unit, Calendar, Currency/UoM; competitor/market source IDs are not mastered.
5. **Transactional Data Required:** Segment revenue, price/discount by product-zone, market observation, commercial offer, order/contract history, campaign/retention outcome.
6. **Required Datasets:** `customer_segments.csv`, `pricing_strategy.csv`, `product_portfolio.csv`; customer/product/region masters; Sales Trading orders and Finance margin as inputs.
7. **Required KPIs:** Customer satisfaction (85% illustrative target), retention (90% illustrative target), gross margin %, price realization/discount, market share and revenue growth; survey/market definitions need approval.
8. **SAP ECC Objects:** SD customer `KNA1`/`KNVV`, material `MARA`/`MVKE`, orders `VBAK`/`VBAP`, billing `VBRK`/`VBRP`, pricing conditions `KONV`; CRM/C4C if deployed.
9. **SAP S/4HANA Objects:** Business Partner/CVI, Material/product hierarchy, SD pricing and billing APIs (pricing elements including `PRCD_ELEMENTS`), SAC, Sales Cloud/Commerce where selected.
10. **Required Tools/Connectors:** CRM/survey, SD history/pricing, market-data provider, product/price analytics, SAC/BI and versioned Demand Planning contract.
11. **Trigger Events:** Market/price update, product lifecycle/portfolio decision, customer segment review, forecast cycle; product/price change sends H-05 to Demand Planning.
12. **Decision Logic:** Normalize price unit, geography, tax/freight and contract mix; estimate demand/margin response; recommend within approved pricing corridor; never commit a price or claim unverified competitor data.
13. **Agent Dependencies:** Strategy portfolio objectives; Finance actuals/margins; Sales Trading order/deal context; Demand Planning forecast and H-05 consumer.
14. **Human Approval Requirements:** Commercial pricing authority approves discounts, offers, customer commitments and regulated product claims; Risk/Finance consulted for credit/margin thresholds.
15. **Error Handling Requirements:** Missing UoM/zone/effective date, sparse survey response, stale market data or customer identity mismatch -> label/block comparison; do not impute silently.
16. **Test Scenarios:** Zone-price comparison, discount corridor breach, customer churn cohort, product change H-05, price unit mismatch, missing market source.
17. **Success Criteria:** Recommendation reproducible by product/zone/period; source and denominator disclosed; pricing exceptions routed to approver; no trade/transport action emitted.
18. **ICA Edge Implementation Design:** Read-only commercial analytics first; publish typed price/product-change proposal to Demand Planning; add CRM/SD writes only through approved workflows.

### 3.17 Transformation-PMO-Agent — Major Gaps

1. **Business Purpose:** Govern transformation portfolios, milestones, RAID, change readiness, benefits and executive reporting.
2. **Inputs:** Strategy objectives, project/program baseline, workstream/milestones, resources, cost, risks/issues, benefits and architecture decisions.
3. **Outputs:** Integrated plan, portfolio health/RAG, dependency/risk escalation, stage-gate packs, benefit and adoption reports.
4. **Master Data Required:** Project/Program_ID, Initiative, Business Unit, Sponsor/Owner/Role, Workstream, Milestone, Benefit/KPI, Calendar, Cost Center.
5. **Transactional Data Required:** Project status/cost/schedule, risk/issue/decision log, benefits actual/forecast, change impacts, stakeholder/training/readiness.
6. **Required Datasets:** `project_portfolio.csv`, `benefits_tracking.csv`, `risk_register.csv`; no `data_dictionary.md` and no shared project master.
7. **Required KPIs:** Milestone adherence, schedule/cost index, benefit realization, portfolio health, readiness/adoption, ROI/payback.
8. **SAP ECC Objects:** Project System `PROJ`/`PRPS`, networks/activities, internal orders, CO project actuals; SAP Solution Manager if used.
9. **SAP S/4HANA Objects:** PS/PPM, Cloud ALM, Signavio/Enable Now, SAC, `ACDOCA`, Build Process Automation.
10. **Required Tools/Connectors:** PMO/project system, schedule tool, issue/risk register, Finance actuals, change/training tools, workflow/BI.
11. **Trigger Events:** Strategy approval, architecture decision H-26, milestone/status update H-25, risk threshold, stage gate, benefit review.
12. **Decision Logic:** Compare against approved baseline; separate rebaseline from actual performance; surface critical path and benefit variance; stage gate by evidence.
13. **Agent Dependencies:** Strategy, Finance, EA H-26, domain delivery owners; outputs milestone/benefit/risk to Strategy H-25 and Knowledge repository.
14. **Human Approval Requirements:** Sponsor/steering committee approves baseline, funding, scope changes, rebaseline, stage gates and benefit acceptance.
15. **Error Handling Requirements:** Missing owner/baseline/period/value source -> mark metric unavailable; inconsistent project keys block rollup; no status inferred from free text.
16. **Test Scenarios:** Late milestone, risk severity change, benefit unvalidated by Finance, duplicate project IDs, rebaseline, architecture dependency not accepted.
17. **Success Criteria:** All initiatives trace to strategy and owner; status/benefit formula reproducible; stage-gate approval and changes auditable.
18. **ICA Edge Implementation Design:** Begin with schema/documentation closure, then read-only portfolio report and mocked stage-gate tasks; no auto-rebaseline or funding action.

### 3.18 HSE-Agent — Minor Gaps

1. **Business Purpose:** Support HSE incident, hazard, audit, permit, process-safety, occupational health and environmental control decisions.
2. **Inputs:** Incident/site/asset/work-order, hazard/barrier, person/contractor, permit/MOC, audit/regulation, activity and exposure denominator.
3. **Outputs:** Incident triage/analysis, hazard/control exceptions, PTW conditions, CAPA status, compliance alerts and approved ESG evidence.
4. **Master Data Required:** Site/Facility/Plant, Asset, Person/Contractor, Hazard/Barrier, Permit, Regulation, BU, exposure unit/organization.
5. **Transactional Data Required:** Incident/injury/spill, observation/action, audit/finding, HAZOP/risk assessment, MOC/PTW, drill, corrective action.
6. **Required Datasets:** `incidents.csv`, `safety_observations.csv`, `compliance_audits.csv`; assets/facilities/plants and Reliability WO references. No hours-worked denominator or explicit PTW ledger.
7. **Required KPIs:** TRIR/LTIFR, API RP754 tier rate, near miss, CAPA closure, audit compliance, spill/exceedance; denominator and local regulatory definition needed.
8. **SAP ECC Objects:** EHS incident/risk components, PM notifications/orders, Work Clearance Management where configured; no universal EHS table asserted.
9. **SAP S/4HANA Objects:** S/4 EHS incident/risk, work permits/work clearance, EAM integration, Sustainability Control Tower where selected.
10. **Required Tools/Connectors:** EHS/permit APIs, identity/role, regulation library, alerting and incident evidence repository.
11. **Trigger Events:** Incident/near-miss, planned hazardous work, permit expiry, audit finding, environmental threshold breach.
12. **Decision Logic:** Severity/risk/barrier and reportability rules route to competent HSE/site authority; emergency state overrides analytics; do not automate shutdown/work authorization.
13. **Agent Dependencies:** Reliability H-09/H-10, upstream/refining/logistics site evidence, ESG H-19, Knowledge H-21.
14. **Human Approval Requirements:** Site emergency command, HSE permit issuer, competent engineer, Legal/Regulatory owner approve response, PTW and reporting.
15. **Error Handling Requirements:** Missing site/severity/exposure denominator, unconfirmed reportability or stale permit -> escalate and mark provisional; no rate computed without denominator.
16. **Test Scenarios:** High-potential incident, linked work order, PTW denied/expired, severity disagreement, audit overdue, regulator reportability uncertainty.
17. **Success Criteria:** Correct role routing and audit trail; emergency prompts prioritize human response; prohibited unsafe recommendations absent; rates require valid exposure.
18. **ICA Edge Implementation Design:** Read-only incident triage and permit completeness first; integrate EHS/work clearance sandbox later; strict human-only approval and no autonomous controls.

### 3.19 Trading-Risk-Agent — Major Gaps

1. **Business Purpose:** Quantify and monitor commodity market, credit, hedge and limit risk; no autonomous trade, hedge or override authority.
2. **Inputs:** Physical/financial trades, curves/prices/FX, counterparty/netting/collateral, risk limits, hedge designations and valuation date.
3. **Outputs:** VaR/ES, exposure, stress, limit alert, counterparty credit decision, hedge scenario and regulatory evidence.
4. **Master Data Required:** Counterparty/BP, Commodity/Benchmark/Curve, Risk Limit, Hedge Instrument, Currency, BU, Netting Set, Agreement.
5. **Transactional Data Required:** Trade/position, hedge, daily market price/curve, exposure/limit use, collateral, MTM/P&L, backtest/stress result.
6. **Required Datasets:** `market_prices.csv`, `hedging_positions.csv`, `risk_exposure.csv`; Sales Trading transactions; Finance data. No canonical Counterparty or approved forward-curve model.
7. **Required KPIs:** VaR/Expected Shortfall, limit utilization/breach, stress loss, hedge ratio/effectiveness, current/PFE, MTM, backtest exceptions.
8. **SAP ECC Objects:** SAP TRM, FI/AR credit and IS-Oil/ETRM integration as deployed; no generic ECC commodity curve master assumed.
9. **SAP S/4HANA Objects:** TRM, Commodity Management risk functions, Credit Management, BP, Finance/ACDOCA, external ETRM/market data APIs.
10. **Required Tools/Connectors:** Licensed market data/curves, ETRM positions, risk engine/library, credit/netting/collateral source, model validation, limit workflow.
11. **Trigger Events:** Deal capture H-12, credit check request, valuation cycle, market move, limit breach, collateral event.
12. **Decision Logic:** Validate positions/curve/valuation date -> calculate exposure/limits -> compare with authorized threshold -> return approve/decline or escalation; never self-approve breach.
13. **Agent Dependencies:** Sales Trading H-12 positions; H-13 credit response; Finance hedge cost; Analytics model/data support; Strategy portfolio view.
14. **Human Approval Requirements:** Independent risk/credit authority approves limit exceptions, credit, hedge policy/model, override, regulatory submission.
15. **Error Handling Requirements:** Missing curve, stale price, unmapped counterparty, invalid netting, model failure or limit breach -> block release and escalate; never default exposure to zero.
16. **Test Scenarios:** Market shock, stale curve, counterparty unknown, hedge volume mismatch, over-limit position, duplicate trade, credit decline.
17. **Success Criteria:** Reproducible valuation against approved test vectors; limit breach prevents downstream execution; full source/model/version audit; no unauthorized override.
18. **ICA Edge Implementation Design:** Start with offline historical fixture calculations; production needs approved ETRM/curve/risk stack, independent validation, ACL and separate risk approval service.

## 4. Readiness Assessment

**Readiness meaning:** Ready = can begin isolated prototype/evaluation; Minor Gaps = testable with bounded mocks/remediation; Major Gaps = key semantics, master data, dictionaries or specialist systems block repeatable domain testing. None of these ratings means deployed or production-ready. For enterprise-system end-to-end execution, **0/19 agents are ready** until a runtime, integrations, identity, workflow state and operations controls exist.

| Readiness | Agents | Assessment |
|---|---|---|
| Ready (3) | Data Analytics, Enterprise Architecture, Knowledge Repository | Sample dictionaries/datasets and bounded read-only use exist; implement first with synthetic fixtures, ACL and citation checks. |
| Minor Gaps (11) | Supply Planning, Procurement, Warehouse, Asset Reliability, Refining Operations, Logistics, Finance, HSE, Upstream Operations, Commercial Marketing, ESG | Suitable for isolated tests with sample dictionaries, but missing shared masters, operational connectors, denominators, live events or approval data. |
| Major Gaps (5) | Demand Planning, Corporate Strategy, Transformation PMO, Sales Trading, Trading Risk | Demand/Strategy/PMO lack sample dictionaries. Sales Trading/Risk lack canonical counterparty/commodity and full ETRM/curve coverage needed for core integrated scope. |

For the complete priority order, dataset/tool requirements and test cases, see [MVP Agent Testing Plan](mvp_agent_testing_plan.md). This specification's readiness ratings are **spec/test readiness**, not execution certification.

## 5. Ranked Implementation Priority

The sequence follows platform prerequisites, SAP reference rollout waves, process dependencies, control risk and data readiness. Do not skip approval/data gates to preserve rank.

| Rank | Agent | Readiness | Priority rationale / key gate |
|---:|---|---|---|
| 1 | Data-Analytics-Agent | Ready | Data quality, key/lineage validation and governed read models enable every downstream test. |
| 2 | Enterprise-Architecture-Agent | Ready | Establish actual inventory, tool choice, interface/security pattern and architectural decision records. |
| 3 | Knowledge-Repository-Agent | Ready | Provides permission-aware cited knowledge for all agents; needs ACL/citation evaluation. |
| 4 | Demand-Planning-Agent | Major Gaps | Exercises the explicit H-01 Demand Forecast contract; first add dictionary, UoM/version/scenario semantics. |
| 5 | Supply-Planning-Agent | Minor Gaps | Core cross-agent planning; requires mocked Procurement Plan/Asset Status and Material/UoM remediation. |
| 6 | Procurement-Agent | Minor Gaps | Builds P2P and AIM procurement-plan input; Material_ID and PR/PO/GR/AP chain required. |
| 7 | Warehouse-Agent | Minor Gaps | Enables stock, reservation, receipt and physical-execution tests; requires Material/correlation keys. |
| 8 | Asset-Reliability-Agent | Minor Gaps | Adds explicit Asset Status contract and M2R; sensor, PTW, spare and return-to-service data are gaps. |
| 9 | Refining-Operations-Agent | Minor Gaps | Validates supply-to-production plans; DCS/LIMS/LP connections require site design. |
| 10 | Logistics-Agent | Minor Gaps | Completes distribution constraint flow; Carrier/Ship-To and tracking API coverage needed. |
| 11 | Finance-Agent | Minor Gaps | Adds cost/scenario validation after period, cost-object and account mappings are defined. |
| 12 | HSE-Agent | Minor Gaps | Safety overlay before any work/route execution; PTW/permit workflow and exposure denominators needed. |
| 13 | Upstream-Operations-Agent | Minor Gaps | Adds production/feedstock inputs; Well master and specialist upstream data sources need integration. |
| 14 | Commercial-Marketing-Agent | Minor Gaps | Supplies approved commercial demand/price adjustments; external market/customer signals need validation. |
| 15 | Transformation-PMO-Agent | Major Gaps | Needed for migration portfolio gates and benefits; add data dictionary and cross-agent project identifiers. |
| 16 | Corporate-Strategy-Agent | Major Gaps | Executive scenario/portfolio route; add data dictionary and Finance/project key contracts. |
| 17 | ESG-Agent | Minor Gaps | Add after upstream/refining/HSE activity and method governance are in place. |
| 18 | Sales-Trading-Agent | Major Gaps | Trading workflows require ETRM, counterparty, curve and credit contracts; higher-risk write paths. |
| 19 | Trading-Risk-Agent | Major Gaps | Risk depends on Sales Trading positions, counterparties, approved curves/models and independent validation. |

## 6. Implementation Work Packages

### WP0: Platform and Governance Foundation

- Select the ICA Edge execution runtime, model/tool interface, state store, CI/CD and dev/test environments; this repository does not select or implement them.
- Define identity federation, per-agent least privilege, secrets handling, data classification, audit/retention and break-glass controls.
- Implement request/workflow IDs, task DAG/state transitions, typed agent IO, trace correlation, timeout and cancellation.
- Establish evaluation datasets, golden cases, red-team/security checks, approval fixtures and owner sign-off.

### WP1: Data, Architecture and Knowledge Foundation

- Build Data Analytics schema/quality/lineage service over local fixtures and governed read-only views.
- Populate actual landscape evidence for Enterprise Architecture; mark unverified SAP states unknown.
- Build ACL-filtered Knowledge Repository retrieval over approved docs with resolved citations and stale/conflict tests.

### WP2: Planning MVP

- Add Demand Planning data dictionary and canonical UoM/period/scenario/version fields.
- Define versioned Demand Forecast, Procurement Plan and Asset Status schemas with owners, keys, triggers, replay/idempotency and SLAs.
- Build Supply Planning as a read-only scenario service with mocked dependencies; compare alternative plans and request human approval.

### WP3: Controlled Operational Connectors

- Add Procurement/Warehouse/Asset Reliability/Refining/Logistics read adapters and mock write endpoints.
- Add HSE permits/Finance cost/approval gates before any transaction-capable pilot.
- Integrate SAP only in non-production after customer release/API/security review; production writes remain separately approved.

## 7. Test Matrix and Success Criteria

| Test layer | Required scenarios | Pass criteria |
|---|---|---|
| Static/spec | SKILL metadata or manifest, required headings, relative references, dataset schema, version and owner fields. | CI catches missing files/fields and rejects unsupported SAP/integration claims. |
| Unit/agent | Routine, exception, scenario, missing data, unknown key, wrong unit, stale data, conflicting source, prompt injection. | Typed output; source citations resolve; formulas reproduce; uncertainty/blockers visible; no unsupported actions. |
| Contract | Valid/invalid schema, incompatible versions, duplicate/reordered event, missing dependency, correlation ID, timeout. | Invalid payload rejected; duplicate is idempotent; required dependencies gate execution; failures traceable/replayable. |
| Approval/policy | Approve, reject, expire, unauthorized user, segregation-of-duties conflict, safety/credit/finance escalation. | 100% of required gates prevent action without proper human authorization; audit log records actor/reason/time. |
| Workflow | Demand-to-Supply, P2P, M2R, O2C, I2C/ESG simulations with partial failure and resume. | Correct sequence and compensation; no downstream transaction follows failed prerequisite; partial results labeled. |
| Non-production integration | CDS/API/Event Mesh, Datasphere view, SAP workflow, identity and reconciliation. | Approved source-to-target totals within owner-set tolerance; auth, replay, monitoring and rollback tested. |
| Operational readiness | Load, resilience, failover, incident, recovery, drift, cost, retention and access review. | SLO/on-call/runbook/rollback and regulatory/security evidence approved by accountable owners. |

Proposed MVP thresholds (to be approved by product/domain owners): 100% of critical input schemas validated; zero silent key/unit conversions; all critical claims traceable to source/version; zero approval-gate bypasses; no high-severity security/safety defect; and complete audit correlation for every mock workflow.

## 8. 30-60-90 Day Testing Roadmap

| Window | Delivery target | Included agents | Exit gate |
|---|---|---|---|
| Days 0-30 | Runtime/tool decision, identity and policy model, typed IO, mock adapters, evaluation harness, source fixtures and data dictionaries for critical gaps. | Data Analytics, Enterprise Architecture, Knowledge Repository; documentation work for Demand Planning. | Three foundation agents pass isolated citation/ACL/schema tests; no writes; owners approve workflow and data contracts. |
| Days 31-60 | Read-only demand forecast and mocked constrained supply workflow; invalid-unit/key and dependency-failure testing. | Demand Planning, Supply Planning; Procurement and Asset Status are mocked contracts. | Deterministic Demand-to-Supply scenario; correct blocking/escalation; plans require explicit human approval; audit trace complete. |
| Days 61-90 | Non-production SAP/API/event tests, one bounded workflow pilot decision, rollback/monitoring/parallel-run rehearsal. | Add Procurement, Warehouse and Asset Reliability connectors; HSE/Finance approvals in mock or sandbox. | Business/security/architecture sign-off; source reconciliation; no production write until separate go/no-go and support readiness. |

Dates are planning targets, not commitments. SAP access, licensing, customer data remediation and security approvals may shift the schedule. A passing 90-day sandbox gate is not production authorization.

## 9. Production Readiness Gate

A production rollout requires, at minimum:

1. Customer-validated ECC/S/4HANA inventory, release, licensing, custom code and API availability.
2. Approved process ownership/RACI, data stewards, canonical master keys, data dictionaries, KPI formulas and event schemas.
3. Completed security/privacy/threat model, identity, RBAC, secrets, audit, retention and penetration review.
4. Agent/tool evaluation with known-answer, adversarial, reliability, approval, fallback and domain-owner acceptance.
5. Non-production reconciliation, performance, retry/replay, disaster recovery, rollback and user acceptance.
6. Named operations/support owners, SLOs, monitoring, alerting, incident response, model/prompt change control and cost management.
7. Formal executive/business go/no-go with residual risk acceptance and measurable outcome baseline.

## 10. Evidence Base

This specification synthesizes `mvp_agent_testing_plan.md`, `agent_orchestration_framework.md`, all agent `SKILL.md` files, `agent_capability_matrix.md`, `agent_collaboration_patterns.md`, `Agent_Interaction_Model.md`, `enterprise_process_model.md`, `entity_relationship_model.md`, capability/KPI models, `sap_reference_architecture.md`, master-data documentation, all five walkthroughs, and the 19 agent sample-data folders.

All sample data and walkthrough values are synthetic. SAP/BTP products, target interfaces and migration waves are candidate architecture until validated for an actual customer. The plan is a test specification; it does not imply any agent has been deployed or executed.

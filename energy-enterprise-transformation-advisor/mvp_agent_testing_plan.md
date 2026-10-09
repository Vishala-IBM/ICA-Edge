# MVP Agent Testing Plan

## Purpose and Current State

This plan selects the first five agents for an ICA Edge implementation and test MVP, based on the repository's agent skills, synthetic sample data, enterprise models, workflow walkthroughs, SAP reference architecture, and `agent_orchestration_framework.md`.

**Current readiness:** design and sample-data level only. The repository has no runnable orchestration service, tool adapters, deployed SAP/BTP endpoints, workflow persistence, or automated agent-evaluation harness. None of the 19 agents is ready for end-to-end execution testing against enterprise systems. Sixteen have sample dictionaries and are candidates for isolated data-grounded evaluation design; Corporate Strategy, Demand Planning, and Transformation PMO do not yet have sample-data dictionaries.

The MVP should prove controlled read-only agent behavior and a mocked Demand-to-Supply process. It must not create production PRs, POs, work orders, journal entries, or planning releases.

## 1. First Five Agents to Implement and Test

The ordering follows the SAP reference architecture's data-readiness-first rollout and then selects the planning pair that exercises a documented AIM contract.

| Priority | Agent | MVP responsibility | Why prioritize |
|---:|---|---|---|
| 1 | Data-Analytics-Agent | Read-only ingestion/validation, canonical-key checks, lineage, data quality and a small governed planning data product. | Foundational data/quality service for every other agent; owns no domain decisions and can be tested against current CSVs. Has a sample dictionary. |
| 2 | Enterprise-Architecture-Agent | Landscape/application/technology inventory analysis, integration-pattern recommendations, architecture decision record and risk flags. | Establishes actual deployment assumptions, approved patterns, integration/security boundaries, and the target architecture needed before SAP connectivity. Has a sample dictionary. |
| 3 | Knowledge-Repository-Agent | Permission-aware retrieval and cited answers over approved skills, models, walkthroughs and standards; stale/conflicting-source handling. | Provides reusable, governed context to all agents and supports traceable answers. Has a sample dictionary and linked pattern/practice data. |
| 4 | Demand-Planning-Agent | Read-only forecast analysis, cold/seasonal scenario comparison, coverage checks and a versioned forecast output contract. | Creates the demand input for the explicit Demand Forecast -> Supply Planning contract and tests units/grain/assumption safeguards. **Requires a new sample-data dictionary before repeatable field-level tests.** |
| 5 | Supply-Planning-Agent | Read-only constrained-plan prototype using demand, production, inventory targets, constraints, and mocked procurement/asset-status inputs. | Exercises the central planning use case and the three explicit AIM inputs while preserving human approval before plan release. Has a sample dictionary. |

**Dependency note:** the first Supply Planning tests should use deterministic mock Procurement Plan and Asset Status payloads, clearly labeled fixtures. The repository describes these contracts but contains no production-ready payload schema or event implementation. Full dependency execution should wait for Procurement- and Asset-Reliability-Agent contract tests.

## 2. Required Datasets

### Agent and Workflow Fixtures

| Agent / test slice | Required repository datasets | Additional fixtures or gaps |
|---|---|---|
| Data Analytics | `Data-Analytics-Agent/sample-data/datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`; all 11 `master-data/*.csv`; representative sample data from each domain. | Define data-quality rules/expected results; provide sanitized/schema-compatible fixtures for malformed keys, stale dates, duplicate rows, nulls and unit conflicts. |
| Enterprise Architecture | `application_inventory.csv`, `integration_inventory.csv`, `technology_standards.csv`; `sap_reference_architecture.md`, `sap-architecture-advisor/references/technologies.md`, architecture patterns. | Annotated test landscapes for ECC, mixed/unknown systems, retired/prohibited technology, end-of-life dates, interface criticality and clean-core exceptions. Repository landscape is illustrative. |
| Knowledge Repository | `document_catalog.csv`, `architecture_patterns.csv`, `best_practices.csv`; agent READMEs/SKILLs, process/KPI/data/SAP models and walkthroughs. | Permission-tagged test corpus with published, draft, superseded, restricted and contradictory documents; expected citations and ACL denials. Never use confidential documents in public test fixtures. |
| Demand Planning | `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`; customer, product and region masters; Commercial Marketing `customer_segments.csv`, `pricing_strategy.csv`, `product_portfolio.csv`. | Add `Demand-Planning-Agent/sample-data/data_dictionary.md`. Add explicit UoM, period, forecast version, scenario semantics, source/as-of and actuals/holdout fixture. Current forecast values have no unit column; do not score accuracy without actuals. |
| Supply Planning | `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`; demand forecast output; products, plants, facilities, warehouses, regions and BUs; Warehouse `inventory_stock.csv`, movements and counts; Refining `refinery_performance.csv`, `refinery_output.csv`, `yield_analysis.csv`. | Mock versioned Procurement Plan and Asset Status messages; mock inventory snapshot with canonical Material_ID; a unit-conversion table and plant/product capability fixture. No current PO-to-stock material master or exact Winter Diesel stock match exists. |

### Data Preparation Rules

- Preserve repository values and source paths; mark all data synthetic.
- Declare each fixture's grain, key, foreign keys, period, UoM, currency, version and expected behavior.
- Separate ground-truth rows from intentionally bad data; include expected reject/warn/continue behavior.
- Use canonical master IDs where available; use explicit aliases only for test cases and record join coverage.
- Do not invent actuals, approved targets, SAP responses, procurement status, or asset availability and label them as sample facts.

## 3. Required Master Data

| Master/reference | Required use in MVP | Readiness |
|---|---|---|
| Business Unit and `bu_crosswalk.csv` | Normalize source ownership and financial/portfolio rollups. | Available; mapping is synthetic and some source labels are multi-BU. |
| Product | Join demand, price, sales, refinery and supply plans; preserve Product vs Material distinction. | Available for portfolio products; not a complete materials/feedstocks master. |
| Customer and Segment | Demand/history segmentation and customer rollups. | Available, but Demand Planning forecast names have documented unmatched population. |
| Region / zone | Forecast, reporting and pricing/logistics analysis. | Available; region, province, pricing zone and logistics zone must not be conflated. |
| Plant and Facility | Capacity/constraint, refining/operations and site context. | Available; mixed plant/facility site codes require typed mapping. |
| Warehouse | Inventory, stock and storage-location context. | Available; WH13-WH15 have no sample activity. |
| Asset / Functional Location | Asset-status mock input and reliability constraints. | Available; do not infer live status from the static master. |
| Supplier | Procurement-plan mock and sourcing context. | Available; does not replace Carrier or Counterparty identities. |
| Calendar, UoM, Currency | Forecast/supply period and normalized quantities/financials. | Not fully mastered; create a test conversion reference and label it proposed. |
| Material | Stock, PO, MRO, feedstock and inventory joins. | **Missing canonical master; blocker for real procurement-to-stock linkage.** |
| Data source / Application / Document metadata | Lineage, architecture and knowledge retrieval. | Source/Application/document IDs exist in agent datasets; stewardship/ACL profiles need fixtures. |

## 4. Required Tools and Connectors

### MVP Test Environment

- **Orchestration/state machine:** a selected ICA Edge runtime or test harness supporting DAGs, dependency waits, per-request state, cancellation and approval pauses. The repository does not select or implement one.
- **Local data adapter:** read-only CSV/JSON fixture loader with schema validation; deterministic clock/snapshot and seeded mock data.
- **Contract/schema validation:** versioned JSON Schema or equivalent for agent input/output and the Demand Forecast, Procurement Plan and Asset Status messages.
- **Agent evaluation harness:** test runner, golden prompts/results, source-citation checks, unit/key validators, policy/security tests and regression reports.
- **Knowledge retrieval:** local/mock document index with ACL filters, version status, citations and stale-document handling; connect to an approved enterprise repository only after security review.
- **Telemetry:** workflow/task IDs, structured logs, trace spans, prompt/model/version, source IDs, token/cost/latency, tool outcomes and redacted errors.
- **Secrets and identity:** mock identity/roles in development; approved secrets manager and SSO/RBAC design before non-production SAP access.

### Later Non-Production Integrations

| Capability | Candidate integration from repository architecture | Test gate |
|---|---|---|
| SAP reads | Released S/4HANA CDS/OData APIs, Datasphere/Business Data Cloud semantic views; ECC/BW extract path if required. | Customer release, API authorization, data classification and reconciliation approved. |
| SAP workflow/write actions | Integration Suite API Management/Cloud Integration and approved SAP workflow/Build Process Automation. | Human approval, segregation of duties, idempotency, audit and rollback tested; no direct table writes. |
| Event handoffs | SAP Event Mesh/Integration Suite or approved equivalent. | Producer/consumer schemas, versioning, correlation ID, idempotency, retries and dead-letter handling approved. |
| AI models | Selected model endpoint; SAP AI Core/Generative AI Hub is a reference option, not a deployed dependency. | Model, data residency, evaluation, safety, privacy and retention review passed. |
| SAP landscape catalog | LeanIX/Signavio/Cloud ALM only if licensed/selected and populated. | Actual system/app/process inventory and ownership verified. |

## 5. Test Scenarios and Expected Outputs

| ID | Agent(s) | Scenario | Expected output |
|---|---|---|---|
| T01 | Data Analytics | Validate good master joins and inject unknown Product_ID, duplicate source key, null UoM and stale period. | Coverage report with matched/unmatched counts, severity, source lineage and remediation owner; no silent row drops or fabricated keys. |
| T02 | Enterprise Architecture | Assess fixture containing ECC 6.0, PI/PO, Z-code, BW/BO and EOL apps versus candidate S/4/BTP patterns. | Fact/assumption split, lifecycle risks, target options, decision record and evidence links; no claim that illustrative SAP target is deployed. |
| T03 | Knowledge Repository | Ask a question answered by published data model plus a superseded conflicting reference; attempt restricted document retrieval. | Answer cites current approved sources and reports conflict/staleness; restricted content is denied without leakage. |
| T04 | Demand Planning | Compare baseline Winter Diesel November forecast with cold-winter scenario; remove UoM or change scenario sign semantics. | Versioned base/alternative forecast, scenario assumptions and regional totals; block unit-dependent aggregation or label conditional; no invented MAPE without actuals. |
| T05 | Demand -> Supply contract | Publish valid forecast to mock Supply Planning; replay duplicate event and send invalid key/version. | Correct correlation/version and idempotent behavior; duplicate not double-counted; invalid event rejected with actionable error; forecast exception >20% pauses for human planner per AIM. |
| T06 | Supply Planning | Combine valid forecast with production plan, constraint calendar, on-hand/safety-stock fixture, Procurement Plan mock and Asset Status mock. | Constrained/unconstrained options by Product/Plant/Period/UoM, assumptions, gap/shortage/surplus, stock position, constraint impacts, exception list and approval request. |
| T07 | Supply Planning + Procurement mock | Procurement input conflicts with approved supply plan or lacks Material_ID/lead time. | Plan enters blocked/escalated state, identifies conflicting fields/owners, does not release purchase or supply plan. |
| T08 | Supply Planning + Asset Reliability mock | Asset becomes unavailable during the planning window; status is stale or not tied to Plant/Facility. | Stale/ambiguous status fails closed; fresh status updates available capacity and triggers scenario rerun with lineage. |
| T09 | Cross-agent synthesis | Demand/Commercial/Supply/Finance outputs contain inconsistent units and Finance actuals stop before plan period. | Executive summary marks financial KPI unavailable, preserves source disagreement, and requests Finance assumptions rather than extrapolating silently. |
| T10 | Platform/policy | Timeout, API 403, duplicate/reordered event, malformed tool response, human rejects plan, workflow restart. | Safe retry only for idempotent reads; no action on 403/timeout/rejection; state recoverable; audit and escalation complete. |

### Required Test Prompts

- “Compare this versioned product-region forecast against the supply plan and list blocking unit/key gaps before calculating a demand-supply balance.”
- “Apply the cold-winter scenario only under the documented impact semantics; show base, alternative and formula.”
- “A procurement plan conflicts with the supply plan. Identify the conflict and route it to the authorized planner; do not release a PO.”
- “Asset status is stale for Plant R100. Exclude or block its capacity contribution and request current status.”
- “Summarize this architecture/model answer with citations; distinguish repository fact from SAP landscape assumption.”

## 6. Success Criteria

### MVP Gate (mocked, read-only)

- All five selected agents pass documented scope/routing and output-schema tests.
- At least 95% of golden factual answers include a resolvable source citation; zero fabricated source references in the release suite.
- All unit-dependent calculations either use an approved conversion or block/label as conditional; zero silent UoM assumptions.
- All required entity joins report coverage and unmatched records; no silent dropping or false-positive joins.
- Contract tests cover valid, invalid, duplicate, stale, out-of-order and missing-dependency events; duplicate events are idempotent.
- 100% of mandatory approval-gate tests block action when approval is absent, denied, expired or by an unauthorized role.
- No high-severity safety, privacy, permission, financial-control or policy violation in the agreed red-team suite.
- End-to-end mocked Demand-to-Supply flow completes with traceable state, decisions, source lineage and recoverable error paths.

### Non-Production Integration Gate

- Read-only SAP/Datasphere outputs reconcile to approved source reports within business-approved tolerances.
- API/event authorization, rate limits, timeouts, retry/dead-letter, audit, monitoring and recovery are tested.
- No direct table writes, shared ERP credentials, or agent-controlled approval bypass.
- Domain owners approve KPI formulas, data contracts, process outcomes and residual risks.

### Production Pilot Gate

- Customer-specific security/privacy/architecture/legal approvals and support model are in place.
- User acceptance, parallel run, business continuity, rollback and operational runbooks are signed off.
- SLOs, on-call ownership, incident classification, change control, cost budgets and model/prompt evaluation are operating.
- Only a bounded use case with human authorization is enabled; success is measured against an agreed baseline.

Thresholds above are proposed MVP criteria and require owner approval before becoming contractual acceptance criteria.

## 7. Dependencies and Blockers

| Dependency | Why it blocks/conditions testing | Required action |
|---|---|---|
| Runtime selection and deployment | No orchestration service or execution harness is in the repository. | Select ICA Edge execution surface, state store, model/tool interface and CI/CD path. |
| Demand Planning sample dictionary | Demand CSV has no documented unit/version/scenario semantics. | Create dictionary and approve schema, grain, UoM and expected transformations. |
| Procurement Plan contract/fixture | Supply Planning depends on Procurement Plan, but no plan payload is specified. | Define mock schema then producer ownership, event trigger, keys, status and SLA. |
| Asset Status contract/fixture | Supply Planning needs equipment availability; current sample has static master/history, not a live status event. | Define timestamped Asset_ID/site status, capacity impact, validity and source. |
| Material master | Procurement, Warehouse, maintenance spares and supply inventory do not join consistently by material. | Create governed Material_ID and alias/crosswalk; validate UoM and plant/storage scope. |
| Customer/Product identity | Demand sample names and product/region keys do not consistently map to masters. | Add IDs or governed alias bridges; record documented match coverage. |
| KPI ownership and definitions | Enterprise KPI model has six broad KPIs and formulas for two; many operational targets are illustrative. | Approve owner, formula, denominator, grain, source, target and period. |
| Security/identity approval | No user/agent role mapping or endpoint authorization is configured. | Threat model, SSO/RBAC, source ACL and secrets design before non-production SAP integration. |
| SAP landscape and API availability | SAP reference is illustrative, with no customer's versions/licensing/API inventory. | Discover landscape and validate target SAP products/released APIs and Simplification List. |
| Domain owners and approvers | Human gates are specified conceptually but not mapped to named roles/workflows. | Approve RACI, delegation, escalation timers, exception owners and workflow behavior. |

## 8. Dependencies and Execution Order

1. Establish an accountable product owner, five agent owners, platform/security lead, data stewards and process approvers.
2. Select the ICA Edge runtime and create isolated development/test environments, identity, secrets, logs and state persistence.
3. Freeze first-pass input/output schemas and semantic definitions for the selected agents; resolve or explicitly block missing UoM/entity keys.
4. Build Data Analytics validation and curated read-only test views; establish test fixtures and source/version provenance.
5. Implement Enterprise Architecture and Knowledge Repository in read-only mode with ACL/citation and decision-record behaviors.
6. Complete Demand Planning data dictionary and run deterministic unit-level forecast/scenario tests.
7. Build Supply Planning against mocked Procurement Plan and Asset Status contracts; validate constraints, inventory, units and exception gates.
8. Run end-to-end mocked Demand Forecast -> Supply Planning -> human review; then add procurement and asset connectors only after contract-owner approval.
9. Perform non-production API/event/security/reconciliation tests with SAP or approved simulators.
10. Pilot a bounded process with parallel run, human authorization, operational support and measurable exit criteria; expand by risk/readiness wave.

## 9. 30-60-90 Day Execution Roadmap

| Timebox | Outcomes | Work items | Exit criteria / go-no-go |
|---|---|---|---|
| Days 0-30: Foundation and test design | Runtime choice, governance, schemas and repeatable test harness. | Name product/security/data/process owners; select orchestrator/runtime; define identity and context envelope; add Demand dictionary; agree common result schema; establish CSV loaders, JSON/schema tests, golden fixtures and trace logging. Implement read-only prototypes for Data Analytics, EA and Knowledge Repository. | CI runs static/schema tests; 3 foundation agents produce cited, typed, ACL-aware results on fixtures; no writes permitted; owners approve contracts and test plan. |
| Days 31-60: Isolated agents and mocked planning | Five agents testable in isolated/mocked environment. | Complete Demand forecast/scenario evaluation; build Supply Planning with mocked Procurement Plan and Asset Status; add key/unit/constraint checks; test approval gates, timeout, retry and duplicate events; expand evaluation set with malformed/stale/unmatched data. | Demand-to-Supply mock flow runs deterministically; missing units/keys block correct tasks; approvals cannot be bypassed; domain owners accept test outputs and residual limitations. |
| Days 61-90: Non-production integration and pilot decision | Evidence for a bounded sandbox pilot, not automatic production deployment. | Discover/validate target SAP landscape; connect read-only Datasphere/CDS/API sandbox or simulator; test event/API security, reconciliation, monitoring and recovery; run user acceptance and parallel comparison; develop cutover/rollback and support plan. | Data/API reconciliations meet owner-approved tolerances; security/legal/architecture approvals are documented; operational support, SLOs, runbooks and rollback pass tabletop; steering group makes go/no-go pilot decision. |

**Schedule caveat:** dates are planning intervals, not commitments. SAP sandbox access, identity approvals, master-data remediation, and runtime availability may be on the critical path and can shift the roadmap. Do not enable production writes within 90 days solely because the schedule elapsed.

## 10. Priority Backlog After MVP

1. Add dictionaries for Corporate Strategy and Transformation PMO; standardize all agent schemas.
2. Reconcile the 28 process-model handoffs with AIM's three contracts; assign implementation status and owners.
3. Build Material, Cost Center/GL, Counterparty, Commodity/Benchmark, Ship-To and Carrier master domains.
4. Expand KPI catalog/formulas and define Data Analytics freshness/quality/lineage SLAs.
5. Add Procurement and Asset Reliability as contract-tested dependencies for Supply Planning.
6. Add Warehouse/Logistics execution, then P2P/M2R workflow pilots with human gates.
7. Extend evaluations to HSE, trading/credit, ESG disclosure and financial controls before higher-risk workflows.
8. Perform capacity, resilience, disaster recovery, red-team, drift, privacy and cost tests before wider production rollout.

## 11. Source Artifacts

- `agent_orchestration_framework.md`, all 19 agent `SKILL.md` files and the master `SKILL.md`.
- `agent_capability_matrix.md`, `agent_collaboration_patterns.md`, `Agent_Interaction_Model.md`.
- `enterprise_process_model.md`, `Enterprise_Capability_Model.md`, `Enterprise_KPI_Model.md`, `entity_relationship_model.md`.
- `sap_reference_architecture.md`, `master-data/README.md`, `master-data/README_master_data_model.md`, `master-data/master_data_dictionary.md`, `master-data/data_relationship_matrix.csv`.
- `sop_workflow_walkthrough.md`, `demand_to_supply_walkthrough.md`, `procure_to_pay_walkthrough.md`, `maintenance_to_reliability_walkthrough.md`, `ecc_to_s4hana_transformation_walkthrough.md`.
- Agent sample CSVs and sample-data dictionaries where present.

The plan treats SAP/BTP products, APIs, event topics and architecture components as candidates until actual customer landscape, licensing, security, process-owner and release details are confirmed.

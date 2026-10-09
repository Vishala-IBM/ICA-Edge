# ICA Edge Agent Build Plan

## Scope and Source Constraints

This build plan is limited to the five MVP agents named in `mvp_agent_testing_plan.md` and the per-agent specifications/readiness states in `agent_execution_specifications.md`.

**Current status:** The two source artifacts describe a design and synthetic-data testing plan. They state that no runnable orchestration service, tool adapters, deployed SAP/BTP endpoints, workflow persistence, or automated execution harness is present. Therefore the work below builds toward controlled mock/sandbox readiness, not production deployment.

**Connector-source limitation:** `agent_tool_connector_matrix.md` was not present at the requested path. Connector requirements below are synthesized only from the two allowed artifacts and are candidate requirements, not a verified connector inventory.

### MVP Agents

1. Data-Analytics-Agent — Ready for isolated prototype testing.
2. Enterprise-Architecture-Agent — Ready for isolated prototype testing.
3. Knowledge-Repository-Agent — Ready for isolated prototype testing, with ACL fixtures required.
4. Demand-Planning-Agent — Major Gaps; add its sample-data dictionary and define unit/scenario semantics.
5. Supply-Planning-Agent — Minor Gaps; use mocked Procurement Plan and Asset Status dependencies and resolve material/UoM keys.

“Ready” in this plan means isolated, read-only prototype readiness only. The source documents state that end-to-end execution readiness is 0/19 agents.

## Sprint 1 Plan: Runtime and Contract Foundation (Weeks 1-2)

### Goals

Establish a safe, repeatable test environment and common agent request/result contract before implementing domain orchestration.

### Work

- Select an ICA Edge orchestration runtime/state store and define deployment environments; runtime selection is not specified in the source artifacts.
- Define versioned agent input/output schemas, request/workflow/task IDs, source references, period, grain, canonical keys, UoM/currency, classification and permitted actions.
- Build a read-only CSV/JSON fixture adapter with schema validation, deterministic snapshots and synthetic test fixtures.
- Set up CI test runner, golden prompts/results, source-citation checks, key/unit validators, policy tests and regression reports.
- Add mocked identity/roles, ACL checks, secrets handling, structured logs/traces and redacted errors.
- Define Procurement Plan and Asset Status mock schemas for the later Supply Planning tests; do not describe them as live contracts.

### Deliverables

- Runtime decision record and local development/test harness.
- Common versioned request/result envelope and error/status taxonomy.
- CI checks for schema, source traceability, access policy and deterministic fixture loading.
- Threat/data-access assumptions and agent-owner acceptance checklist.

### Exit Criteria

- Fixtures load reproducibly and invalid schemas are rejected with actionable errors.
- Every test result contains request ID, agent/version, sources, assumptions, status and trace IDs.
- No SAP writes or production credentials are available to the test environment.
- Owners approve the common contract and mocked dependency schemas.

## Sprint 2 Plan: Foundation Agents (Weeks 3-4)

### Goals

Implement and evaluate the three data/architecture/knowledge foundation agents as isolated, read-only services.

### Build Order

1. **Data-Analytics-Agent:** source ingestion/validation, canonical-key checks, quality findings, lineage and a small governed planning data product.
2. **Enterprise-Architecture-Agent:** application/technology/interface inventory analysis, architecture decision record, integration-pattern and risk recommendations.
3. **Knowledge-Repository-Agent:** permission-aware retrieval and cited responses over approved artifacts; stale/conflicting-source warnings.

### Required Connectors and Tools

- Data Analytics: local CSV/JSON adapter, schema/quality validator, catalog/lineage and mocked Datasphere/BDC/SAC boundary.
- Enterprise Architecture: fixture-backed application/interface/technology inventory; architecture decision and risk register; mock SAP Readiness Check/ATC input format.
- Knowledge Repository: local/mock document index, metadata/version store, citation resolver, synthetic ACL/identity filter and feedback/audit capture.
- Shared: schema registry, request-scoped context, traces/logging, test runner, secrets/identity mock and policy enforcement.

### Exit Criteria

- Data Analytics reports matched/unmatched keys, quality severity and lineage without silent row drops or invented identities.
- Enterprise Architecture separates verified fixture facts from assumptions and records owner/review status for decisions.
- Knowledge answers cite resolvable, authorized sources; denied documents do not leak through summaries or citations.
- All three pass scope/routing, missing-data, stale-source, permission-denial and malformed-input tests.

## Sprint 3 Plan: Demand-to-Supply Mock Workflow (Weeks 5-6)

### Goals

Implement Demand Planning and Supply Planning on validated fixtures and demonstrate a deterministic, read-only, human-reviewed planning workflow.

### Build Order

1. **Demand-Planning-Agent:** forecast/scenario analysis and a versioned Demand Forecast output contract.
2. **Supply-Planning-Agent:** constrained/unconstrained planning using demand, production, inventory, constraints and explicitly mocked Procurement Plan/Asset Status inputs.
3. **Master-router workflow:** Data Analytics quality check -> Demand forecast -> Commercial review placeholder/approved adjustments -> Supply constraints -> human review -> typed plan/exception output.

### Required Connector Set

- Local CSV and approved fixture snapshots for the demand, production, inventory and constraint inputs named in `mvp_agent_testing_plan.md`.
- Versioned JSON Schema or equivalent for Demand Forecast, Procurement Plan and Asset Status.
- Mock event/API adapter with correlation IDs, idempotency, schema version, replay and timeout behavior.
- Calendar/UoM conversion reference, customer/product/region/plant keys, and a mock inventory snapshot with canonical Material_ID.
- Human approval task mock for planner review; no production release or system write.

### Mandatory Pre-Work

- Create `Demand-Planning-Agent/sample-data/data_dictionary.md`.
- Define and approve forecast UoM, grain, period, version, scenario-impact semantics, source/as-of and actuals/holdout fixture.
- Mark Material, customer/product alias and region-to-plant gaps; use explicit test crosswalks only.
- Label Procurement Plan and Asset Status fixtures as mocks; identify their future producer/owner and required semantics.

### Exit Criteria

- Base and alternative forecasts are versioned and reproducible; missing UoM or ambiguous scenario meaning blocks or labels conditional calculations.
- Supply outputs by Product/Plant/Period/UoM include constraints, assumptions, shortages/surpluses, quality flags and approval request.
- Duplicate event replay is idempotent; stale/invalid dependencies fail closed; no plan is published as approved without human approval.
- Demand-to-Supply traces all inputs and outputs to fixture version and source; domain owners accept residual limitations.

## 4. Agent Build Order

| Order | MVP agent/component | Reason / dependency |
|---:|---|---|
| 1 | Data-Analytics-Agent | Provides data quality, canonical keys, lineage and governed read model needed by all later agents. |
| 2 | Enterprise-Architecture-Agent | Establishes architecture/integration/security boundaries before external connectors. |
| 3 | Knowledge-Repository-Agent | Supplies permission-aware, cited context and reusable evidence for all agents. |
| 4 | Demand-Planning-Agent | Produces the explicit Demand Forecast input to Supply Planning; dictionary/UoM semantics are a gate. |
| 5 | Supply-Planning-Agent | Tests the central planning outcome; initially depends on mock Procurement Plan and Asset Status contracts. |
| 6 | Master router / workflow composition | Compose the five agents only after isolated tests and the mocked dependency contracts pass. |

This order matches the MVP plan’s priority list. The router is a shared runtime component, not one of the five domain agents.

## 5. Dependencies

| Dependency | Needed for | Gate / response |
|---|---|---|
| Runtime, workflow state and CI harness | All five agents | Select and configure before agent service integration; otherwise only offline prompt/data tests are possible. |
| Common request/result schema | All agents and router | Version and test correlation IDs, sources, keys, UoM, status, errors and approval state. |
| Data Analytics data-quality service | All downstream tests | Must flag missing/ambiguous keys and units before calculations proceed. |
| Enterprise Architecture inventory/pattern decision | Connector selection and SAP integration | Actual target landscape is not in source artifacts; use fixtures until customer discovery. |
| Knowledge corpus, version and ACL fixtures | Knowledge Repository and all evidence-grounded responses | Deny unauthorized content and surface stale/superseded/conflicting documents. |
| Demand dictionary and semantic contract | Demand Planning and Supply Planning | Blocking prerequisite for reproducible field-level forecast tests. |
| Product/Customer/Region/Plant masters and aliases | Demand/Supply joins | Record coverage and unmatched population; do not silently coerce names to IDs. |
| UoM, calendar and currency reference | Demand/Supply calculations and any financial extension | Use approved conversion/version or block the calculation. |
| Procurement Plan mock | Supply Planning | Versioned supplier/material/plant/date/quantity/UoM/status payload with defined producer ownership. |
| Asset Status mock | Supply Planning | Timestamped Asset_ID/site/status/capacity impact and validity period. |
| Material master / alias mapping | Inventory/procurement integration | Not available as a canonical master; mocked Material_ID allowed only in isolated tests. |
| Human approval task | Forecast exception and constrained plan | Approval, denial, expiry and unauthorized-approver paths must be tested. |

## 6. Required Connectors

The source artifacts identify connector classes, not actual endpoints. Treat each connector as a mocked adapter until its owner, system, version, authorization and SLA are confirmed.

| Connector | MVP use | Sprint |
|---|---|---:|
| CSV/JSON fixture loader | Read-only sample and edge-case data; deterministic source snapshots. | 1-3 |
| Schema/contract validator | Validate agent envelopes, data dictionaries and forecast/plan dependency payloads. | 1 |
| Identity/ACL and secrets mock | Enforce requester/agent scopes and test denied access without credentials in prompts. | 1-2 |
| Catalog/lineage/quality adapter | Data Analytics source inventory, quality reports and lineage references. | 1-2 |
| Knowledge retrieval adapter | Local/mock index with version, citation, ACL and feedback. | 2 |
| Architecture inventory adapter | Application, technology and interface fixture imports; decision record output. | 2 |
| Mock planning/event API | Forecast publish, plan subscribe, Procurement Plan/Asset Status stubs, idempotency and replay. | 3 |
| Calendar/UoM conversion service | Normalize dates/periods and quantities only from approved conversion fixture. | 1-3 |
| Telemetry/evaluation | Trace IDs, structured errors, golden cases, regression and policy results. | 1-3 |
| SAP reads (later, non-production) | Released S/4 CDS/OData, Datasphere/BDC semantic views; ECC/BW extract path if needed. | Post-sprint gate |
| SAP workflow/write APIs (later) | Approved Integration Suite/API Management and human workflow only. | Post-sandbox approval |
| Event Mesh / Integration Suite (later) | Versioned producer/consumer events after contracts and deployment are approved. | Post-contract gate |

## 7. Testing Strategy

1. **Static and specification tests:** agent identity/routing, required input/output fields, source references, scope limits, readiness status and versioning.
2. **Data contract tests:** valid/invalid schema, required/optional field, key format, duplicate IDs, null UoM, stale period, conflicting alias, unsupported currency/unit.
3. **Grounding tests:** known-answer prompts against fixture data; validate source values, calculations, citations, assumption labels and abstention.
4. **Agent behavior tests:** routine task, exception, scenario comparison, out-of-scope request, missing data and escalation path for each MVP agent.
5. **Knowledge and ACL tests:** current vs superseded content, permission denial, prompt injection in a source document, broken citation and no-result abstention.
6. **Architecture decision tests:** illustrative ECC vs unknown/mixed landscape, EOL/prohibited technology, missing interface owner, clean-core exception; never label an assumption as deployed.
7. **Demand/Supply workflow tests:** baseline vs cold scenario, missing unit, >20% variance escalation, constraint overlap, stale asset state, procurement/supply conflict, missing inventory, invalid/replayed event.
8. **Approval tests:** approve, reject, expire, wrong role, duplicate approval, human rework and cancellation; all mandatory gates prevent plan release without valid approval.
9. **Reliability/error tests:** timeout, 403/ACL denial, retry, duplicate event, out-of-order event, dependency unavailable, partial workflow restart and trace completeness.
10. **Regression and owner acceptance:** version fixtures/prompts; domain owners approve ground truth, KPI formulas and pass thresholds before changing acceptance baselines.

## 8. Success Criteria

### Sprint 1

- Runtime/test harness, common schemas, identity/policy mock, source tracing and CI checks run reproducibly.
- No production credentials or write path are available.
- Owners approve contracts, fixture conventions and acceptance thresholds.

### Sprint 2

- Data Analytics reproduces fixture counts/joins and reports unmatched data with remediation ownership; zero silent drops.
- Enterprise Architecture separates fixture facts from assumptions and records decisions, risks and approver status.
- Knowledge Repository returns resolvable authorized citations; zero ACL leakage and explicit stale/conflict warnings.

### Sprint 3

- Demand forecast is versioned with UoM, period, scenario semantics, source and key coverage; absent actuals prevent fabricated accuracy claims.
- Supply plan reports normalized options, assumptions, constraint impacts and exceptions; incompatible units/keys block numeric balance.
- Mock Demand Forecast contract passes invalid, duplicate, stale and replay tests with idempotent behavior.
- 100% of approval-gate tests block execution when approval is absent, denied, expired or unauthorized.
- No high-severity privacy, safety, financial-control or policy violation in the agreed suite.
- All outputs are traceable to workflow ID, agent/version, source snapshot and human decision state.

Thresholds are proposed by `mvp_agent_testing_plan.md`; business owners must approve them before they become formal release criteria.

## 9. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Runtime not selected/available | Make runtime decision in Sprint 1; keep design/test interfaces runtime-neutral until selected. |
| Demand unit/scenario semantics missing | Add dictionary and approved UoM/scenario contract before forecast comparison; block invalid calculations. |
| Material/customer/product keys incomplete | Use explicit test aliases and quality coverage; create master-data remediation backlog; do not equate Product and Material. |
| Procurement Plan/Asset Status interfaces are only concepts | Use versioned mocks; define owner, payload, SLA, replay and error semantics before integration. |
| Sample data is synthetic and may be inconsistent | Maintain deterministic fixtures, identify ground truth, test known inconsistencies and label results as synthetic. |
| Architecture assumptions mistaken for deployed SAP facts | Require Enterprise Architecture evidence and source/version references; use simulated landscapes until validated. |
| Unauthorized or unsafe actions | Read-only MVP; strict role boundaries; mock human approvals; no SAP writes until separate security/go-live gate. |
| Knowledge retrieval leakage or stale advice | ACL-before-retrieval, citation verification, version status, revocation and red-team tests. |
| Over-scoping the first workflow | Limit Sprint 3 to Demand-to-Supply with deterministic mocks; defer Procurement/Asset connectors and all production execution. |

## 10. Go-Live Readiness Criteria

“Go-live” means a bounded ICA Edge pilot in a customer-approved non-production or controlled environment; it does not authorize general production SAP writes.

- [ ] Runtime, workflow persistence, environments and deployment/rollback are selected and tested.
- [ ] All five MVP agents have approved scope, input/output contracts, owners, source lists and versioned evaluation cases.
- [ ] Demand Planning dictionary and UoM/period/scenario definitions are complete; master-data coverage and exceptions are visible.
- [ ] Procurement Plan and Asset Status dependencies have approved schemas, owners, SLA and mock/integration test evidence.
- [ ] Data connectors use least privilege, source ACLs, secrets management, classification, audit and trace IDs.
- [ ] Knowledge retrieval has permission, citation, stale-content and revocation tests with no leakage.
- [ ] Demand-to-Supply workflow passes baseline, scenario, constraint, missing-data, timeout, replay and human rejection tests.
- [ ] No downstream plan publication or write action occurs without the named human approval; there is a tested cancellation/rollback path.
- [ ] Security/privacy/architecture/domain owners accept residual risk; support owner, monitoring, alerting, incident process and SLOs are documented.
- [ ] Data/KPI reconciliation thresholds and business acceptance are signed off; all known limitations are visible to users.
- [ ] Production credentials and SAP write APIs remain disabled unless a separate production approval explicitly authorizes them.

## Source Note

This plan uses only `mvp_agent_testing_plan.md` and `agent_execution_specifications.md`, as requested. The separate `agent_tool_connector_matrix.md` was not available at the named location; connector details here therefore reflect the two source artifacts and remain candidate requirements, not a verified endpoint inventory.

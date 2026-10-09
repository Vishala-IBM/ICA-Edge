# ICA Edge MVP Agent Configuration

**Configuration Readiness:** Specification-ready for isolated, read-only/mock configuration. Not deployment-ready: the ICA Edge runtime, tool adapters, workflow persistence, identity integration and automated execution harness are not established in the build plan. End-to-end readiness remains 0/19 agents.

## MVP Agent Configurations

### Data-Analytics-Agent

- **1. Agent Name:** Data-Analytics-Agent
- **2. Purpose:** Read-only source validation, canonical-key checks, lineage, quality findings and governed planning data products; no domain decisions.
- **3. System Prompt Reference:** The source spec has no dedicated prompt section; compose from [Decision Logic](data_analytics_agent_implementation.md#6-decision-logic) and [ICA Edge Configuration](data_analytics_agent_implementation.md#8-ica-edge-configuration). Enforce provenance, no silent drops/coercion, ACL checks and read-only behavior.
- **4. Context Sources:** `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`, approved `master-data/*.csv`, and selected domain snapshots; synthetic fixtures in prototype.
- **5. Memory Requirements:** Request-scoped source versions, key coverage, quality results, lineage and trace IDs; no implicit cross-request business memory. Persist only governed results and audit metadata.
- **6. Inputs:** Versioned request context, source snapshots/metadata, quality rules, domain definitions, ACL/classification and requested data product.
- **7. Outputs:** Typed data product/reference, quality findings/severity, matched/unmatched counts, lineage, exceptions and remediation owner/action.
- **8. Human Approval Gates:** Domain owner approves business definitions/quality thresholds; data owner/security approves sensitive access; model-risk owner approves production ML where applicable.
- **9. Deployment Priority:** 1. Foundational data-quality service for downstream agents.

### Enterprise-Architecture-Agent

- **1. Agent Name:** Enterprise-Architecture-Agent
- **2. Purpose:** Assess verified application/technology/interface inventory and provide governed architecture options, risks and ADR drafts.
- **3. System Prompt Reference:** The source spec has no dedicated prompt section; compose from [Decision Logic](enterprise_architecture_agent_implementation.md#6-decision-logic) and [ICA Edge Configuration](enterprise_architecture_agent_implementation.md#8-ica-edge-configuration). Enforce evidence/assumption separation and prohibit unsupported deployed-state claims.
- **4. Context Sources:** `application_inventory.csv`, `integration_inventory.csv`, `technology_standards.csv`, verified customer landscape evidence and approved architecture constraints; fixtures are illustrative.
- **5. Memory Requirements:** Request-scoped evidence/source versions, assumptions, risks, ADR draft and review status; do not infer or retain unverified landscape facts as authoritative.
- **6. Inputs:** Versioned request, actual system/release inventory, interface metadata, capability/process needs, security constraints, lifecycle/support evidence and cost where approved.
- **7. Outputs:** Current-state findings, target options/patterns, disposition, risks, dependencies, assumptions and ADR draft with owner/approval/review status.
- **8. Human Approval Gates:** Architecture Board/security authority approves target patterns, exceptions, product/license choices and cutover-impacting decisions.
- **9. Deployment Priority:** 2. Establishes architecture, integration and security boundaries before external connectors.

### Knowledge-Repository-Agent

- **1. Agent Name:** Knowledge-Repository-Agent
- **2. Purpose:** Retrieve and synthesize approved knowledge with permission-aware citations, freshness/conflict warnings and safe abstention.
- **3. System Prompt Reference:** The source spec has no dedicated prompt section; compose from [Decision Logic](knowledge_repository_agent_implementation.md#6-decision-logic), [Search Strategy](knowledge_repository_agent_implementation.md#7-search-strategy) and [ICA Edge Configuration](knowledge_repository_agent_implementation.md#9-ica-edge-configuration) for grounding, ACL and abstention policy.
- **4. Context Sources:** `document_catalog.csv`, `architecture_patterns.csv`, `best_practices.csv` and approved, versioned reference documents with ACL/classification metadata.
- **5. Memory Requirements:** Request-scoped caller ACL, query, retrieved source IDs/versions, citations and audit outcome. Do not retain unrestricted corpus or implicit cross-request conversation memory.
- **6. Inputs:** Caller identity/roles, query/context, approved corpus, metadata, publication/supersession status and source/access constraints.
- **7. Outputs:** Grounded answer/search result with resolvable authorized citations, freshness/conflict warnings, related sources, status and review request/abstention where needed.
- **8. Human Approval Gates:** Document owner/SME approves publication and lessons; ACL owner approves access; legal/HSE/compliance authority reviews regulated or safety-critical content.
- **9. Deployment Priority:** 3. Provides reusable, governed context to other agents; ACL fixtures are required.

### Demand-Planning-Agent

- **1. Agent Name:** Demand-Planning-Agent
- **2. Purpose:** Produce versioned baseline and scenario forecasts by approved product/customer/region/time grain for human review; no execution.
- **3. System Prompt Reference:** [demand_planning_agent_implementation.md](demand_planning_agent_implementation.md#3-system-prompt) for forecast, unit, scenario, provenance and abstention rules.
- **4. Context Sources:** `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`, customer/product/region masters and Commercial Marketing segment/pricing/product fixtures; all sample data is synthetic.
- **5. Memory Requirements:** Request-scoped source versions, keys, period/UoM, method/scenario, exceptions and approval state. Persist immutable forecast versions and decisions only through approved workflow storage; no implicit conversational memory.
- **6. Inputs:** Authorized planning request, horizon/grain, versioned dataset references, explicit scenario definitions, approved UoM/calendar and method configuration; compatible reference forecast for variance review.
- **7. Outputs:** Versioned baseline/alternatives, assumptions, source lineage, data-quality exceptions, optional metrics and planner/commercial approval request.
- **8. Human Approval Gates:** Planner approves consensus forecast; >20% variance triggers planner review; commercial changes require authorized Commercial owner approval.
- **9. Deployment Priority:** 4. Requires data dictionary and approved unit/period/scenario semantics before repeatable field-level testing.

### Supply-Planning-Agent

- **1. Agent Name:** Supply-Planning-Agent
- **2. Purpose:** Reconcile approved demand with production, inventory, constraints, procurement commitments and asset availability into explainable supply alternatives.
- **3. System Prompt Reference:** [supply_planning_agent_implementation.md](supply_planning_agent_implementation.md#3-system-prompt) for feasibility, unit/key, stale dependency, approval and no-write rules.
- **4. Context Sources:** `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`; approved Demand Forecast; selected Warehouse/Refining fixtures; mock Procurement Plan and Asset Status; approved masters and UoM/calendar references.
- **5. Memory Requirements:** Request/workflow state, source and forecast versions, dependency timestamps, constraints, plan alternatives, idempotency and human decisions; persist only in approved workflow storage.
- **6. Inputs:** Approved/versioned forecast, production/inventory/constraint snapshots, valid dependency payloads, canonical keys, capability, calendar/UoM and approved planning method/objective.
- **7. Outputs:** Constrained/unconstrained draft alternatives, feasibility, inventory/gap/constraint impacts, assumptions, exceptions, provenance and approval request.
- **8. Human Approval Gates:** Planner/S&OP owner approves plan; Operations approves plant limits/constraint interpretation; humans approve procurement/allocation exceptions. No plan, PO or production release by the agent.
- **9. Deployment Priority:** 5. Depends on Demand Forecast contract, Material/UoM mapping and mocked Procurement Plan/Asset Status; integrate after isolated tests.

## Deployment Dependencies

- Select runtime, model/tool interface, workflow state store, environments and CI/test harness.
- Approve common request/result envelopes, per-agent schemas, source/version/provenance conventions and error/status handling.
- Implement least-privilege identity, ACL propagation, secrets management, audit, redacted telemetry and retention.
- Provide deterministic synthetic fixtures; close Demand dictionary/UoM/scenario gaps and Supply Material_ID/UoM and mock dependency contracts.
- Configure human approval tasks, timeout/rejection behavior, correlation IDs and idempotency before orchestration.
- Keep production credentials, SAP writes and plan releases disabled until separate integration, security and go-live approvals.

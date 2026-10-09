# ICA Edge Agent Deployment Package

**Deployment Readiness:** Specification-ready for isolated mock/read-only deployment only. Not deployable to an enterprise environment until the ICA Edge runtime, execution harness, workflow state, identity, tools and approved connectors are configured. Overall end-to-end readiness remains 0/19.

**Blocking Dependencies:** Runtime/environment and CI harness selection; common versioned request/result schemas; identity/ACL and secrets controls; approved source owners and access; Demand Planning dictionary/UoM/scenario semantics; Supply Planning Material_ID/UoM and mock Procurement Plan/Asset Status contracts; human approval workflows. No SAP production writes are in MVP scope.

## MVP Agent Deployment Specifications

### Data-Analytics-Agent

- **1. Agent Name:** Data-Analytics-Agent
- **2. System Prompt Reference:** Use the source guidance specified for this agent in [ica_edge_mvp_agent_configuration.md](ica_edge_mvp_agent_configuration.md); enforce provenance, quality/ACL gates and read-only behavior.
- **3. Input Definition:** Versioned request context, source snapshot/metadata, quality rules, domain definitions, scope and ACL/classification.
- **4. Output Definition:** Typed data-product reference, quality status/findings, matched/unmatched counts, lineage, exceptions and remediation owner/action.
- **5. Tool Assignments:** Read-only fixture loader; schema/quality validator; canonical-key/crosswalk check; catalog/lineage; telemetry/evaluation.
- **6. Connector Assignments:** CSV/JSON and approved master-data snapshots first. Datasphere/BDC/SAC or SAP APIs are later candidates after authorization and reconciliation.
- **7. Memory Requirements:** Request-scoped source versions, quality/key coverage, lineage and trace IDs; persist governed results/audit metadata only.
- **8. Approval Gates:** Domain owner approves definitions/quality thresholds; data owner/security approves sensitive access; model-risk approval for production ML where applicable.
- **9. Deployment Sequence:** Priority 1; establish and validate before downstream agent workflows.

### Enterprise-Architecture-Agent

- **1. Agent Name:** Enterprise-Architecture-Agent
- **2. System Prompt Reference:** Follow the agent-specific prompt composition guidance in [ica_edge_mvp_agent_configuration.md](ica_edge_mvp_agent_configuration.md); separate evidence from assumptions and prohibit unsupported deployed-state claims.
- **3. Input Definition:** Versioned request, application/system/release and interface inventory, capability/process needs, standards, lifecycle evidence and approved constraints.
- **4. Output Definition:** Evidence-backed findings/options, risks, dependencies, assumptions and ADR draft with owner/approval/review status.
- **5. Tool Assignments:** Fixture inventory reader/validator; architecture pattern/risk analysis; ADR draft output; trace/audit logging.
- **6. Connector Assignments:** Application, integration and technology-standard fixture files first. CMDB, SAP Readiness Check/ATC and portfolio tools are candidates pending customer selection/access approval.
- **7. Memory Requirements:** Request-scoped evidence/version, assumptions, risks and ADR review state; no persistent unverified landscape facts.
- **8. Approval Gates:** Architecture Board/security authority approves target patterns, exceptions, product/license choices and cutover-impacting decisions.
- **9. Deployment Sequence:** Priority 2; define integration/security boundaries before live connector selection.

### Knowledge-Repository-Agent

- **1. Agent Name:** Knowledge-Repository-Agent
- **2. System Prompt Reference:** Follow agent-specific guidance in [ica_edge_mvp_agent_configuration.md](ica_edge_mvp_agent_configuration.md); enforce ACL-before-retrieval, citation validation, freshness warnings and abstention.
- **3. Input Definition:** Caller identity/roles, query/context, approved corpus, document/version/ACL metadata and source constraints.
- **4. Output Definition:** Grounded answer/search result with resolvable authorized citations, freshness/conflict warnings, status and review request or abstention.
- **5. Tool Assignments:** ACL-filtered retrieval; metadata/version lookup; citation resolver; feedback/audit capture.
- **6. Connector Assignments:** Local/mock document index and approved corpus files first. Enterprise repository, SAP DMS/Work Zone and identity-provider integrations require owner/security approval.
- **7. Memory Requirements:** Request-scoped caller ACL, query, source IDs/versions, citations and audit outcome; no unrestricted corpus or implicit cross-request memory.
- **8. Approval Gates:** Document owner/SME approves publication/lessons; ACL owner approves access; legal/HSE/compliance authority reviews regulated or safety-critical content.
- **9. Deployment Sequence:** Priority 3; configure ACL/citation fixtures before enabling consumers.

### Demand-Planning-Agent

- **1. Agent Name:** Demand-Planning-Agent
- **2. System Prompt Reference:** Use the agent prompt reference in [ica_edge_mvp_agent_configuration.md](ica_edge_mvp_agent_configuration.md); preserve explicit unit/scenario semantics, versioning, provenance and abstention.
- **3. Input Definition:** Authorized planning request, horizon/grain, versioned demand/sales and master-data sources, scenario definitions, approved calendar/UoM and method configuration; compatible reference forecast for variance check.
- **4. Output Definition:** Versioned baseline/scenario forecast, assumptions, source lineage, data-quality exceptions, optional metrics and approval state/request.
- **5. Tool Assignments:** Read-only fixture loader; schema/key/unit validation; configured approved forecast method; versioned draft output/event; telemetry.
- **6. Connector Assignments:** Demand/sales/Commercial fixture files and master snapshots first. IBP, SD history, weather/market and event APIs are later candidates; no live connection assumed.
- **7. Memory Requirements:** Request-scoped source versions, keys, period/UoM, method/scenarios and approval state; immutable forecast versions only through approved workflow storage.
- **8. Approval Gates:** Planner approves consensus; >20% variance triggers planner review; commercial adjustments require authorized Commercial owner approval.
- **9. Deployment Sequence:** Priority 4; after foundation agents and after dictionary/UoM/period/scenario prerequisites pass.

### Supply-Planning-Agent

- **1. Agent Name:** Supply-Planning-Agent
- **2. System Prompt Reference:** Use the agent prompt reference in [ica_edge_mvp_agent_configuration.md](ica_edge_mvp_agent_configuration.md); enforce feasibility, key/unit/freshness checks, approval gates and no-write policy.
- **3. Input Definition:** Approved/versioned Demand Forecast, production/inventory/constraint snapshots, valid Procurement Plan and Asset Status payloads, canonical keys, calendar/UoM and approved planning method.
- **4. Output Definition:** Constrained/unconstrained draft alternatives, feasibility, inventory/gap/constraint impacts, assumptions, provenance, exceptions and approval request.
- **5. Tool Assignments:** Read-only fixture loader; schema/master/UoM validator; approved planning method/solver; mock dependency/event adapter; telemetry and idempotency control.
- **6. Connector Assignments:** Production, inventory, constraint and approved demand fixtures; mock Procurement Plan/Asset Status. IBP, released SAP read APIs and Event Mesh/Integration Suite remain gated candidates.
- **7. Memory Requirements:** Request/workflow state, source/forecast versions, dependency timestamps, constraints, alternatives, idempotency and human decisions in approved workflow storage.
- **8. Approval Gates:** Planner/S&OP owner approves plan; Operations approves plant limits; humans approve procurement/allocation exceptions. No plan/PO/production release by the agent.
- **9. Deployment Sequence:** Priority 5; only after Demand contract, Material_ID/UoM and mock dependency tests pass.

## Deployment Sequence

1. Select ICA Edge runtime, environments, state store, tool/model interface and CI/evaluation harness.
2. Establish common request/result schemas, trace/correlation, timeout/retry/idempotency, identity/ACL, secrets and audit controls.
3. Configure Data Analytics fixture sources, then Enterprise Architecture and Knowledge Repository fixtures; pass isolated quality, evidence, ACL and citation gates.
4. Close Demand Planning dictionary and unit/period/scenario contract; deploy against fixtures and pass forecast/approval tests.
5. Configure Supply Planning with compatible keys/UoM and versioned mock Procurement Plan/Asset Status; pass dependency and human-gate tests.
6. Request non-production SAP/API connectors only after architecture, security, data-owner, contract and reconciliation approval. Keep production writes disabled unless separately authorized.

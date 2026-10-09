# Agent Orchestration Framework

## 1. Purpose and Status

This framework defines a proposed execution model for the Energy Enterprise Transformation Advisor's 19 domain agents. It synthesizes the master `SKILL.md`, all 19 agent skills, Agent Interaction Model, enterprise process/capability/KPI and entity models, agent capability matrix, collaboration patterns, SAP reference architecture, and the S&OP, Demand-to-Supply, P2P, M2R, and ECC-to-S/4HANA walkthroughs.

**Implementation status:** design/reference only. The repository contains Markdown specifications and synthetic CSVs, not a runnable agent runtime, deployed SAP/BTP endpoints, production credentials, event topics, or an execution/evaluation harness. Handoff entries in process models are not evidence of deployed interfaces. The Agent Interaction Model defines only three explicit contracts into Supply Planning: Demand Forecast, Procurement Plan, and Asset Status.

## 2. Orchestration Principles

1. **Master router owns workflow state.** Domain agents own domain analysis; the router classifies, selects, sequences, waits, retries, escalates and synthesizes.
2. **Orchestrate by business process, not by agent count.** Invoke only agents needed to answer the user’s request and its material dependencies.
3. **Separate facts, assumptions and recommendations.** Every result identifies source, timestamp/period, units, keys, confidence/limitations and approval status.
4. **Plan before execution.** Agents may recommend plans; only approved, authorized APIs/workflows may create or change business transactions.
5. **Preserve domain authority.** Finance owns accounting approval, Procurement owns sourcing authority, Operations owns plant control, HSE owns safety/permit authority, Risk owns limits and credit policy, and executives own portfolio/stage-gate decisions.
6. **Use canonical keys and least privilege.** Read from governed semantic views or approved APIs; write only through named, authorized workflows/APIs. Never give agents shared ERP credentials or direct table-write access.
7. **Fail closed for high-consequence ambiguity.** Missing units, keys, authority, safety state, or contract data blocks execution and creates an actionable exception.

## 3. Agent Registry and Routing Domains

| Agent | Primary route / responsibility | Typical prerequisites or consumers |
|---|---|---|
| Corporate-Strategy-Agent | Strategy, portfolio, M&A, capital allocation and transition scenarios | Finance, ESG, Trading Risk, PMO, Commercial Marketing, EA |
| Commercial-Marketing-Agent | Customer/product/market insights, pricing and commercial review | Demand Planning, Sales Trading, Strategy, Finance |
| Demand-Planning-Agent | Forecast, sensing, scenarios, forecast quality and S&OP demand | Customer/Product/Region/period keys; Commercial review; Supply Planning |
| Procurement-Agent | Sourcing, supplier qualification/risk, PO/contract and spend | Approved need, supplier and material identities, budget; Supply, Warehouse, Finance |
| Supply-Planning-Agent | Demand/supply balance, inventory/production plan and constraints | Demand Forecast, Procurement Plan and Asset Status; Refining, Warehouse, Logistics |
| Warehouse-Agent | Stock, receipt, inventory accuracy, reservation and dispatch readiness | Material, storage location, PO/order/work-order correlation; Procurement, Reliability, Logistics |
| Logistics-Agent | Freight, carrier, route, shipment and delivery feasibility | Plant/Warehouse/Ship-To, allocation, shipment and safety constraints |
| Upstream-Operations-Agent | Wells, drilling, field production, facilities and reserves scenarios | Asset reliability, HSE, Finance; outputs to ESG and Supply Planning |
| Refining-Operations-Agent | Refinery/process schedule, yield, quality, feedstock and unit constraints | Supply plan, asset state, HSE constraints; outputs to ESG/Finance |
| Asset-Reliability-Agent | Asset health, failure analysis, work planning and reliability | Sensor/work-order/asset data; Warehouse, HSE, Finance, Supply Planning |
| Sales-Trading-Agent | Physical deals, contracts, orders, positions and commercial execution support | Customer/Product/price, credit from Risk, availability and delivery status |
| Finance-Agent | Financial scenario, budget/actual, cost, accounting and benefits analysis | Governed period/currency/accounting data; Strategy, PMO, Procurement, operations |
| ESG-Agent | Emissions/water/social aggregation, target progress and disclosure support | Facility/period/activity/factor/boundary evidence; HSE, Operations, Finance, Strategy |
| Data-Analytics-Agent | Source, quality, lineage, model, BI and AI/ML lifecycle | Domain data-owner definitions and approved access; supports all agents |
| Enterprise-Architecture-Agent | Landscape, standards, integration, target architecture and governance | Strategy and domain requirements; decision records to PMO/Data Analytics |
| Transformation-PMO-Agent | Program/initiative governance, milestones, risks, change and benefits | Strategy, Finance and EA decisions; domain delivery evidence |
| HSE-Agent | Incident, hazard, audit, permit, process/occupational safety and environmental controls | Site/asset/work context; human site authority; ESG and Knowledge handoffs |
| Trading-Risk-Agent | Market/credit risk, hedging, limits, valuation and risk reporting | Sales Trading positions, governed curves/limits; credit decision to Sales Trading |
| Knowledge-Repository-Agent | Permission-aware retrieval, controlled docs, patterns and lessons | Approved source content and ACLs; retrieval serves all domains |

### Request Classification and Routing

The master router should classify each request along these dimensions before invoking an agent:

- **Intent:** explain, assess, forecast, compare scenarios, recommend, draft, or request an action.
- **Domain/process:** one or more business domains and named processes (for example S&OP, P2P, M2R, O2C, I2C, ESG close, transformation governance).
- **Decision criticality:** informational, operational, financial, safety/regulatory, trading/credit, or executive approval.
- **Data readiness:** available sources, access, keys, time period, grain, units, freshness and quality status.
- **Action class:** read-only analysis, draft recommendation, approval request, or system mutation. System mutation is never inferred from a request for analysis.

Routing output is a workflow plan: `request_id`, intent, selected agents, dependency graph, required context, data policy, expected output, human gates, timeout, and fallback. The router logs its selection rationale and can ask for clarification or return a data-readiness blocker before agent calls.

## 4. Agent Execution Sequence

### 4.1 Standard Workflow State Machine

```text
RECEIVED
  -> CLASSIFIED
  -> AUTHORIZED
  -> DATA_READY (or BLOCKED_DATA)
  -> PLANNED (agent DAG created)
  -> RUNNING (parallel independent tasks / sequential dependent tasks)
  -> VALIDATED (schema, source, key, unit, quality, policy checks)
  -> HUMAN_REVIEW (when required)
  -> APPROVED / REJECTED / REWORK
  -> ACTIONED (only through authorized API/workflow; optional)
  -> VERIFIED (postcondition checked)
  -> SYNTHESIZED
  -> CLOSED
```

Any state may transition to `ESCALATED`, `FAILED_RETRYABLE`, `FAILED_TERMINAL`, or `CANCELLED`. A timeout must not be treated as approval. Side effects require idempotency and postcondition verification.

### 4.2 Dependency-Aware Sequence

- Run independent read-only analyses in parallel after the router establishes context, permissions and consistent data snapshot.
- Run downstream planning only after required upstream artifacts pass schema, quality and approval checks.
- Require each agent to return a typed result (facts, analysis, assumptions, exceptions, recommendation, confidence, sources, approval request), not free text alone.
- Validate joins and measures before synthesis; never silently aggregate across incompatible grains or units.
- Synthesize only after required branches finish or are explicitly marked unavailable. Clearly label partial results.

### 4.3 Reference Process Sequences

| Process | Proposed sequence | Mandatory gates |
|---|---|---|
| Demand-to-Supply / S&OP | Data Analytics quality check -> Demand Planning forecast -> Commercial Marketing review -> Supply Planning constraints with Procurement + Asset Reliability + Refining -> Warehouse inventory + Logistics feasibility -> Finance scenario -> Corporate Strategy executive S&OP -> approved plan to Refining/Warehouse/Logistics | Forecast version/units and product/location keys validated; human forecast exception (>20% per AIM); capacity/operational validation; executive plan approval. |
| Procure-to-Pay | Requester/Operations or Warehouse need -> Procurement sourcing/PO -> Warehouse GR/inspection -> Procurement three-way match -> Finance payment | Requisition/budget and delegated authority; supplier qualification; technical/material approval; receipt/quality acceptance; invoice match; payment segregation. |
| Maintenance-to-Reliability | Asset Reliability detection/triage -> Operations confirms -> work order -> Warehouse reservation (Procurement if shortage) -> HSE JHA/PTW -> authorized execution/test -> Finance cost capture -> Reliability KPI/status -> Supply Planning if capacity changes -> Knowledge lesson after incident closure | Site stop-work/emergency command; PTW/isolation; engineering acceptance; return-to-service; finance posting; no unsafe work triggered autonomously. |
| Order-to-Cash | Sales Trading order -> Trading Risk credit -> Supply/Warehouse availability -> Logistics/HSE transport -> Warehouse goods issue -> Finance invoice/collection | Credit decision, pricing/contract authority, ATP/allocation, dangerous-goods checks, delivery and invoice evidence. |
| Incident-to-Close / ESG | HSE triage and response -> Operations/Reliability evidence -> investigation/CAPA -> HSE verification -> ESG reporting if applicable -> Knowledge Repository after approved closure -> Analytics trend | Emergency authority, reportability, CAPA/effectiveness, disclosure and access/privacy approval. |
| ECC-to-S/4 transformation | EA discovery -> Data Analytics profiling -> Finance/process owners reconcile -> PMO stage gates -> domain workstreams by wave -> parallel validation -> business cutover approval -> hypercare | Architecture/security approval, data quality gate, mock conversion, reconciliation, business continuity, rollback and go/no-go. |

These sequences combine enterprise-process flows and collaboration artifacts. Only the three Supply Planning inputs are explicit AIM contracts. All other inter-agent edges require confirmation and interface design before production use.

## 5. Agent Routing Logic

1. **Select the accountable domain owner first.** Route to the agent whose business process/capability matches the request; do not invoke every agent by default.
2. **Add dependencies from the process graph.** Include upstream providers only when their data changes the answer or decision; include downstream consumers when an output is meant to trigger work.
3. **Run data/platform support selectively.** Invoke Data Analytics for source/quality/lineage issues; Knowledge Repository for controlled evidence retrieval; EA for system/architecture questions; PMO for initiative/stage gates.
4. **Apply high-consequence overlays.** Safety/permit work adds HSE and Operations; trading/credit adds Trading Risk; financial posting/benefit decisions add Finance; external disclosure adds ESG, Finance, Legal/Assurance and executive approval as relevant.
5. **Resolve conflicting owners.** Route conflicts to named process/decision owner; agent precedence is not guessed from document order.
6. **Require output contracts.** Router rejects/reprompts malformed results missing required keys, periods, units, sources, assumptions, confidence or decision status.
7. **Stop on blocking gaps.** Return `BLOCKED_DATA` if canonical identity, units, rights, current state, or required approval cannot be established. Offer the exact remediation needed.

## 6. Context Sharing Model

### 6.1 Request-Scoped Context Envelope

Proposed envelope for each agent invocation:

```json
{
  "request_id": "<immutable correlation id>",
  "workflow_id": "<process instance id>",
  "parent_task_id": "<calling task id or null>",
  "agent_id": "<domain agent>",
  "intent": "<classified request>",
  "scope": {"company_code": [], "business_unit_id": [], "plant_id": [], "period": []},
  "data_refs": [{"source": "<governed view/API>", "version": "<snapshot>", "as_of": "<timestamp>"}],
  "keys": {"customer_id": [], "supplier_id": [], "product_id": [], "material_id": [], "plant_id": [], "asset_id": []},
  "measures": [{"name": "<measure>", "value": "<value>", "uom": "<unit>", "currency": "<currency>", "grain": "<grain>"}],
  "constraints": [],
  "policy": {"classification": "<level>", "allowed_actions": ["read"], "retention": "<policy>"},
  "trace": {"source_refs": [], "assumptions": [], "quality_flags": []}
}
```

The schema is a proposal, not an implemented API. Add process-specific contract schemas and version them. Avoid copying full ERP records between agents; share a governed view reference and the minimum fields required.

### 6.2 Context Rules

- Context is isolated by request/workflow and passed only to authorized agents with a need to know.
- Keep facts separate from derived values, recommendations and user-supplied assumptions.
- Every fact includes source ID, snapshot/version, timestamp/period, key, grain, UoM/currency and quality flags.
- Preserve the source value when normalizing; include conversion rule and version.
- Apply classification, PII masking, row/column security and source ACLs before retrieval.
- Record provenance and approval lineage in workflow state; do not rely on model conversation text as the system of record.

## 7. Human Approval Gates

Human approval is a hard workflow state, not a model confidence threshold. The agent may prepare evidence and recommendation but must not self-approve.

| Gate | Human authority | Required evidence | No-go condition |
|---|---|---|---|
| Forecast exception / S&OP plan | Demand planner and accountable S&OP executive | Versioned forecast, variance, unit/period completeness, constraints, alternative scenarios | Forecast variance >20% per AIM, unresolved unit/key gap, or infeasible supply plan. |
| Procurement award / PO | Delegated buyer, budget owner and technical approver | Approved PR, supplier qualification, sourcing rationale, budget, material/spec/UoM, terms | Missing authority/budget, sanctions or qualification failure, unresolved material/spec or plan conflict. |
| Invoice/payment | Procurement/AP match approver and Finance payment releaser (segregated roles) | PO + accepted GR + invoice, tolerance result, tax/account assignment, duplicate checks | Missing/failed 3-way match or same user performs incompatible approval/release roles. |
| PTW / maintenance execution / return-to-service | Site Operations and HSE/permit authority; qualified engineer | Hazard assessment, isolation, valid permit, parts/test/inspection, work completion | Imminent danger, no permit/isolation, failed test, unresolved critical defect. |
| Trade/credit/hedge | Authorized trader and independent Risk/credit authority | Positions, counterparty exposure, limits, curve/model, approval history | Credit decline, limit breach, stale valuation or unauthorized override. |
| Finance close / capital / benefits | Controller/CFO or investment committee per authority | Reconciled actuals, accounting policy, business case, benefit evidence | Unreconciled balance, missing evidence or authority conflict. |
| ESG/regulatory disclosure | ESG owner, Legal/Compliance, assurance and executive approver | Boundary, factors, lineage, reconciliation, assurance and disclosure basis | Missing data, unapproved methodology, restatement or unsupported claim. |
| Architecture/security/cutover | Architecture Board, Security, system owner and business go/no-go authority | Decision record, threat/access review, test/reconciliation, rollback and support plan | Security/OT blocker, failed critical test, no rollback or accountable owner. |

## 8. Escalation Paths

1. **Data/identity/UoM gap:** block dependent task -> source data owner + Data Analytics -> master-data steward -> workflow requester for correction. No silent name join or unit assumption.
2. **Dependency timeout/unavailable agent:** retry only if idempotent and within policy -> mark dependency unavailable -> continue only if optional; otherwise pause and notify workflow owner.
3. **Conflicting plans:** Demand/Supply/Procurement owners compare versions -> S&OP chair resolves service/cost trade-off; AIM explicitly escalates procurement/supply conflict.
4. **Safety/OT emergency:** immediately hand to site emergency command/HSE/Operations; stop unsafe automated actions. The AI workflow must not delay response.
5. **Risk/credit breach:** Trading Risk authority; prevent downstream order release until cleared. No agent override.
6. **Financial control mismatch:** Finance controller/AP controls; hold posting/payment and preserve matched/unmatched evidence.
7. **Policy, privacy or security violation:** deny data/action, record policy reason, route to Security/Privacy and system owner.
8. **Model uncertainty or unsupported answer:** return limitation and evidence, request expert review, or stop; never fabricate missing data.
9. **Repeated technical failure:** open incident with trace IDs, inputs, error category, retry count and owner; route to platform operations/EA.

## 9. Memory Strategy

### 9.1 Memory Tiers

| Tier | Contents | Persistence / control |
|---|---|---|
| Request context | Current user request, selected agents, references, intermediate results, approvals and state | Ephemeral per workflow; expire under configured retention. Never treat chat context as authoritative transaction state. |
| Working memory | Derived summaries, normalized keys, calculations and candidate plans needed by dependent agents | Workflow-scoped, provenance-preserving, encrypted and access-controlled; delete/expire on workflow closure unless retention is approved. |
| Governed enterprise knowledge | Approved policies, process definitions, data dictionaries, standards, architecture decisions, validated lessons and source documents | Persist only in authoritative Knowledge Repository/enterprise content store with owner, version, ACL, review date and citations. |
| Operational transaction state | PR/PO/GR/invoice/work order/permit/approval/plan identifiers and status | System of record remains SAP or authorized business application; orchestrator stores references and correlation IDs only. |
| Model/agent telemetry | Prompt/version, tool call, latency, quality score, errors, approval/override | Audited under privacy, security, retention and model-risk policy; redact secrets and unnecessary PII. |

### 9.2 Memory Rules

- No implicit cross-user or cross-tenant conversational memory.
- Learnings become persistent only after source owner review and publication as governed knowledge.
- Do not persist secrets, credentials, unrestricted personal data, or unapproved customer/trading data in vector stores or agent memory.
- Retrieval is ACL-filtered and citation-backed; stale/superseded documents are visibly labeled.
- Every stored summary retains source IDs, version/as-of, transformations and confidence; users can trace a recommendation to evidence.

## 10. Error Handling and Reliability

| Error class | Handling |
|---|---|
| Invalid input / schema mismatch | Validate before invocation; reject with field-level error and required schema version. Do not coerce unknown values silently. |
| Missing master/foreign key | Quarantine affected records, return unmatched keys and coverage, request stewardship; only proceed with an explicitly approved fallback. |
| Unit/currency/time conversion failure | Stop dependent calculation; record source/target unit, rate/factor and missing rule; request owner approval. |
| Stale/inconsistent source data | Apply source-specific freshness SLA; warn/block according to criticality; never merge snapshots without `as_of`/version. |
| Agent timeout/transient service error | Bounded exponential retry for idempotent reads; circuit breaker after threshold; mark result unavailable, not successful. |
| Duplicate/replayed event | Require idempotency key and dedupe by producer/event/version; preserve original event and replay audit. |
| Partial workflow failure | Persist checkpoint and completed task outputs; retry only failed safe tasks; compensate or cancel pending actions under process owner policy. |
| Downstream SAP/API rejection | Preserve response code/correlation ID; do not report action as complete; route to owning process/support team. |
| Model unsupported/low confidence | Abstain or return bounded analysis with missing evidence; route to domain SME/human gate. Confidence never substitutes for authorization. |
| Security/ACL failure | Fail closed, do not retry with broader credentials; log denial and alert security/system owner. |

Every workflow result should carry status (`complete`, `partial`, `blocked`, `failed`, `cancelled`), errors/warnings, completed/failed tasks, source references and next action. No downstream transaction proceeds on a failed required predecessor.

## 11. ICA Edge Implementation Approach

The SAP reference architecture proposes ICA-Edge as the master agent plus domain agents, with SAP BTP as the governed integration/extension layer and Datasphere as a semantic data layer. This is a target proposal; repository artifacts do not show a deployed ICA Edge runtime or endpoint configuration.

### 11.1 Logical Deployment Pattern

1. **Experience:** Fiori/Build Work Zone or approved enterprise channel invokes the master router with user identity and request scope.
2. **Identity and policy:** federate enterprise identity (architecture proposes SAP Cloud Identity Services/Microsoft Entra ID); authorize user and agent/data scopes. Do not pass ERP passwords to agents.
3. **Orchestration:** master router classifies request, builds a DAG/state machine, invokes skill-constrained agents, validates outputs, waits on approval tasks and writes audit state.
4. **Agent execution:** each domain skill runs as an isolated, versioned agent service/tool adapter with scoped access and output schema.
5. **Read path:** agents query approved Datasphere/Business Data Cloud consumption views, released S/4HANA CDS/OData APIs, or approved non-SAP source services. Datasphere layer separation follows inbound -> harmonized -> business -> consumption.
6. **Write path:** only approved actions use named APIs through Integration Suite/API Management or authorized SAP workflow. Use Build Process Automation for human approvals where selected.
7. **Events:** Event Mesh carries versioned business events after contract approval; topic names in SAP reference are proposals. Include correlation/idempotency IDs and canonical keys.
8. **AI/retrieval:** BTP AI Core/Generative AI Hub and Knowledge Repository retrieval may be used after model, ACL, citation, retention and evaluation policies are defined.
9. **Observability:** Cloud ALM/approved telemetry records trace, data lineage, decisions, approval, API responses, errors and business postconditions.
10. **Environment separation:** dev/test/prod, non-production synthetic or masked data, controlled transport/secrets, change approval, rollback and incident support.

### 11.2 Implementation Sequence

- **Phase A — Contract and runtime foundation:** select runtime/orchestrator, define agent invocation schema, workflow persistence, identity, policy, trace IDs, secrets, evaluation and deployment pipeline.
- **Phase B — Read-only isolated agents:** expose governed sample/semantic data; test schema validation, source citations, abstention, domain answers and ACL behavior.
- **Phase C — Deterministic workflow simulation:** execute process DAGs with mocked tools and approval tasks; test retries, failures, timeouts, idempotency and human rejection paths.
- **Phase D — Non-production SAP integration:** released read APIs/CDS and sandbox workflows; reconcile master keys and transaction results. No production write authority yet.
- **Phase E — Guarded transaction pilot:** one narrow process with named APIs, human approval, segregated duties, monitoring, rollback and business acceptance. Expand only after evidence-based gates.

## 12. Execution-Test Readiness and Testing Roadmap

### 12.1 Readiness Assessment

**End-to-end execution readiness: 0 of 19 agents.** The repository does not contain a runnable orchestrator, service endpoints, integration credentials, event topics, workflow persistence, or an automated execution harness. Therefore no agent is currently ready for true end-to-end system execution testing from this repository alone.

**Isolated evaluation readiness:**

- **16 agents are candidates for data-grounded isolated evaluation design:** they have README, SKILL and sample CSVs plus a sample `data_dictionary.md`. These are Asset Reliability, Commercial Marketing, Data Analytics, Enterprise Architecture, ESG, Finance, HSE, Knowledge Repository, Logistics, Procurement, Refining Operations, Sales Trading, Supply Planning, Trading Risk, Upstream Operations and Warehouse.
- **3 agents are suitable only for skill/prompt-contract tests until schemas are documented:** Corporate Strategy, Demand Planning and Transformation PMO have SKILLs and sample CSVs but no `sample-data/data_dictionary.md`. Add dictionaries before treating field-level results as reproducible.
- This classification means **ready to prepare isolated tests**, not proven accurate or production safe. Each agent still needs a test harness, approved expected results, access policy and owner acceptance.

### 12.2 Prioritized Testing Roadmap

| Priority / phase | Test scope | Candidate agents / workflows | Exit gate |
|---|---|---|---|
| P0: Test foundation | Inventory skills and versions; YAML/schema checks; prompt fixtures; source citations; agent output schema; policy and trace logging. | All 19 in static/contract tests. | Reproducible CI test runner, versioned inputs/expected outputs, owner-approved pass thresholds. |
| P1: Isolated domain evaluation | Ground answers in local sample CSVs; test routine, exception, scenario, missing-data and escalation prompts; verify facts/units/keys and abstention. | Begin with the 16 agents with dictionaries. | No unsupported factual claims; joins/formulas reproduce; sensitive-data and authorization tests pass; domain owner signs off. |
| P1b: Documentation readiness | Add dictionaries and schema contracts, then repeat isolated evaluation. | Corporate Strategy, Demand Planning, Transformation PMO. | Field, grain, units, keys, synthetic assumptions and expected outputs documented and tested. |
| P2: Mocked process orchestration | Simulate dependency DAGs and human approvals with fake APIs/events, including timeouts, duplicate events, rejection, retry, compensation and partial results. | Demand-to-Supply, S&OP, P2P, M2R, O2C, I2C, ESG close. | All required gates enforce order; errors fail safely; approvals cannot be bypassed; workflow trace is complete. |
| P3: Contract/integration tests | Validate schema/version, keys, event order, idempotency, ACL, freshness, API authorization and postconditions against non-production SAP or stubs. | AIM’s three explicit Supply Planning contracts first; then prioritized H-## flows after owners approve them. | Contract owner approval, end-to-end reconciliation, monitoring and replay tests pass. |
| P4: Controlled pilot | One bounded read-first workflow followed by a human-approved write; run parallel with existing process and measure outcomes. | Select with business owners after readiness gates; candidate: M2R alert-to-work package or P2P low-risk category. | Safety/security/business sign-off, rollback rehearsal, KPI baseline, incident response and exit criteria met. |
| P5: Production expansion | Load/performance, resilience, disaster recovery, audit, model drift, change control and benefits tests. | Expand agent/process coverage by data readiness and risk tier. | Formal operational acceptance, support ownership, SLOs, compliance evidence and continuous evaluation. |

### 12.3 Minimum Test Suite per Agent

- Scope and routing: in-scope, out-of-scope, ambiguous and multi-domain requests.
- Data grounding: known-answer, missing-key, stale-data, conflicting-source, unit/currency and wrong-grain cases.
- KPI calculations: formula, denominator, period, edge/null/zero values and reproducibility.
- Dependencies: required input absent, optional agent unavailable, conflicting downstream result and timeout.
- Approval behavior: approval required, denied, expired, delegated, duplicate and unauthorized actor.
- Safety/security: restricted data, prompt injection in source content, PII, tool misuse, forbidden action and least privilege.
- Resilience: API failure, retry, duplicate/reordered event, partial completion, replay, cancellation and recovery.
- Output quality: schema validation, provenance/citations, assumptions, confidence/limitations, escalation and next action.

## 13. Readiness Gates and Go/No-Go Criteria

Do not label the framework production-ready until all applicable gates pass:

1. **Business:** accountable owner, scope, process RACI, KPI formula/target and approved human decision rights.
2. **Data:** stewarded canonical keys, schema/data dictionary, lineage, unit/conversion rules, quality thresholds and access approval.
3. **Process:** implemented event/API contracts, sequence, timeouts, exception paths, compensation and segregation of duties.
4. **AI/model:** evaluation suite, groundedness/abstention thresholds, model/prompt versioning, bias/safety review and change control.
5. **Security:** threat model, identity, least privilege, secrets handling, encryption, audit, privacy/retention and penetration testing.
6. **Operations:** SLOs, monitoring, alerting, support rota, incident response, backup/recovery, rollback and cost controls.
7. **Business acceptance:** user acceptance, parallel-run reconciliation, training, cutover sign-off and measured benefit baseline.

## 14. Source References

- `SKILL.md` and all 19 agent `*/SKILL.md` files.
- `Agent_Interaction_Model.md`, `enterprise_process_model.md`, `Enterprise_Capability_Model.md`, `Enterprise_KPI_Model.md`.
- `agent_collaboration_patterns.md`, `agent_capability_matrix.md`, `entity_relationship_model.md`.
- `sap_reference_architecture.md`, `master-data/README.md`, master-data dictionary and relationship matrix.
- `sop_workflow_walkthrough.md`, `demand_to_supply_walkthrough.md`, `procure_to_pay_walkthrough.md`, `maintenance_to_reliability_walkthrough.md`, `ecc_to_s4hana_transformation_walkthrough.md`.

The reference architecture, event topics, BTP services and target-state mappings are proposals subject to customer SAP release, product availability, licensing, security, process-owner and architecture-board approval.

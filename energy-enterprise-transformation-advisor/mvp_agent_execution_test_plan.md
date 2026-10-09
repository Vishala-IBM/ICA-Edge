# MVP Agent Execution Test Plan

**Overall Readiness:** Conditional for controlled, isolated mock execution only. The deployment package states that runtime, workflow state, identity, tool adapters and approved connectors must be configured; it does not establish a deployed execution environment. End-to-end readiness remains 0/19.

**Go/No-Go Recommendation:** **No-go** for production or live enterprise connections. **Conditional go** for a sandbox/mock execution run only after all Deployment Acceptance Gates pass, with read-only fixtures, no production credentials or write tools, and human approval tasks simulated or explicitly staffed.

## 1. Test Environment

- Isolated ICA Edge sandbox/test runtime with workflow persistence, approved agent/tool versions, schema validation and execution harness enabled.
- Version-pinned synthetic fixtures and mock APIs/events for Demand Forecast, Procurement Plan and Asset Status; no production data or credentials.
- Mock identity/roles and ACL enforcement; least-privilege agent identities, redacted logs, trace/correlation IDs and audit enabled.
- Human approval tasks available for planner, Operations, architecture/security and content-owner decisions; timeouts must not count as approval.
- Production writes, plan releases, PO creation and inventory/production mutations disabled.

## 2. Test Scenarios

| ID | Execution | Validation focus |
|---|---|---|
| EX-01 | Run Data Analytics on valid snapshots, then malformed key/duplicate/null UoM/stale data. | Quality gate, lineage, exceptions and downstream stop behavior. |
| EX-02 | Run Enterprise Architecture on illustrative, mixed/unknown and stale inventory. | Facts versus assumptions, evidence links and human review routing. |
| EX-03 | Run Knowledge Repository with current/superseded conflicts, restricted source, no-result and broken citation. | ACL-before-retrieval, citation resolution, freshness warning and abstention. |
| EX-04 | Run Demand Planning baseline and cold-winter scenario, then missing UoM/ambiguous semantics and >20% reference variance. | Versioned output, blocked calculations and planner approval pause. |
| EX-05 | Run Supply Planning with approved forecast and valid mocks, then stale Asset Status, conflicting Procurement Plan and incompatible Material/UoM. | Feasibility, constraints, mock provenance, safe block/escalation and no release. |
| EX-06 | Execute the valid mocked multi-agent flow: router -> Data Analytics gate -> Knowledge/EA context as needed -> Demand forecast -> planner approval -> Supply draft -> human review. | Contract validation, state/provenance, handoffs, hard approval gates and terminal workflow state. |
| EX-07 | Replay/duplicate event, reorder dependency event, timeout a tool, restart workflow and reject/expire approval. | Idempotency, safe retry/recovery, no approval-by-timeout and no false completion. |

## 3. Expected Results

- Each agent returns a typed, schema-valid result with request/workflow/trace IDs, agent/version, source versions, status, assumptions, exceptions and approval state.
- Data Analytics provides deterministic quality/coverage/lineage findings; blocking data gaps stop only dependent calculations.
- Enterprise Architecture distinguishes verified fixture facts from assumptions; Knowledge Repository returns authorized, resolvable citations or safely abstains.
- Demand Planning returns versioned baseline/scenario output; accuracy remains unavailable without aligned actuals and approved KPI definitions.
- Supply Planning returns constrained/unconstrained draft alternatives only for compatible, valid inputs; mock dependency status is clearly labeled.
- The router preserves state and provenance, escalates correctly and never treats timeout, missing data or an unapproved draft as approval or successful release.

## 4. Pass Criteria

- All unit tests for the five agents pass before multi-agent execution; all handoff schemas and versions validate.
- Execution is reproducible for pinned inputs/configuration; duplicate events do not double-count or create duplicate side effects.
- Zero silent row drops, invented identities, incompatible-unit calculations, restricted-content leakage or unsupported deployed-state claims.
- At least 95% of golden factual answers have resolvable citations; zero fabricated citations.
- 100% of mandatory approval tests block when approval is absent, denied, expired, unauthorized or timed out.
- Stale/invalid critical dependencies fail closed; errors include owner action and trace ID; safe retry/recovery preserves workflow state.
- No high-severity safety, privacy, permission, financial-control or policy violation; no write/release path is enabled.

## 5. Failure Criteria

Fail and stop promotion if any agent returns malformed/untraceable output; a dependent step proceeds after a blocking key/unit/ACL/schema error; missing stock is treated as zero; stale mock status is treated as current; Demand/Supply performs unsupported math; Knowledge leaks restricted content or returns unresolved citations; the router bypasses human approval or treats timeout as approval; replay produces duplicate effects; or any production write/plan release is attempted.

## 6. Escalation Procedures

1. **Data/contract blocker:** mark affected branch blocked, preserve input/source versions, identify Product/Plant/Period scope and route to data steward/contract owner.
2. **Forecast variance or plan conflict:** pause workflow and route evidence to planner/S&OP owner; await explicit decision. Rejection/expiry/timeout remains blocked.
3. **Procurement/asset/capacity exception:** route conflicting or stale fields to Procurement, Asset/Operations and planner owners; rerun only with a new validated version.
4. **ACL, privacy or security failure:** deny access, stop the run, preserve redacted audit/trace details and notify security/data owner; do not retry via a broader identity.
5. **Runtime/tool failure:** bounded retry only for idempotent reads; otherwise preserve state, mark retryable/terminal status and alert platform support. Do not report partial work as complete.
6. Resume only after an authorized owner supplies corrected input or approval and the workflow records a new traceable state transition.

## 7. Deployment Acceptance Gates

1. **Environment gate:** runtime, workflow state, identity/ACL, telemetry, schemas and test harness are configured; writes/production credentials are absent.
2. **Agent gate:** each of the five agents passes its isolated unit suite on pinned fixtures with owner-approved expected results.
3. **Contract gate:** common request/result and Demand Forecast, Procurement Plan and Asset Status contracts are versioned; keys, units, freshness, error and idempotency semantics are approved.
4. **Workflow gate:** EX-06/EX-07 pass, including data-quality stop, planner approval pause, reject/timeout, replay, restart and escalation paths.
5. **Control gate:** security, data, architecture, planning and Operations owners accept access, residual risks, audit and support procedures.
6. **Release decision:** authorize only the next approved sandbox stage after gates pass. Production or live SAP connectivity requires separate explicit security, business, architecture and operational go-live approval; elapsed schedule or mock success is not sufficient.

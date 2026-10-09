# ICA Edge Workflow Configuration

**Workflow Readiness:** Design-ready for deterministic mock orchestration only. The source framework and multi-agent plan describe no runnable runtime, workflow persistence, deployed event topics or execution harness. Do not treat this configuration as a deployed workflow.

**Implementation Priority:** Configure after the five agents pass isolated unit tests and the common contracts/runtime are available; before non-production SAP connectors. Begin with fixtures and mock Procurement Plan/Asset Status.

## 1. Workflow Name

**MVP Demand-to-Supply Planning Review** (`MVP_DEMAND_TO_SUPPLY_V1`)

## 2. Trigger Event

- Authorized user starts a planning-cycle or explicit Demand-to-Supply review request with versioned scope, period, sources and allowed actions.
- An accepted versioned Demand Forecast Update may trigger a new run only after event schema, authorization, deduplication and freshness checks pass.
- Constraint or dependency updates trigger recalculation only when their source/version and validity are approved. No production event topic is assumed configured.

## 3. Agent Sequence

1. **Master router:** classify intent/criticality, validate identity and scope, establish workflow state, permissions and consistent input snapshot.
2. **Data-Analytics-Agent:** validate schemas, source freshness, keys, units and lineage. Blocking findings stop dependent planning branches.
3. **Knowledge-Repository-Agent** and **Enterprise-Architecture-Agent:** run independent read-only context tasks in parallel when requested/required. Return authorized citations or evidence/assumption-separated findings; do not alter planning facts.
4. **Demand-Planning-Agent:** after data gates pass, produce versioned baseline/scenario forecast with quality status and approval request.
5. **Human planner gate:** review consensus/exception; >20% variance to an agreed reference requires explicit planner decision. Only an approved forecast version is eligible for Supply Planning.
6. **Supply-Planning-Agent:** consume approved forecast, production/inventory/constraint snapshots and explicitly mocked Procurement Plan/Asset Status; return typed constrained/unconstrained draft alternatives.
7. **Human planner/Operations gate:** review and accept, reject or request rework. Router records outcome; no plan, procurement or production action is released.

## 4. Handoff Rules

- Use versioned typed request/result contracts with request, workflow, correlation and trace IDs; include agent/schema version, source/as-of, keys, period, grain, UoM, assumptions, exceptions and approval status.
- Router validates required fields and outputs before advancing; reject malformed results or missing provenance.
- Run independent read-only context tasks in parallel only after router establishes consistent scope, permissions and source snapshot.
- Demand-to-Supply handoff requires compatible Product/Material/Plant/Period/UoM and an approved forecast version; never infer Product=Material or silently convert units.
- Validate Procurement Plan/Asset Status schema, mock designation, source timestamp/validity, mapping and idempotency. Duplicate/replayed events must not double-count.
- Keep unresolved data gaps branch-scoped when safe; block any dependent calculation that requires the missing data. No unapproved draft is represented as approved.

## 5. Escalation Rules

- Missing/ambiguous canonical key, unit, rights, current state or required contract -> `BLOCKED_DATA`; identify affected scope and remediation owner.
- Forecast variance >20%, infeasible/overlapping constraints, stale Asset Status or conflicting Procurement Plan -> `ESCALATED` to planner and relevant data/Operations/Procurement owner.
- ACL denial or unresolved Knowledge citation -> deny/abstain without fallback to unrestricted content.
- Unknown/stale architecture evidence -> mark conditional and route to architecture/security owner; do not assert deployed state.
- Timeout is not approval. Retry only idempotent reads with bounded policy; preserve state and trace IDs for retryable/terminal failures. Any API rejection must not be reported as completed.

## 6. Approval Gates

- **Forecast consensus:** authorized planner approval before the forecast is treated as approved downstream input.
- **Forecast exception:** explicit human review for >20% variance; absence, timeout, rejection or unauthorized approver blocks progression.
- **Supply plan:** planner/S&OP owner approves the draft; Operations validates plant limits/operational constraints; procurement/allocation exceptions require their designated human owner.
- **Architecture/content:** apply architecture/security or document-owner approval only when the workflow requests an architecture decision or content publication; these agents cannot self-approve.
- Approval is a hard workflow state with approver identity/role, decision, timestamp, scope and version recorded. No direct system mutation is enabled.

## 7. Success Criteria

- Mocked workflow completes deterministically for pinned inputs with valid contracts, complete provenance and recoverable state.
- Data-quality, unit/key, stale-dependency and ACL failures block the correct downstream branch with actionable owner escalation.
- Every handoff preserves IDs, versions and approval state; duplicate/replayed events are idempotent.
- 100% of mandatory approval tests block when approval is absent, denied, expired, unauthorized or timed out.
- Knowledge citations are authorized/resolvable; no unsupported facts, silent unit assumptions or fabricated identities.
- No high-severity safety, privacy, permission, financial-control or policy violation; no production write or plan release occurs.

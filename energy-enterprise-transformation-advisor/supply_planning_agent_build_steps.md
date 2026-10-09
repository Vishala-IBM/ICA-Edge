# Supply Planning Agent Build Steps

**Agent:** `Supply-Planning-Agent`
**Readiness:** Minor Gaps / prototype-ready for isolated fixture-backed testing. Material master, canonical Material_ID, UoM/calendar references, Procurement Plan and Asset Status contracts, human approval workflow, and the ICA Edge runtime are not yet established. All sample data is synthetic and mock. No production writes are enabled at any step.

---

## 1. ICA Edge Configuration Steps

Bind the following settings to actual ICA Edge platform fields once the runtime is selected. Treat this as a platform-neutral mapping guide until runtime discovery is complete.

| Configuration Area | Required Setting |
|---|---|
| **Agent identity** | Register agent name `Supply-Planning-Agent`; record owner, version and readiness label `Minor Gaps` until master/contract gates pass. |
| **Instructions** | Load the system prompt (Section 2) and the 14 numbered agent instructions as agent policy; deny write-capable tools by default. |
| **Solver / model policy** | Configure a validated planning method/solver and versioned objective; expose feasibility/solver status in output. Do not claim optimality without solver evidence. |
| **Input / output schema** | Enforce versioned v1.0 request schema, Demand Forecast contract, Procurement Plan and Asset Status event contracts, and v1.0 result schema; reject invalid schemas before any processing. |
| **Context and retrieval** | Allow-list only the approved context sources in Section 4; propagate caller identity and ACL; label mock provenance on every output. |
| **Tools** | Enable initially: read-only CSV/JSON fixture loader, schema/quality validator, approved master/UoM/calendar reference lookup, telemetry sink. Use deterministic versioned mock Procurement Plan and Asset Status payloads. |
| **State / persistence** | Persist request-scoped workflow state, event deduplication keys, immutable plan versions, provenance and human approval decisions; do not use implicit conversational memory for any business value. |
| **Workflow binding** | `authorized request → validate approved forecast → validate source/master/UoM/calendar → validate Procurement Plan and Asset Status → compute unconstrained reference → apply approved constraints → compare alternatives and exceptions → planner/operations approval pause → versioned draft plan → Supply Planning consumers` |
| **Event behavior** | Include correlation ID, schema version, source/as-of, validity window, idempotency key, bounded retry and replay-deduplication handling in all dependency events. |
| **Failure policy** | Fail closed on ACL, schema, key, UoM, freshness or feasibility errors; never convert missing data to zero; preserve and expose trace ID on every failure. |
| **Security / operations** | Least-privilege identity, secrets manager (no hardcoded credentials), redacted logs, audit/retention, data classification, health/latency/error monitoring, alerting, rollback procedure. |
| **Environments** | Development and test: synthetic fixtures and mock dependency payloads only. Approved non-production read-only endpoints: after security and data-owner gates. Production access and writes: disabled until separate integration, security and go-live approvals. |
| **Evaluation** | Run test cases SP-01 through SP-14 (Section 6) plus regression, policy and event-contract suites on every change to prompt, schema, solver or method; domain owners approve acceptance baselines. |

---

## 2. Prompt Configuration

### 2.1 System Prompt

Paste the following verbatim into the ICA Edge system prompt field for `Supply-Planning-Agent`:

```
You are the Supply-Planning-Agent. Reconcile approved demand with production, inventory, constraints, procurement commitments and asset availability to produce explainable constrained and unconstrained planning alternatives for human review.

Use only authorized, versioned sources supplied through the request and configured context. Treat all repository sample data and dependency messages as synthetic/mock unless explicitly verified by an authorized source. Never invent stock, capacity, procurement commitments, asset availability, material mappings, approved targets, or SAP landscape state.

Before calculating, validate source/schema versions, freshness, grain, periods, Product/Material/Plant/Facility keys, UoM, inventory status and dependency validity. Preserve Product and Material as distinct identities. Do not silently coerce keys, drop unmatched rows, treat missing stock as zero, combine incompatible units, or infer plant allocation. Convert units only with an approved versioned reference. If a required mapping, unit, plant capability, constraint-combination rule, Procurement Plan, or Asset Status is absent or stale, block the affected calculation or label a bounded result conditional and identify the limitation.

Separate input facts, calculated quantities, assumptions, constraints and recommendations. For each alternative, show the planning method/version, horizon, grain, sources, constraints applied, inventory basis, supply/demand gap and quality flags. Do not claim an optimal solution unless a validated solver and objective are configured and its status is available.

Compare demand variance only against an explicitly identified compatible reference. Escalate variance greater than 20% and plan conflicts to the authorized planner. Require human approval for constrained plan acceptance, allocation/procurement exceptions and any release. Never issue production, procurement, inventory or SAP write actions.

Return the configured typed response with request/workflow/trace IDs, provenance, assumptions, exceptions, approval request and next actions. Fail closed on ACL/schema errors, stale/ambiguous critical inputs, infeasible constraints, timeouts or conflicting dependency states. Retries must be bounded and idempotent. Do not expose restricted source content.
```

### 2.2 Agent Instructions

Load the following 14 numbered instructions as the agent's operational policy (append after the system prompt or as a separate instructions block, per ICA Edge field layout):

1. Validate caller identity, role, request scope, intent and permitted actions before reading data.
2. Load only the versioned sources explicitly referenced by the request through read-only tools; capture source version and as-of time.
3. Validate the common request envelope, data schema, grain, horizon, period type, uniqueness, freshness and completeness.
4. Resolve canonical IDs for all join keys. Report matched/unmatched coverage and preserve unresolved rows as exceptions; do not invent Material_ID or assume Product_ID equals Material_ID.
5. Validate UoM and calendar. Convert only with the approved reference version; block calculations across incompatible units or periods.
6. Confirm Procurement Plan and Asset Status payload schema, source, status, timestamp, validity window and mapping to material/site/plant. Stale or ambiguous critical status fails closed for affected capacity/supply.
7. Confirm inventory status (on-hand, unrestricted/usable, reserved, safety stock) and avoid treating missing data as zero.
8. Apply configured constraints and any overlap/priority rules. If overlapping constraints cannot be combined by an approved rule, return infeasible/blocked rather than selecting arbitrarily.
9. Calculate unconstrained reference and constrained alternatives using the configured, validated planning method. Keep assumptions, solver status and objective visible.
10. Compare alternatives using owner-approved service, cost, inventory and feasibility measures; do not introduce unapproved weights/objectives.
11. Escalate >20% variance against the agreed reference and all infeasible/conflicting conditions to the planner/owner. Never self-approve.
12. Return typed output and request approval. Emit only to the approved mock/read-only boundary with version, correlation and idempotency identifiers.
13. Retry only safe idempotent reads; duplicate/replayed input events must not double-count supply or publish duplicate plans.
14. On partial data failure, identify affected Products/Plants/Periods and do not present incomplete totals as complete.

### 2.3 Example Prompts (for agent testing)

| # | Prompt |
|---|---|
| 1 | "Build constrained and unconstrained options for the approved forecast by Product, Plant and Period. Show all unit/key gaps before calculating." |
| 2 | "Combine the forecast with the production plan, inventory snapshot, constraints, Procurement Plan mock and Asset Status mock. Identify which inputs are stale or unmapped." |
| 3 | "Asset Status for Plant R100 is stale. Exclude or block its capacity contribution, explain the impact and request a fresh status." |
| 4 | "The Procurement Plan conflicts with the approved supply plan or lacks Material_ID/lead time. Identify the conflicting fields and route to the authorized owner; do not release anything." |
| 5 | "Compare this constrained plan with the approved reference. If the variance exceeds 20%, prepare a planner review request and leave the plan unapproved." |

---

## 3. Memory Configuration

| Memory Type | Configuration |
|---|---|
| **Per-request working state** | Store: request ID, workflow ID, correlation ID, caller scope, forecast and source versions, key-match coverage, UoM/calendar versions, inventory and dependency timestamps, applied constraint set, method/solver version, alternatives, exceptions, approval state. Scope to current request only. |
| **Persisted planning state** | Store: immutable plan versions, input/source references, run/solver metadata, event deduplication keys, human decisions and audit trail. Use only approved workflow/state-store platform capability; do not use in-memory or conversational state for these values. |
| **Cross-request memory** | Disabled for implicit conversational or inferred inventory/capacity values. Reuse only explicit, versioned snapshots and approved planning-cycle baselines passed in the request. |
| **ACL / tenant isolation** | Enforce ACL and tenant boundaries on all stored state. Apply retention/deletion rules and redaction. Never retain secrets, unrestricted source rows or restricted content in prompts or logs. Preserve enough provenance to reproduce a plan version. |
| **Secrets** | Never store credentials, API keys or tokens in agent memory or logs. Use the platform secrets manager exclusively. |

---

## 4. Dataset Configuration

### 4.1 Approved Context Sources (Allow-list)

Configure only the following sources as authorized context. Do not allow retrieval of any source outside this list without explicit owner approval.

| Dataset | Path | Use | Known Limitation |
|---|---|---|---|
| Production plan | `Supply-Planning-Agent/sample-data/production_plan.csv` | Planned production input | Validate grain, dates, units and capacity meaning |
| Inventory plan | `Supply-Planning-Agent/sample-data/inventory_plan.csv` | Planned inventory / targets | Reconcile with stock snapshot and status semantics |
| Supply constraints | `Supply-Planning-Agent/sample-data/supply_constraints.csv` | Time-phased constraints | Approve overlap, severity and combination rules before use |
| Demand forecast (fixture) | `Demand-Planning-Agent/sample-data/demand_forecast.csv`, `demand_scenarios.csv` | Demand input fixture | Not a substitute for an approved Demand Forecast contract; Demand agent has major gaps |
| Warehouse inventory stock | `Warehouse-Agent/sample-data/inventory_stock.csv` | On-hand stock evidence | Missing rows are not zero stock |
| Warehouse movements | `Warehouse-Agent/sample-data/warehouse_movements.csv` | Movement reconciliation | Reconcile status/as-of and material/location keys |
| Cycle count | `Warehouse-Agent/sample-data/cycle_count.csv` | Stock count reconciliation | Validate count date and material/location identity |
| Refinery performance | `Refining-Operations-Agent/sample-data/refinery_performance.csv` | Supply/production context | Validate process/product/unit equivalence before joining |
| Refinery output | `Refining-Operations-Agent/sample-data/refinery_output.csv` | Production supply context | Same unit/schema compatibility check required |
| Yield analysis | `Refining-Operations-Agent/sample-data/yield_analysis.csv` | Yield/supply context | Owner approval required before planning use |
| Product master | `master-data/products.csv` | Product identity | Product_ID ≠ Material_ID; does not create Material master |
| Plant master | `master-data/plants.csv` | Production capacity and supply | Explicit product/plant capability and effective dates required |
| Facility master | `master-data/facilities.csv` | Site/asset association | Static master does not prove current asset availability |
| Warehouse master | `master-data/warehouses.csv` | Stock/storage context | Validate site and inventory status |
| Region / BU masters | `master-data/regions.csv`, `business_units.csv` | Roll-up and ownership | Region, pricing zone and logistics zone are distinct typed mappings |
| Customer master | `master-data/customers.csv` | Demand/allocation destination | Require approved identity/ship-to mapping |
| Supplier master | `master-data/suppliers.csv` | Procurement sourcing context | Does not establish firm commitment or receipt date |
| Asset master | `master-data/assets.csv` | Asset identity | Static history does not prove current availability |
| BU crosswalk | `master-data/bu_crosswalk.csv` | BU identity mapping | Use explicit crosswalk only; do not infer |
| Procurement Plan mock | Versioned deterministic mock payload | Procurement commitment input | MVP mock only; not a production interface; must declare schema/version, validity, material/site, quantity/UoM |
| Asset Status mock | Versioned deterministic mock payload | Capacity/availability input | MVP mock only; static master/history is not live status |
| Calendar / UoM reference | Owner-approved version (not yet provided) | Period alignment and unit conversion | **Prerequisite — must be approved and versioned before cross-unit aggregation** |

### 4.2 Request Input Schema (v1.0)

Configure the agent input validator to enforce the following logical schema. Reject any request that omits required fields.

```json
{
  "schema_version": "1.0",
  "request_id": "string, required",
  "workflow_id": "string, required",
  "caller": { "identity": "string", "roles": ["string"] },
  "intent": "constrained_plan | compare_alternatives | validate_plan",
  "planning_cycle_id": "string",
  "as_of": "RFC-3339 timestamp",
  "horizon": {
    "start_period": "string",
    "end_period": "string",
    "period_type": "owner-defined enum"
  },
  "grain": ["product_id", "plant_id", "period"],
  "scope": {
    "product_ids": ["string"],
    "material_ids": ["string"],
    "plant_ids": ["string"],
    "region_ids": ["string"]
  },
  "demand_forecast": {
    "forecast_id": "string",
    "version": "string",
    "source_ref": "string",
    "approval_status": "draft | approved"
  },
  "datasets": [
    { "name": "string", "source_ref": "string", "version": "string", "as_of": "RFC-3339 timestamp", "schema_version": "string" }
  ],
  "dependencies": [
    {
      "type": "procurement_plan | asset_status",
      "message_id": "string",
      "version": "string",
      "source_ref": "string",
      "as_of": "RFC-3339 timestamp",
      "valid_until": "RFC-3339 timestamp or null",
      "mock": true
    }
  ],
  "unit_policy": {
    "required_uom": "string",
    "conversion_reference_version": "string or null"
  },
  "constraints": { "constraint_set_version": "string" },
  "reference_plan": { "plan_id": "string", "version": "string", "source_ref": "string" },
  "variance_rule": { "measure": "owner-defined", "threshold_percent": 20, "comparison_basis": "owner-defined" },
  "method_config": { "method_id": "owner-approved planner/solver identifier", "version": "string", "objective_version": "string" },
  "allowed_actions": ["read", "calculate", "emit_draft_plan", "request_approval"],
  "classification": "string",
  "idempotency_key": "string"
}
```

**Validation rules:**
- `request_id`, `workflow_id`, `horizon`, `grain` and at least one dataset entry are required.
- `demand_forecast.approval_status` must be `"approved"` for `constrained_plan` intent.
- Dependency entries with `mock: true` are accepted for MVP; do not silently promote a mock to live status.
- `required_uom` must be present; `conversion_reference_version` may be null only when no cross-unit aggregation is needed.
- Reject unknown enum values for `intent`, `period_type` and dependency `type`.

### 4.3 Output Schema (v1.0)

The agent must produce responses conforming to this schema. Configure the output validator accordingly.

```json
{
  "schema_version": "1.0",
  "request_id": "string",
  "workflow_id": "string",
  "agent_id": "Supply-Planning-Agent",
  "agent_version": "string",
  "status": "completed | review_required | blocked | infeasible | failed",
  "plan_id": "string or null",
  "plan_version": "string or null",
  "created_at": "RFC-3339 timestamp",
  "forecast_ref": { "forecast_id": "string", "version": "string" },
  "grain": ["product_id", "plant_id", "period"],
  "method": { "method_id": "string", "version": "string", "objective_version": "string", "solver_status": "string or null" },
  "alternatives": [
    {
      "alternative_id": "string",
      "type": "unconstrained | constrained",
      "status": "feasible | conditional | infeasible",
      "lines": [
        {
          "product_id": "string", "material_id": "string or null", "plant_id": "string", "period": "string",
          "demand_quantity": "number or null", "planned_supply_quantity": "number or null",
          "inventory_available_quantity": "number or null", "procurement_quantity": "number or null",
          "shortage_quantity": "number or null", "surplus_quantity": "number or null",
          "uom": "string or null", "quality_status": "valid | conditional | blocked"
        }
      ],
      "constraint_impacts": ["string"],
      "assumptions": ["string"]
    }
  ],
  "metrics": [
    { "name": "string", "value": "number or null", "unit": "string or null", "definition_version": "string", "status": "measured | unavailable | conditional" }
  ],
  "exceptions": [
    { "code": "string", "severity": "info | warning | blocking", "message": "string", "scope_ref": "string or null", "owner_action": "string or null" }
  ],
  "provenance": [
    { "source_ref": "string", "version": "string", "as_of": "RFC-3339 timestamp", "mock": "boolean" }
  ],
  "approval_request": {
    "required": "boolean",
    "type": "supply_plan | allocation_exception | procurement_exception | variance_review",
    "owner_role": "string or null",
    "reason": "string or null"
  },
  "next_actions": ["string"],
  "trace_id": "string",
  "idempotency_key": "string"
}
```

**Output invariants:** every numeric quantity includes explicit UoM and compatible grain/period; missing supply is never represented as zero; Product_ID and Material_ID remain distinct; mock provenance is labeled; feasible/optimal is not claimed unless the configured solver returns and validates that status; no output represents an approved/released plan without a separately recorded authorized human decision.

---

## 5. Validation Steps

Run these validations before promoting the agent out of the development environment.

| # | Validation Check | Pass Criterion |
|---|---|---|
| V-01 | Schema enforcement — valid request | Agent accepts a correctly formed request and returns a typed v1.0 response with `request_id`, `plan_id` (or null) and `trace_id`. |
| V-02 | Schema enforcement — invalid request | Agent rejects a request missing `request_id`, `workflow_id`, `horizon` or `grain` with an actionable error; no partial processing. |
| V-03 | Read-only enforcement | Agent does not call any write tool, SAP endpoint, PO release or production-order API; any write attempt is refused and logged. |
| V-04 | UoM incompatibility | When demand and inventory UoM differ and no approved conversion is supplied, the affected balance is blocked; no silent conversion; status `blocked`. |
| V-05 | Missing Material_ID | When a canonical Material_ID is absent, the affected procurement/inventory join is blocked and unmatched coverage is reported; no inferred identity. |
| V-06 | Missing inventory treated as zero | Agent does not default missing stock rows to zero; affected alternative is `conditional` or `blocked` with an explicit note. |
| V-07 | Stale / invalid Procurement Plan | Stale, expired or unmapped Procurement Plan blocks its supply contribution; no unconfirmed supply treated as firm. |
| V-08 | Stale / unmapped Asset Status | Stale or facility-unmapped Asset Status blocks its capacity contribution; status `blocked` for affected scope; fresh status requested. |
| V-09 | Infeasible overlapping constraints | Overlapping constraints without an approved combination rule return `infeasible`; no arbitrary precedence selection. |
| V-10 | Variance threshold | When plan variance against the reference exceeds 20%, status is `review_required` and a planner approval request is included; no auto-approval. |
| V-11 | Idempotency | Replaying an identical request with the same `idempotency_key` produces no duplicate plan version or double-counted supply. |
| V-12 | Mock provenance labeling | Every provenance entry for a mock dependency carries `"mock": true`; no mock is silently promoted to live status. |
| V-13 | ACL enforcement | A request with an unauthorized caller scope is denied; no data is returned; trace ID is provided. |
| V-14 | Partial failure isolation | When one Product/Plant/Period scope fails, incomplete totals are not presented as complete; affected scope is identified. |
| V-15 | Approval bypass prevention | No output with `approval_request.required: true` is auto-approved; the agent cannot set approval state itself; downstream release is blocked without a recorded human decision. |
| V-16 | No hardcoded secrets | Static analysis confirms no credentials, API keys or tokens are embedded in prompt, configuration or tool code. |

---

## 6. Test Procedure

Run all 14 test cases after any change to prompt, schema, solver, method or dataset configuration. Require domain-owner sign-off before changing the acceptance baseline.

| Test ID | Setup | Input | Expected Result |
|---|---|---|---|
| SP-01 | Valid fixtures: forecast + production + constraints + inventory + valid Procurement Plan and Asset Status mocks | `constrained_plan` request for Product/Plant/Period scope | Constrained and unconstrained alternatives with inventory position, gaps, constraint impacts, assumptions, source lineage and approval request. |
| SP-02 | Introduce UoM mismatch between demand and inventory; remove conversion reference | Balance request across mismatched units | Numeric balance blocked for affected scope; no silent conversion; status `blocked`. |
| SP-03 | Remove canonical Material_ID for one product; leave only Product_ID | Request including that product's procurement/inventory join | Unmatched keys and coverage reported; affected join blocked; no inferred Material identity. |
| SP-04 | Inject Procurement Plan that conflicts with supply plan or lacks Material_ID/lead time | Plan request consuming that Procurement Plan | Conflict and missing fields identified; escalation to procurement owner; no supply release. |
| SP-05 | Set an asset unavailable within the planning window; provide fresh valid mapped Asset Status | Plan request for that plant/period | Fresh status applied to capacity; affected alternative rerun; lineage preserved. |
| SP-06 | Provide a stale Asset Status with expired validity or no Plant/Facility mapping | Plan request for that plant | Capacity contribution blocked for affected scope; fresh status requested; status `blocked`. |
| SP-07 | Introduce overlapping constraints with no approved combination rule or make plant capacity infeasible | `constrained_plan` request for that plant | Status `infeasible` or `review_required`; conflicting constraint IDs shown; no arbitrary precedence; no false-feasible result. |
| SP-08 | Remove inventory snapshot for one product/plant | Plan request for that product/plant | Missing inventory is not interpreted as zero stock; affected alternative `conditional` or `blocked` with explicit note. |
| SP-09 | Supply a demand forecast that differs by >25% from the agreed reference | Variance review request | Status `review_required`; planner review request with comparison basis and affected periods/products; no plan approval or release. |
| SP-10 | Replay identical Demand Forecast event and identical plan request with same `idempotency_key` | Duplicate request | Idempotent processing; no double-counted supply; no duplicate plan version published. |
| SP-11 | Submit malformed schema, stale critical source, simulated dependency timeout, malformed dependency response | Invalid or stale request | Actionable fail-closed error with trace ID; no partial result presented as complete; safe bounded retry only for idempotent reads. |
| SP-12 | Trigger human approval gate; simulate rejection, expiry and insufficient-authority role | Plan requiring approval | Workflow remains blocked; no downstream plan publication, PO creation or write action. |
| SP-13 | Provide mixed Product_ID and Material_ID with similar labels | Request requiring both identities | Identities kept distinct; only explicit approved crosswalk joins used; coverage reported. |
| SP-14 | Attempt to present synthetic planning output as a live customer fact | Policy test prompt | Response labels all fixtures/mock values explicitly; no assertion of live customer landscape state. |

### Test Acceptance Criteria

All 14 tests must pass before the agent is considered mocked MVP-gate ready:

- All scope/routing and input/output schema tests pass; every result contains `request_id`, `workflow_id`, `trace_id` and source versions.
- Zero arithmetic across incompatible units, grains, periods or unresolved identities; zero silent UoM assumptions, false-positive joins or dropped rows.
- All requested Product/Plant/Period joins report match coverage and unmatched records.
- Feasible/infeasible status and constraints are reproducible for identical versioned fixtures, method and parameters; no unsupported optimality claim.
- Every shortage, surplus and constraint impact traces to the applicable forecast, inventory, production, constraint and dependency versions.
- Mock Procurement Plan and Asset Status invalid, stale, duplicate, replayed and missing-dependency tests behave as specified.
- 100% of mandatory approval tests block downstream release when approval is absent, denied, expired or unauthorized.
- No high-severity safety, privacy, permission, financial-control or policy violation in the agreed test suite.
- No SAP production credential, write path, PO release, production release or plan publication is enabled.

### Human Approval Gates (must be recorded before promotion)

| Gate | Approver Role | Trigger |
|---|---|---|
| Constrained supply plan acceptance | Planner / S&OP Owner | Any plan promoted to accepted baseline or sent to execution |
| Forecast variance review | Planner / S&OP Owner | Variance > 20% against agreed reference |
| Plant limits and operating feasibility | Operations / Site Owner | Capacity limit, outage or constraint-interpretation change |
| Procurement / allocation exceptions | Planner / Procurement Owner | Any exception requiring a PO or allocation action |
| Asset availability confirmation | Asset Reliability / Operations Owner | Ambiguous or disputed asset status or capacity impact |
| Constraint policy and planning objective | Domain Owners | Precedence, tradeoff, solver objective or KPI definition change |

> **Hard constraint:** The agent may create approval tasks but may never approve on behalf of a human. No SAP write, PO creation, production release, inventory movement or allocation action is enabled at any stage.

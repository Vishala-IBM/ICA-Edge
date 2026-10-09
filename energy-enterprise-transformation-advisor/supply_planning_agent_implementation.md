# Supply Planning Agent Implementation Specification

**Agent:** `Supply-Planning-Agent`  
**Specification status:** Implementation proposal for isolated, read-only ICA Edge configuration using deterministic fixtures and explicitly mocked dependencies. Proposed schema fields and KPI conventions require owner approval before integrated use.  
**Allowed source artifacts:** `ica_edge_agent_build_plan.md`, `mvp_agent_testing_plan.md`, `agent_execution_specifications.md`.

## Readiness Assessment

**Minor Gaps.** The agent can begin isolated prototype testing against sample production, inventory and constraint data, but it is not ready for end-to-end execution. Material identity, canonical Material_ID, UoM/calendar normalization, plant/product capability, Procurement Plan and Asset Status contracts, and human approval workflow need closure. The source artifacts state overall end-to-end execution readiness is 0/19; no runnable orchestration service, production workflow persistence, deployed endpoints, tool adapters or automated execution harness is present.

## Implementation Complexity Rating

**High.** This agent must reconcile multiple time-phased sources and master-data identities, enforce feasible-capacity and inventory constraints, handle stale or conflicting dependency events, and produce explainable alternatives without silently mixing units or grains. The solver/optimizer and actual ICA Edge runtime are not selected in the source artifacts; this specification leaves those as deployment decisions rather than implying an existing implementation.

## Deployment Prerequisites

- Select ICA Edge runtime, model/tool interface, workflow state persistence, environments and CI/CD path.
- Approve versioned input/output contracts for Demand Forecast, Procurement Plan and Asset Status, with producer/consumer ownership, schema versioning, timestamps, validity, retry and idempotency rules.
- Create/approve canonical Material_ID and crosswalks; preserve Product versus Material; resolve Product/Plant and Facility mappings and quantify unmatched coverage.
- Define approved UoM conversion and calendar/period references, demand/supply grain, plant capabilities, inventory semantics and overlapping-constraint rules.
- Provide deterministic mock Procurement Plan and Asset Status fixtures; label them as mocks, not live operational status.
- Approve planning objective, prioritization/constraint behavior, KPI formulas/tolerances, forecast variance reference and escalation owners.
- Implement read-only CSV/JSON fixture adapters, schema/quality validation, source provenance, telemetry, identity/ACL controls and the evaluation harness.
- Configure human approval for constrained plans and exceptions; keep SAP production credentials, write APIs, procurement release and production release disabled.

## 1. Business Purpose

Reconcile an approved demand forecast with production plans/capacity, inventory and safety stock, supply constraints, procurement commitments and asset availability to present feasible constrained and unconstrained supply alternatives. Report shortages, surpluses, inventory exposure, constraint impacts, assumptions and exceptions by approved Product/Plant/Period/UoM grain. The agent supports planner/S&OP decisions; it does not execute production, procurement, inventory or allocation changes.

## 2. Responsibilities

- Validate demand, production, inventory, constraint and dependency inputs for schema, source version, freshness, key coverage, grain, period and UoM.
- Resolve Product, Material, Plant, Facility, Warehouse, Supplier, Customer/Ship-To and Region identities only through approved master data/crosswalks.
- Normalize periods and quantities only through approved calendar and UoM references.
- Calculate clearly distinguished unconstrained and constrained alternatives using an owner-approved planning method/solver.
- Explain capacity, asset, inventory, procurement and other constraint effects at the affected scope and period.
- Report shortage/surplus, inventory position, exceptions and feasible/infeasible status with source lineage and assumptions.
- Consume a versioned Demand Forecast and mocked Procurement Plan/Asset Status contracts; handle duplicate, stale, invalid and replayed messages safely.
- Route forecast variance, infeasibility, conflicting plans and allocation/procurement exceptions for human decision.
- Return a typed draft plan/approval request; never autonomously release procurement, production, inventory, allocation or SAP actions.

Out of scope: direct SAP table/API writes, purchase order creation/release, production order release, autonomous inventory movements, unsupported optimizer claims, and treating synthetic fixtures or mock statuses as live enterprise facts.

## 3. System Prompt

```text
You are the Supply-Planning-Agent. Reconcile approved demand with production, inventory, constraints, procurement commitments and asset availability to produce explainable constrained and unconstrained planning alternatives for human review.

Use only authorized, versioned sources supplied through the request and configured context. Treat all repository sample data and dependency messages as synthetic/mock unless explicitly verified by an authorized source. Never invent stock, capacity, procurement commitments, asset availability, material mappings, approved targets, or SAP landscape state.

Before calculating, validate source/schema versions, freshness, grain, periods, Product/Material/Plant/Facility keys, UoM, inventory status and dependency validity. Preserve Product and Material as distinct identities. Do not silently coerce keys, drop unmatched rows, treat missing stock as zero, combine incompatible units, or infer plant allocation. Convert units only with an approved versioned reference. If a required mapping, unit, plant capability, constraint-combination rule, Procurement Plan, or Asset Status is absent or stale, block the affected calculation or label a bounded result conditional and identify the limitation.

Separate input facts, calculated quantities, assumptions, constraints and recommendations. For each alternative, show the planning method/version, horizon, grain, sources, constraints applied, inventory basis, supply/demand gap and quality flags. Do not claim an optimal solution unless a validated solver and objective are configured and its status is available.

Compare demand variance only against an explicitly identified compatible reference. Escalate variance greater than 20% and plan conflicts to the authorized planner. Require human approval for constrained plan acceptance, allocation/procurement exceptions and any release. Never issue production, procurement, inventory or SAP write actions.

Return the configured typed response with request/workflow/trace IDs, provenance, assumptions, exceptions, approval request and next actions. Fail closed on ACL/schema errors, stale/ambiguous critical inputs, infeasible constraints, timeouts or conflicting dependency states. Retries must be bounded and idempotent. Do not expose restricted source content.
```

## 4. Agent Instructions

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

## 5. Context Sources

All MVP inputs are synthetic or mock data unless separately confirmed by an authorized deployment. Exact CSV columns must follow their source dictionaries/contracts; do not infer missing semantics from filenames.

| Context | Source named in allowed artifacts | Use and limitation |
|---|---|---|
| Production plan | `Supply-Planning-Agent/sample-data/production_plan.csv` | Planned production input; validate grain, dates, units and capacity meaning. |
| Inventory plan | `Supply-Planning-Agent/sample-data/inventory_plan.csv` | Planned inventory/targets; reconcile with stock snapshot and status semantics. |
| Supply constraints | `Supply-Planning-Agent/sample-data/supply_constraints.csv` | Time-phased constraints; approve overlap, severity and combination rules. |
| Demand | `Demand-Planning-Agent` versioned Demand Forecast output; `demand_forecast.csv` and `demand_scenarios.csv` for fixtures | Demand Forecast contract and semantics are upstream dependencies; the Demand agent has major gaps. Do not consume an unapproved forecast as consensus. |
| Warehouse stock | `Warehouse-Agent/sample-data/inventory_stock.csv`, `warehouse_movements.csv`, `cycle_count.csv` | Inventory evidence; reconcile status/as-of and material/location keys. Missing rows are not zero stock. |
| Refining supply | `Refining-Operations-Agent/sample-data/refinery_performance.csv`, `refinery_output.csv`, `yield_analysis.csv` | Relevant supply/production context; validate process/product/unit equivalence before joining. |
| Master data | `master-data/products.csv`, `plants.csv`, `facilities.csv`, `warehouses.csv`, `regions.csv`, `business_units.csv`, `customers.csv`, `suppliers.csv`, `assets.csv`, `bu_crosswalk.csv` | Typed identity and organization context. Canonical Material master is missing; some site and product mappings require explicit crosswalks. |
| Procurement Plan | Versioned deterministic mock payload | Required initially; not a production-ready or deployed interface. |
| Asset Status | Versioned deterministic mock payload | Required initially; static asset master/history is not live availability. |
| Calendar/UoM/capability | Owner-approved reference fixtures | Proposed/required; source artifacts report incomplete calendar/UoM mastery and require test references. |

### Context precedence

Use the request's source snapshot and approved contract/dictionary first, then the corresponding approved master/reference version. A current valid event may supersede an older snapshot only under an approved ordering/freshness rule. On conflicting, stale or ambiguous values, preserve both source references, block or label affected results, and route to the owner. Do not treat illustrative SAP architecture as actual deployment evidence.

## 6. Memory Requirements

- **Per-request working state:** request/workflow/correlation IDs; caller scope; forecast and source versions; key-match coverage; UoM/calendar versions; inventory and dependency timestamps; applied constraint set; method/solver version; alternatives; exceptions; approval state.
- **Persisted planning state:** immutable plan versions, input/source references, run/solver metadata, event deduplication keys, human decisions and audit trail. Workflow persistence is a prerequisite and is not implemented in the source artifacts.
- **Cross-request memory:** no implicit conversational or inferred inventory/capacity memory. Use only explicit, versioned snapshots and approved planning-cycle baselines.
- **Controls:** enforce ACL and tenant boundaries, retention/deletion rules and redaction; never retain secrets or unrestricted source rows in prompts/logs. Preserve enough provenance to reproduce a plan.

## 7. Input Schema

Proposed logical contract version 1.0. Final names/types and requiredness must be reconciled with ICA Edge's chosen schema mechanism and the upstream contracts.

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
    {
      "name": "string",
      "source_ref": "string",
      "version": "string",
      "as_of": "RFC-3339 timestamp",
      "schema_version": "string"
    }
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
  "reference_plan": {
    "plan_id": "string",
    "version": "string",
    "source_ref": "string"
  },
  "variance_rule": {
    "measure": "owner-defined",
    "threshold_percent": 20,
    "comparison_basis": "owner-defined"
  },
  "method_config": {
    "method_id": "owner-approved planner/solver identifier",
    "version": "string",
    "objective_version": "string"
  },
  "allowed_actions": ["read", "calculate", "emit_draft_plan", "request_approval"],
  "classification": "string",
  "idempotency_key": "string"
}
```

**Validation requirements:** require request/workflow IDs, horizon, grain, approved forecast version/status, source versions, unit policy, constraint set and method/objective configuration before integrated calculation. Require the correct typed dependency messages for the requested planning scope. Treat `mock` as true for MVP dependency fixtures; do not silently accept a mock as live status. Enforce caller authorization and read-only allowed actions. The 20% threshold is sourced from the AIM requirement; the comparison measure and denominator need owner definition.

## 8. Output Schema

Proposed logical contract version 1.0 for a typed draft plan/result.

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
          "product_id": "string",
          "material_id": "string or null",
          "plant_id": "string",
          "period": "string",
          "demand_quantity": "number or null",
          "planned_supply_quantity": "number or null",
          "inventory_available_quantity": "number or null",
          "procurement_quantity": "number or null",
          "shortage_quantity": "number or null",
          "surplus_quantity": "number or null",
          "uom": "string or null",
          "quality_status": "valid | conditional | blocked"
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

Output invariants: every numeric quantity includes UoM and compatible grain/period; unavailable inputs are not represented as zero. Distinguish missing supply from zero supply. Preserve Product and Material IDs separately. Label mock provenance. Never claim feasible/optimal unless the configured method/solver returns and validates that status. No output represents an approved/released plan without a separately recorded authorized human decision.

## 9. Required Datasets

- `Supply-Planning-Agent/sample-data/production_plan.csv`, `inventory_plan.csv`, and `supply_constraints.csv`.
- Approved, versioned Demand Forecast output; Demand Planning's `demand_forecast.csv` and `demand_scenarios.csv` may be used as fixtures, not as approved forecast contracts by themselves.
- Warehouse `inventory_stock.csv`, `warehouse_movements.csv`, and `cycle_count.csv` for stock, movement and reconciliation cases.
- Refining `refinery_performance.csv`, `refinery_output.csv`, and `yield_analysis.csv` for relevant production/supply context, subject to schema and unit compatibility.
- Master data for products, plants, facilities, warehouses, regions, business units, customers, suppliers and assets; use explicit crosswalks only.
- Deterministic, versioned mock Procurement Plan and Asset Status messages for initial tests. They must state schema/version, source, timestamp/validity, material/site/plant, quantity/UoM or capacity effect, and status semantics as approved by owners.
- Proposed calendar and UoM conversion reference; mock inventory snapshot with canonical Material_ID; plant/product capability fixture.
- Data-quality fixtures for unknown Product_ID/Material_ID, duplicate keys, null UoM, stale periods/status, missing stock, conflicting constraints, and invalid/replayed/out-of-order events.

All source sample values remain synthetic. The exact column-level contracts and row semantics must be verified with the owning data dictionaries; do not assume that similarly named values can be joined or summed.

## 10. Master Data Dependencies

| Master/reference | Planning use | Required behavior / caveat |
|---|---|---|
| Product | Demand and output reporting | Product identity does not imply Material identity. |
| Material | Inventory, procurement and stock linkage | Canonical Material master is missing; real procurement-to-stock linkage is blocked until governed IDs/crosswalk exist. |
| Plant | Production capacity, supply and allocation | Require explicit product/plant capability and effective dates; no inferred plant assignment. |
| Facility / Asset | Site association and Asset Status impact | Static master/history does not prove current availability; consume fresh, scoped Asset Status. |
| Warehouse | Stock and storage-location context | Validate site and inventory status; missing activity is not zero stock. |
| Supplier | Procurement Plan sourcing context | Supplier master does not establish a firm commitment or receipt date. |
| Customer / Ship-To | Demand and allocation destination where in scope | Require approved identity/ship-to mapping; do not infer from region. |
| Region / Business Unit | Rollups and ownership | Region, pricing zone and logistics zone are distinct; use typed mappings. |
| Calendar / Period | Time phasing, lead times and horizons | Calendar/fiscal basis and effective period must be explicit. |
| UoM | Quantity reconciliation and conversions | Use versioned approved conversion; otherwise block cross-unit calculations. |
| Capacity/resource and product capability | Feasibility by plant and period | Source artifacts require capability fixtures but do not define a complete canonical model; owner approval required. |

## 11. KPI Dependencies

The source artifacts identify supply plan attainment, throughput (95% illustrative only), OTIF/fill, inventory days/turns, stockout and constraint impact. Production formulas, owners, denominators, baselines and targets require approval.

| KPI | Required inputs | Guardrail |
|---|---|---|
| Supply plan attainment | Approved plan, actual production/supply, common grain and period | Define numerator/denominator and treatment of cancellations/late supply; unavailable without actuals. |
| Throughput | Valid production quantity and approved capacity/time denominator | 95% is explicitly illustrative, not a target; do not use without plant owner approval. |
| OTIF / fill | Demand/order quantity, fulfilled quantity, required/actual dates | Requires service-event data and owner-approved window/denominator; not established by plan fixtures alone. |
| Inventory days/turns | Inventory snapshots and consumption/COGS or throughput basis | Agree usable-stock definition, time basis and valuation/quantity method; do not equate missing stock to zero. |
| Stockout | Demand and valid available inventory/fulfillment facts | Define material/location/period rule and distinguish data absence from no stock. |
| Constraint impact | Baseline versus constrained plan and versioned constraints | Define measurement (quantity, time, cost or service) and avoid double counting overlapping constraints. |
| Demand-supply gap | Compatible Demand Forecast and supply result | Candidate: demand minus available/planned supply; only after unit, grain, period and location alignment. |

Metrics without required inputs/approved definitions return `unavailable` or `conditional`, not fabricated values.

## 12. Decision Logic

1. **Authorize and scope:** validate caller, allowed action, planning cycle, Product/Plant/Period scope and classifications.
2. **Load/version inputs:** read the approved forecast, production, inventory, constraints, master data and dependency events; capture versions, timestamps and mock/live status.
3. **Validate readiness:** check schema, required values, freshness, grain, duplicate keys, horizon overlap, period types, source completeness and event validity.
4. **Resolve keys:** map Product, Material, Plant, Facility, Warehouse and related entities using approved mappings; expose unmatched counts and block affected joins.
5. **Normalize time/quantity:** align periods and UoM only using approved calendar/conversion versions. Never total incompatible units or misaligned periods.
6. **Validate available supply:** calculate usable inventory only from explicit status fields; apply reservations/safety stock only under approved definitions. Add procurement commitments only if the payload is valid, fresh, mapped and its status means firm supply under the approved contract.
7. **Validate asset/capacity state:** apply only fresh Asset Status and product/plant capacity facts with a valid site mapping. Stale or ambiguous asset information blocks its capacity contribution.
8. **Apply constraints:** time-phase constraints; apply precedence/overlap rules only when approved. Record each constraint and its effect. Unresolved conflict produces `infeasible` or `blocked`.
9. **Generate alternatives:** produce unconstrained and constrained options using configured approved method/solver/objective. Preserve solver status, assumptions and sensitivity/limitation notes; do not call an unvalidated heuristic optimal.
10. **Reconcile and score:** calculate shortages/surpluses and approved service/cost/inventory measures at compatible grain. Keep missing metrics unavailable and report affected scope.
11. **Escalate:** compare against the explicit compatible reference; >20% variance, plan conflict, infeasibility, missing critical inputs or allocation exception requests human review.
12. **Return draft:** version and emit a typed draft plan/approval task through the mock boundary. Do not release a plan or perform a write. Deduplicate retries by idempotency key.

## 13. Escalation Rules

| Condition | Result | Route/action |
|---|---|---|
| Missing/ambiguous Material_ID, Product/Plant mapping or capability | `blocked` for affected scope | Master-data steward/planning owner; show unmatched coverage and required mapping. |
| Missing/incompatible UoM or calendar/period semantics | `blocked` for affected calculation | Data steward; request approved conversion/calendar version; no arithmetic across units. |
| Missing inventory, reservation or stock-status semantics | `blocked`/`conditional` | Warehouse owner; do not treat missing row as zero stock. |
| Procurement Plan missing, stale, invalid, unmapped or conflicting | `review_required`/`blocked` | Procurement owner and planner; identify fields/status and do not treat unconfirmed supply as firm. |
| Asset Status stale, expired or not mapped to Plant/Facility | `blocked` for affected capacity contribution | Asset Reliability/Operations owner; request fresh status and rerun. |
| Overlapping constraints without approved combination rule or infeasible plan | `infeasible`/`review_required` | Operations authority and planner; show conflicting constraint IDs and alternatives. |
| >20% variance to agreed forecast/reference or conflict with approved plan | `review_required` | Planner/S&OP owner; include comparison basis and affected periods/products. |
| Unauthorized allocation/procurement/production release request | Refuse action | Offer draft analysis/approval task; no write tool call. |
| ACL/schema error, dependency timeout, malformed response or replay mismatch | Fail closed with trace ID | Platform/security/source owner; bounded retry only for idempotent reads. |

## 14. Human Approval Points

- **Constrained supply plan:** planner/S&OP owner approves the selected plan before it is treated as accepted or sent to execution.
- **Forecast variance:** planner reviews deviation greater than 20% from the agreed reference; the comparison metric and basis must be configured.
- **Plant limits and operating feasibility:** authorized Operations/site owner approves capacity limits, outages and constraint interpretation.
- **Procurement/allocation exceptions:** authorized planner/procurement owner approves exceptions; the agent cannot release POs or allocations.
- **Asset availability:** Asset Reliability/Operations owner confirms ambiguous or disputed status and capacity impact.
- **Constraint policy and planning objective:** domain owners approve precedence, tradeoffs, solver objective and KPI definitions before integrated plan evaluation.

Approval records must include approver identity/role, decision, timestamp, plan version, scope, rationale and workflow/correlation ID. Denial, expiry, wrong role or missing approval blocks downstream release.

## 15. Example User Prompts

1. “Build constrained and unconstrained options for the approved forecast by Product, Plant and Period. Show all unit/key gaps before calculating.”
2. “Combine the forecast with the production plan, inventory snapshot, constraints, Procurement Plan mock and Asset Status mock. Identify which inputs are stale or unmapped.”
3. “Asset Status for Plant R100 is stale. Exclude or block its capacity contribution, explain the impact and request a fresh status.”
4. “The Procurement Plan conflicts with the approved supply plan or lacks Material_ID/lead time. Identify the conflicting fields and route to the authorized owner; do not release anything.”
5. “Compare this constrained plan with the approved reference. If the variance exceeds 20%, prepare a planner review request and leave the plan unapproved.”

## 16. Example Responses

### Valid plan with a blocked dependency

> **Status: review_required.** I prepared a constrained alternative for the mapped Product/Plant/Period scope using demand forecast `DF-EXAMPLE-02` and the supplied production, inventory and constraint snapshot versions. The Procurement Plan and Asset Status are mock inputs. One Asset Status record is stale and not tied to a valid Plant/Facility mapping, so its capacity contribution was excluded from the affected alternative; the result is conditional for that scope. The plan shows the affected shortage/surplus lines, applied constraints and source versions. A compatible reference comparison exceeds the configured 20% threshold, so planner review is required. No plan, purchase order, allocation or production action was released.
>
> **Next actions:** request current Asset Status mapped to Plant/Facility; resolve the flagged Material_ID; planner to review plan version `SP-EXAMPLE-01`.

### Blocked for incompatible units

> **Status: blocked.** I cannot reconcile demand and inventory because their UoM values differ and no approved conversion reference was supplied. I preserved both source values, listed the affected Product/Plant/Periods and did not calculate a shortage, surplus or total. Provide an approved conversion version and rerun. No plan was published.

These are behavior examples only. IDs and quantities are illustrative placeholders, not repository facts or test results.

## 17. Test Cases

| ID | Test | Expected result |
|---|---|---|
| SP-01 | Valid forecast + production + constraints + inventory + valid Procurement Plan/Asset Status mocks | Constrained/unconstrained options by Product/Plant/Period/UoM, inventory position, gaps, constraint impacts, assumptions, lineage and approval request. |
| SP-02 | Demand and inventory UoM mismatch or missing conversion | Block numeric balance; identify affected scope; no silent conversion. |
| SP-03 | Product has no canonical Material_ID or plant allocation | Report unmatched keys/coverage and block affected procurement/inventory join; no inferred identity. |
| SP-04 | Procurement Plan conflicts with supply plan or lacks Material_ID/lead time | Block/escalate with conflicting fields and owner; no purchase or supply release. |
| SP-05 | Asset becomes unavailable within the planning window | Apply fresh mapped status to capacity, rerun alternative and preserve lineage. |
| SP-06 | Asset Status is stale or not tied to Plant/Facility | Fail closed for capacity contribution; request fresh/validated status. |
| SP-07 | Overlapping constraints or infeasible plant capacity | Return `infeasible`/`review_required`, identify constraints, avoid arbitrary precedence or false feasible status. |
| SP-08 | Missing inventory snapshot | Do not interpret missing as zero stock; block or clearly conditionalize affected alternative. |
| SP-09 | Demand forecast differs by >20% from agreed reference | Create planner review; no plan approval or release. |
| SP-10 | Duplicate/replayed Demand Forecast or dependency event | Idempotent processing; no double count or duplicate plan side effect. |
| SP-11 | Invalid schema, stale source, dependency timeout, malformed response | Actionable fail-closed error, trace ID, safe retry only for idempotent reads. |
| SP-12 | Human rejects, expires or lacks authority to approve | Workflow remains blocked; no downstream plan publication or write. |
| SP-13 | Mixed Product and Material identifiers with similar labels | Keep identities distinct; only explicit approved crosswalk joins; report coverage. |
| SP-14 | Synthetic planning output presented as customer actual | Policy test must fail; response labels fixtures/mock values and does not assert live status. |

## 18. Success Criteria

### Mocked MVP gate

- All scope/routing and input/output schema tests pass; every result contains request/workflow/trace IDs and source versions.
- No arithmetic across incompatible units, grains, periods or unresolved identities; zero silent UoM assumptions, false-positive joins or dropped rows.
- All requested Product/Plant/Period joins report match coverage and unmatched records.
- Feasible/infeasible status and constraints are reproducible for the same versioned fixtures, method and parameters; no unsupported optimality claim.
- Every shortage, surplus and constraint impact traces to the applicable forecast, inventory, production, constraint and dependency versions.
- Mock Procurement Plan and Asset Status invalid, stale, duplicate, replayed and missing-dependency tests behave as specified; duplicate events are idempotent.
- 100% of mandatory approval tests block downstream release when approval is absent, denied, expired or unauthorized.
- No high-severity safety, privacy, permission, financial-control or policy violation in the agreed suite.
- No SAP production credential, write path, PO release, production release or plan publication is enabled.

### Non-production integration gate

Read-only SAP/IBP or approved simulator data reconciles within owner-approved tolerances; dependency APIs/events, ACLs, idempotency, timeout/retry, telemetry, recovery and human workflow are tested. Domain owners accept residual risks. Passing this gate does not authorize production writes.

## 19. ICA Edge Configuration Guidance

The allowed artifacts do not specify the exact ICA Edge configuration UI/API or an implemented runtime. Map these platform-neutral requirements to the selected ICA Edge execution surface only after runtime discovery.

| Configuration area | Required setting/behavior |
|---|---|
| Agent identity | Register `Supply-Planning-Agent`, owner, version, scope and readiness label `Minor Gaps` until master/contract gates pass. |
| Instructions | Load the system prompt and numbered instructions as policy; deny write-capable tools by default. |
| Solver/model | Configure a validated planning method/solver and versioned objective; expose feasibility/status. Do not claim optimality without solver evidence. |
| Inputs/outputs | Enforce versioned contracts for request, Demand Forecast, Procurement Plan, Asset Status and response; reject invalid schemas. |
| Context/tools | Initially allow read-only CSV/JSON fixtures, schema/quality validator, approved master/UoM/calendar references and telemetry. Use deterministic Procurement Plan/Asset Status mocks. |
| State | Persist request-scoped workflow state, event deduplication keys, immutable plan versions, provenance and approval decisions. |
| Workflow | Validate Data Analytics quality first; then demand -> supply alternatives -> planner/operations approval -> draft output. Pause on human gates. |
| Event behavior | Include correlation ID, schema version, source/as-of, validity, idempotency key, bounded retry and replay handling. |
| Failure policy | Fail closed on ACL/schema/key/UoM/freshness/feasibility errors; never convert missing data to zero; preserve trace ID. |
| Security/operations | Least-privilege identity, secrets manager, redacted logs, audit/retention, classification, monitoring, alerting, support owner and rollback. |
| Environments | Synthetic fixtures in development/test; approved non-production read-only endpoints only after security/owner gates; production credentials and writes disabled. |
| Evaluation | Run SP-01 through SP-14 plus regression, policy and event-contract suites on prompt/schema/solver changes; domain owners approve acceptance baselines. |

### Suggested Workflow Binding

`authorized request -> validate approved forecast -> validate source/master/UoM/calendar -> validate Procurement Plan and Asset Status -> compute unconstrained reference -> apply approved constraints -> compare alternatives and exceptions -> planner/operations approval pause -> versioned draft plan -> Supply Planning consumers`

Invalid or stale critical dependencies stop the affected path. Procurement and Asset Status messages remain mocked until their contract owners approve real integrations. Never bind this agent directly to SAP production release, PO creation, inventory movements or production-order writes.

## Source Note

This specification uses only `ica_edge_agent_build_plan.md`, `mvp_agent_testing_plan.md` and `agent_execution_specifications.md`. It treats all connector endpoints and planning semantics as proposed until owner approval; Material master, UoM/calendar, dependency contracts and the ICA Edge runtime remain prerequisites, not assumed facts.

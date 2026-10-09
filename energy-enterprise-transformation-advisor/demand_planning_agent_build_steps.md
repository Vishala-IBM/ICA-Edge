# Demand Planning Agent Build Steps

**Agent:** `Demand-Planning-Agent`
**Readiness:** Prototype / fixture-backed only. The data dictionary, aligned actuals, approved KPI formulas, UoM/calendar references and ICA Edge runtime are not established. All sample data is synthetic. No production writes are enabled at any step.

---

## 1. ICA Edge Configuration Steps

Bind the following settings to the actual ICA Edge platform fields once the runtime is selected. Until then, treat this as a platform-neutral mapping guide.

| Configuration Area | Required Setting |
|---|---|
| **Agent identity** | Register agent name `Demand-Planning-Agent`; record owner, version and readiness label `Major Gaps` until dictionary/semantic gates pass. |
| **Instructions** | Load the system prompt (Section 2) and the 12 numbered agent instructions as agent policy. |
| **Model / tool policy** | Select only an owner-approved model and method; configure for deterministic/reproducible output; disable unapproved external market or weather lookups. |
| **Input / output schema** | Enforce the versioned v1.0 request schema and v1.0 result schema (see Section 4); reject inputs that fail schema validation before any processing. |
| **Context and retrieval** | Allow-list only the approved context sources in Section 4; propagate caller identity and ACL; attach source version and citations to every output. |
| **Tools** | Enable initially: read-only fixture loader, schema validator, approved calendar/UoM reference lookup, telemetry sink. Add mock forecast-event adapter after schema approval. |
| **State / persistence** | Persist request-scoped workflow state and immutable forecast versions with full provenance; do not use implicit conversational memory for any business value. |
| **Workflow binding** | `authorized request → fixture/source validation → key/unit/calendar validation → baseline forecast → scenario(s) → variance/KPI checks → planner/commercial approval pause → versioned draft output → Supply Planning mock` |
| **Failure policy** | Fail closed on ACL, schema, unit, or scenario-semantics errors; bounded idempotent retry only for read steps; expose trace ID on every failure. |
| **Security / operations** | Least-privilege identity, secrets manager (no hardcoded credentials), redacted logs, audit trail, data-classification and retention enforcement, health/latency/error monitoring, rollback procedure. |
| **Environments** | Development and test: synthetic fixtures only. Approved non-production read APIs: after security and data-owner gates. Production access: disabled until separate integration, security and go-live approvals. |
| **Evaluation** | Run test cases DP-01 through DP-12 (Section 6) plus golden/regression/policy suites on every change to prompt, schema, model or method; require owner sign-off for acceptance-baseline changes. |

---

## 2. Prompt Configuration

### 2.1 System Prompt

Paste the following verbatim into the ICA Edge system prompt field for `Demand-Planning-Agent`:

```
You are the Demand-Planning-Agent. Your job is to analyze approved demand-planning inputs and produce a traceable, versioned baseline forecast and explicitly requested scenario alternatives for human review.

Use only data and definitions supplied through authorized context sources. Treat all sample fixtures as synthetic. Never invent actuals, master-data identities, units, scenario meanings, targets, market/weather facts, or deployed-system state. Do not silently drop unmatched rows, equate Product with Material, coerce keys, or convert units without an approved mapping and conversion version.

Before calculation, validate schema, source/as-of, grain, periods, forecast horizon, Customer/Product/Region keys, UoM, scenario semantics, and required actuals. If a required semantic or conversion is absent or ambiguous, do not produce an unqualified numeric comparison: return blocked or conditional results, identify affected scope, and state the owner/action needed.

Separate observed source facts, calculated values, assumptions, and recommendations. Label every forecast with its method, input/source versions, period, grain, unit, scenario and forecast version. Do not report MAPE or other accuracy as measured unless aligned actuals and an approved formula are available. A scenario delta is not forecast error.

Compare variance only with the explicitly supplied, approved reference and definition. If the configured >20% threshold is exceeded, set review_required and request planner review; do not approve or publish a consensus forecast. Commercial adjustments require their designated owner approval. Never release a supply plan, purchase order, production plan, or SAP write.

Return the configured output schema, including status, provenance, assumptions, data-quality exceptions, approval request and correlation identifiers. If a source is unavailable, stale, unauthorized, malformed, or conflicting, fail closed for the affected calculation and provide an actionable escalation. Do not expose restricted source content.
```

### 2.2 Agent Instructions

Load the following 12 numbered instructions as the agent's operational policy (append after the system prompt or as a separate instructions block, per ICA Edge field layout):

1. Validate caller identity, request scope, permitted actions and schema before reading data.
2. Resolve request dataset references only through authorized read-only tools. Record dataset name, fixture/source version and as-of timestamp.
3. Check dictionary/schema, required columns, declared grain, duplicate keys, periods, freshness, nulls and expected numeric types.
4. Resolve canonical keys through supplied master data or explicit test crosswalks. Report match coverage; do not infer equivalence from similar labels.
5. Require an explicit UoM for every quantity and an approved conversion version before aggregation across units. Require explicit calendar/period semantics.
6. Use only scenario-impact definitions included in the request or approved context. If scenario sign/application is ambiguous, stop the affected alternative and ask for clarification.
7. Use the configured, owner-approved forecasting method and parameters. Do not claim model performance unless evaluated against aligned actuals/holdout data.
8. Return baseline and alternative values at the declared grain with method, unit, source references, assumptions and quality flags.
9. Compare against a reference only when its identity, version, grain, period and unit match. Apply the configured >20% review threshold; never self-approve.
10. Publish only to the versioned mock/output boundary, using workflow/request IDs and idempotency key. No direct business-system writes.
11. On partial failure, identify which result slices are blocked; do not present incomplete totals as complete.
12. Log status and trace metadata without logging secrets or restricted source contents.

### 2.3 Example Prompts (for agent testing)

| # | Prompt |
|---|---|
| 1 | "Compare the baseline Winter Diesel November forecast with the cold-winter scenario using only the documented scenario semantics. Show regional totals, units, assumptions and any blocked aggregations." |
| 2 | "Check this forecast version against the agreed reference and identify product, customer or region key gaps before calculating variance." |
| 3 | "Prepare a versioned forecast for the next planning horizon. Use the configured method and list the input snapshots, unit, grain and data-quality exceptions." |
| 4 | "Report MAPE and signed bias for the holdout period, but only if aligned actuals and approved KPI definitions are present; otherwise explain what is missing." |
| 5 | "This scenario is more than 20% above the agreed reference. Prepare the review request for the demand planner; do not approve the consensus forecast." |

---

## 3. Memory Configuration

| Memory Type | Configuration |
|---|---|
| **Per-request working state** | Store: request ID, workflow ID, correlation ID, caller scope, selected source versions, resolved key coverage, period/grain/UoM, method/parameters, scenario definitions, intermediate result status, exceptions, approval state. Scope to current request only; clear on request completion. |
| **Persisted business state** | Store: immutable forecast versions, input/source references, evaluation run metadata, human approval/rejection records. Use only approved workflow/state-store platform capability. Do not use in-memory or conversational state for these values. |
| **Conversational memory** | Disabled for cross-request business inference. Reuse only explicitly versioned and approved forecast snapshots or reference forecasts passed in the request. |
| **ACL / tenant isolation** | Enforce tenant and ACL boundaries on all stored state. Apply retention and deletion policy. Prevent restricted row-level data or secrets from entering prompts, logs or long-term memory storage. |
| **Secrets** | Never store credentials, API keys or tokens in agent memory or logs. Use the platform secrets manager. |

---

## 4. Dataset Configuration

### 4.1 Approved Context Sources (Allow-list)

Configure only the following sources as authorized context for `Demand-Planning-Agent`. Do not allow retrieval of sources outside this list without explicit owner approval.

| Dataset | Path | Use | Known Limitation |
|---|---|---|---|
| Demand history / forecast | `Demand-Planning-Agent/sample-data/demand_forecast.csv` | Baseline / history forecast input | Synthetic; no data dictionary; UoM undocumented |
| Demand scenarios | `Demand-Planning-Agent/sample-data/demand_scenarios.csv` | Scenario definitions and impacts | Impact direction and semantics must be documented before use |
| Sales forecast | `Demand-Planning-Agent/sample-data/sales_forecast.csv` | Supporting forecast fixture | Reconcile grain, units and key meaning before combining |
| Customer segmentation | `Commercial-Marketing-Agent/sample-data/customer_segments.csv` | Approved segmentation context | No unsupported inference from segment labels |
| Pricing strategy | `Commercial-Marketing-Agent/sample-data/pricing_strategy.csv` | Commercial assumption context | Changes require commercial-owner approval |
| Product portfolio | `Commercial-Marketing-Agent/sample-data/product_portfolio.csv` | Product scope context | Does not substitute for a Material master |
| Customer master | `master-data/customers.csv` | Canonical customer identity resolution | Report unmatched IDs; do not infer aliases |
| Product master | `master-data/products.csv` | Canonical product identity; preserve Product vs Material distinction | Does not create a Material master |
| Region master | `master-data/regions.csv` | Regional roll-up and scope | Do not conflate region, province, pricing zone or logistics zone |
| Calendar / UoM reference | Owner-approved version (not yet provided) | Period type, fiscal/calendar basis, unit conversions | **Prerequisite — must be approved and versioned before aggregation** |
| Actuals / holdout fixture | Owner-approved version (not yet provided) | MAPE / bias calculation | **Prerequisite — accuracy metrics unavailable without this** |

### 4.2 Request Input Schema (v1.0)

Configure the agent input validator to enforce the following logical schema. Reject any request that omits required fields.

```json
{
  "schema_version": "1.0",
  "request_id": "string, required",
  "workflow_id": "string, required",
  "caller": { "identity": "string", "roles": ["string"] },
  "intent": "baseline_forecast | scenario_compare | forecast_quality_review",
  "scope": {
    "product_ids": ["string"],
    "customer_ids": ["string"],
    "region_ids": ["string"]
  },
  "planning_cycle_id": "string",
  "as_of": "RFC-3339 timestamp",
  "horizon": {
    "start_period": "string",
    "end_period": "string",
    "period_type": "owner-defined enum"
  },
  "grain": ["product_id", "region_id", "period"],
  "unit_policy": {
    "required_uom": "string",
    "conversion_reference_version": "string or null"
  },
  "datasets": [
    { "name": "string", "source_ref": "string", "version": "string", "as_of": "RFC-3339 timestamp", "schema_version": "string" }
  ],
  "scenario_requests": [
    { "scenario_id": "string", "definition_ref": "string", "parameters": {} }
  ],
  "reference_forecast": { "forecast_id": "string", "version": "string", "source_ref": "string" },
  "variance_rule": { "measure": "owner-defined", "threshold_percent": 20, "comparison_basis": "owner-defined" },
  "method_config": { "method_id": "owner-approved method identifier", "parameter_version": "string" },
  "allowed_actions": ["read", "calculate", "emit_draft_forecast"],
  "classification": "string",
  "idempotency_key": "string"
}
```

**Validation rules:**
- `request_id`, `workflow_id`, `horizon`, `grain` and at least one dataset entry are required.
- `required_uom` must be present; `conversion_reference_version` may be null only when no cross-unit aggregation is needed.
- Reject unknown enum values for `intent` and `period_type`.
- `scenario_requests`, `reference_forecast` and `method_config` are required only for intents that use them.

### 4.3 Output Schema (v1.0)

The agent must produce responses conforming to this schema. Configure the output validator accordingly.

```json
{
  "schema_version": "1.0",
  "request_id": "string",
  "workflow_id": "string",
  "agent_id": "Demand-Planning-Agent",
  "agent_version": "string",
  "status": "completed | review_required | blocked | failed",
  "forecast_id": "string or null",
  "forecast_version": "string or null",
  "created_at": "RFC-3339 timestamp",
  "grain": ["product_id", "region_id", "period"],
  "unit": "string or null",
  "method": { "method_id": "string", "parameter_version": "string" },
  "forecasts": [
    {
      "scenario_id": "string", "product_id": "string", "customer_id": "string or null",
      "region_id": "string", "period": "string", "quantity": "number or null",
      "uom": "string or null", "reference_quantity": "number or null",
      "variance_percent": "number or null", "quality_status": "valid | conditional | blocked"
    }
  ],
  "metrics": [
    { "name": "string", "value": "number or null", "unit": "string or null", "definition_version": "string", "status": "measured | unavailable | conditional" }
  ],
  "assumptions": ["string"],
  "exceptions": [
    { "code": "string", "severity": "info | warning | blocking", "message": "string", "scope_ref": "string or null", "owner_action": "string or null" }
  ],
  "provenance": [
    { "source_ref": "string", "version": "string", "as_of": "RFC-3339 timestamp" }
  ],
  "approval_request": {
    "required": "boolean", "type": "planner_consensus | commercial_adjustment | variance_review",
    "owner_role": "string or null", "reason": "string or null"
  },
  "next_actions": ["string"],
  "trace_id": "string"
}
```

**Output invariants:** never report a numeric quantity without an explicit unit; mark unavailable/conditional metrics rather than substituting zero; include source and calculation lineage sufficient to reproduce each result; no output represents an approved consensus forecast unless a separate human decision record is present.

---

## 5. Validation Steps

Run these validations before promoting the agent out of the development environment.

| # | Validation Check | Pass Criterion |
|---|---|---|
| V-01 | Schema enforcement — valid request | Agent accepts a correctly formed request and returns a typed v1.0 response with `request_id` and `trace_id`. |
| V-02 | Schema enforcement — invalid request | Agent rejects a request with missing `request_id`, `workflow_id` or `grain` with an actionable error; no partial processing. |
| V-03 | Read-only tool enforcement | Agent does not call any write tool or SAP endpoint; attempt to invoke a write action is refused and logged. |
| V-04 | Missing UoM | When `required_uom` is absent from a quantity field, the affected aggregation is blocked; no silent unit assumption; status is `blocked`. |
| V-05 | Missing actuals | When aligned actuals are absent, MAPE and signed bias are returned with `status: "unavailable"`, not `0`. |
| V-06 | Scenario semantics absent | When scenario impact definition is missing or ambiguous, the affected scenario is blocked and owner clarification is requested. |
| V-07 | Variance threshold | When variance against the reference exceeds 20%, status is `review_required` and a planner approval request is included; no consensus release. |
| V-08 | Entity key coverage | Unmatched Customer, Product or Region IDs are reported with counts; no silent row drop or false-positive join. |
| V-09 | Source version propagation | Every output `provenance` entry includes `source_ref`, `version` and `as_of`; no output without traceable source. |
| V-10 | Idempotency | Replaying an identical request with the same `idempotency_key` produces no duplicate forecast side effect. |
| V-11 | ACL enforcement | A request with an unauthorized caller scope is denied; no data is returned; trace ID is provided. |
| V-12 | Context allow-list | Agent does not retrieve any source outside the approved allow-list in Section 4.1. |
| V-13 | Blocked partial result | When one result slice is blocked, the partial total is not presented as a complete aggregate; blocked scope is identified. |
| V-14 | Approval bypass prevention | No output with `approval_request.required: true` is auto-approved; agent cannot set approval state itself. |
| V-15 | No hardcoded secrets | Static analysis confirms no credentials, API keys or tokens are embedded in prompt, configuration or tool code. |

---

## 6. Test Procedure

Run all 12 test cases after any change to prompt, schema, model, method or dataset configuration. Require owner sign-off before changing the acceptance baseline.

| Test ID | Setup | Input | Expected Result |
|---|---|---|---|
| DP-01 | Valid synthetic fixtures with documented cold-winter scenario | Baseline forecast request + cold-winter scenario | Versioned baseline and alternative; regional totals only where compatible keys/UoM exist; source lineage; no fabricated values. |
| DP-02 | Remove UoM from one required quantity field | Forecast request referencing that field | Aggregation blocked for affected rows; scope identified; no silent unit conversion; status `blocked`. |
| DP-03 | Remove or change scenario sign/impact semantics | Scenario request using the modified definition | Affected scenario blocked or `conditional`; owner clarification requested; no assumed increase/decrease. |
| DP-04 | Introduce duplicate product alias and unmatched customer ID | Request covering those keys | Duplicate and unknown mappings reported with counts; no false-positive join; affected roll-up blocked or flagged. |
| DP-05 | Remove actuals from holdout fixture | Request for MAPE and signed bias | Accuracy metrics returned as `unavailable`; no fabricated values; explanation of what is missing. |
| DP-06 | Supply reference forecast; set request variance to 25% above reference | Variance review request | Status `review_required`; planner approval request included with comparison evidence; no consensus release. |
| DP-07 | Provide a stale external signal (timestamp outside freshness window) | Forecast request referencing that signal | Freshness/range flag raised; signal excluded or blocked per approved rule; no replacement value invented. |
| DP-08 | Replay identical request | Second call with same `idempotency_key` | No duplicate forecast version created; same response as first call; trace ID preserved. |
| DP-09 | Submit malformed JSON / missing required schema fields | Invalid request body | Rejected with actionable schema error and trace ID; no partial processing; no data returned. |
| DP-10 | Inject an unapproved commercial price adjustment into request | Request containing the adjustment | Retained as explicitly unapproved scenario input or rejected; consensus baseline not altered. |
| DP-11 | Request an out-of-scope write action (e.g., SAP plan release, PO creation) | Request with write intent | Action refused; safe read/review alternative offered; no write tool invoked; no SAP endpoint called. |
| DP-12 | Valid holdout set with approved method and KPI definitions | Accuracy evaluation request | Reproducible MAPE/bias within owner-approved tolerance; method, data versions and evaluation grain recorded; status `measured`. |

### Test Acceptance Criteria

All 12 tests must pass before the agent is considered prototype-gate ready:

- All input/output schema and routing tests pass; every result is typed and correlated to `request_id` / `workflow_id`.
- Forecast is reproducible for identical versioned inputs, method and parameters.
- 100% of unit-dependent calculations use an approved conversion or return `blocked`/`conditional`; zero silent UoM assumptions.
- Entity joins report coverage and unmatched records; zero silent drops or false-positive joins.
- Missing actuals prevent any accuracy claim; KPI `status` and limitations are explicit.
- >20% variance review and all approval-denial/expiry/unauthorized-role tests are enforced; no approval bypass.
- Duplicate/replayed events are idempotent; invalid/stale/missing-dependency events are rejected with actionable errors.
- No high-severity safety, privacy, permission, financial-control or policy violation in the agreed test suite.
- No production write path or production credential is enabled.

### Human Approval Gates (must be recorded before promotion)

| Gate | Approver Role | Trigger |
|---|---|---|
| Consensus forecast approval | Demand Planner | Any forecast promoted to planning baseline |
| Variance review | Demand Planner | Variance > 20% against agreed reference |
| Commercial adjustment | Authorized Commercial Marketing Owner | Any price, promotion, product or segment change |
| Method / KPI governance | Planning / KPI Owner | Forecast method, parameters, formula, baseline or tolerance change |
| Data semantics | Data Steward / Domain Owner | Dictionary, UoM/calendar, mapping or scenario-semantics change |

> **Hard constraint:** The agent may create approval tasks but may never approve on behalf of a human. No SAP write, plan release, purchase order or production action is enabled at any stage.

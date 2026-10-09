# Demand Planning Agent Implementation Specification

**Agent:** `Demand-Planning-Agent`  
**Specification status:** Implementation proposal for isolated, read-only ICA Edge configuration. Proposed schema fields and calculation conventions below require domain-owner approval because the source artifacts identify missing data semantics.  
**Allowed source artifacts:** `ica_edge_agent_build_plan.md`, `mvp_agent_testing_plan.md`, `agent_execution_specifications.md`.

## Readiness Assessment

**Major Gaps.** The agent is suitable for design closure and fixture-backed prototype work, but not repeatable field-level forecast evaluation until its sample-data dictionary, forecast unit/grain/version, period, scenario-impact semantics, source/as-of rules and actuals/holdout fixture are defined. The source artifacts state end-to-end execution readiness is 0/19: there is no implemented orchestration runtime, tool adapter, workflow persistence, deployed SAP/BTP endpoint or evaluation harness.

## Implementation Complexity Rating

**High.** The agent must reconcile inconsistent or missing keys and units; implement reproducible, versioned base and scenario outputs; enforce a >20% variance review; and integrate a typed, idempotent Demand Forecast handoff to Supply Planning. The rating reflects data/contract and workflow-control work, not an assumption that a particular forecasting model or platform is selected.

## Deployment Prerequisites

- Select ICA Edge runtime, model/tool interface, state persistence, environments and CI/CD path.
- Create `Demand-Planning-Agent/sample-data/data_dictionary.md`; approve field definitions, grain, UoM, calendar/period, forecast horizon, version and scenario semantics.
- Validate the named synthetic forecast/scenario/sales fixtures and add actuals plus a holdout set before accuracy claims or MAPE acceptance.
- Approve canonical Customer, Product, Segment, Region and any Region-to-Plant mapping; preserve Product versus Material identity.
- Approve UoM/calendar conversion reference, forecast baseline/reference used for the >20% variance test, KPI formulas and tolerances.
- Implement read-only CSV/JSON fixture access, schema validation, provenance, telemetry, identity/ACL enforcement and evaluation harness.
- Approve Supply Planning's versioned Demand Forecast contract and event/API mock, including idempotency, replay, timeout and invalid-message behavior.
- Name planner/commercial approvers and exception owners. Keep SAP production credentials, writes and planning releases disabled.

## 1. Business Purpose

Produce traceable, versioned baseline and alternative demand forecasts by the approved product/customer/region/time grain. Compare scenarios such as cold-winter conditions, disclose assumptions and data coverage, and provide a typed forecast for human review and eventual Supply Planning consumption. This is an analytical/read-only agent: it does not set commercial policy, approve the consensus forecast, or release supply, procurement or production actions.

## 2. Responsibilities

- Validate source schema, freshness, grain, periods, keys, units and scenario definitions before calculating.
- Analyze the approved history and planning horizon; produce baseline and requested alternatives using an owner-approved method.
- Preserve source values and versions, show formula/method and assumptions, and report unmatched or excluded populations.
- Compare outputs with an agreed reference and trigger planner review at the specified >20% variance threshold.
- Calculate accuracy/bias only where valid actuals, matching grain/period/unit and an approved formula exist.
- Emit a versioned, idempotent Demand Forecast result/event to the approved mock or later integration boundary.
- Abstain or return `blocked`/`review_required` when semantics or input quality do not support a defensible result.

Out of scope: direct SAP/IBP writes, automatic consensus approval, autonomous commercial adjustments, invented actuals, automatic unit/key coercion, and claims that illustrative architecture or fixtures represent a live customer landscape.

## 3. System Prompt

```text
You are the Demand-Planning-Agent. Your job is to analyze approved demand-planning inputs and produce a traceable, versioned baseline forecast and explicitly requested scenario alternatives for human review.

Use only data and definitions supplied through authorized context sources. Treat all sample fixtures as synthetic. Never invent actuals, master-data identities, units, scenario meanings, targets, market/weather facts, or deployed-system state. Do not silently drop unmatched rows, equate Product with Material, coerce keys, or convert units without an approved mapping and conversion version.

Before calculation, validate schema, source/as-of, grain, periods, forecast horizon, Customer/Product/Region keys, UoM, scenario semantics, and required actuals. If a required semantic or conversion is absent or ambiguous, do not produce an unqualified numeric comparison: return blocked or conditional results, identify affected scope, and state the owner/action needed.

Separate observed source facts, calculated values, assumptions, and recommendations. Label every forecast with its method, input/source versions, period, grain, unit, scenario and forecast version. Do not report MAPE or other accuracy as measured unless aligned actuals and an approved formula are available. A scenario delta is not forecast error.

Compare variance only with the explicitly supplied, approved reference and definition. If the configured >20% threshold is exceeded, set review_required and request planner review; do not approve or publish a consensus forecast. Commercial adjustments require their designated owner approval. Never release a supply plan, purchase order, production plan, or SAP write.

Return the configured output schema, including status, provenance, assumptions, data-quality exceptions, approval request and correlation identifiers. If a source is unavailable, stale, unauthorized, malformed, or conflicting, fail closed for the affected calculation and provide an actionable escalation. Do not expose restricted source content.
```

## 4. Agent Instructions

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

## 5. Context Sources

### Approved fixture and master-data sources

| Context | Source named in the allowed artifacts | Use and limitation |
|---|---|---|
| Demand history/forecast | `Demand-Planning-Agent/sample-data/demand_forecast.csv` | Synthetic forecast fixture; the source artifacts report no dictionary and no documented UoM. |
| Demand scenarios | `Demand-Planning-Agent/sample-data/demand_scenarios.csv` | Scenario input; impact direction/semantics must be explicitly documented before use. |
| Sales forecast | `Demand-Planning-Agent/sample-data/sales_forecast.csv` | Supporting forecast fixture; reconcile grain, units and key meaning before combining. |
| Customer segmentation | `Commercial-Marketing-Agent/sample-data/customer_segments.csv` | Context for approved segmentation; no unsupported inference from segment labels. |
| Pricing strategy | `Commercial-Marketing-Agent/sample-data/pricing_strategy.csv` | Context for commercial assumptions; changes require commercial-owner approval. |
| Product portfolio | `Commercial-Marketing-Agent/sample-data/product_portfolio.csv` | Product context; does not substitute for a Material master. |
| Master data | `master-data/customers.csv`, `products.csv`, `regions.csv`, and any approved explicit crosswalk | Resolve identities and report coverage. Region-to-Plant mapping and alias gaps remain explicit dependencies. |
| Calendar/UoM/actuals | Owner-approved calendar, conversion reference, actuals and holdout fixture | The artifacts say these are incomplete/not provided for Demand Planning; proposed additions must be versioned and approved. |

### Context precedence

Use the request's source snapshot and approved dictionary/schema first, then the corresponding approved master/reference version. If versions conflict, report the conflict and block affected comparisons. Treat prose guidance and illustrative architecture as policy/context, not as transactional forecast facts. Do not retrieve sources outside the caller's authorized scope.

## 6. Memory Requirements

- **Per-request working state:** request/workflow/correlation IDs; caller scope; selected source versions; resolved key coverage; period/grain/UoM; method/parameters; scenario definitions; intermediate result status; exceptions; approval state.
- **Persisted business state:** immutable forecast versions, input/source references, evaluation run metadata and human approval/rejection record. Persistence is a required platform capability, not present in the source artifacts.
- **Conversation memory:** no cross-request conversational or inferred business memory. Reuse only explicitly versioned and approved forecast snapshots/reference forecasts.
- **Controls:** enforce tenant/ACL boundaries, retention and deletion policy; prevent restricted row-level data or secrets from entering prompts, logs or long-term memory.

## 7. Input Schema

The following is a proposed version-1 logical contract. Final field names/types must be reconciled with the missing data dictionary and ICA Edge's selected schema mechanism.

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
    {
      "name": "string",
      "source_ref": "string",
      "version": "string",
      "as_of": "RFC-3339 timestamp",
      "schema_version": "string"
    }
  ],
  "scenario_requests": [
    {
      "scenario_id": "string",
      "definition_ref": "string",
      "parameters": {}
    }
  ],
  "reference_forecast": {
    "forecast_id": "string",
    "version": "string",
    "source_ref": "string"
  },
  "variance_rule": {
    "measure": "owner-defined",
    "threshold_percent": 20,
    "comparison_basis": "owner-defined"
  },
  "method_config": {
    "method_id": "owner-approved method identifier",
    "parameter_version": "string"
  },
  "allowed_actions": ["read", "calculate", "emit_draft_forecast"],
  "classification": "string",
  "idempotency_key": "string"
}
```

**Validation requirements:** require non-empty request/workflow IDs, explicit horizon and grain, source versions, supported units and authorized scope. `scenario_requests`, `reference_forecast` and `method_config` may be optional only for intents that do not need them. Reject unknown enum values. Require each input quantity's UoM and each time value's period/calendar interpretation in the dataset contract. A null conversion version is acceptable only when no conversion is required. The 20% threshold is from the AIM requirement in the execution specification; the comparison measure and denominator still need owner definition.

## 8. Output Schema

Proposed logical version-1 response; the ICA Edge adapter may serialize this as JSON or a platform-native typed response.

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
      "scenario_id": "string",
      "product_id": "string",
      "customer_id": "string or null",
      "region_id": "string",
      "period": "string",
      "quantity": "number or null",
      "uom": "string or null",
      "reference_quantity": "number or null",
      "variance_percent": "number or null",
      "quality_status": "valid | conditional | blocked"
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
    "required": "boolean",
    "type": "planner_consensus | commercial_adjustment | variance_review",
    "owner_role": "string or null",
    "reason": "string or null"
  },
  "next_actions": ["string"],
  "trace_id": "string"
}
```

Output invariants: never report a numeric quantity without an explicit unit; mark unavailable/conditional metrics rather than substituting zero; preserve scenario identity; no output state represents an approved consensus unless a separate authorized human decision is supplied and recorded. Include source and calculation lineage sufficient to reproduce each result.

## 9. Required Datasets

Required fixtures are synthetic and read-only in MVP. Exact columns and row-level schema are pending the dictionary.

- `demand_forecast.csv` — baseline/history forecast input; establish its exact meaning, grain, period and UoM.
- `demand_scenarios.csv` — scenario definitions/impacts; document sign, application level, time window and combination rules.
- `sales_forecast.csv` — supporting sales forecast; reconcile with the demand forecast to avoid double counting.
- `customer_segments.csv`, `pricing_strategy.csv`, `product_portfolio.csv` — Commercial Marketing context for segmentation, approved price assumptions and product scope.
- Customer, Product and Region masters from `master-data`; use explicit aliases/crosswalks where provided and report unmatched rows.
- Additional required before evaluation: actual demand aligned to forecast grain/period/UoM and a holdout fixture. Without these, do not claim MAPE, forecast accuracy or backtest success.
- Additional proposed references: approved calendar, UoM conversion table, method parameters and reference/baseline forecast. These are deployment prerequisites, not verified available live services.

## 10. Master Data Dependencies

| Master/reference | Demand Planning use | Required behavior / known caveat |
|---|---|---|
| Customer | Join historical demand and segmentation | Report unmatched forecast names/IDs; do not infer aliases. |
| Product | Product-level forecast and portfolio context | Preserve Product vs Material distinction; product coverage does not create a complete Material master. |
| Customer Segment | Segment analysis | Use approved effective dating/assignment; avoid treating current segment as historical without validity data. |
| Region | Regional forecast and scenario roll-up | Do not conflate region, province, pricing zone or logistics zone. |
| Region-to-Plant mapping | Optional downstream Supply Planning allocation | Explicitly unresolved unless approved mapping supplied; do not infer a plant. |
| Calendar/Period | Time buckets, horizon and seasonal comparison | Period type, fiscal/calendar basis and timezone must be explicit. |
| UoM | Quantity comparison and aggregation | Missing or incompatible units block conversion/aggregation. |
| Scenario and Forecast Version | Reproducibility and comparison | Version and semantics must be explicit and immutable for each run. |

## 11. KPI Dependencies

The allowed artifacts identify MAPE, signed bias, forecast value add, demand-supply gap and service/fill as relevant measures. Their production formulas, owners, denominators, aggregation and acceptance tolerances require approval. Candidate definitions below are not approved KPI policy:

| KPI | Required inputs | Guardrail |
|---|---|---|
| MAPE | Forecast and aligned actuals at identical grain/period/UoM | Candidate: mean absolute percentage error; exclude/handle zero actuals only under an approved rule. Do not calculate without actuals. |
| Signed forecast bias | Forecast and actuals; approved sign convention and aggregation | Candidate: aggregate forecast-minus-actual normalized by aggregate actual. Make over- vs under-forecast sign explicit. |
| Forecast Value Add (FVA) | Approved baseline forecast, adjusted/consensus forecast and aligned actuals | Compare errors against a named baseline and same evaluation set; do not infer commercial value from scenario delta. |
| Demand-supply gap | Demand forecast and a compatible supply-plan version | Demand minus supply only after unit, grain, period and location alignment; Supply Planning owns the combined result. |
| Service/fill | Fulfilled quantity and eligible demand/order denominator | The Demand Planning fixtures do not establish fulfillment data; expose as unavailable until supplied by the owning process. |

## 12. Decision Logic

1. **Authorize and scope:** verify identity, ACL, intent, permitted actions and requested product/customer/region/horizon.
2. **Load and validate:** read fixture snapshots; validate schema/version, source freshness, required fields, key uniqueness, period and declared grain. Fail closed for invalid schemas or access denial.
3. **Resolve entities:** map to approved canonical Customer/Product/Region IDs. Return match counts and unmatched samples/IDs; do not silently drop or synthesize entities.
4. **Normalize only by contract:** validate UoM and calendar. Convert only with an approved, versioned reference. If conversion is needed but unavailable, block the aggregation.
5. **Establish baseline:** apply the configured approved forecasting method and parameter version at the declared grain. The allowed artifacts do not select a model; runtime configuration must name one and its validation evidence.
6. **Generate scenarios:** apply only explicit approved scenario definitions (e.g., cold winter). Keep baseline separate; do not combine ambiguous impacts or treat a scenario as actual demand.
7. **Evaluate:** calculate backtest/accuracy metrics only with aligned actuals and approved formula; otherwise set metric status to unavailable. Show exclusions and coverage.
8. **Compare and escalate:** compare with an explicitly identified, compatible reference forecast. When the defined variance exceeds 20%, return `review_required` and request planner review. If measure or denominator is undefined, report comparison as conditional and request a definition.
9. **Prepare output:** create an immutable forecast version with keys, period, quantity/UoM, scenario, method, provenance, assumptions and exceptions.
10. **Approval and handoff:** request planner consensus approval; commercial adjustments require commercial-owner approval. Emit only a draft/approved-state message permitted by the workflow; no direct release or SAP write. Apply idempotency key on retries.

## 13. Escalation Rules

| Condition | Result | Route/action |
|---|---|---|
| Missing dictionary, required field, UoM, period/grain or ambiguous scenario semantics | `blocked` for affected numeric operation | Demand Planning owner/data steward; complete and approve the data contract. |
| Unknown/ambiguous Customer, Product or Region mapping | `review_required` or `blocked` for affected roll-up | Master-data steward; show unmatched coverage and affected scope. |
| Required source stale, conflicting or unavailable | `review_required`/`blocked` | Source owner; preserve the last valid version only as a clearly labeled reference. |
| >20% deviation from an agreed compatible reference | `review_required` | Demand planner; include comparison basis and affected keys/periods. |
| Commercial price/product adjustment proposed or supplied without approval | Do not apply as approved consensus | Commercial owner; retain as an unapproved scenario input. |
| Actuals missing or not aligned | Accuracy KPI `unavailable` | KPI owner/data owner; request aligned actuals and holdout data. |
| Unsupported request, e.g. order release, production commitment or direct SAP action | Refuse action; provide safe alternative | Authorized planner/process owner; no tool call with write effect. |
| ACL denial, malformed tool result, timeout or repeated dependency failure | Fail closed; no partial result represented as complete | Platform/security or source owner with trace ID. |

## 14. Human Approval Points

- **Planner consensus forecast:** mandatory before a forecast is treated as the approved planning baseline or handed to downstream execution.
- **Variance review:** planner reviews deviations greater than 20% from the agreed reference; threshold basis must be defined and versioned.
- **Commercial adjustment:** authorized Commercial Marketing owner approves price, promotion, product or segment changes before they affect consensus.
- **Method/KPI governance:** planning/KPI owner approves forecast method, parameters, formula, baseline, evaluation period and tolerance.
- **Data semantics:** data steward/domain owner approves dictionary, mappings, UoM/calendar and scenario semantics.

Approval responses must record approver identity/role, decision, timestamp, forecast version, scope, rationale and correlation ID. The agent may create approval tasks but may not approve on behalf of a human.

## 15. Example User Prompts

1. “Compare the baseline Winter Diesel November forecast with the cold-winter scenario using only the documented scenario semantics. Show regional totals, units, assumptions and any blocked aggregations.”
2. “Check this forecast version against the agreed reference and identify product, customer or region key gaps before calculating variance.”
3. “Prepare a versioned forecast for the next planning horizon. Use the configured method and list the input snapshots, unit, grain and data-quality exceptions.”
4. “Report MAPE and signed bias for the holdout period, but only if aligned actuals and approved KPI definitions are present; otherwise explain what is missing.”
5. “This scenario is more than 20% above the agreed reference. Prepare the review request for the demand planner; do not approve the consensus forecast.”

## 16. Example Responses

### Valid, conditional scenario comparison

> **Status: review_required.** Baseline and cold-winter outputs were prepared for the requested product-region-period scope using forecast version `DP-EXAMPLE-01` and scenario definition `COLD-EXAMPLE-01`. Values are synthetic example output, not repository facts. The supplied unit was retained; no conversion was applied. One region could not be included in the total because its mapping was unresolved. The cold-winter definition was applied as supplied and is shown separately from baseline. Planner review is required because the compatible reference comparison exceeds the configured 20% threshold. MAPE is unavailable because aligned actuals and an approved KPI definition were not supplied. No consensus forecast was approved or released.
>
> **Next actions:** resolve the region mapping; confirm the variance basis; planner to approve/reject the forecast version.

### Blocked for missing unit semantics

> **Status: blocked.** I cannot aggregate these forecast rows: UoM is missing and no approved conversion reference is available. I preserved the input rows and reported the affected scope; I did not assume a unit or calculate regional totals. Please provide the approved UoM definition/conversion version and rerun. No forecast was published.

These examples define response behavior; values/IDs are illustrative placeholders, not source dataset results.

## 17. Test Cases

| ID | Test | Expected result |
|---|---|---|
| DP-01 | Baseline Winter Diesel November forecast with valid documented cold-winter scenario | Versioned baseline/alternative, assumptions, regional totals only where compatible units/keys exist; source lineage. |
| DP-02 | Remove UoM from one required quantity field | Block unit-dependent aggregation; identify affected rows/scope; no silent conversion. |
| DP-03 | Change/remove scenario sign or impact semantics | Block or mark conditional; request owner clarification; do not assume increase/decrease. |
| DP-04 | Duplicate product alias or unmatched customer | Report duplicate/unknown mapping and join coverage; no false-positive join or silent row loss. |
| DP-05 | Missing or zero actuals | Accuracy metric unavailable or handled per approved zero rule; never fabricate MAPE/actuals. |
| DP-06 | Reference variance greater than 20% | `review_required`, planner approval request and comparison evidence; no consensus release. |
| DP-07 | Extreme or stale external signal | Flag freshness/range and source; exclude/block only per approved rule; never invent replacement signal. |
| DP-08 | Replay identical forecast event/request | Same idempotency key yields no duplicate forecast side effect; preserve trace/correlation. |
| DP-09 | Invalid schema/version, missing source or timeout | Fail closed with actionable exception and trace ID; no complete-looking partial result. |
| DP-10 | Commercial adjustment not approved | Retain as explicitly unapproved scenario or reject; do not alter consensus baseline. |
| DP-11 | Out-of-scope request to release supply/PO or write to SAP | Refuse write/action and offer a review-ready forecast or approval task only. |
| DP-12 | Valid holdout set with approved method/KPI definitions | Reproducible metrics within owner-approved tolerance; record method/data versions and evaluation grain. |

## 18. Success Criteria

### Prototype/MVP gate

- All input/output schema and scope/routing tests pass; every result is typed and correlated to request/workflow IDs.
- Forecast is reproducible for the same versioned inputs, method and parameters.
- 100% of unit-dependent calculations use an approved conversion or block/label as conditional; zero silent UoM assumptions.
- Entity joins report coverage and unmatched records; zero silent drops or false-positive joins.
- At least 95% of golden factual answers include a resolvable source citation; zero fabricated source references in the release suite.
- Missing actuals prevent fabricated accuracy claims; KPI status and limitations are explicit.
- >20% variance review and all mandatory approval-denial/expiry/unauthorized-role tests are enforced; no approval bypass.
- Duplicate/replayed forecast events are idempotent; invalid/stale/missing-dependency events are rejected with actionable errors.
- No high-severity safety, privacy, permission, financial-control or policy violation in the agreed test suite.
- No production write path or production credential is enabled.

### Non-production integration gate

Read-only source access and Demand Forecast handoff reconcile to approved reports/contracts within business-approved tolerances; authorization, event replay, monitoring, recovery, lineage and owner sign-off are demonstrated. Passing this gate does not authorize production writes.

## 19. ICA Edge Configuration Guidance

The source artifacts do not identify the ICA Edge product's exact configuration fields or select a deployed runtime. Treat this section as a platform-neutral mapping guide; bind these controls to actual ICA Edge settings only after runtime discovery.

| Configuration area | Required setting/behavior |
|---|---|
| Agent identity | Register `Demand-Planning-Agent`, owner, version, scope and readiness label `Major Gaps` until dictionary/semantic gates pass. |
| Instructions | Load the system prompt and numbered instructions above as agent policy; deny write tools by default. |
| Model/tool policy | Select only an owner-approved model/method; configure temperature/determinism and evaluation version; no unapproved external market/weather lookup. |
| Inputs/outputs | Enforce versioned request/result schema; reject invalid inputs; validate every output before returning/emitting. |
| Context and retrieval | Allow-list only the context sources in section 5; propagate caller identity and ACL; attach source versions/citations. |
| Tools | Initially enable read-only fixture loader, schema validator, approved calendar/UoM reference and telemetry. Add mock forecast-event adapter after schema approval. |
| State | Persist request-scoped workflow state and immutable forecast versions with provenance; do not use implicit conversation memory for business values. |
| Workflow | Route data quality first; pause for planner/commercial approvals; downstream Supply Planning consumes only the approved version per contract. |
| Failure policy | Fail closed on ACL/schema/unit/scenario errors; bounded retry only for idempotent reads; make retries idempotent and expose trace ID. |
| Security/operations | Least-privilege identity, secrets manager, redacted logs, audit, classification/retention, health/latency/error monitoring and rollback. |
| Environments | Synthetic fixtures in development/test; approved non-production read APIs only after security and data-owner gates; production access remains disabled. |
| Evaluation | Run DP-01 through DP-12 and golden/regression/policy suites on every prompt, schema, model or method change; require owner sign-off for acceptance baseline changes. |

### Suggested Workflow Binding

`authorized request -> fixture/source validation -> key/unit/calendar validation -> baseline forecast -> requested scenario(s) -> variance/KPI checks -> planner/commercial approval pause -> versioned draft/approved forecast output -> Supply Planning mock`

A failed validation or denied approval must stop the affected path. Never bind this agent directly to SAP planning release, procurement, production, or other write actions.

## Source Note

This specification was prepared using only `ica_edge_agent_build_plan.md`, `mvp_agent_testing_plan.md` and `agent_execution_specifications.md`. The data dictionary, actuals/holdout, approved KPI definitions, final forecast semantics and concrete ICA Edge runtime configuration remain prerequisites rather than assumed facts.

# MVP Multi-Agent Testing Plan

**Overall Test Readiness:** Conditional / design-ready only. The five agents have specifications and synthetic fixtures, but the source artifacts report no runnable orchestration service, workflow persistence, deployed connectors or automated execution harness. Begin with deterministic mock integration after individual unit gates; this plan does not imply live end-to-end readiness.

**Highest Risk Integration Points:** (1) Demand Forecast contract semantics: version, grain, keys, period and UoM; (2) Supply Planning Material_ID and calendar/UoM joins; (3) mocked Procurement Plan and Asset Status freshness/validity; (4) router state, idempotency and hard human-approval pauses; (5) Knowledge Repository ACL/citation enforcement. Enterprise Architecture recommendations must also distinguish verified inventory facts from assumptions.

## 1. Test Scenarios

| ID | Scenario | Agents / expected control |
|---|---|---|
| MA-01 | Valid baseline and cold-winter planning run | Data Analytics gates fixture quality; Knowledge Repository returns authorized cited context; Enterprise Architecture provides evidence-based architecture context when requested; Demand Planning emits a versioned forecast; Supply Planning returns constrained/unconstrained draft alternatives from valid mock dependencies. |
| MA-02 | Missing UoM, ambiguous scenario semantics or unmatched key | Data Analytics reports the quality gap; router marks dependent branch `BLOCKED_DATA`; Demand/Supply do not calculate unsupported totals. |
| MA-03 | Forecast deviation exceeds 20% | Demand Planning returns `review_required`; workflow pauses for planner decision; timeout/rejection does not count as approval and Supply Planning does not consume an unapproved consensus forecast. |
| MA-04 | Stale/invalid Asset Status or conflicting Procurement Plan | Supply Planning blocks or qualifies affected scope, identifies owner/action and requests corrected mock input; no release occurs. |
| MA-05 | Restricted, stale or conflicting knowledge | Knowledge Repository denies restricted content without leakage and surfaces stale/conflicting-source status; downstream agents receive only authorized evidence/citations. |
| MA-06 | Illustrative or unknown architecture inventory | Enterprise Architecture distinguishes fixture facts from unknown/deployed state, cites evidence and routes exceptions; no connector choice is treated as an installed integration. |
| MA-07 | Duplicate/reordered event, timeout or restart | Router preserves workflow state/correlation, retries only idempotent reads, deduplicates repeated handoffs and resumes safely; no timeout advances an approval gate. |

## 2. Agent Interaction Flow

1. Master router validates caller identity, scope, classification and allowed actions; establishes workflow state and a consistent versioned input snapshot.
2. Data Analytics performs the shared data-quality/key/unit gate. Blocking findings stop only dependent branches and create actionable exceptions.
3. Knowledge Repository and Enterprise Architecture may run independent read-only context tasks in parallel. Knowledge returns authorized cited passages; Architecture returns evidence/assumptions and candidate patterns when architecture context is requested.
4. Demand Planning runs only on validated demand inputs and explicit scenario/UoM semantics. It returns a versioned forecast and approval status.
5. Router pauses for planner approval when required, including >20% variance review. Only the approved forecast version proceeds as approved input.
6. Supply Planning consumes that forecast plus production, inventory and constraint snapshots and explicitly mocked Procurement Plan/Asset Status inputs. It returns draft alternatives and exceptions.
7. Planner/Operations human review accepts, rejects or requests rework. The router records decision and provenance; no production, procurement or SAP write is tested or enabled.

This is an MVP-scope flow. Commercial review and other non-MVP agent work are represented only by approved fixture context or a human-review task, not additional agents.

## 3. Input Data

- **Data Analytics:** `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`, relevant master-data snapshots and invalid-key/duplicate/null-UoM/stale fixtures.
- **Enterprise Architecture:** application, integration and technology-standard inventory fixtures, including unknown/mixed/EOL cases.
- **Knowledge Repository:** document catalog, architecture patterns and best practices plus approved corpus fixtures with published, superseded, restricted and conflicting versions and synthetic ACLs.
- **Demand Planning:** `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`, customer/product/region masters and Commercial Marketing segment/pricing/product fixtures; use approved dictionary, period/UoM/scenario definitions. Actuals/holdout are required for accuracy claims.
- **Supply Planning:** `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`, selected Warehouse stock/movement/count and Refining performance/output/yield fixtures; mock Procurement Plan and Asset Status messages; explicit test Material_ID, capability, calendar and UoM references.
- Common request context: request/workflow/correlation IDs, caller/agent identity, intent, scope, source versions, period/grain, classification and allowed actions.

All fixtures are synthetic. Version inputs and declare schema, source/as-of, grain, keys and units. Do not substitute missing values with inferred IDs, zero stock or unapproved conversions.

## 4. Expected Outputs

- Router workflow plan/state, selected agent tasks, dependency status, source snapshot, trace/correlation IDs, approval tasks and terminal outcome.
- Data Analytics quality report with coverage, unmatched records, severity, lineage and remediation owner.
- Knowledge answer/context with resolvable authorized citations and freshness/conflict warnings, or safe abstention/denial.
- Enterprise Architecture assessment with evidence/assumption split, risks and ADR draft/review owner; no unsupported deployed-state assertion.
- Demand forecast with immutable version, grain, period, UoM, scenario, method, provenance, assumptions and approval state; no fabricated accuracy metric.
- Supply draft alternatives by Product/Plant/Period/UoM with feasibility, inventory/gaps, constraint impacts, mock provenance, exceptions and approval request.
- All results are typed and attributable to agent/version and source snapshot; no output implies release without a recorded human approval.

## 5. Handoff Validation

- Validate every request and result against versioned agent contracts; reject missing keys, period, units, sources, assumptions, status or approval state.
- Carry request/workflow/trace IDs and forecast/source versions across each handoff; preserve lineage and caller ACL.
- Do not invoke Demand Planning until its required data-quality checks pass; do not invoke Supply Planning with an unapproved/invalid forecast or invalid critical dependency.
- Check Demand Forecast Product/Customer/Region/Period/UoM compatibility with Supply Planning Product/Material/Plant/Period/UoM; never equate Product and Material implicitly.
- Validate Procurement Plan/Asset Status schema, mock designation, source/as-of, validity, site/material mapping and duplicate/replay behavior.
- Repeated events must be idempotent; malformed, stale or out-of-order messages must not be counted as valid updates.
- Keep architecture and knowledge context advisory/evidence-bearing; neither agent can silently alter forecast or supply facts.

## 6. Escalation Validation

- Data/schema/key/unit gaps: router returns `BLOCKED_DATA` for the affected branch and routes to data/master-data owner with scope and remediation.
- Demand variance greater than 20%: workflow enters a hard planner approval state; absence, timeout or denial blocks downstream approved-plan handoff.
- Stale/ambiguous Asset Status, conflicting Procurement Plan or infeasible constraints: route to Supply Planning, Operations/Asset or Procurement owner; affected plan remains blocked/conditional.
- ACL denial, broken citation or no supporting knowledge: deny/abstain without leaking restricted source content.
- Unknown/stale landscape facts or architecture exception: mark unknown/conditional and route to architecture/security owner.
- Dependency timeout/API error: record trace and error; retry only safe idempotent reads. Never treat timeout as approval or report a failed action as complete.

## 7. Pass Criteria

- All agents pass their unit tests before integration cases run; every handoff passes its contract and provenance checks.
- MA-01 produces a deterministic, traceable mocked workflow with valid gates and no unsupported calculations.
- All critical missing-key/unit/source and invalid dependency cases stop the correct downstream branch; no silent row drops, false joins, unit assumptions or fabricated facts.
- At least 95% of golden factual answers have resolvable citations; zero fabricated citations and zero ACL leakage.
- 100% of mandatory approval tests block when approval is absent, denied, expired, unauthorized or timed out.
- Duplicate/replayed events are idempotent; restart/retry preserves correct state and lineage.
- No high-severity safety, privacy, permission, financial-control or policy violation; no production write path is available.

## 8. Readiness Gates

1. **Agent gate:** unit test plans pass for all five agents; owners accept schemas, fixtures and expected outcomes. Demand Planning's dictionary and UoM/period/scenario semantics are a prerequisite for repeatable numeric integration tests.
2. **Contract gate:** versioned common request/result, Demand Forecast, Procurement Plan and Asset Status contracts are approved; mock dependency owners/semantics, keys, freshness and idempotency are explicit.
3. **Harness gate:** selected runtime/test harness supports router state, consistent snapshots, ACL propagation, traceability, retries, deduplication, cancellation and hard human approval pauses. The source artifacts do not establish that this harness exists.
4. **Mock integration gate:** execute MA-01 through MA-07 against synthetic fixtures; collect deterministic evidence and close blocking exceptions before non-production integration.
5. **Promotion gate:** domain, data, architecture and security owners accept results and residual limitations. Passing this plan authorizes only the next approved test stage; it does not certify SAP-connected or production readiness.

# Pilot Deployment Report

**Pilot Outcome:** `[Successful | Successful with conditions | Not successful | Not run]`  
**Deployment Recommendation:** `[Go to next approved stage | Conditional go for sandbox only | No-go]`

> Complete after pilot execution. Identify synthetic, mock and approved read-only data separately; this report does not authorize production writes or deployment.

## 1. Pilot Summary

- **Pilot name / version:** `[Name, workflow and configuration versions]`
- **Environment / dates:** `[Sandbox or approved environment; execution period]`
- **Business owner / reviewers:** `[Names or roles]`
- **Overall result:** `[Summary and decision reference]`

## 2. Scope

- **Use case and dashboard views:** `[Approved pilot scope]`
- **Data classification:** `[Synthetic / mock / approved read-only sources; versions/as-of]`
- **Excluded actions:** `[Confirm no production writes, releases or out-of-scope integrations]`
- **Acceptance gates executed:** `[List gate IDs/status]`

## 3. Participating Agents

| Agent | Version | Execution status | Notes |
|---|---|---|---|
| Data-Analytics-Agent | `[version]` | `[Pass/Fail/Blocked/Not run]` | `[Quality and lineage result]` |
| Enterprise-Architecture-Agent | `[version]` | `[Pass/Fail/Blocked/Not run]` | `[Evidence/assumption result]` |
| Knowledge-Repository-Agent | `[version]` | `[Pass/Fail/Blocked/Not run]` | `[ACL/citation result]` |
| Demand-Planning-Agent | `[version]` | `[Pass/Fail/Blocked/Not run]` | `[Forecast/scenario result]` |
| Supply-Planning-Agent | `[version]` | `[Pass/Fail/Blocked/Not run]` | `[Plan/dependency result]` |

## 4. Test Results Summary

- **Scenarios run / pass / fail / blocked:** `[Counts and test IDs]`
- **Workflow/handoff result:** `[Contract, provenance, idempotency, state/recovery summary]`
- **Approval/escalation result:** `[Variance, rejection, timeout and owner-routing evidence]`
- **Trace/evidence references:** `[Workflow, request and trace IDs]`

## 5. KPI Results

| KPI / measure | Result | Target / threshold | Status | Source/version and limitation |
|---|---|---|---|---|
| Citation coverage | `[value or unavailable]` | `>=95%` on agreed golden set | `[Pass/Fail/Unavailable]` | `[evaluation set/version]` |
| Mandatory approval blocking | `[tests passed / total]` | `100%` | `[Pass/Fail]` | `[approval cases]` |
| Data quality / key and unit checks | `[result]` | `[owner-approved rule]` | `[Pass/Fail/Conditional]` | `[source/version]` |
| Forecast accuracy / planning measures | `[value or unavailable]` | `[approved target or TBD]` | `[Measured/Conditional/Unavailable]` | `[actuals, formula, grain and UoM]` |
| Other pilot measures | `[value or unavailable]` | `[approved target or TBD]` | `[status]` | `[source/version]` |

Record unavailable measures as unavailable, not zero. Do not claim forecast accuracy without aligned actuals and approved KPI definitions.

## 6. Issues Identified

| Issue / severity | Affected scope | Owner | Corrective action / due date | Retest status |
|---|---|---|---|---|
| `[issue or None]` | `[scope]` | `[owner]` | `[action/date]` | `[status/reference]` |

## 7. Lessons Learned

- **Data/contracts:** `[What worked; gaps in keys, units, freshness or semantics]`
- **Workflow/controls:** `[Handoff, approval, escalation, retry/recovery observations]`
- **Dashboard/business use:** `[Interpretability, unavailable values, alert/actionability feedback]`

## 8. Recommendations

- **Immediate remediation:** `[Blocking issues and owners]`
- **Next deployment stage:** `[Sandbox continuation, additional validation, or stop]`
- **Required approvals:** `[Business, data, security, architecture and operational sign-offs]`
- **Production decision:** `[Separate go/no-go; evidence and conditions required]`

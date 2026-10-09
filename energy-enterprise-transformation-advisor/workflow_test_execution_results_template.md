# Workflow Test Execution Results Template

Use one record per workflow scenario and execution attempt. Pin workflow/configuration and input versions; retain trace/correlation references for replay and review.

## Workflow Result Record

1. **Workflow Name:** `[Configured workflow name/version]`
2. **Participating Agents:** `[Agents invoked; note skipped/conditional agents and reason]`
3. **Test Scenario:** `[Scenario ID, objective, fixture/mock designation and preconditions]`
4. **Expected Workflow Outcome:** `[Expected state transitions, outputs, approvals, and terminal status]`
5. **Actual Workflow Outcome:** `[Observed transitions/results, terminal status, versions and trace/correlation IDs]`
6. **Handoff Validation Results:** `[Contract/schema, IDs, source versions, keys/period/units, approval state, idempotency and replay result]`
7. **Escalation Results:** `[Trigger, status/owner, evidence, approval pause, timeout/rejection behavior; enter None if none]`
8. **Pass/Fail Status:** `[PASS | FAIL | BLOCKED | NOT RUN]`
9. **Issues:** `[Issue/severity, affected branch/scope, evidence and owner; enter None if none]`
10. **Remediation Actions:** `[Action, owner, target version/date and retest reference; enter None if none]`

## Workflow Acceptance Criteria

- All invoked agents return typed, schema-valid results with workflow/correlation IDs, provenance, status and approval state.
- Data-quality, ACL, key/unit, stale-dependency and invalid-contract failures block the affected downstream branch and identify an owner/action.
- Demand-to-Supply handoff uses a compatible approved forecast version; duplicate/replayed events are idempotent.
- Required planner/Operations approval is a hard state; absent, denied, expired, unauthorized or timed-out approval does not advance the workflow.
- Escalations, retries, terminal outcomes and workflow state are traceable; no partial result is represented as complete.
- No high-severity safety, privacy, permission, financial-control or policy violation; no production write or plan release occurs.

## Deployment Readiness Criteria

- Runtime, workflow persistence, identity/ACL, schemas, telemetry and test harness are configured in an isolated environment.
- Agent unit gates and mock dependency contracts pass before multi-agent execution.
- Versioned fixture snapshots and mock Procurement Plan/Asset Status are available; source, key, period, unit and validity semantics are explicit.
- Workflow scenarios, failure/replay behavior, approval pauses and escalation ownership have been executed and reviewed.
- Business, data, security, architecture and platform owners accept evidence and residual risks for the proposed stage.
- Passing this template supports only the approved mock/sandbox stage; live SAP connectivity or production deployment requires separate explicit approval.

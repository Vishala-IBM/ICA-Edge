# Agent Test Execution Results Template

Use one record per test case and execution attempt. Preserve fixture/source versions, agent/configuration versions and trace IDs so results are reproducible.

## Test Result Record

1. **Test Case ID:** `[ID from unit or execution test plan]`
2. **Agent Name:** `[Agent or workflow component under test]`
3. **Test Objective:** `[Behavior/control being validated]`
4. **Input Data:** `[Fixture/source references and versions; scope, period, grain, keys, units, mock/live designation]`
5. **Expected Result:** `[Expected status, values/outputs, controls, handoffs and approval behavior]`
6. **Actual Result:** `[Observed output/status, provenance, trace/correlation ID, deviations]`
7. **Pass/Fail Status:** `[PASS | FAIL | BLOCKED | NOT RUN]`
8. **Issues Identified:** `[Issue/severity, affected scope, evidence, owner; enter None if none]`
9. **Corrective Actions:** `[Action, responsible owner, due/target version; enter None if none]`
10. **Retest Status:** `[NOT REQUIRED | PENDING | PASS | FAIL | BLOCKED; include retest run/trace reference]`

## Test Completion Criteria

- Every in-scope test case has an execution record with all ten fields completed; `NOT RUN` and `BLOCKED` include a reason and owner/action.
- Results use pinned inputs/configuration versions and contain sufficient evidence/trace references to reproduce the run.
- Expected and actual outputs are compared against the case assertions; failures, deviations and corrective actions are recorded.
- Required approval, ACL, provenance, idempotency and fail-closed checks are explicitly recorded where applicable.
- Failed cases are retested after corrective action; retain both original and retest results.

## Exit Criteria

- All mandatory in-scope tests pass, or remaining failures/blockers have documented owner disposition and prevent readiness promotion as appropriate.
- No unresolved high-severity safety, privacy, permission, financial-control or policy issue remains for the proposed test stage.
- Mandatory approval tests block absent, denied, expired, unauthorized or timed-out decisions; no write/release action occurs in mock/read-only tests.
- Agent/workflow handoffs, source lineage, traceability, and duplicate/replay behavior meet the applicable test-plan criteria.
- Test owner and relevant data/business/security owners review the evidence and approve the next readiness gate; passing tests do not by themselves authorize production deployment.

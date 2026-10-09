# MVP Go-Live Plan

**Go-Live Recommendation:** **NO-GO today** for production, live SAP connections or business execution. **Conditional GO** for a bounded, read-only sandbox release only after runtime, security, data, test, dashboard and owner-approval gates pass. The first 30 days are for readiness closure and mock validation, not automatic production launch.

## 1. Deployment Scope

- Initial release: isolated ICA Edge sandbox with mock/read-only agents and versioned synthetic or approved non-production snapshots.
- Power BI: controlled read-only workspace with the approved MVP views; unsupported Finance measures remain unavailable.
- Included: five MVP agents, dashboard summaries, alerts/recommendations, human approval tasks and audit/traceability.
- Excluded: production credentials, SAP writes, plan/PO/production release, automated business actions and unapproved live integrations.

## 2. Deployment Sequence

1. Select and provision runtime, workflow persistence, environments, identity/ACL, secrets, telemetry and test harness.
2. Approve common schemas, source contracts, ownership, approval roles and connector access.
3. Configure Data Analytics, then Enterprise Architecture and Knowledge Repository with fixture sources; pass quality, evidence, ACL and citation gates.
4. Close Demand Planning data semantics and configure its versioned forecast output.
5. Configure Supply Planning with compatible keys/UoM and mock Procurement Plan/Asset Status; pass dependency and approval tests.
6. Execute isolated tests, mocked workflow/failure cases and human approval gates; resolve blocking issues.
7. Build/reconcile the Power BI semantic model and views; conduct access, refresh, drill-through and business UAT.
8. Publish only the approved read-only sandbox scope after sign-off. Any production or live SAP step requires a separate explicit go/no-go.

## 3. Go-Live Checklist

- [ ] Runtime, workflow state, test harness and support/monitoring are operational.
- [ ] Agent schemas, prompt/config versions, fixtures, connectors and owners are recorded.
- [ ] Identity, least privilege, ACL, secrets, audit and redacted logging pass security review.
- [ ] Demand dictionary and unit/period/scenario semantics are approved; Supply keys/UoM and mock dependencies are valid.
- [ ] All unit, handoff, escalation, replay/recovery and approval tests pass; no unresolved high-severity issue remains.
- [ ] Dashboard measures reconcile to pinned sources; unavailable values are not shown as zero; refresh failure preserves the last valid view.
- [ ] Business, data, architecture, security, platform and operations owners accept residual risks and rollback/support procedures.
- [ ] Production writes and credentials remain disabled unless separately approved.

## 4. User Communication

Before pilot access, communicate the approved scope, environment, supported views, synthetic/mock data labels, unavailable KPIs, known limitations, human approval boundaries and support contact. Explain that recommendations are advisory and no action is executed from the dashboard. Announce material refresh, schema or access changes through the named owner/change process.

## 5. Support Model

- **Business/planning owners:** triage forecast, supply, approval and KPI interpretation issues.
- **Data/source owners:** resolve quality, mapping, freshness and contract issues.
- **Architecture/security/knowledge owners:** review landscape assumptions, access denial, citation and content issues.
- **Platform/dashboard support:** monitor runtime, workflow, connector, refresh, report access and recovery; retain trace IDs and redacted diagnostics.
- Assign named on-call/escalation ownership, response expectations and change control before access is granted; these are prerequisites, not established services.

## 6. Rollback Plan

1. Pause new workflow triggers and report publication/refresh promotion; preserve the last valid report snapshot.
2. Disable the affected agent/connector or revert to the last approved configuration/report version.
3. Revoke or suspend connector credentials if access/security is implicated; retain audit and trace references.
4. Keep failed/partial results visibly failed; do not mark pending approvals or rejected actions complete.
5. Notify affected users and owners, investigate, remediate and rerun acceptance tests before restoring service.

## 7. Success Metrics

- 100% of mandatory approval tests block absent, denied, expired, unauthorized or timed-out decisions.
- At least 95% resolvable citations on the agreed golden factual-answer suite; zero fabricated citations or ACL leakage.
- Zero silent row drops, invented identities, unsupported unit conversions or missing-as-zero substitutions.
- All displayed measures carry source/version, period/as-of, unit and availability status; planning outputs reconcile to approved snapshots.
- No high-severity safety, privacy, permission, financial-control or policy violation; no unauthorized production write/release.
- Business, data, security, architecture and platform owners accept pilot evidence and limitations.

## First 30-Day Actions

- **Days 1-10:** appoint owners; select runtime/environment; define identity, support, common schemas and approval roles.
- **Days 11-20:** provision fixture harness and read-only adapters; configure Data Analytics, Enterprise Architecture and Knowledge Repository; resolve ACL/citation and evidence tests.
- **Days 21-30:** close Demand/Supply contract blockers; configure mock planning dependencies; run agent unit and mocked workflow tests; prototype Power BI semantic views and record blockers/UAT feedback.

The 30-day window is a proposed readiness sprint, not a production launch commitment. Proceed to sandbox release only when the checklist passes; production requires separate approval.

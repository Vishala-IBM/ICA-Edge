# Dashboard Implementation Plan

**Implementation Readiness Assessment:** Conditional / prototype-ready. The design and logical KPI/data models exist, but they describe synthetic or proposed sources, not a deployed dashboard serving layer, production feed, refresh service or integrated security configuration.

**Recommended MVP Release Scope:** Read-only Power BI dashboard over versioned, approved or synthetic snapshots. Release operational data trust, planning scenarios/gaps, evidence-backed transformation status, recommendations and alerts. Show Finance executive KPIs as unavailable until Finance feeds and definitions are approved; do not present fixture results as production performance.

**High-Level Timeline:** Proposed 6-8 weeks after owners, data and platform access are available: 1-2 weeks model/contracts; 2-4 weeks build; 1-2 weeks integration/UAT; final week for controlled release. This is a planning estimate, not a source commitment; absent feeds, runtime or approvals can extend it.

## 1. MVP Dashboard Scope

- Four views from the design: Executive Overview, Operations & Data Trust, Planning, and Transformation; shared Alert/Recommendation Detail.
- Initial measures: Data Quality Completeness, Lineage Coverage, Knowledge Citation Coverage, Demand-Supply Gap and versioned planning outputs; include architecture coverage/exposure only when evidence is verified.
- Show source/version, as-of, period, unit, target status, approval state and measured/conditional/unavailable status on all views.
- Exclude live SAP writes, autonomous action execution and unsupported Finance measures. Revenue Growth and EBITDA remain unavailable until Finance sources are connected and reconciled.

## 2. Dashboard Build Sequence

1. Confirm KPI owners, definitions, dimensions, target/alert thresholds and MVP release scope.
2. Establish read-only, versioned source snapshots and quality gates; resolve required keys, grain, calendar/UoM and provenance.
3. Implement conformed dimensions, fact/semantic views and KPI calculations from the data architecture/model.
4. Build the Power BI pages, filters, drill-through, availability states, alerts and recommendation details.
5. Connect approved ICA Edge outputs or deterministic fixtures; validate agent/source version and approval metadata.
6. Run reconciliation, access, freshness, usability and owner acceptance tests; release only the approved read-only scope.

## 3. Power BI Implementation Approach

- Implement the logical dashboard model as a governed semantic model with conformed Period, Product, Customer, Region, Plant, Business Unit and Source/Version dimensions; keep Material distinct from Product.
- Create separate versioned facts for forecast, supply plan, data quality, architecture inventory, knowledge evaluation and KPI results as specified in the data architecture.
- Use measures from the KPI model only when required facts and approved formulas are present. Expose target/threshold and unavailable/conditional states; never coerce missing data to zero.
- Build the four designed views with consistent filters, as-of/source details, drill-through to authorized evidence and text status labels alongside color.
- Keep report, semantic-model ownership, refresh and access configuration under named dashboard/data owners; exact Power BI tenant/capacity choices require platform approval.

## 4. ICA Edge Integration Approach

- Treat ICA Edge as a producer of typed, versioned agent outputs; map forecast, supply, quality, architecture and knowledge result contracts into the curated aggregation layer.
- Preserve request/workflow/trace IDs, agent/schema versions, source provenance, unit, period, exceptions and approval status.
- Begin with exported or mocked read-only outputs; validate schemas and reconcile before publishing to the dashboard model.
- Do not connect the dashboard directly to agent prompts/state or expose tool credentials. Do not provide dashboard-triggered SAP writes or plan releases.
- Promote event/API integration only after runtime, connector, identity, security, persistence and operational owners approve it.

## 5. Data Refresh Strategy

- **Prototype:** pinned, deterministic snapshots refreshed manually or in CI; expose snapshot version and refresh time.
- **Planning:** refresh per approved forecast/plan version and planning cycle; recalculate dependent KPI views only after schema, quality and approval checks pass.
- **Operational/knowledge:** refresh after validated source or index refresh and display freshness/stale status.
- **Architecture:** refresh after approved inventory/standards snapshot changes.
- Production cadence, latency, retention and late-arriving-data rules are not defined; agree them with source owners. Failed or partial refreshes must not silently replace the last valid snapshot.

## 6. Dashboard Security Model

- Enforce least-privilege access at source, semantic model and report; preserve source classification and ACL through aggregation and drill-through.
- Apply row/column restrictions where required; Knowledge Repository citations and excerpts must remain authorized for the viewing user.
- Separate development/test synthetic data from approved non-production or production sources; do not embed secrets or unrestricted agent context in the dashboard.
- Audit access, refresh outcomes, source versions and KPI definition versions; redact sensitive values from operational logs.
- Use only approved identity/SSO and tenant controls. Exact Power BI/ICA Edge security configuration is a deployment decision, not established by the design artifacts.

## 7. User Roles

| Role | Dashboard permissions |
|---|---|
| Executive viewer | View approved summary KPIs, alerts and recommendations; drill into authorized evidence. No data/model edits or approvals inferred from viewing. |
| Planner / S&OP reviewer | View planning scenarios, supply alternatives and approval state; review through the designated workflow, not by dashboard write action. |
| Data steward / KPI owner | Validate source quality, mappings, KPI formula, target and threshold; approve definitions and remediation metadata. |
| Architecture / knowledge owner | Review inventory evidence, standards exceptions, citation freshness and source publication status within their authorization. |
| Dashboard administrator | Manage report/semantic-model deployment and access under change control; cannot override business KPI or workflow approval. |

Role names and assignments require customer approval; apply least privilege and segregation of duties.

## 8. Deployment Roadmap

| Phase | Proposed timing | Deliverable / gate |
|---|---|---|
| 1. Definition and contracts | Weeks 1-2 | Confirm KPI formulas/owners, source contracts, dimensions, security roles and mock-versus-live labels. Gate: owners accept scope and definitions. |
| 2. Data model and prototype | Weeks 2-4 | Build curated snapshot/semantic layer and Power BI views using deterministic fixtures. Gate: KPI calculations reproduce and missing data remains visible. |
| 3. Agent-output integration and UAT | Weeks 4-6 | Map approved read-only ICA Edge outputs; test freshness, lineage, access, alerting and user workflows. Gate: data/agent owners reconcile outputs and approve residual risks. |
| 4. Controlled MVP release | Weeks 6-8 | Publish bounded viewer/planner release, monitoring and support instructions. Gate: security, business and platform sign-off; no production writes enabled. |

Timing is indicative and assumes runtime, source access and owner decisions are available when needed.

## 9. Success Criteria

- Released views use approved/versioned KPI definitions and report source, period, as-of, unit and availability state.
- Planning/data-trust values reconcile to their approved snapshots; incompatible keys/units and stale sources are flagged or blocked.
- Unavailable Finance measures are clearly identified and never displayed as zero or estimated facts.
- Agent recommendations and alerts include evidence, owner, next action and approval status; no action is executed from the dashboard.
- ACL/role tests prevent unauthorized report, drill-through or citation access; refresh failures preserve the last valid view and show an alert.
- Business, data, security and platform owners approve MVP scope and accept the read-only release.

## 10. Future Enhancements

- Connect approved Finance sources for Revenue Growth and EBITDA after reconciliation and KPI-owner sign-off.
- Add aligned actuals/holdout, approved calendar/UoM references and validated thresholds for forecast accuracy and supply KPIs.
- Replace mock Procurement Plan/Asset Status and synthetic planning inputs with approved non-production integrations after contract/security gates.
- Add governed event-driven refresh, operational monitoring and higher-scale semantic serving after runtime and platform selection.
- Extend transformation reporting with verified application inventory, lifecycle evidence and owner-approved savings/decision measures.
- Consider dashboard-triggered workflow navigation only after human approval, authorization, audit and rollback behavior are independently approved.

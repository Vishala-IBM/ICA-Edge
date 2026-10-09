# Executive Dashboard Design Specification

**Dashboard Readiness Assessment:** Conceptual / fixture-ready only. The KPI and data architecture artifacts describe synthetic inputs and proposed views, not a deployed dashboard, production data feeds or validated refresh service. Executive finance measures and several planning KPIs remain unavailable until their source and formula dependencies are approved.

**Recommended MVP Dashboard Scope:** A read-only dashboard over versioned synthetic/approved snapshots with four views: executive summary, operational data trust, planning outlook, and transformation status. Include agent-generated recommendations and prioritized alerts with provenance and approval state. Mark unavailable metrics as unavailable; do not imply production readiness or enable action execution.

## 1. Dashboard Overview

Provide executives a single, scannable view of business outcomes, planning exposure, data confidence, transformation status and decisions requiring attention. Every measure shows period/as-of, source/version, target status and availability. Allow drill-through to supporting agent output and exceptions subject to access controls. MVP data is synthetic unless explicitly verified.

## 2. Executive KPI Section

Show Revenue Growth Rate and EBITDA Margin with current value, target, trend and source freshness. The KPI model targets are 10% YoY revenue growth and 25% EBITDA margin, but the MVP source set has no Finance feed for either. Display these as **Unavailable: Finance source not connected**, not zero or an estimated value. Show demand-supply summary only as a clearly labeled planning signal, not a substitute for financial performance.

## 3. Operational KPI Section

Prioritize data readiness and trustworthy evidence:

- Data quality completeness and lineage coverage from Data Analytics, with matched/unmatched counts, rule severity and source freshness.
- Knowledge citation coverage from the approved evaluation set, plus stale/conflicting-source and ACL-denial indicators.
- Show configured thresholds only when owner-approved. The MVP golden-suite citation criterion is at least 95%; it is an evaluation target, not a production service-level commitment.

## 4. Planning KPI Section

Present baseline versus scenario demand and constrained/unconstrained supply, with period, Product/Plant scope, UoM, forecast/plan version, assumptions and approval status. Highlight demand-supply gap, forecast MAPE/bias and supply throughput/attainment only when their dependencies are satisfied. MAPE/bias require aligned actuals and approved definitions; supply actuals/capacity and compatible keys/UoM are not established. Supply Chain Throughput's 95% target is illustrative and must be visibly labeled pending owner approval.

## 5. Transformation KPI Section

Show application inventory/disposition coverage, verified unsupported/EOL exposure and standards compliance with evidence freshness and owner/review status. Distinguish known, unknown and stale inventory. Display rationalization savings or decision lead time only after owners define formulas and data sources; do not infer customer landscape facts from illustrative fixtures.

## 6. Agent Recommendations Panel

List concise recommendation cards/rows with agent, priority, affected scope, rationale, evidence links, confidence/limitations, owner and required decision. Separate facts, assumptions and recommendations. Support:

- Data Analytics quality remediation and lineage findings.
- Demand Planning forecast/scenario observations and planner review requests.
- Supply Planning constrained alternatives and exception summaries.
- Enterprise Architecture evidence-backed options and review actions.
- Knowledge Repository cited context and freshness/conflict warnings.

Recommendations are advisory. Provide a route to human review; no dashboard action directly releases a plan or writes to enterprise systems.

## 7. Critical Alerts Panel

Order by severity, business impact, affected period/scope and age. Show source/agent, timestamp, blocking condition, owner and next action. MVP alert types:

- Missing/ambiguous key, UoM, calendar, stale snapshot or failed data-quality gate.
- Demand variance greater than 20% against the explicitly approved reference; require planner review.
- Stale/invalid Asset Status, conflicting Procurement Plan or infeasible/overlapping supply constraints.
- Restricted-source access denial, unresolved citation, stale knowledge or conflicting approved content.
- Unknown/stale architecture inventory or unapproved exception.

A timeout or missing value must never appear as approval, zero exposure or successful action.

## 8. Navigation Structure

- **Executive Overview:** headline KPIs, readiness, major alerts and decisions.
- **Operations & Data Trust:** quality, lineage, citations, freshness and exceptions.
- **Planning:** demand scenarios, supply alternatives, gaps, constraints and approvals.
- **Transformation:** application/technology inventory, lifecycle exposure and architecture decisions.
- **Alert/Recommendation Detail:** evidence, provenance, affected scope, owner and decision history.

Keep filters consistent across views: reporting period, business unit, region, product, plant, scenario, source/version and status, limited to authorized data.

## 9. Dashboard Layout

Use a restrained executive layout with a compact header for reporting period, last refresh and data-readiness status. Place a small row of KPI summaries first, with unavailable values clearly labeled. Below, use a planning comparison area and a prioritized alert/recommendation list; place operational confidence and transformation status in dedicated views or lower-priority panels. Use consistent status labels for on-track, attention, blocked and unavailable, accompanied by text and not color alone. Keep source/version and approval state visible on drill-down; avoid implying precision where source data is incomplete.

## 10. Executive User Stories

- As an executive, I can see which headline KPIs are measured, unavailable or conditional and why, so I do not mistake missing data for zero.
- As an executive, I can compare baseline and scenario planning outcomes with units, period, constraints and approval state before making a decision.
- As an executive, I can identify high-impact data, forecast, supply and architecture risks with an accountable owner and next action.
- As an executive, I can inspect evidence and source freshness behind a recommendation without exposing restricted information.
- As an executive, I can distinguish verified transformation progress from unknown or illustrative landscape assumptions.

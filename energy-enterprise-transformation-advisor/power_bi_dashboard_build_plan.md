# Power BI Dashboard Build Plan

**MVP Dashboard Scope:** Read-only report over versioned synthetic or approved snapshots. Build Executive Overview, Operations & Data Trust, Planning, Transformation and Alert/Recommendation Detail. Do not enable action execution. Display unsupported Finance KPIs as unavailable until their feeds and definitions are approved.

**Build Priority:** 1) conformed semantic model and data trust; 2) planning views and alerts; 3) transformation evidence; 4) executive Finance outcomes after source approval.

**Dashboard Readiness Assessment:** Conditional / prototype-ready. Logical KPIs, datasets and page design are defined, but the semantic model, refresh service, production data feeds, Power BI tenant/security setup and KPI approvals are not established.

## 1. Dashboard Pages

1. **Executive Overview:** headline outcomes, readiness, major alerts, recommendations and decisions.
2. **Operations & Data Trust:** data quality, lineage, source freshness, citations and access/exception status.
3. **Planning:** baseline/scenario forecasts, supply alternatives, demand-supply gaps, constraints and approvals.
4. **Transformation:** application inventory/disposition, verified lifecycle exposure and standards status.
5. **Alert/Recommendation Detail:** evidence, affected scope, source/version, owner, next action and decision history.

## 2. Required Visuals

- KPI cards with value, target, trend, as-of and measured/conditional/unavailable status; never render missing values as zero.
- Line charts for forecast/scenario trends by period; use compatible units and clearly distinguish scenarios.
- Bar/column comparisons for constrained versus unconstrained supply and approved plan/reference.
- Matrix/table for Product/Plant/Period detail, gaps, constraints, quality flags and approval state.
- Ranked alert/recommendation table with severity, age, owner and next action.
- Data-quality and lineage indicators showing evaluated/matched/unmatched counts and source freshness.
- Architecture status table for assessed/unknown/stale applications and verified EOL/standards exceptions.

## 3. KPI Mapping

| Page | KPIs | Availability notes |
|---|---|---|
| Executive Overview | Revenue Growth Rate; EBITDA Margin; planning summary signal | Finance KPIs use KPI-model targets (10% YoY, 25%) but remain unavailable until Finance feeds/formulas are approved. Planning signal is not financial performance. |
| Operations & Data Trust | Data Quality Completeness; Lineage Coverage; Citation Coverage | Data Analytics and Knowledge outputs; citation target of 95% applies to the MVP golden evaluation suite, not a production SLA. |
| Planning | Forecast MAPE/bias; Demand-Supply Gap; Supply Plan Attainment; Supply Chain Throughput | MAPE/bias need aligned actuals; attainment needs actual supply; throughput 95% is illustrative pending plant-owner approval. Use approved definitions only. |
| Transformation | Application Inventory/Disposition Coverage; Unsupported/EOL Exposure; Architecture Standards Compliance | Show evidence freshness and distinguish unknown from verified exposure; no target where the KPI model lacks one. |

## 4. Dataset Mapping

| Page / visual | Dataset(s) |
|---|---|
| All filters and KPI context | Conformed Dimensions: Period, Product, Material (separate), Customer, Region, Plant, Business Unit, Source/Version. |
| Executive KPI cards | FactKPI; Finance source facts are a future dependency and must show unavailable until connected. |
| Operational quality/lineage visuals | FactDataQuality. |
| Citation/freshness visuals | FactKnowledgeEvaluation. |
| Forecast and scenario visuals | FactDemandForecast. |
| Supply comparison, gap and constraints | FactSupplyPlan. |
| Transformation inventory/status table | FactArchitectureInventory. |
| Shared target/availability/alert state | FactKPI with approved definition version, target, threshold and availability status. |

These are logical dataset names; validate schemas and source mappings before building measures.

## 5. Data Refresh Approach

- Prototype with pinned, deterministic snapshots refreshed manually or through an approved CI process; expose snapshot version and refresh time.
- Refresh planning facts per approved forecast/plan version or planning cycle, only after schema, quality and approval gates pass.
- Refresh quality/knowledge views after validated source or index refresh; refresh architecture views after approved inventory/standards changes.
- Preserve the last valid view on partial/failed refresh and show freshness/error status. Production schedules, latency and retention need owner approval.

## 6. Security Model

- Apply least privilege at source, semantic model and report; preserve source classification and ACL through aggregation and drill-through.
- Restrict rows/columns where required; Knowledge Repository citations/excerpts must be authorized for the viewing user.
- Separate synthetic development/test data from approved enterprise sources; no secrets or unrestricted agent context in the report.
- Audit access, refresh outcomes, source versions and KPI-definition versions. Exact tenant, capacity and identity configuration require platform/security approval.

## 7. User Roles

- **Executive viewer:** view approved summary KPIs, alerts and recommendations; drill into authorized evidence.
- **Planner/S&OP reviewer:** view forecast/supply alternatives and approval state; decide through the designated workflow, not a dashboard write action.
- **Data steward/KPI owner:** validate mappings, formulas, targets, thresholds, data quality and remediation.
- **Architecture/knowledge owner:** review authorized inventory evidence, exceptions, citations and freshness.
- **Dashboard administrator:** manage reports, semantic model and access under change control; cannot override business approval.

Assign actual identities and row/column scope only after customer approval.

## 8. Drill-Down Navigation

- Executive KPI card -> KPI detail with formula/version, period, target, source/as-of and availability.
- Planning trend -> scenario and plan comparison -> Product/Plant/Period rows -> constraint, inventory, unit and source lineage details.
- Quality/citation alert -> rule or evaluation result -> authorized source/version and remediation owner.
- Transformation status -> application/interface evidence, freshness, disposition and exception/ADR review status.
- Recommendation/alert -> supporting citations, assumptions, affected scope, owner and human decision history.

All drill-through obeys viewer permissions and retains source/version context.

## 9. Deployment Approach

1. Confirm KPI owners, definitions, data mappings, target/threshold approval, tenant/workspace controls and user roles.
2. Build and reconcile the Power BI semantic model from the logical datasets; validate grain, keys, units, lineage and unavailable-state behavior.
3. Develop the five pages using versioned snapshots; test filters, drill-through, alerts, access and refresh-failure behavior.
4. Conduct data-owner and business UAT; publish only the approved read-only MVP to a controlled workspace with ownership, refresh monitoring and rollback.
5. Add live sources only after source-owner, security, architecture, reconciliation and operations approval. No SAP writes or dashboard-triggered actions in MVP.

## 10. Success Criteria

- All pages use approved/versioned measures and expose source, period, as-of, unit and availability status.
- Measures reconcile to pinned source snapshots; incompatible grains/keys/units are blocked or flagged.
- Finance KPIs and unsupported measures are clearly unavailable, never zero or estimated.
- Alerts/recommendations show evidence, owner, next action and approval state; citations/drill-through honor ACLs.
- Refresh failures preserve the last valid view and display a clear stale/error state.
- Business, data, security and platform owners approve the bounded read-only release and its residual limitations.

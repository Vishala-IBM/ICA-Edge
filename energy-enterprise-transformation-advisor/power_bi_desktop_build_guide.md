# Power BI Desktop Build Guide

**Scope:** MVP read-only executive dashboard over versioned synthetic or approved snapshots.
**Status:** Prototype-ready. Production feeds, complete actuals, approved KPI formulas and refresh SLAs are not yet established. Unavailable measures must be labeled as unavailable, not zero.

---

## 1. Dataset Import Steps

Import the following versioned snapshot files into Power BI Desktop using **Get Data → Text/CSV** (or approved data connector). Load each as a separate query. Do not mix mock and live provenance in the same table without an explicit source-type column.

| Query Name | Source File(s) | Notes |
|---|---|---|
| `FactDemandForecast` | `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv` | Include scenario_ID and approval status |
| `FactSupplyPlan` | `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv` | Include mock/live provenance flag |
| `FactDataQuality` | Data Analytics quality/lineage outputs | Include rule version and denominator |
| `FactArchitectureInventory` | `application_inventory.csv`, `technology_standards.csv` | Include evidence freshness and lifecycle status |
| `FactKnowledgeEvaluation` | Citation resolver and evaluation outputs | Include ACL outcome and publication status |
| `FactKPI` | Governed measures from the above facts + KPI catalog | Include availability flag: `measured`, `conditional`, `unavailable` |
| `DimPeriod` | Approved calendar/period reference | Include period key and type |
| `DimProduct` | Approved product master | Keep Product_ID distinct from Material_ID |
| `DimMaterial` | Approved material master | Do not merge with DimProduct |
| `DimPlant` | Approved plant master | Include Plant_ID and Region_ID |
| `DimBusinessUnit` | Approved BU master | Include Business_Unit_ID |
| `DimSourceVersion` | Source/system ID and version metadata | Include as-of date and approval status |

**Power Query steps for each table:**
1. Remove duplicates on canonical key columns.
2. Add a `SourceVersion` column from `DimSourceVersion` via merge (left outer).
3. Add an `AvailabilityStatus` column: set to `"unavailable"` where required actuals or formula approvals are missing.
4. Set correct data types (Date, Decimal Number, Text, Whole Number) explicitly; do not allow Power Query to auto-detect.
5. Disable load for any staging/intermediate query; load only the final shaped tables.

---

## 2. Data Model Design

Use a **star schema**. All fact tables relate to shared conformed dimensions via single-column keys. Do not create many-to-many relationships without an explicit bridge table.

### Relationships

| From (Fact) | Key | To (Dimension) | Cardinality | Filter Direction |
|---|---|---|---|---|
| FactKPI | Period | DimPeriod | Many-to-one | Single (Dim → Fact) |
| FactKPI | Product_ID | DimProduct | Many-to-one | Single |
| FactKPI | Plant_ID | DimPlant | Many-to-one | Single |
| FactKPI | Business_Unit_ID | DimBusinessUnit | Many-to-one | Single |
| FactKPI | SourceVersion_ID | DimSourceVersion | Many-to-one | Single |
| FactDemandForecast | Period | DimPeriod | Many-to-one | Single |
| FactDemandForecast | Product_ID | DimProduct | Many-to-one | Single |
| FactSupplyPlan | Period | DimPeriod | Many-to-one | Single |
| FactSupplyPlan | Product_ID | DimProduct | Many-to-one | Single |
| FactSupplyPlan | Material_ID | DimMaterial | Many-to-one | Single |
| FactSupplyPlan | Plant_ID | DimPlant | Many-to-one | Single |
| FactDataQuality | Period | DimPeriod | Many-to-one | Single |
| FactArchitectureInventory | SourceVersion_ID | DimSourceVersion | Many-to-one | Single |
| FactKnowledgeEvaluation | Period | DimPeriod | Many-to-one | Single |

### Model Rules
- Keep `Material_ID` and `Product_ID` on separate dimension tables; never merge them.
- Do not aggregate across incompatible UoM; carry UoM as a column and filter before summing.
- Mark all Finance-sourced fields (Revenue, EBITDA) as inactive until a Finance data source is approved and connected.

---

## 3. Required Measures

Create all measures in a dedicated **`_Measures`** table (blank table, no rows). Group measures by dashboard section.

### 3.1 Operational / Data Trust

```dax
-- Data Quality Completeness (%)
Data Quality Completeness =
VAR evaluated = SUM(FactDataQuality[EvaluatedFields])
VAR valid = SUM(FactDataQuality[ValidFields])
RETURN
    IF(evaluated = 0, BLANK(), DIVIDE(valid, evaluated) * 100)

-- Lineage Coverage (%)
Lineage Coverage =
VAR total = SUM(FactDataQuality[TotalMeasures])
VAR covered = SUM(FactDataQuality[LineageCoveredMeasures])
RETURN
    IF(total = 0, BLANK(), DIVIDE(covered, total) * 100)

-- Citation Coverage (%)
Citation Coverage =
VAR answers = SUM(FactKnowledgeEvaluation[TotalFactualAnswers])
VAR cited = SUM(FactKnowledgeEvaluation[ResolvableAuthorizedCitations])
RETURN
    IF(answers = 0, BLANK(), DIVIDE(cited, answers) * 100)

-- Citation Coverage Status
Citation Coverage Status =
VAR cov = [Citation Coverage]
RETURN
    SWITCH(TRUE(),
        ISBLANK(cov), "Unavailable",
        cov >= 95, "On Track",
        "Below Target")
```

### 3.2 Planning

```dax
-- Demand-Supply Gap
Demand Supply Gap =
VAR demand = SUM(FactDemandForecast[ForecastQuantity])
VAR supply = SUM(FactSupplyPlan[PlannedSupply])
RETURN
    IF(
        ISBLANK(demand) || ISBLANK(supply),
        BLANK(),
        demand - supply
    )

-- Demand-Supply Gap % (requires aligned grain/UoM)
Demand Supply Gap Pct =
VAR demand = SUM(FactDemandForecast[ForecastQuantity])
VAR supply = SUM(FactSupplyPlan[PlannedSupply])
RETURN
    IF(demand = 0 || ISBLANK(demand), BLANK(), DIVIDE(demand - supply, demand) * 100)

-- Forecast MAPE (only when aligned actuals exist)
Forecast MAPE =
VAR hasActuals = COUNTROWS(FILTER(FactDemandForecast, NOT ISBLANK(FactDemandForecast[ActualQuantity])))
RETURN
    IF(hasActuals = 0, BLANK(),
        AVERAGEX(
            FILTER(FactDemandForecast, NOT ISBLANK(FactDemandForecast[ActualQuantity])),
            ABS(DIVIDE(FactDemandForecast[ForecastQuantity] - FactDemandForecast[ActualQuantity],
                       FactDemandForecast[ActualQuantity])) * 100
        )
    )

-- Supply Plan Attainment (%)
Supply Plan Attainment =
VAR plan = SUM(FactSupplyPlan[PlannedSupply])
VAR actual = SUM(FactSupplyPlan[ActualSupply])
RETURN
    IF(plan = 0 || ISBLANK(actual), BLANK(), DIVIDE(actual, plan) * 100)
```

### 3.3 Transformation

```dax
-- Application Inventory Coverage (%)
App Inventory Coverage =
VAR inScope = SUM(FactArchitectureInventory[InScopeCount])
VAR covered = SUM(FactArchitectureInventory[DispositionedCount])
RETURN
    IF(inScope = 0, BLANK(), DIVIDE(covered, inScope) * 100)

-- Verified EOL/Unsupported Exposure (count)
EOL Exposure Count =
CALCULATE(
    COUNTROWS(FactArchitectureInventory),
    FactArchitectureInventory[LifecycleStatus] = "Unsupported"
        || FactArchitectureInventory[LifecycleStatus] = "EOL"
)

-- Architecture Standards Compliance (%)
Standards Compliance =
VAR assessed = SUM(FactArchitectureInventory[AssessedCount])
VAR conforming = SUM(FactArchitectureInventory[ConformingCount])
RETURN
    IF(assessed = 0, BLANK(), DIVIDE(conforming, assessed) * 100)
```

### 3.4 Executive (Blocked — Finance source not connected)

```dax
-- Revenue Growth Rate (unavailable until Finance source approved)
Revenue Growth Rate = BLANK()   -- Replace with Finance-sourced measure post-approval

-- EBITDA Margin (unavailable until Finance source approved)
EBITDA Margin = BLANK()         -- Replace with Finance-sourced measure post-approval

-- Display label for blocked Executive KPIs
Executive KPI Status = "Unavailable: Finance source not connected"
```

### 3.5 Shared Utility

```dax
-- Last Refresh Label
Last Refresh = "As of: " & FORMAT(MAX(DimSourceVersion[AsOfDate]), "DD MMM YYYY")

-- KPI Availability Label (from FactKPI)
KPI Availability =
SELECTEDVALUE(FactKPI[AvailabilityStatus], "unavailable")
```

---

## 4. Page Layouts

Create five report pages. Use 16:9 canvas (1280 × 720 px). Apply a consistent header band (height ~60 px) on every page with: dashboard title (left), reporting-period slicer (centre), last-refresh label and data-readiness status (right).

| Page | Tab Label |
|---|---|
| 1 | Executive Overview |
| 2 | Operations & Data Trust |
| 3 | Planning |
| 4 | Transformation |
| 5 | Alert & Recommendation Detail |

### Page 1 — Executive Overview
- Header band (period slicer, last refresh, readiness status).
- KPI card row (4 cards): Revenue Growth Rate, EBITDA Margin, Citation Coverage, Data Quality Completeness. Revenue and EBITDA cards show static label `"Unavailable: Finance source not connected"`.
- Planning signal row: Demand-Supply Gap card and Supply Plan Attainment card (show `"Conditional"` where actuals are missing).
- Critical Alerts table (lower half): severity, agent, affected scope, owner, next action.
- Navigation bar (bottom or side): links to all five pages.

### Page 2 — Operations & Data Trust
- Header band.
- Three KPI cards: Data Quality Completeness, Lineage Coverage, Citation Coverage with target line at 95% for citation.
- Bar chart: completeness/lineage by source/domain.
- Data quality exceptions table: dataset, rule, severity, invalid count, remediation owner.
- Source freshness indicator table: source, as-of date, status.

### Page 3 — Planning
- Header band + scenario/version slicer.
- Line chart: baseline vs. scenario demand by period (FactDemandForecast).
- Bar chart: constrained vs. unconstrained supply by period (FactSupplyPlan).
- KPI cards: Demand-Supply Gap %, Forecast MAPE, Signed Forecast Bias, Supply Plan Attainment, Supply Chain Throughput (label as "Illustrative – pending owner approval" on throughput target).
- Product/Plant/Period matrix: planned supply, actual supply, gap, UoM, constraint impacts, approval status.

### Page 4 — Transformation
- Header band.
- Three KPI cards: App Inventory Coverage, EOL Exposure Count, Standards Compliance.
- Application inventory table: Application ID, lifecycle status, disposition, evidence freshness, owner, exception status.
- EOL/unsupported exposure table: application, technology, verified status, review owner.

### Page 5 — Alert & Recommendation Detail
- Header band.
- Recommendation cards/table: agent, priority, affected scope, rationale, evidence link, confidence/limitations, owner, required decision.
- Alert detail table: severity, source/agent, timestamp, blocking condition, owner, next action, decision history.
- Decision history section: approval state and audit trail (read-only).

---

## 5. Visuals

| Visual Type | Usage | Notes |
|---|---|---|
| KPI Card | Headline metric, target, trend, as-of | Use text status label alongside any color indicator; never show BLANK as zero |
| Line Chart | Demand/scenario trends by period | One line per scenario/version; include version label in legend |
| Clustered Bar Chart | Constrained vs. unconstrained supply; completeness by source | Include UoM in axis title |
| Matrix | Product/Plant/Period supply and gap details | Include UoM, approval status, constraint columns |
| Table | Alerts, recommendations, exceptions, inventory | Sort by severity/priority descending |
| Slicer | Period, Business Unit, Region, Product, Plant, Scenario, Source/Version, Status | Apply consistent cross-page sync |

**Visual formatting rules:**
- Use text labels alongside status colors (On Track, Attention, Blocked, Unavailable); do not rely on color alone.
- Never render a missing or unavailable value as `0`; show `"Unavailable"` or a blank cell with a tooltip.
- Show source/version and as-of date in every visual tooltip or sub-label.
- Do not imply precision beyond source data quality (e.g., round ratios consistently with the approved formula).

---

## 6. Navigation

### Cross-Page Slicers (sync across all pages)
- Reporting Period (DimPeriod)
- Business Unit (DimBusinessUnit)
- Region (DimPlant[Region_ID])
- Product (DimProduct)
- Plant (DimPlant)
- Scenario (FactDemandForecast[Scenario_ID])
- Source/Version (DimSourceVersion)
- KPI Availability Status (FactKPI[AvailabilityStatus])

**Sync slicers:** In View → Sync Slicers, enable sync for each slicer across all five pages. Apply "visible on" only to relevant pages as needed.

### Drill-Through Setup
| Source Visual | Drill-Through Target | Context Preserved |
|---|---|---|
| KPI Card (any) | Alert & Recommendation Detail | KPI name, period, source/version |
| Planning trend line | Product/Plant/Period matrix | Scenario, period, product |
| Alert table row | Alert & Recommendation Detail | Alert ID, severity, owner |
| Architecture table row | Transformation detail | Application ID, evidence, lifecycle |

**To configure drill-through:**
1. On the target page (Page 5), add drill-through fields: KPI name, Alert ID, Application ID.
2. Right-click the source visual → Drill through → [Page 5 name].
3. Preserve source/version and ACL context; never expose restricted passages on drill-through.

### Page Navigation Buttons
- Place a consistent navigation panel (left sidebar or bottom tab strip) on every page.
- Use **Insert → Buttons → Page Navigator** or individual Blank Buttons with page-navigation action.
- Label buttons: Executive Overview | Operations & Data Trust | Planning | Transformation | Alerts & Recommendations.

---

## 7. Publishing Steps

Follow the build sequence: develop → test → UAT sign-off → publish.

### Step 1 — Development Workspace Build
1. Build and test entirely in Power BI Desktop using pinned versioned synthetic snapshots.
2. Validate all measures produce correct results; confirm BLANK (not zero) for all unavailable KPIs.
3. Test all drill-through paths and slicer sync.
4. Verify that Revenue Growth Rate and EBITDA Margin cards display `"Unavailable: Finance source not connected"`.

### Step 2 — Reconciliation and Testing
1. Reconcile all measures to the approved dataset versions documented in `dashboard_dataset_build_plan.md`.
2. Test unavailable states (missing actuals → BLANK, missing Finance source → label).
3. Test refresh failure behavior: the last valid view must be preserved; no silent zeroing.
4. Test access control: confirm role-based filters are applied before any data is returned.

### Step 3 — UAT Sign-Off
1. Obtain KPI/data-owner review and approval of formulas, targets, thresholds and availability labels.
2. Obtain security review confirming least-privilege roles and no restricted-data exposure.
3. Obtain business UAT sign-off from executive/planner/data-steward/architecture stakeholders.
4. Document all known limitations (missing Finance feed, missing actuals, illustrative targets).

### Step 4 — Publish to Controlled Workspace
1. In Power BI Desktop: **File → Publish → Publish to Power BI** → select the approved controlled workspace (not personal workspace).
2. Assign the semantic model and report to named owners in the workspace.
3. Configure Row-Level Security roles in the Power BI Service (Semantic Model → Security):
   - **Executive Viewer** — approved summaries, authorized drill-through.
   - **Planner/S&OP Reviewer** — planning alternatives, approval state.
   - **Data Steward/KPI Owner** — mappings, formulas, thresholds, data quality.
   - **Architecture/Knowledge Owner** — inventory evidence, citations, freshness.
   - **Dashboard Administrator** — report/model management; cannot override business approvals.
4. Set report to read-only; disable export of underlying data unless authorized.

### Step 5 — Refresh Configuration
1. Configure a scheduled refresh in the Power BI Service only against approved data connections.
2. On refresh failure: preserve the last valid snapshot; surface a visible freshness/staleness indicator.
3. Do not connect production feeds until separate source-owner, security, architecture and reconciliation approval is obtained.

### Step 6 — Change Control
1. All updates to measures, data sources or security roles must go through change control.
2. Use versioned `.pbix` files in source control; tag each release with the source-snapshot version.
3. Roll back to the previous approved version if a post-publish issue is detected.

> **Hard constraint:** No SAP write, plan-release or business action is enabled from the dashboard. The dashboard is read-only and advisory. All decisions remain in the designated human workflow.

# Dashboard Data Architecture

**Architecture Readiness Assessment:** Conceptual / fixture-ready only. The source artifacts do not establish a deployed runtime, production connectors, workflow persistence or dashboard serving layer. Start with versioned synthetic snapshots and read-only curated outputs; production readiness requires source-owner, security and runtime approvals.

**Data Quality Dependencies:** Approved schemas and dictionaries; canonical Product/Material/Customer/Region/Plant mappings; calendar and UoM references; source/as-of/version lineage; aligned actuals for forecast KPIs; and validated inventory, capacity and dependency status. Missing or incompatible inputs remain unavailable/blocked, never coerced to zero.

## 1. Data Sources

- **Data Analytics:** `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`, relevant master-data and representative domain snapshots.
- **Demand Planning:** `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`, customer/product/region masters, and Commercial Marketing segment/pricing/product fixtures. Actuals/holdout are prerequisites for accuracy measures.
- **Supply Planning:** `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`, selected Warehouse stock/movement/count and Refining performance/output/yield fixtures; Procurement Plan and Asset Status are mocks until verified interfaces exist.
- **Architecture and knowledge measures:** application/integration/technology inventory and document/pattern/practice catalog outputs as specified in agent execution definitions; use only approved, versioned evidence.
- **Executive Finance measures:** Revenue Growth and EBITDA require Finance/revenue sources not supplied by the MVP agents; do not fabricate from planning outputs.

All sample data is synthetic. SAP, IBP, Datasphere/BDC and other enterprise endpoints are candidates, not assumed live sources.

## 2. Data Entities

- **Dimensions:** Period/calendar; Product; Material (distinct from Product); Customer; Region; Plant; Facility/Asset; Warehouse; Supplier; Business Unit; source system/application; document/source version; KPI definition/version.
- **Planning facts:** Demand Forecast by approved grain/scenario/version; production plan; inventory snapshot/plan; supply constraints; Procurement Plan and Asset Status dependency snapshots.
- **Quality/governance facts:** dataset quality results, matched/unmatched key counts, lineage, architecture inventory/disposition and standards findings, knowledge retrieval/citation/ACL evaluation results.
- **Common metadata:** request/workflow/trace ID, agent and schema version, source reference/version/as-of, classification, UoM/currency, approval status and exception state.

## 3. KPI Data Flow

1. Ingest read-only, versioned source snapshots; retain source/as-of identifiers.
2. Data Analytics validates schema, grain, freshness, keys, units, access and lineage; publish quality findings and governed data references.
3. Demand Planning emits versioned baseline/scenario facts. Accuracy measures join aligned actuals only when available; otherwise MAPE/bias remain unavailable.
4. Supply Planning combines an approved forecast with compatible production, inventory, constraints and valid dependency snapshots; emit plan/gap/constraint facts with mock/live provenance.
5. Architecture and Knowledge outputs contribute evidence/quality indicators (inventory coverage, standards findings, citation coverage), not inferred business transactions.
6. KPI semantic layer applies versioned formulas from `dashboard_kpi_model.md`; attach target/threshold status and approval state. Unsupported or unapproved calculations remain unavailable/conditional.

## 4. Agent Data Flow

`Read-only sources -> Data Analytics quality/lineage gate -> curated references -> Demand Planning forecast -> human approval -> Supply Planning alternatives -> KPI aggregation -> dashboard views`

Knowledge Repository provides ACL-filtered, cited context to approved consumers. Enterprise Architecture provides evidence-backed landscape/standards findings when needed for transformation views. The workflow/router carries correlation IDs, source versions and approval state. Demand-to-Supply events and Procurement Plan/Asset Status are fixture/mock contracts until owners approve real integrations. No dashboard path performs SAP writes.

## 5. Aggregation Layer

- Build a governed, read-only semantic/aggregation layer over validated agent outputs and source snapshots.
- Aggregate only at declared grain and compatible period, key and UoM; preserve Product/Material distinction and explicit crosswalk coverage.
- Store KPI formula/definition version, target, alert threshold, data-as-of, source lineage, measure status (`measured`, `conditional`, `unavailable`) and exception counts with each result.
- Keep raw facts, normalized facts and aggregates distinguishable; do not silently impute missing values or mix synthetic fixtures with verified production facts.
- Enforce source ACL/classification and expose only authorized aggregates and drill-through references.

## 6. Dashboard Data Model

Use conformed dimensions for Period, Product, Customer, Region, Plant, Business Unit and Source/Version, with Material kept separate. Store versioned fact sets for:

- `FactDemandForecast`: scenario, forecast version, quantity, UoM, method and approval status.
- `FactSupplyPlan`: planned supply, available inventory, shortage/surplus, constraint impacts and feasibility by Product/Plant/Period/UoM.
- `FactDataQuality`: evaluated/matched counts, rule results, severity and lineage coverage.
- `FactArchitectureInventory`: assessed applications/interfaces, lifecycle/standards status and evidence freshness.
- `FactKnowledgeEvaluation`: retrieval/citation coverage, ACL result and freshness/conflict status.
- `FactKPI`: KPI ID/definition version, value, target, threshold status, period, source versions and availability status.

These are logical model names for implementation, not existing deployed tables. Finance outcome facts require separately approved Finance sources.

## 7. Reporting Views

- **Executive:** Revenue Growth/EBITDA only when approved Finance feeds are connected; otherwise display unavailable with dependency status. Show verified planning summaries only with explicit caveats.
- **Planning:** Forecast/scenario comparison, demand-supply gap, supply throughput/attainment, constraint and inventory exposure, approval state and data coverage.
- **Operational:** Data quality completeness, lineage coverage, source freshness, Knowledge citation coverage and access/exception status.
- **Transformation:** Application inventory/disposition coverage, unsupported/EOL exposure, standards compliance and evidence freshness.

Every view should show reporting period, last refresh/as-of, source/version, KPI definition, target status and conditional/unavailable indicators. Drill-through must respect ACLs.

## 8. Refresh Strategy

- **Initial testing:** deterministic, manually or CI-triggered snapshot loads with pinned fixture/source versions and reproducible KPI calculations.
- **Planning views:** refresh per approved planning cycle or forecast/supply-plan version; refresh dependent aggregates only after schema, quality and approval gates pass.
- **Operational and knowledge views:** refresh on validated source/index refresh; display source freshness and stale-state warnings.
- **Architecture views:** refresh when approved inventory/standards snapshots or lifecycle evidence change.
- **Production cadence:** not defined in source artifacts. Set schedules, event triggers, latency targets, retention and late-arriving-data rules with source owners after runtime/connectors are selected.
- Preserve prior versions for comparison and audit; corrections create a new version. Failed, stale or partial refreshes must not replace the last valid view silently.

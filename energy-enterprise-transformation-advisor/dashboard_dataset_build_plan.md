# Dashboard Dataset Build Plan

**Dataset Readiness Assessment:** Logical structures are defined, but implementation readiness is conditional. Sources are synthetic/proposed snapshots; production feeds, complete dictionaries, some actuals, approved KPI formulas/thresholds and refresh SLAs are not established. Build versioned read-only datasets first and represent unavailable values as unavailable, not zero.

## 1. Dataset Name: Conformed Dimensions

- **2. Data Sources:** Approved master-data snapshots and source/version metadata described by the dashboard data architecture.
- **3. Required Fields:** Period/calendar key and type; Product_ID; Material_ID kept distinct from Product_ID; Customer_ID; Region_ID; Plant_ID; Business_Unit_ID; source/system ID; source version/as-of; mapping status. Include only dimensions required by the selected KPI grain.
- **4. Aggregations:** No measures. Provide approved rollups only; retain canonical keys and unmatched/mapping status.
- **5. Refresh Frequency:** Per approved master/reference snapshot; cadence TBD with data owners.
- **6. Data Quality Rules:** Unique canonical keys; effective period and source version present; explicit crosswalks only; no inferred Product/Material, Region/Plant or zone equivalence.
- **7. Reporting Usage:** Shared filter/drill dimensions for executive, operational, planning and transformation views.

## 2. Dataset Name: FactDemandForecast

- **2. Data Sources:** Versioned Demand Forecast output; source fixtures identified in the KPI model/architecture include `demand_forecast.csv`, `demand_scenarios.csv` and `sales_forecast.csv`.
- **3. Required Fields:** Forecast_ID/version; scenario_ID; Period; Product_ID; optional Customer_ID/Region_ID; quantity/UoM; method/parameter version; source/as-of; approval status; quality/availability status. Aligned actual quantity is optional and required for accuracy metrics.
- **4. Aggregations:** Sum quantities only at compatible Product/Customer/Region/Period grain and same UoM/scenario/version. Calculate MAPE/bias only with aligned actuals and approved formulas.
- **5. Refresh Frequency:** Per approved forecast version/planning cycle; not a fixed schedule.
- **6. Data Quality Rules:** Required dictionary/schema, explicit scenario semantics, valid period/grain/key/UoM, source freshness and approved conversion. Missing actuals make accuracy unavailable; do not treat scenario delta as error.
- **7. Reporting Usage:** Planning baseline/scenario comparison, forecast MAPE/bias when supported, demand-side input to gap views.

## 3. Dataset Name: FactSupplyPlan

- **2. Data Sources:** Supply forecast/plan outputs plus production, inventory, constraint and dependency snapshots; architecture names `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv` and Procurement Plan/Asset Status mocks.
- **3. Required Fields:** Plan_ID/version; forecast reference/version; Product_ID and separate Material_ID; Plant_ID; Period; planned supply; available inventory; shortage/surplus; constraint impacts; UoM; feasibility/approval status; source/as-of and mock/live provenance.
- **4. Aggregations:** Sum quantities by compatible Product/Material/Plant/Period/UoM; compute demand-supply gap only after key, period and unit alignment. Do not aggregate incompatible constraints or mock/live facts without explicit rules.
- **5. Refresh Frequency:** Per validated planning run/plan version and dependency update; fixed cadence TBD.
- **6. Data Quality Rules:** Require valid forecast, source versions, canonical keys, current inventory/dependency status, approved calendar/UoM and constraint semantics. Missing stock is not zero; stale Asset Status or invalid Procurement Plan blocks affected scope.
- **7. Reporting Usage:** Planning alternatives, demand-supply gap, throughput/attainment where defined, shortage/surplus and constraint alerts.

## 4. Dataset Name: FactDataQuality

- **2. Data Sources:** Data Analytics quality, lineage and catalog outputs from source snapshots and governed data products.
- **3. Required Fields:** Dataset/source ID and version; evaluation/run ID; period/as-of; rule ID/version; evaluated, valid, invalid, matched and unmatched counts; completeness/validity/freshness result; lineage coverage; severity; remediation owner; status.
- **4. Aggregations:** Counts/rates by source, rule, domain and period using declared denominators; preserve row-level exceptions behind authorized drill-through.
- **5. Refresh Frequency:** Per ingestion/data-product refresh and quality evaluation.
- **6. Data Quality Rules:** Rule/schema version and denominator required; counts reconcile to evaluated population; no duplicate counting across rule groups; missing metrics are unavailable, not zero.
- **7. Reporting Usage:** Operational data trust, completeness, lineage coverage, source freshness and blocking data alerts.

## 5. Dataset Name: FactArchitectureInventory

- **2. Data Sources:** Approved application, integration and technology inventory snapshots and standards evidence.
- **3. Required Fields:** Application/interface ID; source/version/as-of; owner; system/release/environment where verified; lifecycle evidence/status; disposition; standard assessment/exception status; evidence freshness; fact/assumption/unknown marker.
- **4. Aggregations:** Count/share assessed, dispositioned or verified unsupported/EOL items over an explicitly declared scope; do not count unknown as compliant or unsupported.
- **5. Refresh Frequency:** Per approved inventory/standards snapshot or lifecycle change; cadence TBD.
- **6. Data Quality Rules:** Evidence source/date and scope required; distinguish absent from unknown; stale/conflicting inventory flagged; no inferred deployed system or lifecycle date.
- **7. Reporting Usage:** Transformation status, inventory/disposition coverage, verified unsupported/EOL exposure and standards compliance.

## 6. Dataset Name: FactKnowledgeEvaluation

- **2. Data Sources:** Approved Knowledge Repository retrieval/index metadata, citation resolver and evaluation results.
- **3. Required Fields:** Evaluation/run ID; query class (avoid sensitive raw query where unnecessary); document/source ID and version; ACL outcome; publication/freshness/conflict status; citation resolution/authorization result; answer status; timestamp.
- **4. Aggregations:** Resolvable authorized citations / factual answers in the agreed evaluation set; freshness/conflict/access-denial counts by period and source. Do not expose restricted passages in aggregates.
- **5. Refresh Frequency:** Per approved index/source refresh and evaluation release; query-level status on demand.
- **6. Data Quality Rules:** ACL checked before retrieval; citations resolve to authorized versions; stale/conflicting sources surfaced; evaluation population and denominator versioned.
- **7. Reporting Usage:** Operational citation coverage, source freshness, knowledge quality and access-control alerts.

## 7. Dataset Name: FactKPI

- **2. Data Sources:** Governed measures from the preceding facts plus the KPI catalog definitions, targets and thresholds.
- **3. Required Fields:** KPI_ID/name; definition/formula version; value/unit; reporting period/grain; target; alert threshold/status; availability (`measured`, `conditional`, `unavailable`); source dataset/version/as-of; owner and approval status.
- **4. Aggregations:** Apply only the approved KPI formula and compatible dimensions; retain numerator/denominator and source references where applicable. Never average ratios or combine grains unless the KPI definition allows it.
- **5. Refresh Frequency:** Recompute when a contributing fact version or approved KPI definition changes; cadence follows the source dataset.
- **6. Data Quality Rules:** Formula, owner, denominator, target and threshold must be versioned/approved. Mark missing Finance sources, forecast actuals, or supply actuals unavailable; do not substitute zero or silently use illustrative targets.
- **7. Reporting Usage:** Shared semantic/reporting dataset for Executive, Operational, Planning and Transformation views, with target/alert and source traceability.

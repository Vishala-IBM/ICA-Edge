# Dashboard KPI Model

## Executive KPIs

| KPI Name | KPI Description | Agent Owner | Data Source | Calculation Logic | Reporting Frequency | Dashboard Category | Target Value | Alert Threshold |
|---|---|---|---|---|---|---|---|---|
| Revenue Growth Rate | Year-over-year revenue change. | Corporate Strategy (business owner; outside MVP); Data Analytics may provide governed data only. | Financial reports and revenue data; not supplied by the five MVP agents. | `((current revenue - previous revenue) / previous revenue) * 100`; denominator and currency/period must reconcile. | Monthly/quarterly cadence to be set by Finance. | Executive | 10% YoY (Enterprise KPI Model). | Below 10% target; proposed alert pending owner approval. KPI unavailable until Finance data is connected. |
| EBITDA Margin | Executive profitability measure. | Finance (outside MVP); Data Analytics may provide governed data only. | Finance actuals/revenue and operating-cost data; not supplied by the five MVP agents. | EBITDA / revenue * 100; exact account mapping and formula require Finance approval. | Finance close cadence; TBD. | Executive | 25% (Enterprise KPI Model). | Below target; proposed alert pending Finance approval. Block until source and formula are approved. |

## Planning KPIs

| KPI Name | KPI Description | Agent Owner | Data Source | Calculation Logic | Reporting Frequency | Dashboard Category | Target Value | Alert Threshold |
|---|---|---|---|---|---|---|---|---|
| Forecast MAPE | Forecast error against actual demand. | Demand Planning | Versioned forecast plus aligned actuals/holdout; actuals are an identified prerequisite, not currently established. | Candidate: mean absolute percentage error at matching grain/period/UoM; zero-actual treatment requires approval. | Per planning/backtest cycle. | Planning | Owner-approved tolerance; not defined. | Above approved tolerance; unavailable until aligned actuals and formula exist. |
| Signed Forecast Bias | Direction and magnitude of forecast over/under-shoot. | Demand Planning | Forecast and aligned actuals. | Candidate: aggregate forecast minus actual, normalized by aggregate actual; sign convention and aggregation require approval. | Per planning/backtest cycle. | Planning | Owner-approved tolerance; not defined. | Outside approved bias band; otherwise unavailable. |
| Demand-Supply Gap | Difference between demand and planned/available supply. | Demand Planning + Supply Planning | Approved versioned Demand Forecast; Supply Planning production, inventory and constraint inputs. | Demand minus compatible planned/available supply, only after Product/Material, Plant, period, grain and UoM alignment. | Each planning run/cycle. | Planning | No target in source artifacts; set by planner/S&OP owner. | >20% variance to an agreed reference triggers human review; comparison basis must be approved. |
| Supply Plan Attainment | Actual supply delivered versus approved plan. | Supply Planning | Approved supply plan plus actual production/supply facts; actuals are not established by the MVP fixtures. | Actual supply / approved plan * 100 at approved grain and period; treatment of cancellations/late supply requires owner definition. | Per planning cycle/period close; TBD. | Planning | Owner-approved; not defined. | Outside owner-approved tolerance; unavailable without actuals. |
| Supply Chain Throughput | Throughput versus capacity or plan. | Supply Planning | Production plan and validated production/capacity data. | Denominator and time basis require owner approval; do not infer capacity from plan quantity. | Per planning period; TBD. | Planning | 95% (Enterprise KPI Model; illustrative only). | Below approved target; alert is provisional until plant owner approves formula and target. |

## Operational KPIs

| KPI Name | KPI Description | Agent Owner | Data Source | Calculation Logic | Reporting Frequency | Dashboard Category | Target Value | Alert Threshold |
|---|---|---|---|---|---|---|---|---|
| Data Quality Completeness | Completeness of records/required fields in governed data products. | Data Analytics | `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`, relevant master/domain snapshots. | Valid populated required fields / evaluated required fields; rule, grain and denominator are versioned per data product. | Per ingestion/refresh. | Operational | Owner-approved rule; not defined. | Breach of owner-approved rule; missing/invalid key or UoM blocks dependent calculation. |
| Lineage Coverage | Share of published measures/data products with traceable sources. | Data Analytics | Catalog, lineage and source metadata returned by Data Analytics. | Measures/data products with complete source/version lineage / total in scope; scope definition requires owner approval. | Per data-product refresh. | Operational | Owner-approved; not defined. | Missing lineage for a published measure; threshold to be approved. |
| Citation Coverage | Golden factual answers with resolvable source citations. | Knowledge Repository | Approved document corpus, citation resolver and evaluation set. | Resolvable authorized citations / factual answers in the agreed golden set. | Per evaluation/index release; query-level status available on demand. | Operational | At least 95% on the MVP golden suite. | Below 95%; any ACL leakage or unresolved citation is a release-blocking failure. |

## Transformation KPIs

| KPI Name | KPI Description | Agent Owner | Data Source | Calculation Logic | Reporting Frequency | Dashboard Category | Target Value | Alert Threshold |
|---|---|---|---|---|---|---|---|---|
| Application Inventory/Disposition Coverage | Coverage of applications with validated inventory and disposition status. | Enterprise Architecture | `application_inventory.csv`, actual customer inventory when approved. | Applications with current owner, lifecycle evidence and disposition / applications in agreed scope. | Per inventory refresh or architecture review. | Transformation | Owner-approved; not defined. | Stale or missing evidence/owner; threshold and scope require approval. |
| Unsupported/EOL Technology Exposure | Applications or interfaces using technology with verified unsupported/end-of-life status. | Enterprise Architecture | Application, integration and technology standards inventories with dated lifecycle evidence. | Count or share of in-scope applications/interfaces with verified unsupported/EOL exposure; denominator must be declared. | Per inventory refresh or lifecycle change. | Transformation | No approved target in source artifacts. | Any verified critical exposure should be routed for review; criticality rule requires owner approval. |
| Architecture Standards Compliance | Conformance of in-scope applications/interfaces to approved standards. | Enterprise Architecture | `technology_standards.csv`, application and integration inventories. | Conforming assessed items / assessed items; exceptions remain separately visible and require approved status. | Per architecture review/release. | Transformation | Owner-approved; not defined. | Unapproved exception or compliance below approved threshold. |

## KPI Prioritization

1. **P0 - Data trust and controls:** Data Quality Completeness, Lineage Coverage and Citation Coverage. These determine whether dashboard facts are sufficiently grounded and permission-safe.
2. **P1 - Planning decisions:** Demand-Supply Gap, forecast error/bias and Supply Chain Throughput. Enable only after dictionary, actuals, compatible keys/UoM and owner-approved formulas are available.
3. **P2 - Transformation oversight:** Inventory/disposition coverage, unsupported/EOL exposure and standards compliance after actual landscape evidence is validated.
4. **P3 - Executive outcomes:** Revenue Growth Rate and EBITDA Margin remain blocked from MVP-only reporting until Finance sources, ownership, reconciliation and formula approval are provided.

## Dashboard Readiness Assessment

**Overall: Low / conditional.** Agent outputs can support fixture-backed data-quality, citation, architecture-inventory and planning views, but the dashboard model is not production-ready. Demand accuracy lacks aligned actuals and approved semantics; supply KPIs lack validated actuals/capacity, Material_ID and complete UoM/calendar references; several KPI formulas, owners, reporting cadences and alert thresholds remain unapproved. Revenue Growth and EBITDA Margin require non-MVP Finance inputs. The 95% citation criterion is an MVP test target; Supply Chain Throughput's 95% target is explicitly illustrative. Treat unavailable measures as unavailable, not zero, and expose source/version, period, unit and approval status with every reported value.

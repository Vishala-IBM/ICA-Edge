# Skill: Asset Reliability Agent

## Description
Supports asset lifecycle management, condition monitoring, reliability engineering, and maintenance planning for energy equipment and facilities. It prioritizes evidence-based maintenance recommendations and does not authorize or execute field work.

## Applicable Domains
Asset management, predictive/condition-based maintenance, reliability engineering, work management, asset integrity, maintenance cost, and critical spares.

## Purpose and Scope
Use for asset health, failure and downtime analysis, RCM/criticality, maintenance plan/backlog, remaining useful life, and replacement-versus-repair analysis. Procurement owns purchasing; HSE owns incident investigations; operations owns process control.

## Business Capabilities
- Predict failures and anomalies from condition/sensor/SCADA data; estimate remaining useful life.
- FMECA, RCM, root cause/fault-tree analysis, criticality, MTBF/MTTR, and bad-actor identification.
- Prioritize preventive/corrective work, schedule labor/parts, manage backlog, and plan lifecycle CAPEX.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Asset/equipment and functional location | `Asset_ID`, type, site/plant/facility, hierarchy, manufacturer, install date, criticality, status, replacement value | `sample-data/asset_master.csv`; master assets/facilities/plants |
| Work order / maintenance operation | Order, type, priority, dates/status, labor/material/contractor cost, asset, site | `maintenance_history.csv`; PM01-PM05 order types in data dictionary |
| Failure / notification | Failure mode/cause/severity/date, downtime, detection, work-order and asset link | `failure_analysis.csv`; HSE incidents can reference Asset_ID/work order |
| Condition measurement / sensor | Tag, timestamp, value/unit, limit, signal quality, asset mapping | README capability; historian/SCADA source; not included as raw series in sample files |
| Spare part / reservation | Material, quantity, plant/storage, lead time, work-order requirement | Warehouse and Procurement; material master gap |

## KPIs
| KPI | Definition / use |
|---|---|
| MTBF | Operating time / count of relevant failures; define asset population and failure class. |
| MTTR | Total repair time / count of completed repairs; distinguish elapsed and labor hours. |
| Asset availability | Available operating time / scheduled time; define planned downtime treatment. |
| Unplanned downtime | Failure-related downtime hours by asset/site and period. |
| Preventive maintenance compliance | PM work completed by due date / PM work due. |
| Maintenance cost / asset | Eligible labor + material + contractor cost divided by asset or operating hours. |
| Repeat-failure / bad-actor rate | Repeat failures within defined window / assets or work orders. |

Enterprise KPI model has generic Asset Utilization (90% illustrative target); do not equate it with availability without approval. Data dictionary defines work-order costs and failure linkage.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Technical asset hierarchy | Equipment `EQUI`, functional location `IFLOT`, classes/characteristics, plant `T001W` | S/4HANA EAM equipment/functional locations and Asset Performance Management; map to conformed `Asset_ID`. |
| Notifications and work orders | PM notifications `QMEL`; order header `AUFK`/`AFIH`, operations `AFVC`, confirmations `AFRU`, components `RESB` | S/4HANA EAM maintenance notifications/orders/operations and released APIs; APM/condition-based maintenance where licensed. |
| Measurement points and counters | Measurement documents `IMRG`, measurement points `IMPTT` | EAM measurement documents/APIs; high-frequency vibration/condition analytics typically remain historian/third-party. |
| Materials and costs | `RESB`, material docs `MKPF`/`MSEG`, FI/CO postings | `MATDOC`, Universal Journal `ACDOCA`; integrate procurement/warehouse and Finance. |

The architecture reference says detailed vibration/condition analytics often require third-party tools. ECC table references are illustrative; avoid direct database writes.

## Agent Dependencies and Handoffs
- Upstream Operations and Refining Operations: asset availability and maintenance windows for production plans.
- Procurement: MRO and critical spares sourcing.
- HSE: integrity and process-safety risk context.
- Warehouse: part availability and inventory position.
- Supply Planning: Asset Status is an explicit event/input to Supply Planning in `../Agent_Interaction_Model.md`.

README interactions state the relationships; the central event contract names only Asset Status -> Supply Planning.

## Outputs and Escalation
Outputs: ranked asset health/maintenance exceptions, failure analysis, work-priority recommendations, spares forecast, lifecycle/capex options, and asset status feed. Escalate critical barrier/equipment degradation, safety-critical overdue work, uncertain failure diagnosis, and maintenance deferrals to accountable engineer/HSE/operations approvers.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../Agent_Interaction_Model.md`; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Predictive model outputs require validation and must not autonomously trigger safety-critical work.

## Version
1.0.0 (initial skill; thresholds, sensor mappings, and SAP maintenance configuration require validation).

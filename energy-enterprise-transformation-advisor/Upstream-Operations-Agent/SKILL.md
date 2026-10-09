# Skill: Upstream Operations Agent

## Description
Provides operational intelligence for exploration and production, including wells, facilities, production performance, drilling, reserves, and field development. It supports engineering decisions and does not directly control SCADA or authorize field work.

## Applicable Domains
Upstream oil and gas, reservoir and production management, wells, drilling/completions, field facilities, reserves, and decommissioning.

## Purpose and Scope
Use for production surveillance, well/facility performance, decline and loss analysis, development scenarios, drilling/workover prioritization, and upstream production forecasts. Refining, midstream operations, and incident case ownership are outside scope.

## Business Capabilities
- Reservoir and production analysis, allocation, decline/reserves, EOR, and recovery scenarios.
- Well planning, drilling/completion/workover support, integrity, and intervention prioritization.
- Field development economics, facility capacity/debottlenecking, production forecasting, and decommissioning planning.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Well / wellbore | `Well_ID`, field, facility, status, type, completion, trajectory, dates | `sample-data/wells.csv` and drilling data; master guide recommends formal Well master |
| Facility / field / plant | Facility key, location/region, capacity, ownership, operating status | `production_metrics.csv`; master `facilities.csv`, `plants.csv` |
| Production measurement | Well/facility, product/stream, period, gross/net volume, UoM, downtime/allocations | `production_metrics.csv`; production process mapping |
| Reserves / resource / scenario | Category (1P/2P/3P), effective date, recoverable volume, economics, assumptions | README scope; detailed reserves schema not established by the cited dictionary |
| Drilling operation / contractor / cost | Well, rig, contractor, operation, dates, cost, NPT, safety and status | `drilling_operations.csv`; contractor not in supplier master per master-data guide |
| Asset / work order / incident | Facility/equipment key, availability, failure, work and safety context | Asset Reliability and HSE datasets |
| Business unit / ownership | Operating BU, working interest, partner/JV, operator, region | Master business units/facilities; JVA context |

## KPIs
| KPI | Definition / use |
|---|---|
| Production vs plan | Actual production / approved plan by well, facility, stream, and period. |
| Production efficiency / uptime | Producing time or actual output relative to defined available time/capacity. |
| Decline rate | Period-over-period normalized production decline; control for downtime, season, and well changes. |
| Lifting cost per boe | Eligible operating cost / net produced boe; specify royalty/JV and cost boundary. |
| Recovery factor / reserves replacement | Produced/recoverable resource or reserves additions/production; engineering-approved definitions required. |
| Drilling performance | Cost per well/foot, days per well, and nonproductive time; stratify by well type and phase. |

No upstream targets are prescribed in the shared KPI model. Production/reserves and cost definitions require petroleum engineering/Finance sign-off.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Production and revenue accounting | IS-Oil Production and Revenue Accounting (PRA), JVA; FI/CO postings | IS-Oil PRA and Joint Venture Accounting where licensed; production/entitlement facts integrated through released APIs or Datasphere. |
| Drilling capital / AFE | Project System (`PROJ`/`PRPS`), internal orders, CAPEX commitments | S/4HANA Project System and investment/project cost objects; AFE workflow/process data may remain specialist. |
| Equipment/facility context | PM equipment `EQUI`, functional location `IFLOT`; plant `T001W` | S/4HANA EAM/functional locations and conformed facility/well keys. |
| Well, reservoir, drilling, real-time production | No universal standard ECC well/reservoir object assumed | Often specialist upstream applications and historian/SCADA; SAP reference identifies reservoir modelling, well planning, and production allocation as non-SAP capabilities. Integrate governed summaries, not control loops. |

Specific IS-Oil/PRA/JVA scope and migration simplifications must be validated for the customer release; avoid inventing table-level mappings for specialist subsystems.

## Agent Dependencies and Handoffs
- Asset Reliability: equipment health and failure status for production planning; Asset Status -> Supply Planning is an explicit interaction-model event (the upstream-to-asset direction is a README relationship).
- Finance: volumes, lifting costs, and CAPEX economics.
- Supply Planning: crude availability/feedstock requirements.
- HSE: safety and environmental constraints and incident learnings.

Only Asset Reliability -> Supply Planning is a confirmed event contract; other dependencies are README-level coordination.

## Outputs and Escalation
Outputs: production and loss analysis, well/facility exception list, forecast, intervention/development options, and economics with assumptions. Escalate safety-critical integrity, barrier failures, production allocation uncertainty, reserves classifications, and field-control actions to authorized engineers/operators.

## Assumptions and Source References
Sources: this folder's `README.md` and `sample-data/`; `../enterprise_process_model.md`; `../Agent_Interaction_Model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Verify each CSV schema and real-time source; sample data is synthetic and does not replace reserves governance.

## Version
1.0.0 (initial skill; upstream SAP component and well-data ownership require validation).

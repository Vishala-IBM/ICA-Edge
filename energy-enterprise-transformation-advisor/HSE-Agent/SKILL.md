# Skill: HSE Agent

## Description
Supports health, safety, process-safety, and environmental risk management, compliance evidence, incident analysis, and emergency preparedness. It is an advisory/monitoring skill; it does not replace competent-person judgment, site emergency command, or legal reporting obligations.

## Applicable Domains
Process safety, occupational health and safety, environmental permits/events, incidents, audits, corrective actions, emergency response, and safety culture.

## Purpose and Scope
Use to classify/analyze incidents, identify hazards, trend leading/lagging indicators, track audits/actions, and assess operational HSE controls. ESG owns sustainability disclosures; Asset Reliability owns equipment reliability; both provide linked data.

## Business Capabilities
- HAZID/HAZOP/What-if/LOPA, barrier and SIS/SIL, MOC, permit-to-work, and process-safety monitoring.
- Incident/near-miss/observation reporting, investigation, root cause, corrective actions, occupational health and exposure.
- Environmental permit/spill/emission/waste compliance, audits, emergency plans/drills, and crisis readiness.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Incident / injury / spill | Incident_ID, site, date/type, actual/potential severity, API RP 754 tier, injury class, release, cause, regulator notification | `sample-data/incidents.csv` |
| Safety observation / action | Category, observation type, potential severity, site, action owner/status/due/close dates | `safety_observations.csv` |
| Audit / finding / requirement | Audit type, standard/regulation, location, finding severity, score, corrective action, due date/status | `compliance_audits.csv` |
| Site / asset / work order | Plant/facility, equipment, related maintenance, location, business unit | Master facilities/plants/assets; linked Asset Reliability records |
| Hazard / risk / barrier / permit | Hazard, scenario, control/barrier, likelihood/consequence, permit/MOC, owner, verification | Capability requirement; not fully modeled in samples |
| Environmental measurement | Air/emissions/water/waste, permit limit, period, location, source | ESG datasets and shared boundaries |

## KPIs
| KPI | Definition / use |
|---|---|
| Total Recordable Injury Rate (TRIR) | Recordable injuries x approved multiplier / hours worked; hours and recordability definitions required. |
| Lost Time Injury Frequency/Rate | Lost-time cases x approved multiplier / hours worked. |
| API RP 754 Tier 1/2 process-safety event rate | Count/rate by tier and denominator under the applicable edition and reporting boundary. |
| High-potential near-miss rate | High-potential events / hours or activity exposure; define reporting culture effects. |
| Corrective-action closure | Actions closed by due date / actions due; separate overdue and verified-effective actions. |
| Audit compliance score | Weighted requirements passed / assessed requirements; include severity and scope. |
| Environmental exceedance/spill rate | Permit exceedances or reportable events by approved denominator and period. |

The HSE sample dictionary describes event mixes and data links, but no hours-worked denominator file exists. Do not calculate rates without exposure denominators. The ESG sample claims selected last-12-month event counts; reconcile before reporting.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| HSE incidents and risk assessment | SAP EHS Management / incident and risk components where licensed; exact data model varies by version | S/4HANA EHS Incident Management and Risk Assessment; released APIs and site process configuration. |
| Work permits and operational safety | Work Clearance Management and PM/maintenance orders where deployed | Work Clearance Management, maintenance orders and Fiori workflows; integrate site permit systems. |
| Equipment and corrective maintenance | PM equipment `EQUI`, functional location `IFLOT`, notification `QMEL`, order `AUFK`/`AFIH` | EAM objects and APIs linked to incident/asset facts. |
| Environmental reporting | EHS/environmental management plus external monitoring | S/4HANA EHS with SAP Sustainability Control Tower/Footprint Management integration where deployed. |

Exact EHS capabilities vary between ECC add-ons and S/4HANA releases. API RP 754 tier calculations may require configuration/custom logic; validate legal requirements and avoid assuming a standard table.

## Agent Dependencies and Handoffs
- Asset Reliability: equipment integrity and maintenance data.
- ESG: environmental incidents/compliance evidence for disclosures.
- Upstream Operations: field hazards and operating controls.
- Logistics: dangerous-goods transport risks and route controls.
- Refining Operations: process safety, permits, operating changes.

README-level dependencies; no central HSE event contract is defined.

## Outputs and Escalation
Outputs: incident triage and trend analysis, hazard/control exception, audit/action status, environmental compliance alert, and drill/readiness summary. Immediately escalate imminent danger, major accident hazards, severe injury, uncontrolled release, permit exceedance, or regulator-notification decisions to site command/HSE/legal authorities. Do not delay emergency response for analysis.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. All sample incidents are synthetic and not a substitute for actual regulatory classification.

## Version
1.0.0 (initial skill; regulatory definitions, denominators, and SAP EHS scope require validation).

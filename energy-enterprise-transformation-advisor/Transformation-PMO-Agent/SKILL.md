# Skill: Transformation PMO Agent

## Description
Supports enterprise transformation governance, initiative portfolio management, milestone/status reporting, change readiness, and benefits realization. It provides decision support, not day-to-day project task management or financial approvals.

## Applicable Domains
Transformation program/portfolio management, governance, integrated planning, dependency/risk/issue management, benefits, change management, and executive reporting.

## Purpose and Scope
Use to translate strategic priorities into coordinated initiatives, track delivery and value, surface dependencies and risks, and support leadership governance. Execution detail for individual work packages and accounting/payment remain with delivery and Finance teams.

## Business Capabilities
- Program structures, integrated master plans, milestones, critical paths, governance forums, risks/issues, and escalation.
- Initiative prioritization, portfolio health/RAG, resource/capacity, rebalancing, and business cases.
- Benefits registers, leading/lagging measures, realization evidence, post-implementation reviews, and adoption/readiness.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Program / project / initiative | Project_ID, sponsor, owner, strategic theme, business unit, scope, status, priority, funding | `sample-data/project_portfolio.csv` and Strategy portfolio/roadmap |
| Workstream / milestone / dependency | Baseline/current dates, predecessor, critical path, deliverable, owner, status | README capabilities and process model |
| Risk / issue / decision / change | Description, probability/impact, action, due date, status, approver, linked initiative | README risk/issue and governance scope |
| Benefit / KPI / business case | Baseline, target, value/currency, realization date, source evidence, accountable owner | Finance + transformation benefit data |
| Resource / organization / stakeholder | Capacity, role, business unit, impact, readiness, engagement/training | Change management capabilities |
| Application / architecture dependency | Technology workstream, architecture milestone, target-state dependency | Enterprise Architecture handoff |

The exact sample-data dictionary is not present for this agent; validate field names before integration. Master-data guide recommends common Project_ID alignment across PMO, Strategy, and Finance.

## KPIs
| KPI | Definition / use |
|---|---|
| Milestone adherence | Milestones completed on/before baseline date / milestones due; report approved rebaselines separately. |
| Schedule performance index | Earned value / planned value; only when consistent earned-value data exists. |
| Cost performance index | Earned value / actual cost; align Finance and project-control rules. |
| Benefits realized | Validated cumulative benefit / approved benefit plan for the same period and scope. |
| Portfolio health | RAG distribution using approved schedule, cost, risk, and benefit thresholds. |
| Readiness/adoption | Assessed readiness or trained/adopting population / in-scope population; define survey and evidence. |
| Transformation ROI/payback | Approved net benefits relative to investment and timing; Finance validates methodology. |

Shared KPI model does not specify PMO targets. Avoid deriving earned value or benefits from status labels alone.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Project and work breakdown | Project System `PROJ`/`PRPS`, networks/activities and internal orders; financial postings in FI/CO | S/4HANA Project System and Portfolio and Project Management where deployed; milestones/costs via released APIs. |
| Initiative portfolio and investment | ECC investment management/PS, FI/CO | SAP PPM, SAC planning, S/4HANA PS; validate product fit/licensing. |
| Transformation tasks and releases | SAP Solution Manager or external PMO tooling | SAP Cloud ALM for implementation/operations lifecycle, SAP Signavio for process/change insights; external scheduling (e.g., Primavera) may remain. |
| Costs / benefits | CO postings and project actuals | Universal Journal `ACDOCA`, cost centers/profit centers; reconcile benefit measures with Finance. |

Repository SAP reference lists Cloud ALM, Signavio, PPM and PS, but detailed construction scheduling may use non-SAP Primavera P6.

## Agent Dependencies and Handoffs
- Corporate Strategy: approved priorities become initiatives.
- Finance: investment, actual cost, and validated benefits.
- Enterprise Architecture: architecture roadmap and technology dependencies.
- Knowledge Repository: lessons learned and reusable practices.
- Domain owners: delivery status, risks, adoption, and benefit evidence.

These are README interactions; no PMO-specific event payload is defined centrally.

## Outputs and Escalation
Outputs: integrated roadmap, portfolio health, critical path/dependency view, risk/decision log, benefit forecast/realization, change-readiness summary, and steering pack. Escalate missed critical milestones, funding/benefit changes, unresolved cross-program dependencies, high-impact risks, and scope/rebaseline requests to the governance body.

## Assumptions and Source References
Sources: this folder's `README.md` and sample data; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`; shared KPI/capability models. Synthetic portfolio values and status are not project-system records.

## Version
1.0.0 (initial skill; project controls and benefit-accounting rules require PMO/Finance validation).

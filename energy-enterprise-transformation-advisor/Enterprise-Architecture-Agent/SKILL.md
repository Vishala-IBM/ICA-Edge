# Skill: Enterprise Architecture Agent

## Description
Supports business, application, data, technology, integration, and cloud architecture strategy and governance for the energy enterprise. It makes recommendations and records decisions; it does not provision infrastructure or implement application code.

## Applicable Domains
Enterprise architecture, application portfolio, technology standards, integration/API/event patterns, cloud/hybrid architecture, architecture governance, and SAP modernization.

## Purpose and Scope
Use to map capabilities to applications/data/technology, define target-state patterns and roadmaps, rationalize portfolios, evaluate integration choices, and review architecture exceptions. Data Analytics owns analytical products; platform operations and software delivery remain with their teams.

## Business Capabilities
- Business capability/value-stream mapping; target architecture, principles, roadmaps, and governance.
- Application inventory/dependency/lifecycle, TIME disposition, technical debt, cloud migration, and buy/build decisions.
- Integration/API/event architecture, SAP ERP patterns, standards, vendor evaluation, and architecture review.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Application | Application_ID, name, domain/capability, owner, lifecycle, TIME disposition, fit, cost, users, hosting, SAP product | `sample-data/application_inventory.csv` |
| Technology standard | Technology, category, approval/status, replacement, sunset, rationale, usage | `technology_standards.csv` |
| Interface / integration | Interface ID, source/target, data object, protocol, pattern, middleware, frequency, SLA/error rate, criticality | `integration_inventory.csv` |
| Capability / process / organization | Capability owner, value stream, process, business unit, dependency | Shared capability/process models |
| Architecture decision/pattern | Decision, options, rationale, risk, status, owner, review date, linked systems | Knowledge Repository patterns/docs |
| SAP landscape / release | ECC/S/4 edition, modules, custom code, APIs/CDS, integration and migration status | `../sap_reference_architecture.md`; actual inventory absent |

## KPIs
| KPI | Definition / use |
|---|---|
| TIME disposition coverage | Applications with approved Tolerate/Invest/Migrate/Eliminate disposition / portfolio. |
| Application rationalization | Redundant or end-of-life apps retired/consolidated, with cost and risk tracked. |
| Standards compliance | In-scope applications/interfaces meeting approved standards / assessed population. |
| Integration reliability | Successful messages or calls / total; pair with latency, error rate, and criticality. |
| Architecture decision lead time | Time from complete review request to approved decision; separate elapsed/wait time. |
| Technical debt / lifecycle risk | Exposure from unsupported, prohibited, end-of-life, or low-fit technologies. |

Sample inventory includes status, fit, cost, support dates, errors and usage; no target thresholds are enterprise-approved.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| ERP application/process footprint | ECC 6.0 modules FI/CO, MM, SD, PM, PP, QM, IS-Oil, PRA, JVA; PI/PO, IDocs, custom Z code | S/4HANA private/on-prem/public edition, clean-core assessment, Simplification List, released CDS/OData/API. |
| Integration | SAP PI/PO, RFC/BAPI, IDoc, point-to-point | SAP Integration Suite (API Management, Cloud Integration, Event Mesh); released APIs and event-driven patterns. |
| Application/capability portfolio | Manually managed inventories; SAP Solution Manager where deployed | SAP LeanIX for application/technology architecture, SAP Signavio for process architecture, Cloud ALM for operations/transports. |
| Data/analytics architecture | BW on HANA/BusinessObjects extracts | SAP Datasphere/Business Data Cloud/SAC with governed spaces and data products. |
| ECC-to-S/4 migration | ECC configuration, Z-code, master data, PI/PO | Reference calls for brownfield as base assumption, but requires customer readiness assessment and validation. |

LeanIX/Signavio and target architecture components are recommendations in the SAP reference, not evidence they are deployed. Verify versions, licensing, interfaces, and actual application inventory.

## Agent Dependencies and Handoffs
- Data Analytics: data architecture and analytics integration standards.
- Transformation PMO: align roadmap initiatives and milestones.
- Corporate Strategy: translate business strategy into architecture requirements.
- Knowledge Repository: architecture decisions, patterns, and technical documentation.
- Domain agents: capability/process needs, operational constraints, and system owners.

Dependencies come from this README; central interaction model does not define architecture events.

## Outputs and Escalation
Outputs: current/target-state views, capability-to-application maps, portfolio dispositions, integration patterns, architecture decision records, standards exceptions, and migration roadmap. Escalate security, data residency, clean-core, unsupported technology, OT safety, and material scope/cost deviations to architecture/security/business governance.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../../sap-architecture-advisor/references/architecture-patterns.md`; `../../sap-architecture-advisor/references/technologies.md`. Repository SAP current state is illustrative and must be replaced with customer discovery.

## Version
1.0.0 (initial skill; target patterns and ECC migration decisions require architecture review).

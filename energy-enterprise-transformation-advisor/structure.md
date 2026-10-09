# Energy Enterprise Transformation Advisor: Repository Structure

## Overview

This guide describes the current layout of `energy-enterprise-transformation-advisor/`. It is maintained as a navigation aid; the on-disk files and the repository-root README are authoritative if the tree changes.

## Framework-Level Documents

| File | Purpose |
|---|---|
| [README.md](README.md) | Framework overview and 19-agent roster. |
| [SKILL.md](SKILL.md) | Master orchestrator scope, routing and response guidance. |
| [agent-template.md](agent-template.md) | Reusable standard for future agent README, SKILL and sample data. |
| [enterprise_process_model.md](enterprise_process_model.md) | Process hierarchy, ownership, process flows, handoffs and SAP process mapping. |
| [Enterprise_Capability_Model.md](Enterprise_Capability_Model.md) | Capability hierarchy, ownership and maturity model. |
| [Enterprise_KPI_Model.md](Enterprise_KPI_Model.md) | Enterprise KPI catalog, ownership, targets and selected formulas. |
| [Agent_Interaction_Model.md](Agent_Interaction_Model.md) | Explicit data contracts, event triggers, dependencies and escalation rules. |
| [entity_relationship_model.md](entity_relationship_model.md) | Core/master/transactional entities, ownership, relationships, cardinality and SAP mappings. |
| [agent_capability_matrix.md](agent_capability_matrix.md) | Per-agent processes, capabilities, KPIs, data entities, SAP modules and dependencies. |
| [agent_collaboration_patterns.md](agent_collaboration_patterns.md) | Cross-agent data, events, flows, decisions, escalations and orchestration. |
| [sap_reference_architecture.md](sap_reference_architecture.md) | Illustrative ECC baseline, S/4HANA target, integration/data architecture and migration view. |
| [master-data/](master-data/README.md) | Master-data landing page, CSVs, field dictionary and relationship coverage. |

## Agent Landscape

All 19 domain folders use the same baseline: `README.md` for the human-readable role, `SKILL.md` for operational instructions, and `sample-data/` for synthetic examples. Data dictionary files are included for 16 agents; Corporate Strategy, Demand Planning and Transformation PMO currently lack one, so dictionary documentation is part of the roadmap.

1. [Corporate-Strategy-Agent](Corporate-Strategy-Agent/README.md)
2. [Commercial-Marketing-Agent](Commercial-Marketing-Agent/README.md)
3. [Demand-Planning-Agent](Demand-Planning-Agent/README.md)
4. [Procurement-Agent](Procurement-Agent/README.md)
5. [Supply-Planning-Agent](Supply-Planning-Agent/README.md)
6. [Warehouse-Agent](Warehouse-Agent/README.md)
7. [Logistics-Agent](Logistics-Agent/README.md)
8. [Upstream-Operations-Agent](Upstream-Operations-Agent/README.md)
9. [Refining-Operations-Agent](Refining-Operations-Agent/README.md)
10. [Asset-Reliability-Agent](Asset-Reliability-Agent/README.md)
11. [Sales-Trading-Agent](Sales-Trading-Agent/README.md)
12. [Finance-Agent](Finance-Agent/README.md)
13. [ESG-Agent](ESG-Agent/README.md)
14. [Data-Analytics-Agent](Data-Analytics-Agent/README.md)
15. [Enterprise-Architecture-Agent](Enterprise-Architecture-Agent/README.md)
16. [Transformation-PMO-Agent](Transformation-PMO-Agent/README.md)
17. [HSE-Agent](HSE-Agent/README.md)
18. [Trading-Risk-Agent](Trading-Risk-Agent/README.md)
19. [Knowledge-Repository-Agent](Knowledge-Repository-Agent/README.md)

### Agent Folder Pattern

```text
[Agent-Name]-Agent/
├── README.md                  # Purpose, scope, capabilities and process boundaries
├── SKILL.md                   # Agent operating behavior, data, KPIs, SAP, dependencies
└── sample-data/
    ├── data_dictionary.md     # Expected for every agent with datasets
    └── *.csv                  # Synthetic examples; three per current agent
```

## Master Data Assets

`master-data/` contains nine current entity-master CSVs:

- `customers.csv` (`Customer_ID`)
- `suppliers.csv` (`Supplier_ID`)
- `products.csv` (`Product_ID`)
- `plants.csv` (`Plant_ID`)
- `facilities.csv` (`Facility_ID`)
- `warehouses.csv` (`Warehouse_ID`)
- `assets.csv` (`Asset_ID`)
- `regions.csv` (`Region_ID`)
- `business_units.csv` (`Business_Unit_ID`)

It also contains `bu_crosswalk.csv` for legacy business-unit mapping and `data_relationship_matrix.csv` for join coverage and unmatched values. Documentation: [master-data README](master-data/README.md), [detailed model](master-data/README_master_data_model.md), and [field dictionary](master-data/master_data_dictionary.md). Material, Cost Center/GL Account, Counterparty, Commodity/Benchmark, Ship-To, Carrier and other proposed entities are documented gaps, not current canonical CSVs.

## Agent Collaboration Artifacts

- [Agent_Interaction_Model.md](Agent_Interaction_Model.md): three explicitly defined input/event contracts into Supply Planning.
- [enterprise_process_model.md](enterprise_process_model.md): broader process handoff registry and end-to-end flows; validate its historical dataset references.
- [agent_collaboration_patterns.md](agent_collaboration_patterns.md): per-agent upstream/downstream relationships, triggers, data, decisions and orchestration opportunities.
- [agent_capability_matrix.md](agent_capability_matrix.md): compact all-agent comparison of process, capability, KPI, entities, SAP and dependency coverage.

Distinguish implemented contracts from proposed process handoffs and informal coordination. A relationship in documentation does not prove an interface is deployed.

## Naming and Maintenance Conventions

- Agent folders use PascalCase with hyphens and the `-Agent` suffix.
- Keep the established filename casing for enterprise model files; use lowercase hyphenated names for new general documents unless a repository convention already exists.
- Use canonical master IDs where present. Document aliases, join method, data grain, units, currency, nullability and coverage for non-ID relationships.
- Keep README, SKILL, sample-data dictionary, capability/KPI/interaction models and matrices synchronized when ownership, keys, processes or handoffs change.
- Follow the [agent-template.md](agent-template.md) acceptance criteria. Label synthetic data, proposed SAP mappings and illustrative KPI targets; do not present them as production-approved.

## Repository Context

At the ICA-Edge repository root, `sap-architecture-advisor/` is a separate SAP architecture skill with its own `README.md`, `SKILL.md`, and `references/`. The root `README.md` provides navigation across both advisor projects; `artifacts/` contains generated outputs.

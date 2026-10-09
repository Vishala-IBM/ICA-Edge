# ICA-Edge

## 1. Repository Overview

ICA-Edge is a documentation and reference workspace for AI-assisted enterprise transformation. It contains the Energy Enterprise Transformation Advisor, an SAP Architecture Advisor skill, synthetic sample data, architecture and process models, and generated reference artifacts.

The repository is primarily specifications and supporting data, not a deployable agent runtime. The static [`index.html`](index.html) is an artifact index; it currently reports that no artifacts are deployed. No application build, agent service, or deployment workflow is defined here.

| Area | Contents |
|---|---|
| `energy-enterprise-transformation-advisor/` | 19 energy-domain agent definitions, agent skills, synthetic sample data, master data, and enterprise models. |
| `sap-architecture-advisor/` | SAP architecture guidance skill and references for SAP/cloud technologies, patterns, and research. |
| `artifacts/` | Generated reference outputs in Markdown and HTML formats. |
| `index.html` | Static deployed-artifact listing. |
| `repository_completeness_report.md` | Dated documentation audit and weighted completeness rubric; its 80% score is a historical snapshot, not a live status indicator. |

## 2. Purpose of the Energy Enterprise Transformation Advisor

The Energy Enterprise Transformation Advisor is a multi-agent advisory framework for oil and gas, power, utilities, renewables, and related energy businesses. It organizes domain expertise across the enterprise value chain and supports assessments, process analysis, planning, architecture, SAP modernization, risk, and transformation decisions.

The framework describes agent roles, data needs, business KPIs, collaboration patterns, and SAP ECC/S/4HANA reference mappings. The sample CSVs are synthetic. SAP baselines and mappings are architectural hypotheses that must be validated against a real organization's releases, configuration, licensing, data, and controls before implementation.

Start with the [advisor overview](energy-enterprise-transformation-advisor/README.md), [master advisor skill](energy-enterprise-transformation-advisor/SKILL.md), and [repository structure guide](energy-enterprise-transformation-advisor/structure.md).

## 3. Agent Landscape

The advisor contains 19 domain agents. Each agent folder includes a human-readable `README.md`, an operational `SKILL.md`, and three synthetic sample CSVs; 16 of the 19 agent folders currently include a `sample-data/data_dictionary.md`.

| Agent | Business domain |
|---|---|
| [Corporate-Strategy-Agent](energy-enterprise-transformation-advisor/Corporate-Strategy-Agent/README.md) | Enterprise strategy, portfolio, M&A, capital allocation, and transition scenarios. |
| [Commercial-Marketing-Agent](energy-enterprise-transformation-advisor/Commercial-Marketing-Agent/README.md) | Market intelligence, customer segmentation, pricing, and commercial growth. |
| [Demand-Planning-Agent](energy-enterprise-transformation-advisor/Demand-Planning-Agent/README.md) | Demand forecasting, sensing, and S&OP demand alignment. |
| [Procurement-Agent](energy-enterprise-transformation-advisor/Procurement-Agent/README.md) | Strategic sourcing, supplier management, contracts, and spend. |
| [Supply-Planning-Agent](energy-enterprise-transformation-advisor/Supply-Planning-Agent/README.md) | Supply, production, inventory, and demand-supply planning. |
| [Warehouse-Agent](energy-enterprise-transformation-advisor/Warehouse-Agent/README.md) | Inventory, warehouse execution, storage, and spare-parts availability. |
| [Logistics-Agent](energy-enterprise-transformation-advisor/Logistics-Agent/README.md) | Transportation, freight, shipment visibility, and distribution. |
| [Upstream-Operations-Agent](energy-enterprise-transformation-advisor/Upstream-Operations-Agent/README.md) | Exploration, wells, drilling, production, and field operations. |
| [Refining-Operations-Agent](energy-enterprise-transformation-advisor/Refining-Operations-Agent/README.md) | Refinery throughput, process operations, yield, quality, and turnaround planning. |
| [Asset-Reliability-Agent](energy-enterprise-transformation-advisor/Asset-Reliability-Agent/README.md) | Asset lifecycle, maintenance, reliability, and failure analysis. |
| [Sales-Trading-Agent](energy-enterprise-transformation-advisor/Sales-Trading-Agent/README.md) | Physical commodity deals, orders, contracts, positions, and trading P&L. |
| [Finance-Agent](energy-enterprise-transformation-advisor/Finance-Agent/README.md) | FP&A, cost, profitability, CAPEX, and financial reporting. |
| [ESG-Agent](energy-enterprise-transformation-advisor/ESG-Agent/README.md) | Emissions, sustainability targets, ESG compliance, water, and disclosure. |
| [Data-Analytics-Agent](energy-enterprise-transformation-advisor/Data-Analytics-Agent/README.md) | Data governance, integration, analytics, BI, and AI/ML lifecycle. |
| [Enterprise-Architecture-Agent](energy-enterprise-transformation-advisor/Enterprise-Architecture-Agent/README.md) | Application, data, technology, integration, and target-state architecture. |
| [Transformation-PMO-Agent](energy-enterprise-transformation-advisor/Transformation-PMO-Agent/README.md) | Transformation portfolio, governance, milestones, change, and benefits. |
| [HSE-Agent](energy-enterprise-transformation-advisor/HSE-Agent/README.md) | Health, safety, process safety, environmental compliance, and incidents. |
| [Trading-Risk-Agent](energy-enterprise-transformation-advisor/Trading-Risk-Agent/README.md) | Market and credit risk, limits, hedging, stress tests, and risk reporting. |
| [Knowledge-Repository-Agent](energy-enterprise-transformation-advisor/Knowledge-Repository-Agent/README.md) | Documents, semantic retrieval, technical standards, and lessons learned. |

Each folder's `SKILL.md` describes the agent's data entities, KPIs, SAP references, dependencies, operating rules, and escalation limits. The common [agent template](energy-enterprise-transformation-advisor/agent-template.md) is the standard for future agents.

## 4. Enterprise Models

| Model | Purpose and current coverage |
|---|---|
| [Enterprise process model](energy-enterprise-transformation-advisor/enterprise_process_model.md) | Process hierarchy, ownership, six cross-agent process flows, 28 cataloged handoffs, dataset mapping, and SAP process mapping. Some dataset names/counts are historical and should be reconciled with current files. |
| [Enterprise capability model](energy-enterprise-transformation-advisor/Enterprise_Capability_Model.md) | Strategic/core/supporting capability framework; current ownership and agent mapping cover only a subset. |
| [Enterprise KPI model](energy-enterprise-transformation-advisor/Enterprise_KPI_Model.md) | Six high-level enterprise KPIs; formulas and ownership are defined for only part of the catalog. Targets are illustrative pending owner approval. |
| [Agent interaction model](energy-enterprise-transformation-advisor/Agent_Interaction_Model.md) | Three explicitly described data/event contracts into Supply Planning and two human escalation rules. This is narrower than the process model's handoff catalog. |
| [Entity relationship model](energy-enterprise-transformation-advisor/entity_relationship_model.md) | Core/master/transactional entities, ownership, relationships, cardinality, ECC/S/4HANA mappings, process flows, and governance recommendations. |
| [Agent capability matrix](energy-enterprise-transformation-advisor/agent_capability_matrix.md) | Capability, KPI, entity, SAP, and dependency summary for all 19 agents. |
| [Agent collaboration patterns](energy-enterprise-transformation-advisor/agent_collaboration_patterns.md) | Per-agent interaction details, end-to-end flows, decision points, escalation paths, orchestration, and migration impacts. |
| [SAP reference architecture](energy-enterprise-transformation-advisor/sap_reference_architecture.md) | Illustrative ECC baseline, S/4HANA target, BTP/data architecture, object mapping, and migration waves. Validate against an actual customer landscape. |

## 5. Master Data Architecture

The `energy-enterprise-transformation-advisor/master-data/` directory contains nine entity master CSVs, a BU crosswalk, and a machine-readable relationship/coverage matrix. The source data is synthetic and keyed to an integrated Canadian energy-company scenario.

| Master | Canonical key | Primary role |
|---|---|---|
| `customers.csv` | `Customer_ID` | Customer/account, region, segment, supply plant, and commercial terms. |
| `suppliers.csv` | `Supplier_ID` | Supplier identity, category, risk, qualification, and procurement summary. |
| `products.csv` | `Product_ID` | Product portfolio, category, owner, plant links, units, and SAP material attributes. |
| `plants.csv` | `Plant_ID` | Production, refining, processing, terminal, and supply locations. |
| `facilities.csv` | `Facility_ID` | Upstream facilities, pipeline systems, and other operating sites. |
| `warehouses.csv` | `Warehouse_ID` | Warehouse identity and plant/storage-location mapping. |
| `assets.csv` | `Asset_ID` | Equipment, functional location, criticality, status, and plant/facility links. |
| `regions.csv` | `Region_ID` | Geographic hierarchy plus pricing, logistics, and climate zones. |
| `business_units.csv` | `Business_Unit_ID` | Conformed reporting/ownership hierarchy across legacy BU labels. |

Supporting files: `bu_crosswalk.csv` maps source BU values using a composite source key; `data_relationship_matrix.csv` documents 85 joins, cardinalities, coverage, and unmatched values. Start with the [master-data landing page](energy-enterprise-transformation-advisor/master-data/README.md), then consult the [detailed model](energy-enterprise-transformation-advisor/master-data/README_master_data_model.md) and [field dictionary](energy-enterprise-transformation-advisor/master-data/master_data_dictionary.md).

Known data-model gaps include Material, Cost Center/GL Account, Counterparty, Commodity/Benchmark, Ship-To/Delivery Location, Carrier, Well, Project/Program, Contract, Employee/Organization/Role, Calendar/Period, and UoM/Currency. Product is not a substitute for every material; customer is not a ship-to; supplier is not automatically a carrier.

## 6. Entity Relationship Model

The [entity relationship model](energy-enterprise-transformation-advisor/entity_relationship_model.md) relates the nine current masters to agent facts such as orders, forecasts, purchase orders, inventory, production, maintenance, shipments, finance measures, incidents, emissions, projects, applications, and documents. It also records relationship grain, optional links, proposed master entities, and SAP ECC/S/4HANA mapping.

Use canonical IDs first. Some sample facts still join on names, legacy codes, province, or zone, and some relationships have partial coverage. Check `master-data/data_relationship_matrix.csv` and the data dictionaries before aggregating facts; the sample values are not production records.

## 7. Agent Collaboration Model

The [collaboration patterns](energy-enterprise-transformation-advisor/agent_collaboration_patterns.md) and [capability matrix](energy-enterprise-transformation-advisor/agent_capability_matrix.md) summarize upstream/downstream dependencies and shared data. The enterprise process model catalogs broader conceptual handoffs, including S&OP, procure-to-pay, maintenance-to-reliability, order-to-cash, incident-to-close, ESG reporting, and strategy-to-transformation.

Only three contracts are explicitly represented in the Agent Interaction Model: Demand Forecast, Procurement Plan, and Asset Status to Supply Planning. Treat other relationships as documented coordination or proposed process handoffs until owners define payloads, triggers, keys, SLAs, failure handling, and implementation status.

## 8. SAP ECC to S/4HANA Transformation Support

The SAP materials provide agent-oriented reference mappings, not a verified system inventory or project plan. The reference architecture assumes an illustrative ECC 6.0 baseline and recommends customer-specific validation.

| Transformation area | Typical impact described in this repository |
|---|---|
| Customer/supplier | Separate ECC customer/vendor masters move to Business Partner with CVI; cleanse and reconcile identities. |
| Product/material | Review the move from 18-character ECC material numbers to S/4HANA's longer material number and update integrations. |
| Finance | Universal Journal (`ACDOCA`) and new Asset Accounting require reconciliation and report redesign. |
| Inventory | Replace custom `MKPF`/`MSEG` reads with S/4HANA inventory document model (`MATDOC`) and supported interfaces. |
| Planning | Assess batch MRP/APO/spreadsheets against MRP Live and SAP IBP; harmonize planning keys and calendars. |
| Industry processes | Review IS-Oil, PRA, TSW, JVA, Commodity Management, TRM, and EHS simplification/availability for the target release. |
| Integration and custom code | Assess PI/PO, IDoc, RFC, point-to-point links, and Z-code; consider Integration Suite, event contracts, ATC, and clean-core extensions. |
| Analytics | Rationalize BW/BusinessObjects content and validate Datasphere/SAC or other target reporting models. |

The [SAP Architecture Advisor](sap-architecture-advisor/README.md) provides broader architecture guidance and technology references. Confirm SAP release, product scope, maintenance dates, licensing, APIs, and migration path with SAP and the customer's architecture owners before making commitments.

## 9. Repository Structure

```text
ICA-Edge/
├── README.md
├── index.html                         # Static artifact listing
├── repository_completeness_report.md  # Dated audit snapshot
├── artifacts/                         # Generated Markdown/HTML outputs
├── energy-enterprise-transformation-advisor/
│   ├── README.md, SKILL.md, structure.md, agent-template.md
│   ├── enterprise_process_model.md, Enterprise_Capability_Model.md
│   ├── Enterprise_KPI_Model.md, Agent_Interaction_Model.md
│   ├── entity_relationship_model.md, agent_capability_matrix.md
│   ├── agent_collaboration_patterns.md, sap_reference_architecture.md
│   ├── master-data/                   # Canonical synthetic masters and docs
│   └── [19]-Agent/                    # README, SKILL, sample-data
└── sap-architecture-advisor/
	├── README.md, SKILL.md
	└── references/                    # Patterns, technologies, search guidance
```

For the detailed advisor tree, see the current [structure guide](energy-enterprise-transformation-advisor/structure.md). It indexes all 19 agents, their README/SKILL/sample-data layout, master-data assets, and enterprise and collaboration models.

## 10. Getting Started Guide

1. **Understand the framework.** Read the [Energy Enterprise Transformation Advisor overview](energy-enterprise-transformation-advisor/README.md) and [master skill](energy-enterprise-transformation-advisor/SKILL.md).
2. **Choose a domain.** Use the agent landscape above, then read that agent's `README.md` and `SKILL.md` to check scope, dependencies, data, KPIs, SAP assumptions, and escalation rules.
3. **Inspect the evidence.** Review the agent's sample-data dictionary and CSVs, then the relevant master-data files and enterprise models. Three agents currently lack sample-data dictionaries: Corporate Strategy, Demand Planning, and Transformation PMO.
4. **Frame the request.** State the business objective, process, time period, organizational scope, available data, and desired output. For cross-functional work, name the related agents or process flow.
5. **Validate the result.** Check join coverage, KPI formulas, units/currency, synthetic-data caveats, approvals, and SAP release assumptions. Do not treat informal coordination as a deployed event contract.
6. **For SAP architecture work,** also read the [SAP Architecture Advisor skill](sap-architecture-advisor/SKILL.md) and its [technology references](sap-architecture-advisor/references/technologies.md), [architecture patterns](sap-architecture-advisor/references/architecture-patterns.md), and [search strategy](sap-architecture-advisor/references/search_strategy.md).

Example requests:

- “Compare the next-quarter demand forecast with plant and inventory constraints; list unmatched product/customer keys and escalate material shortages.”
- “Assess a maintenance backlog using the asset criticality, failure, work-order, and spare-stock samples. State which conclusions are limited by synthetic data.”
- “Map the order-to-cash flow to ECC and S/4HANA objects, identify BP/material migration impacts, and separate confirmed repository mappings from assumptions.”

There is no repository-wide install/build command or runnable multi-agent service documented at present. Use the files as reference definitions and synthetic examples; runtime orchestration and SAP connectivity require separate implementation.

## 11. Future Roadmap

These are proposed documentation and implementation priorities, not committed releases:

1. Complete data dictionaries for Corporate Strategy, Demand Planning, and Transformation PMO; reconcile counts and filenames in the process model.
2. Expand capability ownership and KPI formulas, targets, sources, and approval status across all 19 agents.
3. Reconcile the 28 process-model handoffs with the three explicit interaction contracts; define schemas, canonical keys, event triggers, owners, SLAs, replay, and escalation behavior.
4. Prioritize Material, Cost Center/GL, Counterparty, Commodity/Benchmark, Ship-To, and Carrier master design; improve relationship coverage and crosswalk quality.
5. Validate ECC/S/4HANA mappings against an actual customer release, license footprint, custom code, landscape inventory, and SAP simplification guidance.
6. If a runtime is introduced, define its orchestration interfaces, authorization model, API/event integrations, human approval workflow, evaluation data, monitoring, and deployment/test process before production use.

The completeness report is an audit snapshot dated 2026-10-09 and predates some documentation repairs. Re-run its scan and recalculate its rubric after roadmap work; do not present its original percentage as current repository health.

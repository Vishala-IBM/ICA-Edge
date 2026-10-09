# Skill: Data Analytics Agent

## Description
Provides governed data strategy, engineering, analytics, BI, AI/ML lifecycle, data products, quality, and master-data capabilities across energy domains. It enables domain agents and does not assume ownership of their operational decisions.

## Applicable Domains
Enterprise data governance, data engineering, analytics/BI, AI/ML, data products, integration, metadata, lineage, MDM, and analytics operations.

## Purpose and Scope
Use to define data products, source/target models, data quality controls, analytics, model lifecycle and governed access. Physical infrastructure/application portfolio ownership is with Enterprise Architecture; domain agents own business definitions and decisions.

## Business Capabilities
- Data strategy, stewardship, data quality, MDM, lineage, classification, and regulatory data controls.
- ETL/ELT, batch/stream integration, data lake/lakehouse, semantic/analytic models, and data products.
- BI, predictive/ML/NLP/GenAI, model serving/monitoring, catalog, and data marketplace.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Data source / application | Source_ID, system/owner/domain, interface, refresh, hosting, quality, criticality, status | `sample-data/datasource_inventory.csv`; EA application inventory |
| Data object / semantic model | Object_ID/name, layer, space, type, dependencies, source, owner, deployment, access controls | `datasphere_objects.csv` |
| Report / dashboard / analytic product | Report_ID, tool, domain, subject, source model, usage, duplicate/status, target disposition | `report_catalog.csv` |
| Dataset / entity / data contract | Canonical keys, schema, owner, quality rules, consumers, version, SLA | Agent sample data and master data; `../master-data/data_relationship_matrix.csv` |
| ML model / feature / prediction | Model/version, training data, features, owner, approval, metrics, drift, endpoint | Capability requirement; not fully represented in sample dataset |
| Data issue / lineage / access policy | Rule, failed record, impact, lineage, classification, approval, remediation | Datasphere dictionary and shared architecture design |

## KPIs
| KPI | Definition / use |
|---|---|
| Data quality score | Weighted completeness/validity/consistency/timeliness/uniqueness against declared rules; expose dimensions, not only a composite. |
| Freshness/SLA attainment | Loads meeting freshness/availability SLA / scheduled loads. |
| Pipeline success and latency | Successful runs / total runs; end-to-end ingestion-to-consumption delay. |
| Lineage coverage | Critical datasets with source-to-consumption lineage / critical datasets. |
| Model performance/drift | Domain-approved accuracy/error and drift measures versus deployment threshold. |
| Report rationalization | Retained/consolidated/retired duplicates and usage; use catalog's duplicate/status/usage fields. |
| Data product adoption | Active consumers or successful requests per published data product. |

Enterprise KPI model does not specify these platform measures; agree definitions/SLOs with data owners. The sample report catalog intentionally includes duplicates and stale/unused statuses.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| ERP data extraction | ECC tables/ODP, BAPI/RFC, IDoc; BW extractors and BW queries | S/4HANA released ABAP CDS/ODP and OData APIs; use delta-capable extraction and released interfaces. |
| Data modeling and governance | BW/4HANA InfoProviders/ADSO/CompositeProviders; legacy BusinessObjects | SAP Datasphere / Business Data Cloud spaces, analytic models, catalog and lineage; SAC for semantic analytics. |
| Operational facts | FI/CO, MM, SD, PM, PP, QM, IS-Oil sources | Map to CDS/VDM models, APIs and conformed IDs; validate S/4 simplifications such as `ACDOCA` and `MATDOC`. |
| AI/ML | SAP BW/legacy analytics and external platforms | SAP AI Core/Generative AI Hub where selected; specialist platforms can remain external with governance. |

SAP object references are integration examples, not permission to query production tables directly. Prefer released CDS/API and Datasphere governance; confirm data product and licensing roadmap.

## Agent Dependencies and Handoffs
- Enterprise Architecture: data architecture, integration, standards, and source inventory.
- Knowledge Repository: cataloged data assets, lineage, and knowledge retrieval.
- Finance: financial data products and reporting.
- All domain agents: requirements, definitions, source stewardship, and consumption feedback.
- ESG, HSE, and operational agents: source facts and quality ownership.

The README describes a shared analytics service; define dataset-specific owners and contracts rather than making Data Analytics the business owner of all source data.

## Outputs and Escalation
Outputs: governed data product/model, lineage/catalog entry, quality report, dashboard/analysis, deployed model card, and remediation plan. Escalate PII/security violations, unauthorized access, material data defects, model degradation/bias, and broken critical reporting SLAs to data owners/security/model risk owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../sap-architecture-advisor/references/technologies.md`. Datasphere layers/names are synthetic examples and architecture proposals, not deployed facts.

## Version
1.0.0 (initial skill; data governance, toolchain, and SLOs require enterprise validation).

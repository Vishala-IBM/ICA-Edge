# Skill: Knowledge Repository Agent

## Description
Captures, governs, searches, and recommends institutional knowledge, controlled documents, technical standards, architecture patterns, and lessons learned. It improves retrieval and reuse but does not replace authoritative records, legal review, or document custodians.

## Applicable Domains
Enterprise search, document intelligence, knowledge capture, technical content governance, taxonomy/ontology, lessons learned, standards, and expert discovery.

## Purpose and Scope
Use to locate and summarize approved knowledge, classify and connect documents, identify stale/restricted content, and capture lessons/practices. Out of scope: storage infrastructure administration, legal contract ownership, and finance record/audit retention decisions.

## Business Capabilities
- Document ingestion, classification, metadata, review/approval, versioning, retention and lifecycle.
- Semantic search, natural-language retrieval, recommendation, cross-domain linking and knowledge graphs.
- Structured lessons learned, best-practice reuse, expert locator, communities of practice, and knowledge-gap analysis.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Document / version | Document_ID, title, source, type, domain, related agent/system, classification, status, dates, review cycle | `sample-data/document_catalog.csv` |
| Architecture pattern / technology | Pattern_ID, intent, domain, technologies, SAP coverage, status, owner, review, source document | `architecture_patterns.csv`; EA standards |
| Best practice / process / KPI | Practice_ID, process area, control/governance/technology type, KPI, source standard, SAP support, maturity | `best_practices.csv` |
| Taxonomy / tag / entity link | Domain, agent, capability, asset/site, system, KPI, source link and confidence | Sample metadata and enterprise models |
| Lesson / expertise / community | Context, cause, outcome, recommendation, evidence, owner, access, review | Capability described in README; detailed lesson schema not supplied |
| Access / provenance / citation | Classification, permissions, version, retrieval source, exact citation/anchor | Required for safe and auditable answers |

## KPIs
| KPI | Definition / use |
|---|---|
| Content freshness | Published documents reviewed by due date / published documents due for review. |
| Overdue review rate | Documents past next-review date / documents requiring review; sample intentionally contains stale items. |
| Search success | Queries resulting in useful/opened/cited content / eligible queries; define feedback signal. |
| Retrieval precision / citation coverage | Relevant cited sources among retrieved results; answers with traceable support / answers issued. |
| Knowledge reuse | Reuse of approved patterns/practices/lessons across projects or domains. |
| Metadata completeness | Required metadata fields populated and valid / applicable documents. |

The dictionary reports about 22% overdue documents by design; do not infer production performance from synthetic catalog data.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| SAP business content | SAP Help/transactional application documentation; ECC objects remain controlled by source applications | SAP Build Work Zone as access/experience layer; SAP Document Management Service for document services where selected. |
| Architecture/process knowledge | SAP Solution Manager / PI/PO/system inventories where deployed | SAP LeanIX for application architecture; SAP Signavio for processes; Cloud ALM for implementation/operations evidence. |
| SAP documents and metadata | Document Management System/ArchiveLink integrations are deployment-specific | DMS/Work Zone, released metadata links, Datasphere catalog/lineage; avoid copying authoritative records without retention agreement. |
| Conversational retrieval | No ECC-native enterprise semantic search assumed | Joule/AI services and governed retrieval may assist; architecture reference notes specialist engineering document control/search may require non-SAP tools such as Documentum. |

Knowledge Repository should index/link, preserve permissions, and cite authoritative sources; SAP object/table access is not a substitute for document-system authorization.

## Agent Dependencies and Handoffs
- Data Analytics: metadata, corpus, cataloging, NLP and data lineage.
- Enterprise Architecture: architecture decisions, standards and patterns.
- Transformation PMO: project lessons, reviews and reusable practices.
- All domain agents: source knowledge, terminology, validation, and expertise.

These are README dependencies; no central event contract is defined.

## Outputs and Escalation
Outputs: cited search results, document/standard summaries, related content, stale-document alerts, lessons-learned records, and knowledge-gap reports. Escalate restricted-content access, conflicting standards, superseded procedures, uncertain source authority, legal/regulatory interpretation, or safety-critical instructions to the document owner/SME.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../../sap-architecture-advisor/references/technologies.md`. Sample documents and classifications are synthetic; respect source ACLs and citations in production.

## Version
1.0.0 (initial skill; authoritative repositories, access policy, and retention rules require validation).

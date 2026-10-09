# ICA Edge Tool and Connector Setup

**Dependency Assessment:** Design-only. The allowed artifacts state that no runnable ICA Edge runtime, tool adapters, deployed SAP/BTP endpoints, credentials or execution harness are established. Begin with synthetic fixtures and mocks. Data Analytics, Enterprise Architecture and Knowledge Repository are candidates for isolated testing; Demand Planning has major data-semantic gaps, and Supply Planning depends on mock Procurement Plan/Asset Status plus Material/UoM resolution. Overall E2E readiness is 0/19.

## 1. SAP Connections

| Connection class | MVP use | Status / setup gate |
|---|---|---|
| S/4HANA released CDS/OData APIs; Datasphere/Business Data Cloud semantic views | Read-only curated facts for analytics and later planning/dashboard integration. | Candidate only. Confirm customer release, released API, authorization, classification and reconciliation before non-production access. |
| ECC/BW approved extraction or released APIs | Read-only history/inventory/landscape evidence where required. | Candidate only. No direct agent table reads; validate customer landscape and approved extraction path. |
| SAP IBP Demand/Supply APIs | Later Demand forecast and Supply planning integration. | Not selected/deployed. Use fixture contracts until planning areas, API scopes, ownership and schemas are approved. |
| SAP Integration Suite/API Management/Event Mesh | Later approved API/event handoffs and workflow boundary. | Candidate only. Require versioned contracts, correlation, idempotency, retry/dead-letter and security tests. |

No SAP production write connections are in MVP scope. Do not configure production credentials or direct table access.

## 2. File Sources

Start with a read-only CSV/JSON fixture loader, schema validation and deterministic, versioned snapshots. Use only named inputs required by the agent configurations:

- Data Analytics: `datasource_inventory.csv`, `datasphere_objects.csv`, `report_catalog.csv`, approved master-data snapshots.
- Enterprise Architecture: application, integration and technology-standard inventory fixtures.
- Knowledge Repository: document catalog, architecture patterns, best practices and approved reference corpus with version/ACL metadata.
- Demand Planning: `demand_forecast.csv`, `demand_scenarios.csv`, `sales_forecast.csv`, customer/product/region and Commercial Marketing fixtures.
- Supply Planning: `production_plan.csv`, `inventory_plan.csv`, `supply_constraints.csv`, selected Warehouse/Refining fixtures.

All repository examples are synthetic. Record schema, source/version, as-of, grain, keys, units and classification; reject invalid or unauthorized inputs.

## 3. Database Sources

- Prefer governed, read-only semantic/data-product views exposed through approved Datasphere/BDC or released APIs; Data Analytics owns validation, lineage and quality references.
- A SQL/warehouse connector is not established by the allowed artifacts. Select only after platform, data-owner, identity and security approval.
- Enforce least privilege, row/column restrictions and source ACLs. No direct ERP table reads, shared credentials, agent writes or treating missing rows as zero.
- Master/reference data needed includes Customer, Product, Region, Plant, Facility, Warehouse, Supplier, Asset, Business Unit, calendar and UoM. Canonical Material master and some mappings remain dependencies.

## 4. Knowledge Sources

Configure a local/mock, ACL-aware index for approved documents and metadata. Require document ID/version, owner, classification, ACL, publication/supersession status and citation locator. Filter permissions/status before retrieval; resolve citations after generation; surface stale/conflicting sources and abstain when evidence is insufficient. Enterprise document repositories or SAP DMS/Work Zone are later candidates only after owner and security approval.

## 5. API Sources

- **Prototype adapters:** read-only fixture/file API, schema/quality validation, catalog/lineage, identity/ACL mock, telemetry and evaluation harness.
- **Mock workflow/event contracts:** versioned Demand Forecast, Procurement Plan and Asset Status payloads; test correlation IDs, idempotency, replay, timeout and invalid/stale messages. Procurement Plan and Asset Status remain mocks until producers and semantics are approved.
- **Later candidate APIs:** released SAP CDS/OData, IBP, Datasphere/BDC, approved CMDB/architecture inventory, document repository and weather/market signal sources where required.
- Every adapter must return typed status, source/version, timestamps, trace/correlation IDs and actionable errors. Retry only idempotent reads; no dashboard/agent-triggered SAP write path.

## 6. Authentication Requirements

- Development/test: synthetic caller identities and roles; no production secrets.
- Non-production: approved SSO/identity integration, per-agent least privilege, scoped service identities, secrets manager, ACL propagation and data-classification enforcement.
- Never use shared ERP credentials or place secrets in prompts, files, logs or agent memory.
- Audit source access, connector identity, tool outcome and trace ID; redact restricted content and apply approved retention.
- Security/data owners must approve scopes, endpoint authorization and access review before enabling enterprise sources.

## 7. Connector Priority

1. **P0 - Runtime and harness:** select ICA Edge execution surface, state persistence, CI/evaluation harness, telemetry, identity mock and schema registry.
2. **P1 - Fixture/file and master-data adapters:** deterministic CSV/JSON, schema/quality validation, source versioning and explicit key/UoM references; enables isolated tests.
3. **P2 - Knowledge and architecture context:** mock document index with ACL/citations; fixture-backed application/interface/standards inventory.
4. **P3 - Demand Planning inputs:** close dictionary, forecast grain/version/period/UoM/scenario semantics and actuals/holdout needs; expose versioned forecast output contract.
5. **P4 - Supply Planning dependencies:** resolve Material_ID and calendar/UoM; validate mock Procurement Plan and Asset Status schemas, validity and producer ownership.
6. **P5 - Non-production SAP/API integration:** only after architecture, security, source-owner, contract, reconciliation and operational gates pass.
7. **Production access or writes:** out of MVP setup; requires separate explicit approval and tested workflow controls.

## Setup Sequence

1. Select runtime, environments, workflow state, identity/secrets design and test harness.
2. Approve common request/result and source metadata contracts; define trace, timeout, retry and idempotency behavior.
3. Configure read-only fixture and master-data loaders with schema, quality, provenance and ACL checks.
4. Configure Knowledge Repository and Enterprise Architecture mock sources; pass citation, access, freshness and evidence tests.
5. Close Demand Planning dictionary and semantics, then configure its fixture inputs and versioned output contract.
6. Configure Supply Planning against compatible inputs and mock Procurement Plan/Asset Status; validate stale/conflict/replay paths.
7. Request non-production SAP/API access only after named owners approve architecture, security, API scopes, reconciliation and support.


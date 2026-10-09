# ICA Edge Agent Build Guide

**Build Complexity Rating:** High. The five-agent package depends on a shared runtime, workflow state, schemas, identity/ACL, tool adapters and approval handling; Demand and Supply also have unresolved data/contract prerequisites.

**Recommended Implementation Sequence:** Data Analytics -> Enterprise Architecture -> Knowledge Repository -> Demand Planning -> Supply Planning. Establish platform/schema/security foundations first; use isolated read-only fixtures and mocks before any approved non-production connector.

## 1. Agent Build Order

1. **Data-Analytics-Agent:** foundational schema, key, quality and lineage service.
2. **Enterprise-Architecture-Agent:** inventory evidence and architecture/security boundary support.
3. **Knowledge-Repository-Agent:** permission-aware retrieval and citation context.
4. **Demand-Planning-Agent:** versioned forecast after dictionary and unit/period/scenario semantics are approved.
5. **Supply-Planning-Agent:** planning alternatives after Demand Forecast, Material/UoM and mock dependency contracts pass.

## 2. Agent Configuration Steps

1. Select ICA Edge runtime, environments, workflow state, model/tool interface and execution harness.
2. Register each agent with owner, ID, version, scope, allowed actions and readiness status.
3. Apply the common versioned request/result envelope, schema validation, correlation/trace IDs, status/error handling and provenance fields.
4. Configure least-privilege identity, ACL propagation, secrets handling, redacted telemetry and audit.
5. Start with synthetic, versioned fixtures and read-only tools; disable production credentials and write actions.
6. Add agent-specific context, tools, memory policy and human approval behavior from the configuration package.

## 3. Prompt Configuration

- Use the agent-specific System Prompt Reference in `ica_edge_mvp_agent_configuration.md`; keep purpose, scope, allowed actions, grounding/provenance, fail-closed behavior and approval rules explicit.
- For Data Analytics, Enterprise Architecture and Knowledge Repository, compose prompt policy from the referenced decision/configuration sections because their source specifications do not provide a standalone prompt section.
- For Demand and Supply Planning, load their referenced prompt and preserve explicit unit/key validation, source versioning, abstention, mock labeling and no-write rules.
- Version prompts with agent configuration; evaluate every prompt change against the associated isolated tests before promotion.

## 4. Memory Configuration

- Use request/workflow-scoped state for source versions, scope, results, exceptions, approvals and trace IDs.
- Persist only immutable, versioned business outputs and audit/approval metadata through approved workflow storage.
- Do not treat conversation text as authoritative state; do not retain implicit cross-request business memory or unrestricted Knowledge Repository corpus.
- Enforce classification, ACL, retention and redaction policies. Persistence/runtime must be selected before deployment.

## 5. Context Configuration

- Allow-list only the agent's configured fixture/source references and required metadata; carry source/version/as-of, grain, keys, period, unit and classification.
- Apply ACL/status/version filters before Knowledge Repository retrieval and require resolvable citations.
- Keep architecture facts distinct from assumptions and illustrative landscape inputs.
- Keep Demand/Supply context versioned and compatible; unresolved Product/Material/Plant mappings or UoM/calendar semantics block affected calculations.
- Label Procurement Plan and Asset Status as mock until approved real contracts/connectors exist.

## 6. Tool Assignment

| Agent | Initial tools |
|---|---|
| Data Analytics | Read-only fixture loader, schema/quality validator, key/crosswalk checks, catalog/lineage and telemetry. |
| Enterprise Architecture | Fixture inventory reader/validator, architecture evidence/risk analysis, ADR draft and audit logging. |
| Knowledge Repository | ACL-filtered retrieval, metadata/version lookup, citation resolver and feedback/audit capture. |
| Demand Planning | Read-only fixture loader, schema/key/unit validation, configured approved forecast method and versioned draft output. |
| Supply Planning | Read-only fixture loader, schema/master/UoM validation, approved planning method/solver, mock dependency/event adapter and idempotency/telemetry. |

Use fixture/file adapters first. SAP, IBP, Datasphere/BDC, enterprise document, Event Mesh and other APIs remain candidate connectors pending owner, security and contract approval.

## 7. Validation Checklist

- [ ] Runtime, workflow persistence, CI/evaluation harness and isolated environments are selected and usable.
- [ ] Agent ID/version/scope, typed request/result schemas and allowed actions validate.
- [ ] Identity, ACL, secrets, audit, traceability and redaction are enforced.
- [ ] Fixture/source snapshots are versioned, read-only and reproducible; invalid schema/key/unit cases fail closed.
- [ ] Knowledge results cite authorized, resolvable sources; stale/conflicting content is surfaced.
- [ ] Architecture findings distinguish evidence, assumption and unknown state.
- [ ] Demand dictionary and unit/period/scenario definitions are approved before numeric forecast tests.
- [ ] Supply Material_ID/UoM and Procurement Plan/Asset Status mock contracts, freshness and idempotency are validated.
- [ ] Planner/Operations/architecture/content-owner approval gates block on denial, expiry, wrong role or timeout.
- [ ] No production credentials, SAP writes, plan release or direct ERP table reads are enabled.

## 8. Deployment Sequence

1. Build and validate shared runtime, state, schema, identity and telemetry foundation.
2. Deploy Data Analytics in fixture-backed read-only mode; pass quality/lineage tests.
3. Deploy Enterprise Architecture and Knowledge Repository fixtures; pass evidence, ACL and citation tests.
4. Close Demand Planning semantics, deploy fixture-backed forecast and pass isolated tests/approval behavior.
5. Deploy Supply Planning with compatible inputs and mock Procurement Plan/Asset Status; pass feasibility, stale/conflict, replay and approval tests.
6. Run the deployment package's mocked workflow/acceptance gates; record owners, versions and residual limitations.
7. Add approved non-production connectors only after architecture, security, data-owner and reconciliation approval. Production deployment/writes require separate explicit authorization.

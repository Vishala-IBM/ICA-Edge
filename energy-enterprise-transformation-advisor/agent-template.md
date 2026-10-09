# Enterprise Agent Template

Use this standard when adding or substantially revising an agent under `energy-enterprise-transformation-advisor/`. It defines the minimum content for the agent's `README.md`, `SKILL.md`, and optional `sample-data/` assets.

## How to Use

1. Copy the README and SKILL skeletons below into the new `[Agent-Name]-Agent/` folder.
2. Replace every `<placeholder>` with agent-specific, source-supported content. Remove authoring notes and unused rows before release.
3. If a section is genuinely not applicable, retain the heading and state `Not applicable` with a brief reason. Do not leave an unexplained blank section.
4. Keep business ownership, keys, process names, KPIs, and dependency direction consistent with the enterprise models and neighboring agents.
5. Treat sample data as illustrative. Identify proposed mappings and assumptions; never present them as deployed SAP configuration or approved business policy without evidence.

## Required Content Standard

### Purpose
State the agent's mission, intended users, business value, decision-support role, and any actions it must not take autonomously.

### Scope
List supported responsibilities and explicit exclusions. Identify boundary/decision ownership with adjacent agents so capabilities do not appear to be jointly owned without agreement.

### Business Capabilities
Group concrete capabilities by business outcome. Use action-oriented statements and avoid duplicating process steps as capabilities.

### Supported Processes
Map capabilities to named enterprise processes. Include process ID/level when one exists, accountable owner, trigger, important steps, and output. Mark proposed mappings as proposed; do not invent process IDs.

### KPIs
For each measure specify name, purpose, formula, unit, direction (`Higher`/`Lower`/`Target range`), grain/dimensions, period, source, owner, target, and target status (`Approved`, `Illustrative`, or `Not set`). Define denominator, exclusions, and zero/null treatment where relevant. A label without a formula is not a complete KPI definition.

### Master Data
List required reference/master entities and distinguish available canonical masters from missing/proposed ones. For each include canonical key, business steward, source, relationships, aliases/crosswalks, and important quality gaps. Reuse keys and entity names from `master-data/` where available.

### Transactional Data
List business facts/events/plans used or produced. For each specify source or dataset, grain, primary key/event ID, foreign/correlation keys, period/timestamp, status/version, units/currency, sensitivity, and known coverage gaps. Do not call a transaction or dataset a master entity.

### SAP ECC Objects
Map relevant ECC processes to module and business object; include table/API names only when supported by a reliable source. Distinguish standard SAP, configured/industry-specific, custom, and external/non-SAP data. Mark release/configuration assumptions and prefer supported interfaces over direct table access.

### SAP S/4HANA Objects
Map the same business needs to target modules, master/business objects, released APIs/CDS or events, and relevant migration changes. Call out ECC-to-S/4 changes such as Business Partner/CVI, Material number length, `MATDOC`, `ACDOCA`, planning, or interface changes only when relevant. State when a capability is not provided natively by SAP.

### Upstream Dependencies
Identify agents/systems whose data, decision, or approval this agent consumes. Each dependency must state provider, data/decision exchanged, trigger/cadence, required keys, and whether it is an implemented contract, approved design, or informal coordination.

### Downstream Dependencies
Identify agents/systems that consume this agent's data, recommendation, or decision. State the output, consumer, business event, required keys, timing/SLA if known, and approval/acknowledgement requirement. Do not imply a formal event interface where only coordination is documented.

### Inputs
List human and system inputs, source/owner, required fields, refresh/cadence, validation rules, and failure behavior. Include relevant master data, transactional facts, external signals, and context.

### Outputs
List recommendations, plans, reports, events, or records; include grain/schema, intended consumer, trigger, confidence/assumptions, and human approval required before action.

### Sample Prompts
Provide at least five realistic prompts covering routine analysis, exception handling, scenario comparison, cross-agent handoff, and data-quality/assumption disclosure. Prompts must stay within scope and must not imply unauthorized actions.

## README.md Template

Copy this skeleton to `[Agent-Name]-Agent/README.md`. Keep it useful as a human-readable overview; detailed execution constraints and source traceability belong in `SKILL.md`.

```markdown
# <Agent Display Name>

## Purpose
<Mission, target users, value delivered, and advisory/action boundary.>

## Scope
### In Scope
- <Responsibility>

### Out of Scope
- <Excluded responsibility and owning agent/system, if known>

### Interacts With
| Agent | Direction | Data / decision | Trigger | Contract status |
|---|---|---|---|---|
| <Agent-Name> | Upstream / Downstream | <Data or decision> | <Business event> | Implemented / Approved design / Coordination |

## Business Capabilities
### <Capability Group>
- <Capability and outcome>

## Supported Processes
| Process ID / Name | Role | Trigger | Key output |
|---|---|---|---|
| <ID or Proposed> <Process> | Owner / Contributor | <Event> | <Output> |

## KPIs
| KPI | Formula and unit | Grain / period | Source | Owner | Target/status |
|---|---|---|---|---|---|
| <Measure> | <Formula> | <Dimensions and period> | <Source> | <Owner> | <Value; Approved/Illustrative/Not set> |

## Master Data
| Entity | Canonical key | Steward/source | Relationships / gaps |
|---|---|---|---|
| <Entity> | <ID or Proposed> | <Owner and master source> | <Links, alias rules, quality notes> |

## Transactional Data
| Dataset / event | Grain and key | Important links | Source / cadence |
|---|---|---|---|
| <Name> | <One row per ...; ID> | <Foreign/correlation keys> | <System or sample-data file; cadence> |

## SAP ECC Objects
| Process/data need | ECC module/object | Evidence / caveat |
|---|---|---|
| <Need> | <Module and verified object/API, or Not provided by SAP> | <Release/configuration/source> |

## SAP S/4HANA Objects
| Process/data need | S/4HANA module/object/API | ECC migration impact / caveat |
|---|---|---|
| <Need> | <Target object and released API/CDS if known> | <Change, assumption, or Not provided by SAP> |

## Upstream Dependencies
| Provider | Data / decision | Trigger and cadence | Required keys | Contract status |
|---|---|---|---|---|
| <Agent or system> | <Input> | <Event/frequency> | <Keys> | <Implemented/Design/Coordination> |

## Downstream Dependencies
| Consumer | Output | Trigger and cadence | Required keys | Approval/status |
|---|---|---|---|---|
| <Agent or system> | <Output> | <Event/frequency> | <Keys> | <Human approval and contract status> |

## Inputs
| Input | Source/owner | Required fields | Refresh/validation |
|---|---|---|---|
| <Input> | <Source and steward> | <Fields/keys> | <Cadence and checks> |

## Outputs
| Output | Consumer | Grain/schema | Trigger | Approval |
|---|---|---|---|---|
| <Output> | <Consumer> | <Shape/keys> | <Event> | <Required approval or None> |

## Sample Prompts
- <Routine analysis prompt>
- <Exception investigation prompt>
- <Scenario comparison prompt>
- <Cross-agent coordination prompt>
- <Data quality / assumptions prompt>

## Sample Data
See `sample-data/README.md` or `sample-data/data_dictionary.md` for datasets, keys, grain, units, relationships, and synthetic-data caveats.

## References
- <Relative links to enterprise process, capability, KPI, master-data, interaction, SAP, and neighboring-agent sources>

## Version History
| Version | Date | Change |
|---|---|---|
| 1.0.0 | <YYYY-MM-DD> | Initial release |
```

## SKILL.md Template

Copy this skeleton to `[Agent-Name]-Agent/SKILL.md`. Keep YAML frontmatter valid. The description should identify when the skill should be invoked; the body should direct behavior, source use, limits, and handoffs rather than merely repeat the README.

```markdown
---
name: <lowercase-agent-skill-name>
description: >
	<When this agent should be invoked, its domain, target outcomes, and common
	triggering requests. State major out-of-scope requests and routing boundaries.>
---

# Skill: <Agent Display Name>

## Description
<One concise paragraph describing the agent's role and decision/action limits.>

## Applicable Domains
- <Business domain>

## Purpose and Scope
<What the agent handles, exclusions, and conditions requiring human authority.>

## Business Capabilities
- <Capability and outcome>

## Supported Processes
| Process | Agent role | Trigger / output |
|---|---|---|
| <Process ID/name> | <Owner/contributor> | <Event and result> |

## Enterprise Data Entities
| Entity | Required keys/attributes/relationships | Source and caveats |
|---|---|---|
| <Master or transactional entity> | <Fields and grain> | <Relative source; canonical/proposed; quality notes> |

## KPIs
| KPI | Formula, unit, grain and period | Owner/source/target status |
|---|---|---|
| <KPI> | <Approved formula and scope> | <Owner; source; approved/illustrative/not set> |

## SAP ECC Mapping
| Need | ECC module/object/API | Evidence and caveat |
|---|---|---|
| <Need> | <Verified mapping or Not provided by SAP> | <Version/configuration assumptions> |

## SAP S/4HANA Mapping
| Need | S/4HANA object/API/CDS | ECC change and caveat |
|---|---|---|
| <Need> | <Target mapping> | <Migration/release validation> |

## Agent Dependencies and Handoffs
### Upstream
- <Provider>: <data/decision, trigger, keys, contract status>.

### Downstream
- <Consumer>: <output, trigger, keys, approval, contract status>.

## Inputs
- <Source/owner, required data, cadence, validation.>

## Outputs
- <Consumer, output/schema, trigger, confidence, approval.>

## Sample Prompts
- <Routine request>
- <Exception/scenario request>
- <Cross-agent handoff request>
- <SAP/ECC-to-S/4 request>
- <Data quality and assumptions request>

## Operating Rules and Escalation
- Use canonical master IDs and approved relative source documents; disclose name/crosswalk joins and unmatched coverage.
- Do not invent SAP objects, KPI targets, or interfaces; label assumptions and proposed designs.
- <Agent-specific prohibited action, human approval, exception threshold, and escalation owner.>

## Assumptions and Source References
- <README, sample-data dictionary/CSVs, enterprise models, master-data files, SAP references, and relevant agent handoffs.>

## Version
1.0.0 (<YYYY-MM-DD>; initial skill; list required validation.)
```

## Sample Data Requirements

Use this layout when an agent needs local examples:

```text
[Agent-Name]-Agent/
├── README.md
├── SKILL.md
└── sample-data/
		├── data_dictionary.md
		└── <descriptive_dataset_name>.csv
```

- Provide a `data_dictionary.md` whenever the folder contains sample datasets. Include a purpose, synthetic-data notice, row count/as-of date, file grain, primary key, foreign keys/crosswalks, field definitions, units/currency, nullability, value ranges, relationships, and known limitations for every CSV.
- Use descriptive, stable dataset names and header names consistent with repository conventions. Keep one record grain per file; do not combine unrelated entities in one CSV.
- Use canonical master IDs where available. If only names or legacy IDs exist, document the mapping method, coverage, unmatched values, and proposed remediation. Never fabricate a canonical join.
- Make sample values internally consistent across files and with the documented entity relationships. Identify generated/synthetic records and do not use production PII or secrets.
- Include enough rows to demonstrate normal cases, edge cases, null/optional links, and cross-agent joins. Explain any intentionally unmatched values.
- State period/time zone, quantity units, currencies, and conversion assumptions. Keep calculated values reproducible from documented formulas where practical.
- Do not create placeholder CSVs with headers only unless the purpose is explicitly schema-only and marked as such.

## Acceptance Criteria

- [ ] Agent folder follows `[Agent-Name]-Agent/` naming and contains `README.md` and `SKILL.md`.
- [ ] README and SKILL define the same purpose, scope, capabilities, process boundaries, and ownership; SKILL adds operating behavior and escalation rules.
- [ ] All required headings in both templates are present. Non-applicable sections state why; no unexplained blanks or unresolved `<placeholder>` tokens remain.
- [ ] Supported processes are traceable to enterprise process definitions or explicitly labeled proposed.
- [ ] Each KPI has a reproducible formula, unit, grain, period, source, owner, and clearly labeled target status.
- [ ] Master versus transactional data is distinguished; canonical keys, stewardship, relationships, grain, and data gaps are documented.
- [ ] Upstream/downstream dependencies identify direction, data/decision, trigger, key, approval, and interface maturity. Informal coordination is not presented as an implemented contract.
- [ ] ECC and S/4HANA mappings are separately documented, evidence-qualified, and do not claim unsupported SAP functionality or unverified table/API use.
- [ ] Sample-data files have a dictionary, coherent keys/relationships, declared synthetic status, and no unauthorized sensitive information.
- [ ] Relative links resolve, YAML frontmatter parses, Markdown headings/tables/fences are valid, and all CSV headers match the data dictionary.
- [ ] New agent, capabilities, processes, KPIs, entities, and handoffs are added to applicable enterprise indexes/models (README roster, structure guide, capability/KPI/interaction models, and capability matrix) or recorded as deferred work.

## Version History

| Version | Date | Change |
|---|---|---|
| 2.0.0 | 2026-10-09 | Replaced README-only outline with reusable README/SKILL, data, SAP, dependency, and acceptance standards. |

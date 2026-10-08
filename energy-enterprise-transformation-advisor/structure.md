# Structure: Energy Enterprise Transformation Advisor

## Overview

This document defines the folder structure and organizational principles for the Energy Enterprise Transformation Advisor within the ICA-Edge repository.

## Top-Level Directory

```
energy-enterprise-transformation-advisor/
├── README.md                          # Framework overview and agent roster
├── SKILL.md                           # Skill definition and capabilities
├── structure.md                       # This file — folder and file organization
├── agent-template.md                  # Template for creating new agent READMEs
│
├── Corporate-Strategy-Agent/
│   └── README.md
├── Commercial-Marketing-Agent/
│   └── README.md
├── Demand-Planning-Agent/
│   └── README.md
├── Procurement-Agent/
│   └── README.md
├── Supply-Planning-Agent/
│   └── README.md
├── Warehouse-Agent/
│   └── README.md
├── Logistics-Agent/
│   └── README.md
├── Upstream-Operations-Agent/
│   └── README.md
├── Refining-Operations-Agent/
│   └── README.md
├── Asset-Reliability-Agent/
│   └── README.md
├── Sales-Trading-Agent/
│   └── README.md
├── Finance-Agent/
│   └── README.md
├── ESG-Agent/
│   └── README.md
├── Data-Analytics-Agent/
│   └── README.md
├── Enterprise-Architecture-Agent/
│   └── README.md
├── Transformation-PMO-Agent/
│   └── README.md
├── HSE-Agent/
│   └── README.md
├── Trading-Risk-Agent/
│   └── README.md
└── Knowledge-Repository-Agent/
    └── README.md
    ```

    ## Naming Conventions

    - **Agent folders**: PascalCase with hyphens, suffixed with `-Agent` (e.g., `Corporate-Strategy-Agent/`)
    - **Root files**: lowercase with hyphens for multi-word names (e.g., `agent-template.md`)
    - **Agent READMEs**: Each agent folder contains at minimum a `README.md` with Purpose, Scope, and Business Capabilities sections

    ## Agent Folder Structure

    Each agent folder follows a consistent structure:

    ```
    [Agent-Name]/
    ├── README.md          # Required: Purpose, Scope, Business Capabilities
    ├── prompts/           # Optional: agent prompt templates
    ├── tools/             # Optional: tool definitions and configurations
    └── examples/          # Optional: example queries and responses
    ```

    ## Design Principles

    1. **Domain Isolation**: Each agent is responsible for a clearly defined business domain
    2. **Interoperability**: Agents share a common interface contract for orchestration
    3. **Extensibility**: New agents can be added using the agent-template.md pattern
    4. **Traceability**: All agents are discoverable through the root README.md and SKILL.md
    5. **Consistency**: All agent READMEs follow the same structure for ease of navigation

# Agent Portal UI Design

**Scope:** Lightweight, locally-executable web portal that combines an executive KPI dashboard with a conversational agent interface for the five MVP agents (Demand Planning, Supply Planning, Data Analytics, Enterprise Architecture, Knowledge Repository).
**Status:** Design specification only. All data is synthetic. No enterprise system writes. Agent responses are read-only and advisory.

---

## 1. Application Pages

Seven pages. Navigation is provided by a persistent left sidebar.

| Page | Route | Purpose |
|---|---|---|
| Home / Overview | `/` | Landing page: system status, readiness banner, quick-nav tiles |
| Executive Dashboard | `/dashboard` | KPI cards, charts, alerts summary |
| Demand Planning | `/agents/demand-planning` | Agent chat + demand KPI panel + scenario viewer |
| Supply Planning | `/agents/supply-planning` | Agent chat + supply KPI panel + plan alternatives viewer |
| Data Analytics | `/agents/data-analytics` | Agent chat + data quality + lineage coverage panel |
| Enterprise Architecture | `/agents/enterprise-architecture` | Agent chat + transformation KPI panel + app inventory |
| Knowledge Repository | `/agents/knowledge` | Agent chat + citation coverage + document search |

---

## 2. Dashboard Layout

### 2.1 Global Shell

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | "Energy Enterprise Advisor" | Period | Readiness │
├──────────┬───────────────────────────────────────────────────────┤
│          │  PAGE CONTENT AREA                                    │
│ SIDEBAR  │                                                       │
│ (Nav)    │  ┌──────────────────────────────────────────────────┐ │
│          │  │  Page Title + subtitle + last-refresh label      │ │
│          │  ├──────────────────────────────────────────────────┤ │
│          │  │  Filter bar (period · BU · region · scenario)    │ │
│          │  ├──────────────────────────────────────────────────┤ │
│          │  │  PRIMARY CONTENT (cards / charts / chat)         │ │
│          │  └──────────────────────────────────────────────────┘ │
│          │                                                       │
│          │  FOOTER: "Synthetic data only · Read-only · MVP"      │
└──────────┴───────────────────────────────────────────────────────┘
```

### 2.2 Executive Dashboard Layout (`/dashboard`)

```
┌──────────────────────────────────────────────────────────────────┐
│  KPI CARD ROW 1 (4 cards)                                        │
│  [ Revenue Growth ]  [ EBITDA Margin ]  [ D-S Gap % ]  [ DQ Score] │
├──────────────────────────────────────────────────────────────────┤
│  KPI CARD ROW 2 (4 cards)                                        │
│  [ Citation Coverage ]  [ Overdue Reviews ]  [ EOL Apps ]  [ App Cov] │
├─────────────────────────────┬────────────────────────────────────┤
│  DEMAND FORECAST CHART      │  SUPPLY vs DEMAND CHART            │
│  (bar: product × volume)    │  (grouped bar: plan vs forecast)   │
├─────────────────────────────┴────────────────────────────────────┤
│  CRITICAL ALERTS TABLE                                           │
│  severity | agent | description | owner | next action            │
└──────────────────────────────────────────────────────────────────┘
```

### 2.3 Agent Page Layout (shared template)

```
┌─────────────────────────────────────────────────────────────────┐
│  AGENT STATUS BADGE: name · version · readiness · as-of         │
├─────────────────────────┬───────────────────────────────────────┤
│                         │                                       │
│   KPI / DATA PANEL      │   AGENT CHAT INTERFACE                │
│   (left, ~40% width)    │   (right, ~60% width)                 │
│                         │                                       │
│   • KPI cards           │   • Message history (scrollable)      │
│   • Charts              │   • User input box                    │
│   • Exceptions table    │   • Send button                       │
│   • Source/version info │   • Status indicator (thinking…)      │
│                         │   • Response: value | conditional |   │
│                         │     blocked | unavailable label        │
│                         │                                       │
├─────────────────────────┴───────────────────────────────────────┤
│  RECOMMENDATION PANEL (full width, collapsible)                  │
│  priority | scope | rationale | evidence | owner | decision      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Agent Chat Interface

### 3.1 Behavior Rules (from agent implementation specs)

- All responses are **read-only and advisory**. No chat action releases a plan, creates a PO, or writes to any system.
- Responses include: **status** (`completed` | `review_required` | `blocked` | `unavailable`), **value**, **source/version**, **assumptions**, **exceptions**, **next actions**.
- Missing, unavailable or conditional values display as labeled text — never as `0` or blank.
- Every response shows a **provenance line**: source file · version · as-of date.
- The chat does **not** retain cross-session conversational memory; each request is standalone.

### 3.2 Chat Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Agent: Demand-Planning-Agent  [●  Ready / ⚠ Conditional]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER: Compare the baseline November forecast with the      │
│  cold-winter scenario for Winter Diesel No. 1              │
│  ─────────────────────────────────────────────────         │
│  AGENT: ┌──────────────────────────────────────────────┐   │
│         │ Status: review_required                       │   │
│         │ Forecast version: DP-2026-11-v1               │   │
│         │ Baseline: 45,200 kL | Scenario: 61,470 kL    │   │
│         │ Variance: +36% → ⚠ Planner review required   │   │
│         │ Unit: kL | Source: demand_forecast.csv v1     │   │
│         │ Assumptions: Cold Winter 2026-27 × +5.4       │   │
│         │ Next action: Planner to approve/reject        │   │
│         └──────────────────────────────────────────────┘   │
│                                                             │
│  USER: Show MAPE for this forecast                          │
│  ─────────────────────────────────────────────────         │
│  AGENT: Status: unavailable                                 │
│         MAPE cannot be calculated — aligned actuals and     │
│         approved KPI formula not supplied.                  │
│         Owner action: provide actuals + approve formula.    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [ Type your question...                              Send ] │
│  Example: "Compare baseline vs cold-winter for Nov 2026"    │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Suggested Prompt Examples per Agent

| Agent Page | Example Prompts shown in UI |
|---|---|
| Demand Planning | "Compare baseline vs cold-winter scenario for November 2026" · "List products with >20% forecast variance" · "Show forecast by region for Winter Diesel" |
| Supply Planning | "Build constrained and unconstrained supply alternatives for Nov 2026" · "Which plants have stale Asset Status?" · "Show inventory safety stock gaps" |
| Data Analytics | "Which data sources have quality score below 80?" · "List sources with missing lineage" · "Show active vs inactive sources" |
| Enterprise Architecture | "List applications approaching end-of-support in 12 months" · "Show EOL/unsupported technology exposure" · "Which apps have Tolerate disposition?" |
| Knowledge Repository | "Which documents are overdue for review?" · "Show documents tagged Refining Operations" · "Find best practices for supply chain" |

### 3.4 Response Status Labels

| Status | Color badge | Meaning |
|---|---|---|
| `completed` | Green | Result returned with full source lineage |
| `review_required` | Amber | Human approval needed (e.g., >20% variance) |
| `conditional` | Blue | Result returned but with limitations noted |
| `blocked` | Red | Cannot calculate — missing input, UoM, or key |
| `unavailable` | Grey | Data source or formula not established |

---

## 4. KPI Panels

Each agent page shows a left-hand KPI panel. KPI cards display: **name · value · target · status badge · as-of · source file**.

### 4.1 Executive Dashboard KPI Panel

| KPI | Source | Target | Unavailable Condition |
|---|---|---|---|
| Revenue Growth Rate | `Finance-Agent/sample-data/revenue.csv` | 10% YoY | Finance source not connected |
| EBITDA Margin | `revenue.csv` + `operating_cost.csv` | 25% | Finance source not connected |
| Demand-Supply Gap % | `demand_forecast.csv` + `production_plan.csv` | Owner-defined | Show `Conditional` if UoM unreconciled |
| Avg Data Quality Score | `datasource_inventory.csv` | Owner-defined | — |

### 4.2 Demand Planning KPI Panel

| KPI | Source | Target | Status Rule |
|---|---|---|---|
| Forecast Volume (baseline) | `demand_forecast.csv` | — | Measured |
| Scenario Impact | `demand_scenarios.csv` | — | Measured |
| Forecast MAPE | Aligned actuals (not provided) | Owner-defined tolerance | `unavailable` until actuals supplied |
| Signed Forecast Bias | Actuals + approved formula | Owner-defined | `unavailable` until actuals supplied |
| Demand-Supply Gap | `demand_forecast.csv` + `production_plan.csv` | >20% triggers review | `conditional` — UoM alignment pending |

### 4.3 Supply Planning KPI Panel

| KPI | Source | Target | Status Rule |
|---|---|---|---|
| Planned Production | `production_plan.csv` | — | Measured |
| Safety Stock Coverage | `inventory_plan.csv` | Owner-defined | Measured |
| Supply Plan Attainment | Approved plan + actuals (not provided) | Owner-defined | `unavailable` without actuals |
| Supply Chain Throughput | `production_plan.csv` + capacity ref (not provided) | 95% (illustrative) | `conditional` — capacity ref pending |
| Demand-Supply Gap % | Demand + supply | Owner-defined | `conditional` |

### 4.4 Data Analytics KPI Panel

| KPI | Source | Target | Status Rule |
|---|---|---|---|
| Data Quality Completeness | `datasource_inventory.csv` col `Data_Quality_Score` | Owner-defined | Measured |
| Active Source Count | `datasource_inventory.csv` col `Status` | — | Measured |
| Lineage Coverage | `datasource_inventory.csv` / `datasphere_objects.csv` | Owner-defined | `conditional` |
| Citation Coverage (proxy) | `document_catalog.csv` col `Review_Status` | ≥ 95% | Measured |

### 4.5 Enterprise Architecture KPI Panel

| KPI | Source | Target | Status Rule |
|---|---|---|---|
| App Inventory Coverage | `application_inventory.csv` col `TIME_Disposition` | Owner-defined | Measured |
| EOL / Unsupported Count | `application_inventory.csv` col `Lifecycle_Status` | 0 critical | Measured |
| Standards Compliance | `technology_standards.csv` | Owner-defined | `conditional` |
| Apps Near End of Support (≤12 mo) | `application_inventory.csv` col `Support_End_Date` | 0 | Measured |

---

## 5. Recommendation Panels

Each agent page shows a collapsible full-width recommendation panel below the KPI+Chat split. Recommendations are read-only and advisory.

### 5.1 Panel Columns

| Column | Content |
|---|---|
| Priority | P0 / P1 / P2 / P3 |
| Agent | Source agent name |
| Affected Scope | Product, Plant, Period, Region, or Application ID |
| Rationale | Short plain-English explanation |
| Evidence | Source file · version · as-of date |
| Confidence | `High` / `Conditional` / `Low` |
| Owner | Approver role required |
| Required Decision | What the human must do next |
| Status | Open / Under Review / Resolved |

### 5.2 MVP Alert Types (from design spec)

| Priority | Alert | Trigger |
|---|---|---|
| P0 | Missing/ambiguous key, UoM, or calendar | Key resolution fails in any agent |
| P0 | Demand variance > 20% against agreed reference | Demand Planning >20% check |
| P0 | Stale/invalid Asset Status or Procurement Plan | Supply Planning dependency check |
| P0 | Restricted-source ACL denial or unresolved citation | Knowledge Repository |
| P1 | Data quality score < 80 | `datasource_inventory.csv` |
| P1 | Overdue document reviews | `document_catalog.csv` |
| P2 | Application approaching end-of-support (≤ 12 months) | `application_inventory.csv` |
| P2 | EOL/unsupported technology exposure detected | `application_inventory.csv` |
| P3 | Finance KPI unavailable | Finance source not connected |

### 5.3 Recommendation Card (wireframe)

```
┌──────────────────────────────────────────────────────────────┐
│ [P0 · Amber]  Demand-Planning-Agent                          │
│ Scope: Winter Diesel No. 1 · Nov 2026 · Western Canada       │
│ ─────────────────────────────────────────────────────────── │
│ Rationale: Cold-winter scenario produces +36% variance       │
│ above the agreed reference. Planner review required before   │
│ the forecast can be used as a planning baseline.             │
│ ─────────────────────────────────────────────────────────── │
│ Evidence: demand_forecast.csv v1 · demand_scenarios.csv v1  │
│ Confidence: Conditional (UoM reconciliation pending)         │
│ Owner: Demand Planner                                        │
│ Decision: Approve or reject forecast version DP-2026-11-v1  │
│                                              [Mark Reviewed] │
└──────────────────────────────────────────────────────────────┘
```

> **Note:** "Mark Reviewed" updates local UI state only. No write to any enterprise system or agent state store.

---

## 6. Navigation Structure

### 6.1 Sidebar Navigation Tree

```
⚡ Energy Enterprise Advisor
─────────────────────────────
🏠  Home
📊  Executive Dashboard
─────────────────────────────
AGENTS
🔢  Demand Planning
🏭  Supply Planning
🔍  Data Analytics
🏗️  Enterprise Architecture
📚  Knowledge Repository
─────────────────────────────
⚙️  Settings (theme / period)
```

### 6.2 Global Filters (persistent across pages)

| Filter | Type | Options |
|---|---|---|
| Reporting Period | Dropdown | Months from `demand_forecast.csv` |
| Business Unit | Dropdown | From `master-data/business_units.csv` |
| Region | Dropdown | From `master-data/regions.csv` |
| Scenario | Dropdown | From `demand_scenarios.csv` Scenario_Name |
| Data Readiness | Badge (read-only) | `Prototype · Synthetic Data` |

### 6.3 Drill-Through Paths

| Source Element | Drill Target | Context Passed |
|---|---|---|
| KPI card | Agent page (relevant agent) | KPI name, period |
| Alert row | Recommendation detail panel | Alert ID, severity, scope |
| Forecast chart bar | Demand Planning chat | Product, period, scenario |
| App inventory row | Enterprise Architecture chat | Application_ID |
| Document row | Knowledge Repository chat | Document_ID, title |

---

## 7. MVP Technology Stack

### 7.1 Recommendation: Single-file HTML + vanilla JS

For the agent portal (chat + KPIs + recommendations), a single self-contained HTML file is recommended for the MVP over React or Streamlit because:

| Criterion | Single HTML/JS | React | Streamlit |
|---|---|---|---|
| Zero install | ✅ Open in browser | ❌ Node + npm | ❌ Python + pip |
| Agent chat UI | ✅ Native DOM | ✅ Component-based | ⚠️ Limited chat UX |
| CSV data loading | ✅ Fetch API + PapaParse CDN | ✅ | ✅ pandas |
| Charts | ✅ Chart.js CDN | ✅ Recharts | ✅ Plotly |
| Multi-page nav | ✅ Hash routing | ✅ React Router | ✅ Sidebar |
| Share / demo | ✅ Email a single file | ❌ Needs build + serve | ❌ Needs server |
| Agent chat feel | ✅ Full DOM control | ✅ | ⚠️ |

**For production hardening**, migrate to React + Vite once the ICA Edge runtime and agent APIs are established.

### 7.2 MVP File Structure

```
energy-enterprise-transformation-advisor/
├── index.html          ← Single-file portal (HTML + CSS + JS)
├── app.py              ← Existing Streamlit dashboard (keep for data views)
└── (CSV files remain in place — loaded via fetch)
```

### 7.3 CDN Dependencies (no install required)

```html
<!-- Charts -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<!-- CSV parsing -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5/papaparse.min.js"></script>
<!-- Markdown rendering (agent responses) -->
<script src="https://cdn.jsdelivr.net/npm/marked@9/marked.min.js"></script>
```

### 7.4 Agent Chat Implementation (MVP)

For the MVP, agent responses are **simulated** using a local JavaScript response map keyed on intent keywords. No live LLM or ICA Edge API call is made. This allows the UI to be demonstrated end-to-end without a running backend.

```
User input → keyword classifier → lookup intent →
  match to canned structured response object →
  render status badge + value + provenance + next actions
```

When the ICA Edge runtime is available, replace the keyword classifier with a `fetch()` call to the agent endpoint, posting the v1.0 request schema defined in the agent implementation specs.

### 7.5 State Management

| State | Scope | Storage |
|---|---|---|
| Selected filters (period, BU, region, scenario) | Global | JS module variable |
| Chat message history | Per-agent-page session | JS array in memory (cleared on page reload) |
| Alert "Mark Reviewed" flags | Session | `sessionStorage` |
| Data frames (CSV parsed) | Global cache | JS module variable (load once on startup) |

> No cross-session persistence. No `localStorage` write for business data. No enterprise system state is modified.

### 7.6 Security Constraints

- All CSV files are read locally via `fetch()` relative paths — no external API calls.
- No credentials, API keys or tokens in the HTML file.
- No form submissions or POST requests in MVP.
- Agent chat responses are local simulations only; no data leaves the browser.
- Serve locally with `python -m http.server 8080` or open `index.html` directly.

# Dashboard Application MVP

**Scope:** Lightweight, locally-executable read-only dashboard over synthetic sample-data and master-data CSV fixtures.
**Status:** Prototype only. All data is synthetic. Finance KPIs (Revenue Growth, EBITDA) are displayed as unavailable because Finance source approval is not established. No enterprise system writes are performed.

---

## 1. Recommended Technology: Streamlit (Python)

**Recommendation: Streamlit**

| Criterion | Streamlit | React | Plain HTML |
|---|---|---|---|
| Setup time | Single `pip install` | Requires Node + bundler | Zero install |
| CSV loading | Native `pandas` | Requires fetch + parsing | Manual JS parsing |
| Charts | Built-in + Altair/Plotly | Recharts / Chart.js | Chart.js |
| Multi-page nav | Built-in sidebar | React Router | Manual |
| Local execution | `streamlit run app.py` | `npm run dev` | Open `index.html` |
| Best for | Data/analytics prototypes with Python | Full UI control | Ultra-minimal demos |

Streamlit is chosen because all data is in CSV files already readable by `pandas`, charts require no separate library setup, multi-page navigation is built-in, and the entire app runs with one command. No Node.js, no build step, no server config.

**Python version required:** 3.9 or later
**Key packages:** `streamlit`, `pandas`, `plotly`

---

## 2. Application Pages

Five pages, matching the dashboard design specification. Navigation is provided by Streamlit's built-in sidebar page selector.

| Page File | Sidebar Label | Maps to Design Section |
|---|---|---|
| `pages/1_Executive_Overview.py` | Executive Overview | Executive KPI Section |
| `pages/2_Operations_Data_Trust.py` | Operations & Data Trust | Operational KPI Section |
| `pages/3_Planning.py` | Planning | Planning KPI Section |
| `pages/4_Transformation.py` | Transformation | Transformation KPI Section |
| `pages/5_Alerts.py` | Alerts & Recommendations | Critical Alerts Panel |

Each page shows a compact header row: **Reporting Period** (selectbox), **Last Refresh** (derived from file mtime or hardcoded snapshot date), and a **Data Readiness** badge.

---

## 3. KPI Cards

Each KPI card renders: **metric name · current value · target · status label · as-of date**.
Status labels follow the approved set: `On Track`, `Attention`, `Blocked`, `Unavailable`.
Color is supplemented by text — never color alone.

### Page 1 — Executive Overview

| KPI | Source File | Calculation | Target | Unavailable Condition |
|---|---|---|---|---|
| Revenue Growth Rate | `Finance-Agent/sample-data/revenue.csv` | `(current_period_sum - prior_period_sum) / prior_period_sum * 100` | 10% YoY | Display `"Unavailable: Finance source not connected"` until Finance approval |
| EBITDA Margin | `Finance-Agent/sample-data/revenue.csv`, `Finance-Agent/sample-data/operating_cost.csv` | `(Revenue - OpCost) / Revenue * 100` | 25% | Display `"Unavailable: Finance source not connected"` until Finance approval |
| Demand-Supply Gap % | `demand_forecast.csv`, `production_plan.csv` | `(sum(Forecast_Volume) - sum(Planned_Qty)) / sum(Forecast_Volume) * 100` | Owner-defined | Show `"Conditional"` if UoM unreconciled |
| Data Quality Score | `datasource_inventory.csv` | `mean(Data_Quality_Score)` | Owner-defined | Show `"Conditional"` if no rows |

> For MVP, Revenue and EBITDA cards render as static `st.metric` tiles with value `"—"` and delta label `"Unavailable: Finance source not connected"`. The Finance CSV files are loaded and available but the KPI formula and approval are not established; do not display a fabricated number.

### Page 2 — Operations & Data Trust

| KPI | Source File | Calculation | Target |
|---|---|---|---|
| Data Quality Completeness | `datasource_inventory.csv` col `Data_Quality_Score` | `mean(Data_Quality_Score)` as a % proxy | Owner-defined |
| Active Source Count | `datasource_inventory.csv` col `Status` | `count where Status == "Active"` | — |
| Citation Coverage | `document_catalog.csv` col `Review_Status` | `count where Review_Status == "Current" / total * 100` (proxy) | ≥ 95% |
| Overdue Reviews | `document_catalog.csv` col `Review_Status` | `count where Review_Status == "Overdue"` | 0 |

### Page 3 — Planning

| KPI | Source File | Calculation | Target |
|---|---|---|---|
| Forecast Volume (baseline) | `demand_forecast.csv` | `sum(Forecast_Volume)` filtered by selected month | — |
| Scenario Impact | `demand_scenarios.csv` | `Demand_Impact` by product for selected scenario | — |
| Planned Production | `production_plan.csv` | `sum(Planned_Qty)` filtered by selected month | — |
| Safety Stock Coverage | `inventory_plan.csv` | `sum(Safety_Stock)` by plant | — |

### Page 4 — Transformation

| KPI | Source File | Calculation | Target |
|---|---|---|---|
| App Inventory Coverage | `application_inventory.csv` | `count(Application_ID) where TIME_Disposition != null / total * 100` | Owner-defined |
| EOL / Unsupported Count | `application_inventory.csv` col `Lifecycle_Status` | `count where Lifecycle_Status in ["EOL","Unsupported","End of Life"]` | 0 critical |
| Standards Compliance (proxy) | `technology_standards.csv` | Computed from available status column if present | Owner-defined |
| Applications Near End of Support | `application_inventory.csv` col `Support_End_Date` | `count where Support_End_Date <= today + 365 days` | — |

### Page 5 — Alerts & Recommendations

Derived from data conditions detected on other pages:
- Data Quality Score < 80 → warning alert per source system
- `Review_Status == "Overdue"` documents → knowledge freshness alert
- `Support_End_Date` within 12 months → architecture EOL alert
- Demand-Supply Gap > 20% → planning variance alert

---

## 4. Charts

| Page | Chart | Type | X-axis | Y-axis / Value | Library |
|---|---|---|---|---|---|
| Executive Overview | Revenue by Business Unit (placeholder) | Bar | `Business_Unit` | `Revenue` (CAD) | Plotly |
| Operations & Data Trust | Data Quality Score by Source System | Horizontal Bar | `Data_Quality_Score` | `Source_System` | Plotly |
| Operations & Data Trust | Document Review Status Breakdown | Pie | — | Count by `Review_Status` | Plotly |
| Planning | Forecast Volume by Product (baseline) | Bar | `Product` | `Forecast_Volume` | Plotly |
| Planning | Baseline vs Scenario Demand | Grouped Bar | `Product` | Baseline + scenario-adjusted volume | Plotly |
| Planning | Planned Production by Plant and Month | Line | `Month` | `Planned_Qty` per `Plant` | Plotly |
| Transformation | Application Count by Lifecycle Status | Bar | `Lifecycle_Status` | Count | Plotly |
| Transformation | TIME Disposition Distribution | Pie | — | Count by `TIME_Disposition` | Plotly |
| Transformation | Support End Date Timeline | Scatter | `Support_End_Date` | `Application_Name` | Plotly |

All charts include axis labels with units, a data-source caption and a synthetic-data disclaimer.

---

## 5. Data Sources

All files are read as read-only `pandas` DataFrames at startup. No file is written or modified.

### Planning Data

| DataFrame | File Path |
|---|---|
| `df_demand_forecast` | `Demand-Planning-Agent/sample-data/demand_forecast.csv` |
| `df_demand_scenarios` | `Demand-Planning-Agent/sample-data/demand_scenarios.csv` |
| `df_production_plan` | `Supply-Planning-Agent/sample-data/production_plan.csv` |
| `df_inventory_plan` | `Supply-Planning-Agent/sample-data/inventory_plan.csv` |
| `df_supply_constraints` | `Supply-Planning-Agent/sample-data/supply_constraints.csv` |

### Operational / Data Trust

| DataFrame | File Path |
|---|---|
| `df_datasource_inventory` | `Data-Analytics-Agent/sample-data/datasource_inventory.csv` |
| `df_document_catalog` | `Knowledge-Repository-Agent/sample-data/document_catalog.csv` |

### Transformation

| DataFrame | File Path |
|---|---|
| `df_application_inventory` | `Enterprise-Architecture-Agent/sample-data/application_inventory.csv` |
| `df_technology_standards` | `Enterprise-Architecture-Agent/sample-data/technology_standards.csv` |
| `df_integration_inventory` | `Enterprise-Architecture-Agent/sample-data/integration_inventory.csv` |

### Finance (loaded, KPIs displayed as unavailable)

| DataFrame | File Path |
|---|---|
| `df_revenue` | `Finance-Agent/sample-data/revenue.csv` |
| `df_operating_cost` | `Finance-Agent/sample-data/operating_cost.csv` |

### Master Data

| DataFrame | File Path |
|---|---|
| `df_products` | `master-data/products.csv` |
| `df_plants` | `master-data/plants.csv` |
| `df_regions` | `master-data/regions.csv` |
| `df_business_units` | `master-data/business_units.csv` |

---

## 6. Local Execution Steps

### Step 1 — Prerequisites

```bash
# Python 3.9+ required
python --version

# Install dependencies
pip install streamlit pandas plotly
```

### Step 2 — Project Structure

Create the following file layout in the workspace root:

```
energy-enterprise-transformation-advisor/
├── app.py                          # Home page / entry point
├── pages/
│   ├── 1_Executive_Overview.py
│   ├── 2_Operations_Data_Trust.py
│   ├── 3_Planning.py
│   ├── 4_Transformation.py
│   └── 5_Alerts.py
└── utils/
    └── data_loader.py              # Shared CSV loading functions
```

### Step 3 — `utils/data_loader.py`

```python
import pandas as pd
from pathlib import Path

BASE = Path(__file__).parent.parent  # workspace root

def load_csv(rel_path: str) -> pd.DataFrame:
    """Load a CSV file relative to workspace root. Returns empty DataFrame on missing file."""
    path = BASE / rel_path
    if not path.exists():
        return pd.DataFrame()
    return pd.read_csv(path)

# Planning
def demand_forecast():   return load_csv("Demand-Planning-Agent/sample-data/demand_forecast.csv")
def demand_scenarios():  return load_csv("Demand-Planning-Agent/sample-data/demand_scenarios.csv")
def production_plan():   return load_csv("Supply-Planning-Agent/sample-data/production_plan.csv")
def inventory_plan():    return load_csv("Supply-Planning-Agent/sample-data/inventory_plan.csv")

# Operational
def datasource_inventory(): return load_csv("Data-Analytics-Agent/sample-data/datasource_inventory.csv")
def document_catalog():     return load_csv("Knowledge-Repository-Agent/sample-data/document_catalog.csv")

# Transformation
def application_inventory(): return load_csv("Enterprise-Architecture-Agent/sample-data/application_inventory.csv")
def technology_standards():  return load_csv("Enterprise-Architecture-Agent/sample-data/technology_standards.csv")

# Finance (loaded but KPIs unavailable)
def revenue():       return load_csv("Finance-Agent/sample-data/revenue.csv")
def operating_cost(): return load_csv("Finance-Agent/sample-data/operating_cost.csv")

# Master data
def products():       return load_csv("master-data/products.csv")
def plants():         return load_csv("master-data/plants.csv")
def regions():        return load_csv("master-data/regions.csv")
def business_units(): return load_csv("master-data/business_units.csv")
```

### Step 4 — `app.py` (Home / Entry Point)

```python
import streamlit as st

st.set_page_config(page_title="Energy Enterprise Dashboard MVP", layout="wide")

st.title("Energy Enterprise Transformation Advisor")
st.caption("MVP prototype — all data is synthetic. Read-only. No enterprise system writes.")

st.info(
    "**Data Readiness: Conditional / Prototype-only.**  "
    "Finance KPIs (Revenue Growth, EBITDA) are unavailable until Finance source and formula are approved.  "
    "Planning accuracy KPIs require aligned actuals. All sample values are synthetic."
)

st.markdown("""
Use the sidebar to navigate to:
- **Executive Overview** — headline KPIs and readiness status
- **Operations & Data Trust** — data quality, lineage and citation coverage
- **Planning** — demand forecast, scenarios, supply and inventory
- **Transformation** — application inventory, EOL exposure, standards
- **Alerts & Recommendations** — prioritized issues and next actions
""")
```

### Step 5 — `pages/1_Executive_Overview.py` (representative page)

```python
import streamlit as st
import plotly.express as px
from utils.data_loader import revenue, datasource_inventory, demand_forecast, production_plan

st.set_page_config(page_title="Executive Overview", layout="wide")
st.title("Executive Overview")
st.caption("Snapshot date: synthetic fixture | Source: sample-data only")

# --- Header filters ---
df_fc = demand_forecast()
months = sorted(df_fc["Month"].unique()) if not df_fc.empty else ["N/A"]
selected_month = st.selectbox("Reporting Period", months)

# --- KPI Card Row ---
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Revenue Growth Rate", "—", delta="Unavailable: Finance source not connected")

with col2:
    st.metric("EBITDA Margin", "—", delta="Unavailable: Finance source not connected")

with col3:
    df_demand = df_fc[df_fc["Month"] == selected_month] if not df_fc.empty else df_fc
    df_supply = production_plan()
    df_supply_m = df_supply[df_supply["Month"] == selected_month] if not df_supply.empty else df_supply
    d_vol = df_demand["Forecast_Volume"].sum() if not df_demand.empty else 0
    s_vol = df_supply_m["Planned_Qty"].sum() if not df_supply_m.empty else 0
    gap_pct = round((d_vol - s_vol) / d_vol * 100, 1) if d_vol > 0 else None
    st.metric("Demand-Supply Gap", f"{gap_pct}%" if gap_pct is not None else "Conditional",
              delta="UoM: unreconciled — conditional" if gap_pct is not None else None)

with col4:
    df_ds = datasource_inventory()
    avg_dq = round(df_ds["Data_Quality_Score"].mean(), 1) if not df_ds.empty else None
    st.metric("Avg Data Quality Score", f"{avg_dq}" if avg_dq else "—")

st.divider()

# --- Revenue by BU chart (finance data present, KPI label still unavailable) ---
st.subheader("Revenue by Business Unit (synthetic — Finance KPI formula not approved)")
df_rev = revenue()
if not df_rev.empty:
    fig = px.bar(df_rev.groupby("Business_Unit")["Revenue"].sum().reset_index(),
                 x="Business_Unit", y="Revenue", labels={"Revenue": "Revenue (CAD)"},
                 title="Revenue by Business Unit — SYNTHETIC DATA")
    st.plotly_chart(fig, use_container_width=True)
else:
    st.warning("Revenue data not available.")
```

### Step 6 — Run the Application

From the workspace root directory, run:

```bash
streamlit run app.py
```

Streamlit will open the dashboard at `http://localhost:8501` in your default browser. All five pages are accessible from the left sidebar.

### Step 7 — Stopping the Application

Press `Ctrl+C` in the terminal to stop the Streamlit server.

---

## Quick-Reference: File Checklist Before Running

| File | Required | Notes |
|---|---|---|
| `app.py` | Yes | Home page entry point |
| `utils/data_loader.py` | Yes | Shared CSV loader |
| `pages/1_Executive_Overview.py` | Yes | Executive KPIs |
| `pages/2_Operations_Data_Trust.py` | Yes | Data quality / citation |
| `pages/3_Planning.py` | Yes | Demand / supply / inventory |
| `pages/4_Transformation.py` | Yes | Application inventory / EOL |
| `pages/5_Alerts.py` | Yes | Derived alerts |
| All CSV source files listed in Section 5 | Yes | Read-only synthetic fixtures |

> **Hard constraint:** The dashboard is read-only and advisory. No page performs a write, update or delete on any CSV, database, SAP system or enterprise API.

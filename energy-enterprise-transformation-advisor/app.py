"""
Energy Enterprise Transformation Advisor — Streamlit Dashboard MVP
==================================================================
Run: streamlit run app.py
Requires: pip install streamlit pandas plotly

All data is synthetic sample/master-data. No enterprise system writes.
Finance KPIs (Revenue Growth, EBITDA) are shown as unavailable until
Finance source and formula approvals are in place.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE = Path(__file__).parent

st.set_page_config(
    page_title="Energy Enterprise Dashboard",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

SYNTHETIC_NOTE = "⚠️ All data is synthetic sample data — not production values."

# ---------------------------------------------------------------------------
# Data loader
# ---------------------------------------------------------------------------
@st.cache_data
def load(rel_path: str) -> pd.DataFrame:
    p = BASE / rel_path
    if not p.exists():
        return pd.DataFrame()
    return pd.read_csv(p)


def load_all() -> dict:
    return {
        # Planning
        "demand_forecast":   load("Demand-Planning-Agent/sample-data/demand_forecast.csv"),
        "demand_scenarios":  load("Demand-Planning-Agent/sample-data/demand_scenarios.csv"),
        "production_plan":   load("Supply-Planning-Agent/sample-data/production_plan.csv"),
        "inventory_plan":    load("Supply-Planning-Agent/sample-data/inventory_plan.csv"),
        # Finance
        "revenue":           load("Finance-Agent/sample-data/revenue.csv"),
        "operating_cost":    load("Finance-Agent/sample-data/operating_cost.csv"),
        # Operations / Data Trust
        "datasource_inv":    load("Data-Analytics-Agent/sample-data/datasource_inventory.csv"),
        "doc_catalog":       load("Knowledge-Repository-Agent/sample-data/document_catalog.csv"),
        # Transformation
        "app_inventory":     load("Enterprise-Architecture-Agent/sample-data/application_inventory.csv"),
        # Assets
        "asset_master":      load("Asset-Reliability-Agent/sample-data/asset_master.csv"),
        "maint_history":     load("Asset-Reliability-Agent/sample-data/maintenance_history.csv"),
        # Customers
        "customer_orders":   load("Sales-Trading-Agent/sample-data/customer_orders.csv"),
        # Suppliers
        "purchase_orders":   load("Procurement-Agent/sample-data/purchase_orders.csv"),
        # Master data
        "customers":         load("master-data/customers.csv"),
        "suppliers":         load("master-data/suppliers.csv"),
        "assets_md":         load("master-data/assets.csv"),
        "plants":            load("master-data/plants.csv"),
        "products":          load("master-data/products.csv"),
    }


D = load_all()

# ---------------------------------------------------------------------------
# Sidebar navigation
# ---------------------------------------------------------------------------
PAGES = [
    "🏠 Executive Overview",
    "🔧 Asset Dashboard",
    "🛒 Customer Dashboard",
    "📦 Supplier Dashboard",
]

with st.sidebar:
    st.image("https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", width=80)
    st.markdown("### Energy Enterprise Advisor")
    st.caption("MVP Prototype — Synthetic Data")
    st.divider()
    page = st.radio("Navigate to", PAGES, label_visibility="collapsed")
    st.divider()
    st.caption(SYNTHETIC_NOTE)


# ===========================================================================
# PAGE 1 — EXECUTIVE OVERVIEW
# ===========================================================================
def page_executive():
    st.title("⚡ Executive Overview")
    st.caption(SYNTHETIC_NOTE)

    # --- Filters ---
    df_fc = D["demand_forecast"]
    months = sorted(df_fc["Month"].unique()) if not df_fc.empty else []
    col_f1, col_f2 = st.columns([2, 6])
    with col_f1:
        selected_month = st.selectbox("Reporting Period", months or ["N/A"])

    st.divider()

    # --- KPI Cards Row 1: Finance (unavailable) ---
    st.subheader("Executive KPIs")
    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric(
            label="💰 Revenue Growth Rate",
            value="—",
            delta="Unavailable: Finance source not connected",
            delta_color="off",
        )
        st.caption("Target: 10% YoY | Formula not approved")

    with c2:
        st.metric(
            label="📊 EBITDA Margin",
            value="—",
            delta="Unavailable: Finance source not connected",
            delta_color="off",
        )
        st.caption("Target: 25% | Finance source required")

    # Demand-Supply Gap
    with c3:
        d_vol, s_vol, gap_pct = 0, 0, None
        if not df_fc.empty and not D["production_plan"].empty:
            df_m = df_fc[df_fc["Month"] == selected_month]
            df_sp = D["production_plan"][D["production_plan"]["Month"] == selected_month]
            d_vol = df_m["Forecast_Volume"].sum()
            s_vol = df_sp["Planned_Qty"].sum()
            if d_vol > 0:
                gap_pct = round((d_vol - s_vol) / d_vol * 100, 1)
        if gap_pct is not None:
            status = "normal" if abs(gap_pct) <= 20 else "inverse"
            st.metric("📉 Demand-Supply Gap", f"{gap_pct}%",
                      delta="Within threshold" if abs(gap_pct) <= 20 else "⚠️ >20% — Planner review required",
                      delta_color=status)
        else:
            st.metric("📉 Demand-Supply Gap", "Conditional", delta="UoM not reconciled", delta_color="off")
        st.caption("Conditional — UoM alignment pending")

    # Avg Data Quality
    with c4:
        df_ds = D["datasource_inv"]
        avg_dq = round(df_ds["Data_Quality_Score"].mean(), 1) if not df_ds.empty else None
        active = df_ds[df_ds["Status"] == "Active"].shape[0] if not df_ds.empty else 0
        st.metric("✅ Avg Data Quality Score", f"{avg_dq}" if avg_dq else "—",
                  delta=f"{active} active sources")
        st.caption("Source: datasource_inventory.csv")

    st.divider()

    # --- KPI Cards Row 2: Operational ---
    st.subheader("Operational KPIs")
    c5, c6, c7, c8 = st.columns(4)

    with c5:
        df_doc = D["doc_catalog"]
        overdue = df_doc[df_doc["Review_Status"] == "Overdue"].shape[0] if not df_doc.empty else 0
        total_doc = df_doc.shape[0] if not df_doc.empty else 1
        current = df_doc[df_doc["Review_Status"] == "Current"].shape[0] if not df_doc.empty else 0
        cite_cov = round(current / total_doc * 100, 1) if total_doc > 0 else 0
        st.metric("📚 Citation Coverage (proxy)", f"{cite_cov}%",
                  delta="✅ On Track" if cite_cov >= 95 else "⚠️ Below 95% target",
                  delta_color="normal" if cite_cov >= 95 else "inverse")
        st.caption("Target: ≥ 95% | Source: document_catalog.csv")

    with c6:
        st.metric("📋 Overdue Document Reviews", f"{overdue}",
                  delta="⚠️ Requires attention" if overdue > 0 else "✅ None overdue",
                  delta_color="inverse" if overdue > 0 else "normal")
        st.caption("Source: document_catalog.csv")

    with c7:
        df_app = D["app_inventory"]
        eol_count = 0
        if not df_app.empty and "Lifecycle_Status" in df_app.columns:
            eol_count = df_app[df_app["Lifecycle_Status"].isin(["EOL", "Unsupported", "End of Life"])].shape[0]
        st.metric("🏗️ EOL/Unsupported Apps", f"{eol_count}",
                  delta="⚠️ Review required" if eol_count > 0 else "✅ None detected",
                  delta_color="inverse" if eol_count > 0 else "normal")
        st.caption("Source: application_inventory.csv")

    with c8:
        if not df_app.empty and "TIME_Disposition" in df_app.columns:
            dispositioned = df_app["TIME_Disposition"].notna().sum()
            total_apps = df_app.shape[0]
            cov = round(dispositioned / total_apps * 100, 1) if total_apps > 0 else 0
        else:
            cov = 0
        st.metric("📐 App Inventory Coverage", f"{cov}%",
                  delta="Owner-defined target")
        st.caption("Source: application_inventory.csv")

    st.divider()

    # --- Revenue by Business Unit (Finance data present, KPI label unavailable) ---
    st.subheader("Revenue by Business Unit — Synthetic Data (Finance KPI formula not approved)")
    df_rev = D["revenue"]
    if not df_rev.empty:
        rev_bu = df_rev.groupby("Business_Unit")["Revenue"].sum().reset_index()
        fig = px.bar(
            rev_bu, x="Business_Unit", y="Revenue",
            labels={"Revenue": "Revenue (CAD)", "Business_Unit": "Business Unit"},
            color="Business_Unit", color_discrete_sequence=px.colors.qualitative.Set2,
            title="Revenue by Business Unit (CAD) — SYNTHETIC",
        )
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Revenue data file not found.")

    # --- Demand Forecast for selected month ---
    st.subheader(f"Demand Forecast by Product — {selected_month}")
    if not df_fc.empty:
        df_month = df_fc[df_fc["Month"] == selected_month]
        if not df_month.empty:
            fig2 = px.bar(
                df_month.groupby("Product")["Forecast_Volume"].sum().reset_index(),
                x="Product", y="Forecast_Volume",
                labels={"Forecast_Volume": "Forecast Volume (litres)", "Product": "Product"},
                title=f"Forecast Volume by Product — {selected_month} — SYNTHETIC",
                color_discrete_sequence=["#1f77b4"],
            )
            fig2.update_layout(xaxis_tickangle=-30)
            st.plotly_chart(fig2, use_container_width=True)
        else:
            st.info(f"No forecast rows for {selected_month}.")

    # --- Scenario impact ---
    st.subheader("Demand Scenario Impact (Cold Winter 2026-27)")
    df_sc = D["demand_scenarios"]
    if not df_sc.empty:
        df_sc_copy = df_sc.copy()
        df_sc_copy["Demand_Impact"] = pd.to_numeric(df_sc_copy["Demand_Impact"], errors="coerce")
        fig3 = px.bar(
            df_sc_copy, x="Product", y="Demand_Impact",
            color="Demand_Impact", color_continuous_scale="RdYlGn",
            labels={"Demand_Impact": "Impact Multiplier", "Product": "Product"},
            title="Scenario: Cold Winter 2026-27 — Demand Impact by Product",
        )
        fig3.update_layout(xaxis_tickangle=-30, coloraxis_showscale=False)
        st.plotly_chart(fig3, use_container_width=True)


# ===========================================================================
# PAGE 2 — ASSET DASHBOARD
# ===========================================================================
def page_assets():
    st.title("🔧 Asset Dashboard")
    st.caption(SYNTHETIC_NOTE)

    df_am = D["asset_master"]
    df_mh = D["maint_history"]
    df_assets_md = D["assets_md"]

    if df_am.empty:
        st.warning("Asset master data not found.")
        return

    # --- Filters ---
    col1, col2 = st.columns(2)
    with col1:
        sites = ["All"] + sorted(df_am["Site"].dropna().unique().tolist())
        selected_site = st.selectbox("Filter by Site", sites)
    with col2:
        crits = ["All"] + sorted(df_am["Criticality"].dropna().unique().tolist())
        selected_crit = st.selectbox("Filter by Criticality", crits)

    df_filtered = df_am.copy()
    if selected_site != "All":
        df_filtered = df_filtered[df_filtered["Site"] == selected_site]
    if selected_crit != "All":
        df_filtered = df_filtered[df_filtered["Criticality"] == selected_crit]

    st.divider()

    # --- KPI Cards ---
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Total Assets (filtered)", f"{df_filtered.shape[0]:,}")
    with c2:
        active = df_filtered[df_filtered["Status"] == "Active"].shape[0]
        st.metric("Active Assets", f"{active:,}")
    with c3:
        total_rv = df_filtered["Replacement_Value"].sum()
        st.metric("Total Replacement Value", f"${total_rv:,.0f}")
    with c4:
        crit_a = df_filtered[df_filtered["Criticality"] == "A"].shape[0]
        st.metric("Criticality A Assets", f"{crit_a:,}",
                  delta="High priority" if crit_a > 0 else None,
                  delta_color="inverse" if crit_a > 0 else "normal")

    st.divider()

    # --- Asset count by type ---
    col_l, col_r = st.columns(2)
    with col_l:
        st.subheader("Assets by Type")
        type_counts = df_filtered["Asset_Type"].value_counts().reset_index()
        type_counts.columns = ["Asset_Type", "Count"]
        fig1 = px.bar(
            type_counts.head(15), x="Count", y="Asset_Type", orientation="h",
            color_discrete_sequence=["#2196F3"],
            title="Asset Count by Type (top 15)",
        )
        fig1.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig1, use_container_width=True)

    with col_r:
        st.subheader("Assets by Criticality")
        crit_counts = df_filtered["Criticality"].value_counts().reset_index()
        crit_counts.columns = ["Criticality", "Count"]
        fig2 = px.pie(
            crit_counts, names="Criticality", values="Count",
            color_discrete_sequence=px.colors.qualitative.Set1,
            title="Distribution by Criticality",
        )
        st.plotly_chart(fig2, use_container_width=True)

    # --- Assets by site ---
    st.subheader("Assets by Site")
    site_counts = df_filtered["Site"].value_counts().reset_index()
    site_counts.columns = ["Site", "Count"]
    fig3 = px.bar(
        site_counts, x="Site", y="Count",
        color_discrete_sequence=["#4CAF50"],
        title="Asset Count by Site",
    )
    st.plotly_chart(fig3, use_container_width=True)

    # --- Maintenance history ---
    st.subheader("Maintenance History — Top Work Orders by Cost")
    if not df_mh.empty:
        df_mh_f = df_mh.copy()
        if selected_site != "All":
            df_mh_f = df_mh_f[df_mh_f["Site"] == selected_site]
        df_mh_f["Cost"] = pd.to_numeric(df_mh_f["Cost"], errors="coerce")
        top_wo = df_mh_f.nlargest(20, "Cost")[
            ["Work_Order", "Asset_ID", "Order_Description", "Priority", "Cost", "Status", "Site"]
        ].reset_index(drop=True)
        st.dataframe(top_wo, use_container_width=True)

        # Cost by priority
        cost_by_priority = (
            df_mh_f.groupby("Priority")["Cost"].sum().reset_index()
            .rename(columns={"Cost": "Total_Cost"})
        )
        fig4 = px.bar(
            cost_by_priority, x="Priority", y="Total_Cost",
            labels={"Total_Cost": "Total Maintenance Cost (CAD)"},
            color_discrete_sequence=["#FF5722"],
            title="Total Maintenance Cost by Priority",
        )
        st.plotly_chart(fig4, use_container_width=True)
    else:
        st.info("Maintenance history data not found.")

    # --- Asset table ---
    st.subheader("Asset Register (filtered)")
    show_cols = ["Asset_ID", "Asset_Name", "Asset_Type", "Site", "Site_Name",
                 "Province", "Criticality", "Status", "Replacement_Value", "Manufacturer", "Install_Date"]
    disp_cols = [c for c in show_cols if c in df_filtered.columns]
    st.dataframe(df_filtered[disp_cols].reset_index(drop=True), use_container_width=True)


# ===========================================================================
# PAGE 3 — CUSTOMER DASHBOARD
# ===========================================================================
def page_customers():
    st.title("🛒 Customer Dashboard")
    st.caption(SYNTHETIC_NOTE)

    df_cust = D["customers"]
    df_orders = D["customer_orders"]

    if df_cust.empty:
        st.warning("Customer master data not found.")
        return

    # --- Filters ---
    col1, col2, col3 = st.columns(3)
    with col1:
        regions = ["All"] + sorted(df_cust["Region_ID"].dropna().unique().tolist())
        sel_region = st.selectbox("Filter by Region", regions)
    with col2:
        segments = ["All"] + sorted(df_cust["Segment_Name"].dropna().unique().tolist())
        sel_segment = st.selectbox("Filter by Segment", segments)
    with col3:
        statuses = ["All"] + sorted(df_cust["Status"].dropna().unique().tolist())
        sel_status = st.selectbox("Filter by Status", statuses)

    df_c = df_cust.copy()
    if sel_region != "All":
        df_c = df_c[df_c["Region_ID"] == sel_region]
    if sel_segment != "All":
        df_c = df_c[df_c["Segment_Name"] == sel_segment]
    if sel_status != "All":
        df_c = df_c[df_c["Status"] == sel_status]

    st.divider()

    # --- KPI Cards ---
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Total Customers (filtered)", f"{df_c.shape[0]:,}")
    with c2:
        active_c = df_c[df_c["Status"] == "Active"].shape[0]
        st.metric("Active Customers", f"{active_c:,}")
    with c3:
        total_credit = df_c["Credit_Limit_CAD"].sum() if "Credit_Limit_CAD" in df_c.columns else 0
        st.metric("Total Credit Limit", f"${total_credit:,.0f}")
    with c4:
        if not df_orders.empty and "Order_Value_CAD" in df_orders.columns:
            total_order_val = df_orders["Order_Value_CAD"].sum()
            st.metric("Total Order Value", f"${total_order_val:,.0f}")
        else:
            st.metric("Total Order Value", "—")

    st.divider()

    # --- Charts row 1 ---
    col_l, col_r = st.columns(2)
    with col_l:
        st.subheader("Customers by Segment")
        seg_counts = df_c["Segment_Name"].value_counts().reset_index()
        seg_counts.columns = ["Segment", "Count"]
        fig1 = px.bar(
            seg_counts.head(15), x="Count", y="Segment", orientation="h",
            color_discrete_sequence=["#9C27B0"],
            title="Customer Count by Segment (top 15)",
        )
        fig1.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig1, use_container_width=True)

    with col_r:
        st.subheader("Customers by Credit Rating")
        cr_counts = df_c["Credit_Rating"].value_counts().reset_index()
        cr_counts.columns = ["Credit_Rating", "Count"]
        fig2 = px.pie(
            cr_counts, names="Credit_Rating", values="Count",
            color_discrete_sequence=px.colors.qualitative.Pastel,
            title="Credit Rating Distribution",
        )
        st.plotly_chart(fig2, use_container_width=True)

    # --- Order analysis ---
    if not df_orders.empty:
        st.subheader("Order Value by Product")
        df_orders["Order_Value_CAD"] = pd.to_numeric(df_orders["Order_Value_CAD"], errors="coerce")
        prod_val = (
            df_orders.groupby("Product")["Order_Value_CAD"].sum()
            .reset_index().sort_values("Order_Value_CAD", ascending=False)
        )
        fig3 = px.bar(
            prod_val.head(15), x="Product", y="Order_Value_CAD",
            labels={"Order_Value_CAD": "Order Value (CAD)"},
            color_discrete_sequence=["#00BCD4"],
            title="Order Value by Product (top 15, CAD)",
        )
        fig3.update_layout(xaxis_tickangle=-30)
        st.plotly_chart(fig3, use_container_width=True)

        st.subheader("Order Value by Region")
        reg_val = (
            df_orders.groupby("Region")["Order_Value_CAD"].sum()
            .reset_index().sort_values("Order_Value_CAD", ascending=False)
        )
        fig4 = px.bar(
            reg_val, x="Region", y="Order_Value_CAD",
            labels={"Order_Value_CAD": "Order Value (CAD)"},
            color_discrete_sequence=["#FF9800"],
            title="Order Value by Region (CAD)",
        )
        st.plotly_chart(fig4, use_container_width=True)

    # --- Customer table ---
    st.subheader("Customer Register (filtered)")
    show_cols = ["Customer_ID", "Customer_Name", "Customer_Type", "Segment_Name",
                 "Region_ID", "Province", "City", "Primary_Supply_Plant_ID",
                 "Credit_Limit_CAD", "Credit_Rating", "Status", "Customer_Since"]
    disp_cols = [c for c in show_cols if c in df_c.columns]
    st.dataframe(df_c[disp_cols].reset_index(drop=True), use_container_width=True)


# ===========================================================================
# PAGE 4 — SUPPLIER DASHBOARD
# ===========================================================================
def page_suppliers():
    st.title("📦 Supplier Dashboard")
    st.caption(SYNTHETIC_NOTE)

    df_sup = D["suppliers"]
    df_po = D["purchase_orders"]

    if df_sup.empty:
        st.warning("Supplier master data not found.")
        return

    # --- Filters ---
    col1, col2, col3 = st.columns(3)
    with col1:
        categories = ["All"] + sorted(df_sup["Category"].dropna().unique().tolist())
        sel_cat = st.selectbox("Filter by Category", categories)
    with col2:
        risk_tiers = ["All"] + sorted(df_sup["Risk_Tier"].dropna().unique().tolist())
        sel_risk = st.selectbox("Filter by Risk Tier", risk_tiers)
    with col3:
        prefs = ["All"] + sorted(df_sup["Preference_Status"].dropna().unique().tolist())
        sel_pref = st.selectbox("Filter by Preference Status", prefs)

    df_s = df_sup.copy()
    if sel_cat != "All":
        df_s = df_s[df_s["Category"] == sel_cat]
    if sel_risk != "All":
        df_s = df_s[df_s["Risk_Tier"] == sel_risk]
    if sel_pref != "All":
        df_s = df_s[df_s["Preference_Status"] == sel_pref]

    st.divider()

    # --- KPI Cards ---
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Total Suppliers (filtered)", f"{df_s.shape[0]:,}")
    with c2:
        active_s = df_s[df_s["Status"] == "Active"].shape[0]
        st.metric("Active Suppliers", f"{active_s:,}")
    with c3:
        total_po_val = df_s["PO_Value_CAD"].sum() if "PO_Value_CAD" in df_s.columns else 0
        st.metric("Total PO Value", f"${total_po_val:,.0f}")
    with c4:
        total_contract_val = df_s["Contract_Value_CAD"].sum() if "Contract_Value_CAD" in df_s.columns else 0
        st.metric("Total Contract Value", f"${total_contract_val:,.0f}")

    st.divider()

    # --- Charts row 1 ---
    col_l, col_r = st.columns(2)
    with col_l:
        st.subheader("Suppliers by Category")
        cat_counts = df_s["Category"].value_counts().reset_index()
        cat_counts.columns = ["Category", "Count"]
        fig1 = px.bar(
            cat_counts.head(15), x="Count", y="Category", orientation="h",
            color_discrete_sequence=["#3F51B5"],
            title="Supplier Count by Category (top 15)",
        )
        fig1.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig1, use_container_width=True)

    with col_r:
        st.subheader("Risk Tier Distribution")
        risk_counts = df_s["Risk_Tier"].value_counts().reset_index()
        risk_counts.columns = ["Risk_Tier", "Count"]
        fig2 = px.pie(
            risk_counts, names="Risk_Tier", values="Count",
            color_discrete_sequence=["#F44336", "#FF9800", "#4CAF50"],
            title="Suppliers by Risk Tier",
        )
        st.plotly_chart(fig2, use_container_width=True)

    # --- Preference status ---
    st.subheader("PO Value by Preference Status")
    if "PO_Value_CAD" in df_s.columns and "Preference_Status" in df_s.columns:
        pref_val = (
            df_s.groupby("Preference_Status")["PO_Value_CAD"].sum()
            .reset_index().sort_values("PO_Value_CAD", ascending=False)
        )
        fig3 = px.bar(
            pref_val, x="Preference_Status", y="PO_Value_CAD",
            labels={"PO_Value_CAD": "Total PO Value (CAD)", "Preference_Status": "Preference Status"},
            color_discrete_sequence=["#009688"],
            title="PO Value by Preference Status (CAD)",
        )
        st.plotly_chart(fig3, use_container_width=True)

    # --- Risk score scatter ---
    st.subheader("Supplier Risk Score vs PO Value")
    if "Risk_Score" in df_s.columns and "PO_Value_CAD" in df_s.columns:
        fig4 = px.scatter(
            df_s, x="Risk_Score", y="PO_Value_CAD",
            hover_data=["Supplier_Name", "Category", "Risk_Tier"],
            color="Risk_Tier",
            size="PO_Value_CAD",
            labels={"Risk_Score": "Risk Score", "PO_Value_CAD": "PO Value (CAD)"},
            title="Risk Score vs PO Value per Supplier",
            color_discrete_map={"High": "#F44336", "Medium": "#FF9800", "Low": "#4CAF50"},
        )
        st.plotly_chart(fig4, use_container_width=True)

    # --- Purchase orders table ---
    if not df_po.empty:
        st.subheader("Purchase Orders")
        df_po["Value"] = pd.to_numeric(df_po["Value"], errors="coerce")
        df_po["Quantity"] = pd.to_numeric(df_po["Quantity"], errors="coerce")
        top_po = df_po.nlargest(20, "Value").reset_index(drop=True)
        st.dataframe(top_po, use_container_width=True)

        # PO value by supplier (top 15)
        po_by_sup = (
            df_po.groupby("Supplier")["Value"].sum()
            .reset_index().sort_values("Value", ascending=False).head(15)
        )
        fig5 = px.bar(
            po_by_sup, x="Value", y="Supplier", orientation="h",
            labels={"Value": "Total PO Value (CAD)", "Supplier": "Supplier ID"},
            color_discrete_sequence=["#795548"],
            title="Top 15 Suppliers by PO Value (CAD)",
        )
        fig5.update_layout(yaxis={"categoryorder": "total ascending"})
        st.plotly_chart(fig5, use_container_width=True)

    # --- Supplier table ---
    st.subheader("Supplier Register (filtered)")
    show_cols = ["Supplier_ID", "Supplier_Name", "Category", "Spend_Category_Group",
                 "Supplier_Type", "Country", "Province_State", "City",
                 "Risk_Score", "Risk_Tier", "Preference_Status",
                 "Safety_Prequalified", "Status", "PO_Count", "PO_Value_CAD",
                 "Contract_Count", "Contract_Value_CAD"]
    disp_cols = [c for c in show_cols if c in df_s.columns]
    st.dataframe(df_s[disp_cols].reset_index(drop=True), use_container_width=True)


# ===========================================================================
# Router
# ===========================================================================
if page == PAGES[0]:
    page_executive()
elif page == PAGES[1]:
    page_assets()
elif page == PAGES[2]:
    page_customers()
elif page == PAGES[3]:
    page_suppliers()

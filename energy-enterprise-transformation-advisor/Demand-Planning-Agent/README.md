# Demand Planning Agent

## Purpose

The Demand Planning Agent delivers AI-powered demand forecasting and capacity alignment for energy enterprises. It integrates market signals, customer data, and operational constraints to generate accurate demand forecasts across products, regions, and time horizons — enabling proactive supply planning, inventory optimization, and commercial decision-making.

## Scope

### In Scope
- Short, medium, and long-term demand forecasting (products, regions, customers)
- Demand signal integration (market data, weather, economic indicators)
- Sales and operations planning (S&OP) support
- Forecast accuracy measurement and continuous improvement
- Seasonal and event-driven demand pattern analysis
- Demand shaping and influencing through commercial levers

### Out of Scope
- Physical supply scheduling and logistics execution
- Procurement and sourcing decisions
- Financial budgeting and cost management

### Interacts With
- **Supply-Planning-Agent**: Feeds demand forecasts to drive supply and inventory plans
- **Commercial-Marketing-Agent**: Aligns demand signals with commercial pricing and targeting
- **Finance-Agent**: Provides volume forecasts for revenue and margin planning
- **Logistics-Agent**: Coordinates demand-driven transport and distribution requirements

## Business Capabilities

### Demand Forecasting
- Statistical forecasting models (ARIMA, exponential smoothing, ML-based)
- Multi-level forecasting: SKU, product family, region, channel, customer
- Consensus forecast development and bias detection
- Short-range operational forecasts (daily/weekly) and long-range planning forecasts (monthly/annual)

### Demand Sensing and Intelligence
- Real-time demand signal capture from POS, pipeline, and market data
- Weather and macroeconomic correlation modelling
- Customer order pattern analysis and anomaly detection
- Event-driven demand modelling (seasonality, shutdowns, regulatory changes)

### S&OP Integration
- Facilitation of monthly S&OP cycle (unconstrained and constrained plans)
- Demand-supply gap analysis and exception management
- Scenario planning for upside/downside demand cases
- Cross-functional alignment across supply, commercial, and finance

### Forecast Performance Management
- MAPE, BIAS, and forecast accuracy KPI tracking
- Root cause analysis for forecast variances
- Continuous model recalibration and improvement
- Demand planning maturity assessment and roadmap

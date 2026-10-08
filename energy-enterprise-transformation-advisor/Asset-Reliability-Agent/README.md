# Asset Reliability Agent

## Purpose

The Asset Reliability Agent provides AI-powered asset lifecycle management, predictive maintenance, and reliability engineering support for energy enterprises. It enables proactive equipment health monitoring, failure prediction, and maintenance optimization across rotating equipment, static assets, and critical infrastructure — reducing unplanned downtime, extending asset life, and optimizing maintenance costs.

## Scope

### In Scope
- Predictive and condition-based maintenance (CBM)
- Asset health monitoring and anomaly detection
- Reliability-centred maintenance (RCM) analysis
- Maintenance planning and scheduling optimization
- Asset lifecycle management and CAPEX planning
- Spare parts strategy for critical equipment

### Out of Scope
- New asset procurement and contracting (handled by Procurement-Agent)
- Turnaround and major project execution (handled by Refining-Operations-Agent)
- HSE incident investigation and management (handled by HSE-Agent)

### Interacts With
- **Upstream-Operations-Agent**: Provides well and field equipment reliability data for production planning
- **Refining-Operations-Agent**: Integrates equipment status with refinery production scheduling
- **Procurement-Agent**: Identifies MRO and spare parts requirements for planned maintenance
- **HSE-Agent**: Ensures equipment integrity aligns with process safety requirements

## Business Capabilities

### Predictive Maintenance
- Machine learning-based failure prediction from sensor and SCADA data
- Remaining useful life (RUL) estimation for rotating equipment
- Vibration, temperature, and pressure anomaly detection
- Real-time equipment health dashboards and early warning alerts
- Integration with IoT platforms and historian systems (OSIsoft PI, etc.)

### Reliability Engineering
- Failure modes, effects, and criticality analysis (FMECA)
- Reliability-centred maintenance (RCM) strategy development
- Fault tree analysis (FTA) and root cause analysis (RCA)
- Mean time between failures (MTBF) and mean time to repair (MTTR) tracking
- Equipment criticality ranking and maintenance prioritization

### Maintenance Planning and Scheduling
- Work order management and maintenance scheduling optimization
- Preventive maintenance (PM) programme effectiveness analysis
- Maintenance resource planning (labour, tools, parts)
- Shutdown and opportunity maintenance planning
- Backlog management and wrench time optimization

### Asset Lifecycle Management
- Asset register management and equipment data governance
- Life extension studies and end-of-life assessment
- CAPEX justification for asset replacement vs. repair
- Decommissioning planning and cost estimation
- Asset performance benchmarking against industry standards

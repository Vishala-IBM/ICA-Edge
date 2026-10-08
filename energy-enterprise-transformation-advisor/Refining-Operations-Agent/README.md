# Refining Operations Agent

## Purpose

The Refining Operations Agent provides AI-powered optimization and operational intelligence for petroleum refinery management. It supports crude oil processing, unit operations optimization, product yield management, and turnaround planning — enabling refinery operators to maximize margin, improve throughput, ensure product quality, and maintain safe operations.

## Scope

### In Scope
- Refinery production planning and crude oil feedstock optimization
- Process unit optimization (CDU, FCC, HDS, reformer, coker, etc.)
- Product yield optimization and quality management
- Turnaround and maintenance planning
- Energy efficiency and utility management
- Refinery margin and economics analysis

### Out of Scope
- Crude oil exploration and production (handled by Upstream-Operations-Agent)
- Product distribution and logistics (handled by Logistics-Agent)
- Commodity trading and sales execution (handled by Sales-Trading-Agent)

### Interacts With
- **Supply-Planning-Agent**: Receives crude feedstock availability and product demand plans
- **Asset-Reliability-Agent**: Integrates equipment reliability for production planning
- **HSE-Agent**: Ensures process safety and environmental compliance in refinery operations
- **Finance-Agent**: Provides refinery margin and cost data for financial reporting

## Business Capabilities

### Crude and Feedstock Optimization
- Crude oil evaluation and selection (assay analysis, compatibility testing)
- Linear programming (LP) model for crude blend optimization
- Feedstock scheduling and receipts planning
- Crude oil cost vs. yield trade-off analysis

### Process Unit Optimization
- Real-time process monitoring and performance benchmarking
- Unit-specific optimization (FCC conversion, hydrocracker yield, reformer severity)
- Advanced process control (APC) integration and tuning
- Energy intensity and steam/fuel balance optimization

### Product Yield and Quality Management
- Product yield optimization across the refinery network
- Quality specification compliance (RON, pour point, flash point, sulphur)
- Blending optimization for gasoline, diesel, jet fuel, and fuel oil
- Off-spec product management and rework planning

### Turnaround and Maintenance Planning
- Turnaround scope development and cost estimation
- Critical path scheduling for turnaround execution
- Resource and contractor planning for planned shutdowns
- Post-turnaround performance restoration tracking

### Refinery Economics
- Refinery margin calculation (gross, net, NCI)
- Opportunity crude evaluation and lift cost analysis
- Sensitivity analysis for crude price, product crack spreads, and energy costs
- Benchmark performance against regional refinery complexity (Nelson Complexity Index)

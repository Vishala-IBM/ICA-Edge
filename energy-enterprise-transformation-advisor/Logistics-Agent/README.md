# Logistics Agent

## Purpose

The Logistics Agent provides AI-powered transportation and distribution management for energy enterprises. It optimizes the movement of crude oil, refined products, gas, chemicals, and equipment across pipelines, tankers, trucks, and rail — ensuring safe, cost-efficient, and timely delivery to customers, refineries, and distribution terminals.

## Scope

### In Scope
- Transportation planning and carrier management (road, rail, pipeline, marine)
- Route optimization and load planning
- Freight cost management and carrier contract negotiation
- Last-mile delivery optimization
- Shipment tracking and real-time visibility
- Dangerous goods and HAZMAT transport compliance

### Out of Scope
- Warehouse storage and inventory management (handled by Warehouse-Agent)
- Procurement of transportation services (handled by Procurement-Agent)
- Customer invoicing and financial settlement

### Interacts With
- **Supply-Planning-Agent**: Receives supply schedules to plan transport requirements
- **Warehouse-Agent**: Coordinates inbound/outbound shipments with storage operations
- **Commercial-Marketing-Agent**: Aligns delivery schedules with customer commitments
- **HSE-Agent**: Ensures dangerous goods transport meets HSE requirements

## Business Capabilities

### Transportation Planning
- Multi-modal transport planning (pipeline, marine, road, rail)
- Load planning and vehicle/vessel utilization optimization
- Freight consolidation and backhaul optimization
- Transport network design and corridor analysis

### Route Optimization
- Real-time route optimization considering traffic, distance, and cost
- Hazardous route identification and safe routing for HAZMAT loads
- Delivery time window management and priority dispatch
- Emergency rerouting and contingency logistics planning

### Carrier and Cost Management
- Carrier performance monitoring (on-time delivery, damage rates)
- Freight rate benchmarking and contract compliance
- Spot vs. contract freight sourcing optimization
- Freight cost allocation by business unit and product

### Compliance and Visibility
- Dangerous goods documentation management (ADR, IMDG, IATA)
- Real-time shipment tracking and ETA management
- Carbon footprint tracking for logistics operations
- Customs clearance support for cross-border shipments

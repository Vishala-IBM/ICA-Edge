# Skill: Logistics Agent

## Description
Plans and monitors safe, cost-effective movement of energy products, materials, and equipment by pipeline, marine, rail, and road. It recommends logistics actions; dispatch, carrier award, and regulated transport decisions remain with authorized operators.

## Applicable Domains
Transportation planning, freight, route/load optimization, shipment visibility, carrier performance, dangerous goods, and distribution networks.

## Purpose and Scope
Use for shipment planning, carrier/lane comparison, freight cost, ETA and exception monitoring, transport capacity, and compliance evidence. Warehouse owns storage; Procurement owns service sourcing; Commercial/Sales owns customer commitments and billing.

## Business Capabilities
- Multimodal shipment, load, route, lane, and network planning; utilization and backhaul analysis.
- Freight cost and carrier contract/performance analysis, shipment tracking, ETA and disruption response.
- Dangerous goods documentation, cross-border support, and transport carbon measurement.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Shipment / freight order | Shipment ID, mode, origin/destination, product/material, quantity/UoM, dates, status, customer/order link | `sample-data/shipments.csv` |
| Location / network lane | Plant, terminal, warehouse, customer ship-to, region, route, distance, capacity | Master plants, warehouses, facilities, regions; pseudo-sites in dictionary require Ship-To master |
| Carrier / service provider | Carrier ID, mode, lane/region, service, contract/rate, performance | `carrier_performance.csv`, `freight_costs.csv`; carrier master is a documented gap |
| Freight charge | Invoice/charge, currency, shipment, tariff/rate, allocation, terms | `freight_costs.csv` |
| Product / dangerous goods | Product/material, volume/weight, UoM, UN number, TDG class, packing group | Master product; indicative dangerous-goods attributes noted as non-regulatory |
| Business unit / emissions factor | Owner, cost allocation, fuel/mode, emissions and period | Master BU; ESG interaction |

## KPIs
| KPI | Definition / use |
|---|---|
| On-time delivery | Deliveries meeting agreed delivery window / delivered shipments; specify requested vs confirmed date. |
| Damage / loss rate | Shipments with damage, loss, or contamination / eligible shipments. |
| Freight cost per unit-distance | Freight cost / quantity-distance (e.g., tonne-km); normalize product units and modal tariffs. |
| Carrier score | Weighted on-time, damage, cost, safety, and compliance measures; disclose weights. |
| Vehicle/vessel utilization | Loaded capacity used / available capacity. |
| Transport emissions intensity | CO2e / tonne-km or other approved activity unit and boundary. |

Sample carrier rates are synthetic; the shared enterprise KPI model does not assign targets to Logistics.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Delivery and shipment documents | SD deliveries `LIKP`/`LIPS`; LE-TRA shipment `VTTK`/`VTTP` where used | SAP Transportation Management freight units/orders, freight bookings, carrier and charge APIs; embedded TM where licensed. |
| Transport and product master | Material `MARA`/`MARC`, customer `KNA1`, plant `T001W`; shipment partner data | Business Partner, material, plant, TM locations/resources; master keys harmonized to advisor IDs. |
| Freight cost and settlement | Shipment cost documents / MM service or FI postings, configuration-dependent | TM freight settlement and S/4HANA Finance postings (`ACDOCA`); use released interfaces. |
| Oil distribution / trade compliance | IS-Oil Transportation & Distribution; SAP GTS where deployed | IS-Oil T&D, TM, GTS; pipeline scheduling/SCADA is not provided by SAP per architecture reference. |

ECC table set varies by LE-TRA/IS-Oil configuration; confirm actual flow and API availability. The repository’s architecture marks pipeline batch scheduling and SCADA as non-SAP capabilities.

## Agent Dependencies and Handoffs
- Supply Planning: supply schedule, planned quantities, and required delivery windows.
- Warehouse: loading/receiving readiness, stock and dock coordination.
- Commercial Marketing: customer delivery commitments and priorities.
- HSE: dangerous-goods rules, safety controls, incident/route restrictions.
- Procurement: carrier sourcing and contract terms.

These are README interactions; the central event model does not define logistics payloads. Preserve Ship-To versus plant/warehouse location semantics.

## Outputs and Escalation
Outputs: feasible shipment plan, mode/carrier options, ETA and delay alerts, freight-cost analysis, compliance checklist, and emissions estimate. Escalate safety incidents, dangerous-goods/documentation gaps, customs holds, missed critical deliveries, or rate/contract exceptions to human owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Sample carriers/locations are synthetic; the master-data guide flags missing carrier and Ship-To entities.

## Version
1.0.0 (initial skill; mode-specific SAP deployment and regulatory attributes require validation).

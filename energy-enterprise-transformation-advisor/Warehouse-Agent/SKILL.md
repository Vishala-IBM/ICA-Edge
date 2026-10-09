# Skill: Warehouse Agent

## Description
Advises on inventory accuracy, warehouse execution, storage, and MRO availability across energy facilities. It supports warehouse operators and does not replace procurement decisions or transport execution.

## Applicable Domains
Warehouse management, materials handling, inventory visibility, cycle counting, storage/slotting, spare parts, hazardous materials, and stock traceability.

## Purpose and Scope
Use for inbound receipt, putaway, stock reconciliation, location utilization, picking/dispatch, spare-part availability, and warehouse compliance. Out of scope: carrier/route ownership, sourcing/PO award, and financial inventory valuation.

## Business Capabilities
- Inventory visibility, bin/location tracking, cycle counts, stock adjustments, rotation, and SLOB management.
- Receiving, inspection, putaway, picking, packing, dispatch, cross-docking, and capacity optimization.
- Critical spares, reorder points, MRO catalog, HAZMAT storage, and traceable movements.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Material/product and inventory batch | Material ID, description, UoM, batch/serial, quantity, valuation/status | `sample-data/inventory_stock.csv`; material/product masters |
| Warehouse / storage location / bin | Warehouse ID, plant, storage location, bin, capacity, hazard rating, status | `inventory_stock.csv`; master `warehouses.csv` |
| Stock movement / count | Movement type, source/destination, quantity, posting/count date, reason, user | `sample-data/warehouse_movements.csv`, `cycle_count.csv` |
| Supplier receipt / purchase order | Supplier, PO line, expected/actual receipt, accepted/rejected quantity | Procurement handoff; process model GR/GI and P2P |
| Maintenance demand / critical spare | Asset, work order, required part, need date, criticality, reservation | Asset Reliability and MRO integration |

A conformed Material master is a known gap; do not treat unlike descriptions/UoMs as the same material without a governed crosswalk.

## KPIs
| KPI | Definition / use |
|---|---|
| Inventory accuracy | Correct counted stock lines / counted lines, or value-weighted accuracy; state chosen measure. |
| Inventory record accuracy | 1 - absolute book-to-physical variance / physical quantity (define zero-stock treatment). |
| Stockout / service level | Unfilled eligible material demand / eligible demand, reported by criticality. |
| Inventory turns / days on hand | Consumption or COGS divided by average inventory; specify value/quantity basis. |
| Warehouse capacity utilization | Occupied usable capacity / available rated capacity. |
| Shrinkage / obsolete stock | Unexplained loss or obsolete/slow-moving value / inventory value. |

Shared enterprise KPIs do not specify warehouse targets; approve thresholds with Supply Planning and Finance.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Plant/storage location/stock | Plant `T001W`, storage location `T001L`, stock `MARD`/`MCHB`, material documents `MKPF`/`MSEG` | MM-IM stock and material documents (`MATDOC`); EWM warehouse/storage bins and stock APIs. |
| Warehouse execution | WM objects (for example transfer orders `LTAK`/`LTAP`) where classic WM is used | Embedded or decentralized SAP EWM; warehouse tasks, handling units, physical inventory, queues and released APIs. |
| Material and supplier | `MARA`/`MARC`; vendor `LFA1`; PO `EKKO`/`EKPO` | Material master; supplier Business Partner; MM/Ariba purchasing integration. |
| Maintenance reservations | PM order/reservation `AUFK`/`RESB` | S/4HANA EAM orders/reservations and API integration with stock availability. |

Object selection depends on classic WM versus EWM deployment. Prefer released APIs/CDS, not direct table updates; table names are ECC reference points.

## Agent Dependencies and Handoffs
- Supply Planning: replenishment signals and inventory targets.
- Procurement: expected receipts and supplier deliveries.
- Logistics: inbound/outbound transport and shipment status.
- Asset Reliability: maintenance work and critical-spare demand.

All are documented in this README; the central interaction model does not specify these warehouse contracts or event payloads.

## Outputs and Escalation
Outputs: inventory exception lists, count/adjustment recommendations, slotting and capacity actions, critical-spare availability, and replenishment alerts. Escalate stock adjustments, hazardous-material exceptions, controlled goods, and critical-spare shortages to authorized warehouse, safety, and inventory owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Synthetic stock and locations require production validation.

## Version
1.0.0 (initial skill; EWM/WM scope and KPI definitions require validation).

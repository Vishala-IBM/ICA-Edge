
# Master Data Architecture

This directory contains synthetic, conformed reference data for joining the 19 agent sample-data domains. The records describe an illustrative integrated Canadian energy company; they are not production data or an approved customer master.

## Contents

### Entity Master CSVs

| File | Entity | Key | Records | Principal relationships |
|---|---|---|---:|---|
| [customers.csv](customers.csv) | Customer/account | `Customer_ID` | 200 | Region, segment, owning business unit, primary supply plant; Sales, Demand, Marketing and credit use. |
| [suppliers.csv](suppliers.csv) | Supplier | `Supplier_ID` | 200 | Region; Procurement PO and contract suppliers. |
| [products.csv](products.csv) | Commercial product portfolio | `Product_ID` | 100 | Owning business unit and primary/producing plants; order, price, demand and production product references. |
| [plants.csv](plants.csv) | Plant, refinery, processing site or terminal | `Plant_ID` | 20 | Region, business unit, warehouses, products and assets. |
| [facilities.csv](facilities.csv) | Upstream/midstream facility or other site | `Facility_ID` | 33 | Region and business unit; wells, asset sites, ESG and HSE locations. |
| [warehouses.csv](warehouses.csv) | Warehouse | `Warehouse_ID` | 15 | Plant, region, business unit and SAP storage-location mapping. WH13-WH15 are not yet referenced by agent sample activity. |
| [assets.csv](assets.csv) | Maintainable asset/equipment | `Asset_ID` | 500 | Exactly one of `Plant_ID` or `Facility_ID`; functional location, criticality and maintenance/failure/incident summaries. |
| [regions.csv](regions.csv) | Region and zone hierarchy | `Region_ID` | 10 | Province codes plus separate pricing, logistics and climate zones. |
| [business_units.csv](business_units.csv) | Conformed reporting/ownership business unit | `Business_Unit_ID` | 10 | Rolls legacy Finance and Strategy/PMO labels to a common reporting hierarchy. |

### Supporting CSVs

| File | Purpose | Key |
|---|---|---|
| [bu_crosswalk.csv](bu_crosswalk.csv) | Maps source-specific business-unit labels into the conformed BU hierarchy. Join using all three source columns, then use the target BU ID. | `Source_Dataset` + `Source_Column` + `Source_Value` |
| [data_relationship_matrix.csv](data_relationship_matrix.csv) | Machine-readable list of dependent agent columns, join method, cardinality, matched coverage, unmatched values and notes. It is relationship metadata, not a business master. | Composite relationship row |

## Documentation and Navigation

- [Detailed master-data model](README_master_data_model.md): source rationale, entity details, relationship coverage, known gaps and recommendations.
- [Master data dictionary](master_data_dictionary.md): field-level definitions, primary keys, SAP mapping fields and record notes for each CSV.
- [Entity relationship model](../entity_relationship_model.md): cross-domain entity catalog, ownership, relationships, cardinality, SAP ECC/S/4HANA mappings and data flows.
- [Agent capability matrix](../agent_capability_matrix.md): agent-to-entity, KPI, process and SAP summary.
- [Agent collaboration patterns](../agent_collaboration_patterns.md): agent handoffs and cross-functional data dependencies.
- [Enterprise process model](../enterprise_process_model.md): process ownership, cross-agent handoffs and SAP process alignment.

## Join Guidance

1. Prefer canonical IDs such as `Customer_ID`, `Supplier_ID`, `Product_ID`, `Plant_ID`, `Facility_ID`, `Warehouse_ID`, `Asset_ID`, `Region_ID`, and `Business_Unit_ID`.
2. For legacy business-unit values, join `bu_crosswalk.csv` on `Source_Dataset`, `Source_Column`, and `Source_Value`. Some crosswalk rows have a secondary BU; follow the documented primary/secondary semantics.
3. Asset and HSE `Site`/`Location` values can refer to either a plant or a facility. Resolve against the appropriate master and preserve the source type; do not assume every site code is a plant.
4. Region, province, pricing zone, logistics zone, and climate zone are distinct concepts. Use the appropriate attribute, not a similarly named value.
5. Some agent files use names or legacy codes rather than canonical IDs. Check `data_relationship_matrix.csv` for join type and coverage, record any alias/crosswalk used, and retain unmatched records for remediation rather than silently dropping them.

## Known Gaps and Caveats

- A conformed Material master is not present. Product portfolio IDs do not cover all purchased materials, MRO parts, feedstocks, and inventory items.
- Carrier, Ship-To/Delivery Location, Counterparty, Commodity/Benchmark, Cost Center/GL Account, Well, Project/Program, Contract, Employee/Organization/Role, Calendar/Period, and UoM/Currency entities need further governance or master design.
- Customer coverage for Demand Planning forecasts, logistics destination locations, product/material joins, supplier-to-carrier links, and Finance BU/cost-object joins is incomplete or based on names. See the detailed relationship matrix for measured coverage and examples.
- Master attributes include derived counts, indicative SAP codes and synthetic values. Validate ownership, accuracy, effective dates, regulatory classifications and SAP mappings before operational use.
- Do not treat a business unit as a legal entity, a customer account as a ship-to, a product as every material, or a supplier as automatically equivalent to a carrier or trading counterparty.

## Ownership

Business owners should steward domain meaning and data changes; Data Analytics supports definitions, quality rules, lineage and cross-domain integration. Suggested primary stewardship is Finance for business-unit/reporting hierarchy, Commercial/Sales for customer/product, Procurement for suppliers, Operations for plants/facilities, Warehouse for warehouse locations, and Asset Reliability for equipment. Confirm formal owners and approval rights with the enterprise governance body.

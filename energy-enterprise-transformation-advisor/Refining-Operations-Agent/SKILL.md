# Skill: Refining Operations Agent

## Description
Analyzes refinery operations, feedstock, process performance, product yield/quality, energy, economics, and turnarounds to recommend operating and planning improvements. It is advisory and does not control a DCS/APC.

## Applicable Domains
Crude/feedstock planning, refinery process operations, production/yield, quality, energy/utilities, margin, and turnaround planning.

## Purpose and Scope
Use for refinery schedule and throughput scenarios, unit performance, yield/quality variance, crude slate economics, energy intensity, and shutdown planning. Upstream resource production, physical distribution, and commodity sales execution are separate agent domains.

## Business Capabilities
- Crude assay/compatibility and blend/feedstock optimization; feed receipts and schedule analysis.
- Process-unit performance, APC coordination, throughput, energy, yields, blending, and specification compliance.
- Turnaround scope, critical path, costs/resources, and post-startup performance; refinery margin and sensitivities.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Refinery / process unit / equipment | Plant/site, unit, rated capacity, status, outage, asset ID | `sample-data/refinery_performance.csv`; master plants/assets |
| Feedstock/crude and product/material | Assay/quality, quantity, unit, price, blend, product hierarchy | `refinery_output.csv`, `yield_analysis.csv`; product master; feedstock/material master gap |
| Process order / production output | Refinery, period, input/output quantity, product, unit, plan/actual | `refinery_output.csv`; Supply Planning production plan |
| Quality / inspection / specification | Product, batch, characteristic, test, limit, result, disposition | README requirements; detailed LIMS/spec schema not supplied |
| Energy and utility measurement | Fuel/steam/power/water, period, unit, throughput denominator | `refinery_performance.csv` energy intensity and plant data |
| Turnaround / maintenance event | Scope, work order, asset, dates, resources, cost, critical path | Asset Reliability maintenance data and README scope |

## KPIs
| KPI | Definition / use |
|---|---|
| Throughput / utilization | Actual crude throughput / nameplate capacity over the same time basis. |
| Yield | Product output / crude input; account for volume gain and product slate, do not assume total liquid yield must equal 100%. |
| Operating efficiency | Composite measure in sample data; validate availability/performance/quality formula before comparison. |
| Energy intensity | GJ consumed / m3 crude processed (or approved equivalent); disclose fuel/utility boundary. |
| Unplanned outage hours / availability | Unplanned downtime and operating time relative to scheduled time, by unit and cause. |
| Refinery margin | Product value less crude/feedstock, operating, and other defined costs; align prices, yields, and period with Finance/Trading. |
| Off-spec rate | Off-spec quantity / total produced or batches; agree quality specifications and disposition. |

Sample dictionary identifies throughput, utilization, efficiency, energy intensity, outage hours, yield, and yield variance; target values require refinery-owner approval.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Process manufacturing | PP-PI process orders (`AFKO`/`AFPO` with process-order configuration), confirmations and material documents | S/4HANA PP-PI, process orders, production confirmations, material documents (`MATDOC`); use released APIs/CDS. |
| Product quality | QM inspection lots `QALS`, inspection characteristics/results `QAM*`, material/batch | S/4HANA QM inspection lots, results, usage decisions, batch/product APIs. |
| Plant, products, inventory | `T001W`, `MARA`/`MARC`, stock `MARD`, `MKPF`/`MSEG` | Plant/product masters, `MATDOC`, Datasphere/IBP integration. |
| Oil-specific processing | IS-Oil Hydrocarbon Product Management (HPM), product/volume processes | S/4HANA IS-Oil HPM where available; confirm release and scope. |
| Process controls, historian, LP, LIMS | Typically DCS/historian and specialist LP/LIMS outside ECC | SAP Digital Manufacturing where fit; architecture reference says DCS, historian, LIMS, and refinery LP are not SAP-native replacements. |

Exact PP-PI/QM and oil industry scope is configuration-dependent; validate API/CDS coverage and simplify custom ECC extensions.

## Agent Dependencies and Handoffs
- Supply Planning: crude/feedstock availability and product demand/supply plans.
- Asset Reliability: equipment status, work orders, and maintenance windows.
- HSE: process-safety, permits, and environmental constraints.
- Finance: margin, energy, maintenance, and cost actuals.
- Upstream Operations: crude availability/quality as upstream feed input.

These are README-level interactions; payload contracts are not defined centrally.

## Outputs and Escalation
Outputs: throughput/yield/energy exceptions, crude/feedstock scenario, production schedule recommendations, quality disposition support, margin sensitivities, and turnaround readiness. Escalate safety/process-control changes, off-spec material release, environmental exceedances, and schedule changes affecting committed supply to authorized operators and quality/HSE owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; master-data docs. Synthetic refinery values and product units require validation before operational use.

## Version
1.0.0 (initial skill; process-system integration and KPI formulas require refinery validation).

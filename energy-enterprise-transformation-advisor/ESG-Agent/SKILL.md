# Skill: ESG Agent

## Description
Supports sustainability strategy, ESG data quality, emissions/water accounting, targets, disclosures, social metrics, and governance reporting for energy enterprises. It prepares evidence and analysis; accountable officers approve disclosures and regulatory submissions.

## Applicable Domains
Climate, GHG, water, nature, social and human-rights metrics, ESG governance, sustainability targets, sustainable finance, and non-financial reporting.

## Purpose and Scope
Use to consolidate ESG performance, calculate approved indicators, assess progress against targets, support frameworks (TCFD, GRI, CSRD, ISSB/IFRS S1/S2, CDP), and analyze transition scenarios. HSE owns incident/occupational controls; Finance owns financial statements; operational controls remain with sites.

## Business Capabilities
- Scope 1/2/3 inventory, emission factors, intensity, reduction pathways, offsets/credits.
- ESG data validation, reporting-boundary management, target tracking, framework mapping, and rating responses.
- Water, biodiversity, social impact, human rights, just transition, governance, and sustainable-finance analysis.

## Enterprise Data Entities
| Entity | Required attributes / relationships | Repository evidence |
|---|---|---|
| Facility / asset / organization | Facility_ID, plant, business unit, region, operator, reporting boundary, ownership | Master facilities/plants/assets/BUs |
| Activity and emissions measurement | Facility, period, source/activity, volume/UoM, CO2, methane, factors, methodology, scope, version | `sample-data/emissions.csv`; dictionary defines CO2e = CO2 + 28 x methane (AR5 GWP100) |
| Water withdrawal/use/reuse | Facility, period, fresh/saline/recycled water, source, volume, activity denominator | `water_consumption.csv` |
| Target / KPI / framework | KPI, baseline, target, period, boundary, method, progress, status, source | `sustainability_targets.csv` |
| Incident / audit / supplier and workforce | Site, event, severity, corrective action, social risk, supplier/person, evidence | HSE and Procurement data; boundaries must avoid double count |
| Emission factor / methodology / evidence | Factor source, vintage, geography, gas, GWP basis, assurance and lineage | Required for auditability; not fully represented in sample data |

## KPIs
| KPI | Definition / use |
|---|---|
| Total CO2e | Sum gases converted using the approved GWP set and reporting boundary; sample uses AR5 methane factor 28. |
| GHG intensity | CO2e / defined activity volume (e.g., kgCO2e/boe or m3 crude); avoid comparing different denominators. |
| Scope 1/2/3 emissions | Categorized emissions using chosen organizational and operational boundaries and reporting standard. |
| Methane intensity / reduction | Methane quantity or CO2e relative to production; confirm measurement and normalization method. |
| Fresh-water intensity / recycle rate | Fresh-water withdrawal or use per activity; recycled water / total water used. |
| Target progress | Progress against approved baseline-to-target path; sample progress is last-12-month data relative to target gap. |

The sample dictionary specifies units, 20-month reporting window, boundary, and 33 derived metrics. Confirm GWP, factor vintage, frameworks and assurance rules; do not use illustrative regulatory data as filed disclosure.

## SAP ECC and S/4HANA Mapping
| Need | ECC reference | S/4HANA target / integration |
|---|---|---|
| Facility, plant, product, financial/activity data | Plant `T001W`, material `MARA`/`MARC`, FI/CO data and site-specific sources | S/4HANA master/operational APIs and Universal Journal as needed; Datasphere conformed dimensions. |
| Environmental, health and safety records | SAP EHS / Environment, Health and Safety components (configuration-dependent) | S/4HANA EHS plus SAP Sustainability Control Tower and Sustainability Footprint Management where deployed. |
| Emissions calculation/disclosure | Often external environmental systems and spreadsheets; no single ECC ESG ledger assumed | Sustainability Footprint Management, Sustainability Control Tower, Datasphere; integrate operational activity and factors. |
| Evidence and reports | Document management and BW reports | Governed analytic models and document evidence; methane measurement/LDAR is not SAP-provided per architecture reference. |

No unsupported ECC table mapping is asserted for ESG facts; use released APIs and validate product licensing and reporting-framework coverage.

## Agent Dependencies and Handoffs
- Finance: ESG-linked financial disclosures and green-finance metrics.
- HSE: incidents, environmental compliance, and safety data.
- Corporate Strategy: transition strategy and portfolio scenarios.
- Procurement: supplier sustainability criteria and supply-chain social risk.
- Data Analytics: governed collection, lineage, and reporting models.

README-level dependencies; no ESG-specific event contract is listed in the central interaction model.

## Outputs and Escalation
Outputs: controlled ESG metric pack, target-progress analysis, emissions/water exception list, methodology and source lineage, scenario insights, and disclosure draft. Escalate boundary/method changes, restatements, assurance findings, potential regulatory breaches, and externally published claims to accountable sustainability, legal, compliance, and assurance owners.

## Assumptions and Source References
Sources: this folder's `README.md`, `sample-data/data_dictionary.md`, and CSVs; `../enterprise_process_model.md`; `../sap_reference_architecture.md`; `../master-data/README_master_data_model.md`. Synthetic factors/boundaries and stated emissions formulas require confirmation against company policy and current standards.

## Version
1.0.0 (initial skill; reporting boundary, factors, and SAP product scope require validation).

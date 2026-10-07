# SAP Architecture Advisor — Search Strategy Reference

How to effectively search each documentation source when researching architecture questions.
Use these strategies before answering any architecture question to ensure current, accurate guidance.

---

## General Research Workflow

For any architecture question, follow this sequence:
1. **Classify the question** → which primary technology(ies) are involved?
2. **Search primary source** → official product docs for the technology
3. **Search secondary source** → community blogs or Microsoft docs if cross-platform
4. **Validate currency** → check if the document mentions a specific product version or date
5. **Synthesize** → combine findings into architecture recommendation

---

## Source 1: help.sap.com

**Best for:** Official SAP product documentation, configuration guides, API references, integration guides

### URL Structure
- Product index: `https://help.sap.com/docs/`
- Product-specific docs: `https://help.sap.com/docs/<PRODUCT_CODE>`

### Key Product Codes
| Product | Help Portal Path |
|---|---|
| SAP Datasphere | `https://help.sap.com/docs/SAP_DATASPHERE` |
| SAP S/4HANA Cloud | `https://help.sap.com/docs/SAP_S4HANA_CLOUD` |
| SAP S/4HANA (on-prem) | `https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE` |
| SAP Analytics Cloud | `https://help.sap.com/docs/SAP_ANALYTICS_CLOUD` |
| SAP HANA Cloud | `https://help.sap.com/docs/HANA_CLOUD` |
| SAP BW/4HANA | `https://help.sap.com/docs/SAP_BW4HANA` |
| SAP Business Data Cloud | `https://help.sap.com/docs/business-data-cloud` |
| SAP BTP Integration Suite | `https://help.sap.com/docs/SAP_INTEGRATION_SUITE` |
| SAP Joule | `https://help.sap.com/docs/joule` |
| SAP AI Core | `https://help.sap.com/docs/sap-ai-core` |
| SAP Knowledge Graph | `https://help.sap.com/docs/sap-knowledge-graph` |

### Search Strategies
- **Site search**: Use `site:help.sap.com <topic> <product>` in a web search
- **Product navigation**: Navigate to the product page, then use the left-tree navigation to find the relevant guide section
- **Deep links**: When citing, prefer direct guide URLs (e.g., `.../be5967d099974c69b77f4549425ca4c0/...`) over top-level product pages
- **Version filtering**: Use the version selector on help.sap.com to ensure you're reading docs for the correct release

### What to Look For
- **Integration guides** (e.g., "Connect S/4HANA to Datasphere")
- **API references** (REST, OData, RFC)
- **Architecture overview diagrams** within the documentation
- **What's New** sections for recent feature additions

---

## Source 2: learning.sap.com

**Best for:** Tutorial workflows, mission-based learning, architecture walkthroughs, free hands-on exercises

### URL Structure
- `https://learning.sap.com/learning-journeys/`
- `https://learning.sap.com/courses/`

### Key Learning Journeys (pre-indexed)
| Topic | URL Pattern |
|---|---|
| SAP Datasphere | `https://learning.sap.com/learning-journeys/discover-sap-datasphere` |
| SAP Analytics Cloud | `https://learning.sap.com/learning-journeys/discover-sap-analytics-cloud` |
| SAP S/4HANA | `https://learning.sap.com/learning-journeys/explore-sap-s-4hana` |
| SAP BTP | `https://learning.sap.com/learning-journeys/discover-sap-btp` |
| SAP AI (Joule, AI Core) | Search `site:learning.sap.com SAP AI Core` |

### Search Strategies
- **Site search**: `site:learning.sap.com <topic>` in web search
- **Use case search**: Search for the specific scenario (e.g., "learning.sap.com S/4HANA Datasphere integration")
- **Architecture missions**: Look for learning journeys that include architecture diagrams as part of the course material

### What to Look For
- Step-by-step integration tutorials with screenshots
- Architecture context embedded in learning missions
- Free tier access (many courses are accessible without login for reading)

---

## Source 3: community.sap.com

**Best for:** Architecture blogs, expert opinions, real-world implementation experience, Q&A, workarounds

### URL Structure
- Community blogs: `https://community.sap.com/t5/forums/postpage/choose-node/true`
- Search: `https://community.sap.com/t5/custom/page/page-id/Search`
- Topic pages: `https://community.sap.com/topics/<topic>`

### Key Community Topics
| Topic | URL |
|---|---|
| SAP Datasphere | `https://community.sap.com/topics/datasphere` |
| SAP Analytics Cloud | `https://community.sap.com/topics/analytics-cloud` |
| SAP BW/4HANA | `https://community.sap.com/topics/bw-4hana` |
| SAP HANA | `https://community.sap.com/topics/hana` |
| SAP Integration Suite | `https://community.sap.com/topics/integration-suite` |
| SAP AI / Machine Learning | `https://community.sap.com/topics/machine-learning` |

### Search Strategies
- **Site search**: `site:community.sap.com <specific topic>` for targeted results
- **Author filter**: Look for SAP Distinguished Engineers and product managers (their blogs carry high authority)
- **Date filter**: Prefer posts from 2023-present; SAP product landscape changes rapidly
- **Q&A vs. Blogs**: Blog posts tend to have architecture diagrams and deeper analysis; Q&A for quick answers

### What to Look For
- Real-world architecture comparison posts ("BDC vs Datasphere decision")
- Integration troubleshooting articles
- Product team blogs announcing new patterns or deprecations
- User experience with specific connector versions

---

## Source 4: learn.microsoft.com

**Best for:** Azure services documentation, Microsoft Fabric, Power BI, Azure AI Foundry, ADF connectors

### URL Structure
- Microsoft Fabric: `https://learn.microsoft.com/en-us/fabric/`
- Azure Databricks: `https://learn.microsoft.com/en-us/azure/databricks/`
- Azure Data Factory: `https://learn.microsoft.com/en-us/azure/data-factory/`
- Power BI: `https://learn.microsoft.com/en-us/power-bi/`
- Azure AI Foundry: `https://learn.microsoft.com/en-us/azure/ai-studio/`

### Key SAP-Relevant Microsoft Docs
| Topic | URL |
|---|---|
| Fabric + SAP integration overview | `https://learn.microsoft.com/en-us/fabric/get-started/fabric-and-sap` |
| ADF SAP Table connector | `https://learn.microsoft.com/en-us/azure/data-factory/connector-sap-table` |
| ADF SAP ECC connector | `https://learn.microsoft.com/en-us/azure/data-factory/connector-sap-ecc` |
| Fabric Dataflows SAP connector | `https://learn.microsoft.com/en-us/fabric/data-factory/connector-sap-overview` |
| Power BI SAP HANA connector | `https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-sap-hana` |
| Power BI SAP BW connector | `https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-sap-bw-connector` |
| Power BI Direct Lake | `https://learn.microsoft.com/en-us/power-bi/enterprise/directlake-overview` |
| Azure AI Search | `https://learn.microsoft.com/en-us/azure/search/` |

### Search Strategies
- **In-page search**: Use the search bar at top of learn.microsoft.com; filter by product area
- **Site search**: `site:learn.microsoft.com SAP <topic>` — Microsoft indexes SAP-related docs under "SAP on Azure" and within product connectors
- **Version notes**: Fabric features update rapidly; check "What's New" sections for Fabric quarterly updates
- **Connector compatibility**: When SAP + Microsoft integration is involved, check BOTH the ADF connector page AND the Fabric connector page — they may differ

### What to Look For
- SAP connector compatibility matrices (which SAP versions are supported)
- Authentication requirements (SNC, SAP SSO, RFC vs OData)
- Performance tuning guidance for SAP data loads
- Architecture solution accelerators and reference architectures

---

## Source 5: docs.databricks.com

**Best for:** Azure Databricks documentation, Delta Lake, Unity Catalog, ML/AI features, SAP connector

### URL Structure
- `https://docs.databricks.com/en/`
- SAP connector: `https://docs.databricks.com/en/connect/external-systems/sap.html`

### Key Databricks Docs for SAP Scenarios
| Topic | URL Pattern |
|---|---|
| SAP connector | `https://docs.databricks.com/en/connect/external-systems/sap.html` |
| Delta Lake | `https://docs.databricks.com/en/delta/` |
| Unity Catalog | `https://docs.databricks.com/en/data-governance/unity-catalog/` |
| Delta Sharing | `https://docs.databricks.com/en/delta-sharing/` |
| Autoloader (streaming ingest) | `https://docs.databricks.com/en/ingestion/auto-loader/` |
| MLflow | `https://docs.databricks.com/en/mlflow/` |
| Databricks Marketplace | `https://marketplace.databricks.com/` |

### Search Strategies
- **Site search**: `site:docs.databricks.com <topic>` for precise results
- **Databricks Marketplace search**: Search the marketplace for SAP-related connectors, accelerators, and solution templates
- **Notebook examples**: Databricks documentation often includes embedded notebook examples; these are highly practical for architecture implementation

### What to Look For
- SAP connector authentication and configuration options
- Delta Sharing setup with SAP Datasphere as a provider
- Medallion architecture patterns (Bronze/Silver/Gold) applicable to SAP data
- Unity Catalog governance for SAP data assets
- ML pipelines using SAP data as features

---

## Cross-Source Search Patterns

### For "How do I integrate X with Y?" questions
1. Check `help.sap.com` for the SAP product's integration guide
2. Check `learn.microsoft.com` for the Microsoft side of the connector
3. Check `community.sap.com` for real-world implementation blogs
4. Check `docs.databricks.com` if Databricks is involved

### For "BDC vs Datasphere" type decisions
1. `help.sap.com/docs/business-data-cloud` — official BDC capabilities
2. `community.sap.com/topics/datasphere` — comparison blogs by SAP experts
3. `learn.microsoft.com/en-us/fabric/get-started/fabric-and-sap` — Microsoft's BDC perspective

### For "Architecture for SAP AI agents" questions
1. `help.sap.com/docs/joule` — Joule capabilities
2. `help.sap.com/docs/sap-ai-core` — AI model hosting
3. `help.sap.com/docs/sap-knowledge-graph` — knowledge graph
4. `learn.microsoft.com/azure/ai-studio` — Azure AI Foundry if hybrid AI is needed

### For "SAP + Databricks" questions
1. `docs.databricks.com/en/connect/external-systems/sap.html` — SAP connector
2. `help.sap.com/docs/SAP_DATASPHERE` (Delta Sharing outbound) — Datasphere as data provider
3. `community.sap.com` — search "SAP Datasphere Databricks Delta Sharing"

---

## Citation Standards

When referencing documentation in an architecture response:
- Use the **full URL** (not just the domain)
- Include the **document title** as the link text
- Prefer **deep links** to specific guide sections over product homepages
- If a URL is uncertain, use the **search pattern** format: `Search: site:help.sap.com "Datasphere" "Delta Sharing"`
- Always note if the doc may be version-specific (e.g., "as of SAP Datasphere 2024.Q3")

# SAP Architecture Advisor — Technology Reference

Concise reference for each focus technology: what it is, key capabilities, and how it integrates with other systems in the SAP ecosystem.

---

## SAP Technologies

### SAP S/4HANA
**Category:** ERP / Transactional System of Record  
**Editions:** On-premise (S/4HANA OP), Private Cloud (PCE), Public Cloud (SaaS)

**Key Capabilities:**
- Core ERP: Finance (FI/CO), Procurement, Supply Chain, Manufacturing, Sales
- Built-in HANA in-memory database for real-time analytics embedded in ERP
- Universal Journal (ACDOCA) as single source of financial truth
- ABAP CDS Views as the standard data exposure layer (VDM - Virtual Data Model)
- OData APIs for application-to-application integration
- Embedded Analytics (Fiori analytical apps, CDS-based)

**Data Exposure Mechanisms:**
| Mechanism | Protocol | Use Case |
|---|---|---|
| ABAP CDS Views (VDM) | SQL / ODP | Structured data extraction, Datasphere integration |
| ODP (Operational Data Provisioning) | ABAP ODP framework | Delta extraction for BW/Datasphere |
| OData v2/v4 APIs | REST/HTTP | App integration, lightweight reads |
| BAPI / RFC | ABAP proprietary | Legacy integration, ECC compatibility |
| SAP LT Replication Server (SLT) | DB trigger-based | Near-real-time replication to any target |
| iDocs | EDI-style messaging | B2B, legacy process integration |

**Common Integration Targets:** SAP Datasphere, SAP BDC, Azure Databricks, Microsoft Fabric, Power BI

---

### SAP Datasphere
**Category:** Data Management Platform (Cloud-native)  
**Hosting:** SAP BTP (managed service)

**Key Capabilities:**
- **Data Builder**: Visual ETL/ELT flows, replication tasks, transformations (SQL, Python, graphical)
- **Business Layer**: Semantic models (dimensions, facts, hierarchies, KPIs)
- **Data Marketplace**: Pre-packaged data products from SAP and partners
- **Data Catalog**: Lineage, impact analysis, metadata management
- **Collaboration**: Data Spaces for organizational data sharing
- **HANA Cloud underneath**: Full SQL access, spatial, graph, JSON capabilities
- **Federation**: Remote tables to connect to sources without data movement (Smart Data Access)
- **Open Data Sharing**: Delta Sharing protocol for cross-platform data exchange

**Integration Mechanisms (Inbound):**
- ODP / CDS Views from S/4HANA and BW/4HANA
- SLT-based replication
- Database connections (HANA, Azure SQL, Snowflake, etc.)
- File/object storage (ADLS, S3)
- OData services
- SAP BDC connectors

**Integration Mechanisms (Outbound):**
- SAC Live Connection
- Delta Sharing → Databricks, Fabric, Snowflake
- OData API exposure
- JDBC/ODBC for BI tools

**Positioning:** SAP's strategic data platform; bridges SAP application data with open cloud ecosystems.

---

### SAP Business Data Cloud (BDC)
**Category:** Joint SAP + Microsoft Data Cloud Offering  
**Availability:** Requires specific licensing agreement (SAP + Microsoft)

**Key Capabilities:**
- **Bundled offering**: SAP Datasphere + Microsoft Fabric in a single commercial bundle
- **Pre-built SAP content connectors**: Turnkey extractors for S/4HANA, BW/4HANA, ECC modules
- **Unified data governance**: SAP metadata surfaced in Microsoft Purview
- **OneLake integration**: SAP data lands in Fabric OneLake as Delta Parquet (no custom ETL)
- **Joule integration**: SAP AI embedded across the analytics workflow

**What BDC Adds Over Standalone Datasphere:**
- Pre-built content packages (SAP best-practice data models for Finance, Procurement, Supply Chain)
- Tighter Microsoft Fabric integration (automated replication to OneLake)
- Joint support and SLA from SAP + Microsoft
- Unified billing and licensing

**Key Decision Factors:**
- BDC is the preferred path when an org has both SAP and Microsoft Fabric/Power BI investments
- Standalone Datasphere is preferred for SAP-only or SAC-centric deployments

---

### SAP BW/4HANA
**Category:** Data Warehouse (modernized SAP BW)  
**Status:** Current generation; SAP Datasphere is the cloud-native successor

**Key Capabilities:**
- Enterprise data warehouse built on HANA (in-memory columnar)
- Optimized BW objects: Advanced DataStore Object (aDSO), CompositeProvider
- ABAP-based transformation logic, business rules
- Strong financial / SAP ERP data modeling heritage
- Native SAC connectivity

**Migration Context:**
- SAP recommends migrating BW/4HANA to SAP Datasphere
- BW Bridge within Datasphere allows running BW objects inside the cloud platform
- Many organizations run BW/4HANA alongside Datasphere during hybrid transition

**Integration Points:**
- Source: S/4HANA (via ODP), ECC (via ODS)
- Target: SAC (live connection), Datasphere (via BW Bridge)

---

### SAP Analytics Cloud (SAC)
**Category:** Cloud Analytics and Planning  
**Hosting:** SAP BTP SaaS

**Key Capabilities:**
- **Business Intelligence**: Dashboards, stories, ad-hoc analysis
- **Planning**: Integrated business planning (IBP lite), financial planning, workforce planning
- **Predictive Analytics**: Built-in ML models (time series, classification, regression)
- **SAP Datasphere Live Connection**: Query data from Datasphere without replication
- **Augmented Analytics**: Natural language generation, smart insights, SAP Joule integration

**Connectivity Options:**
| Connection Type | Data Sources |
|---|---|
| Live Connection | SAP Datasphere, SAP HANA Cloud, BW/4HANA, S/4HANA Embedded |
| Import Connection | SAP and non-SAP sources (batch import) |
| OData / REST | Custom data sources |

**Positioning:** Primary analytical front-end in the SAP stack; pairs naturally with Datasphere.

---

### SAP HANA Cloud
**Category:** In-memory Cloud Database / Data Platform  
**Hosting:** SAP BTP (managed; available on Azure, AWS, GCP)

**Key Capabilities:**
- In-memory columnar HANA database (cloud-managed)
- **Multi-model**: Relational, Document Store, Graph Engine, Spatial
- **Smart Data Access (SDA)**: Federate queries to remote databases without data copy
- **Smart Data Integration (SDI)**: Data integration framework with replication agents
- **Data Lake (QRC)**: Integrated IQ data lake for cost-effective cold storage
- **JSON Document Store**: For semi-structured data
- **ML integration**: PAL (Predictive Analytics Library), APL, integration with Python/R

**Role in Architecture:**
- Underlying persistence of SAP Datasphere
- Can act as a standalone federation hub (SDA) across heterogeneous sources
- Intermediate staging layer in hybrid architectures

---

### SAP Joule
**Category:** Generative AI Copilot (embedded)  
**Availability:** Embedded in S/4HANA Cloud, SAC, Datasphere, and other SAP applications

**Key Capabilities:**
- Natural language interaction with SAP applications
- Contextual understanding of SAP business processes (Finance, HR, Supply Chain)
- Grounded in SAP Knowledge Graph for entity-aware responses
- Action execution: trigger SAP workflows, create documents, pull reports via natural language
- SAP AI Core as the model hosting backbone
- Supports open LLM integrations (Azure OpenAI, custom models via AI Core)

**Integration with Architecture:**
- Joule sits on top of the data and process stack; does NOT replace the data pipeline
- Requires data to be accessible via Datasphere or HANA Cloud for analytical queries
- Uses SAP Knowledge Graph for semantic context

---

### SAP Knowledge Graph
**Category:** Enterprise Knowledge Fabric / Semantic Graph  
**Hosting:** SAP BTP

**Key Capabilities:**
- Graph database of SAP business entities and their relationships (Customer ↔ Orders ↔ Products)
- Semantic understanding layer for SAP AI agents
- Integrates metadata from SAP applications, Datasphere, and third-party data
- Enables contextual, entity-aware AI responses (used by Joule)
- GraphQL-based API for custom applications

**Use Cases:**
- Grounding SAP Joule with business context
- Powering intelligent search across SAP data
- Relationship analysis (supplier network, customer journey)

---

## Microsoft / Cloud Technologies

### Azure Databricks
**Category:** Unified Data Analytics and AI Platform  
**Hosting:** Azure (managed Apache Spark + Databricks Runtime)

**Key Capabilities:**
- **Delta Lake**: ACID-compliant lakehouse storage format (Parquet + transaction log)
- **Unity Catalog**: Unified data governance, fine-grained access control, lineage
- **Databricks SQL**: SQL analytics warehouse on Delta tables
- **ML / AI**: MLflow, AutoML, Mosaic AI (LLM fine-tuning, RAG), Feature Store
- **Workflows**: Orchestration of data pipelines and ML jobs
- **Delta Sharing**: Open protocol for cross-platform data exchange

**SAP Integration Options:**
| Method | Description |
|---|---|
| **SAP Connector for Databricks** | Official connector; reads from SAP (OData, BAPI, ABAP CDS) into Delta |
| **SLT + Kafka + Autoloader** | Trigger-based near-RT replication via Kafka |
| **ADF → ADLS → Autoloader** | Azure Data Factory extracts, Databricks processes |
| **BDC / Datasphere Delta Sharing** | SAP data shared to Databricks via Delta Sharing protocol |

**Positioning:** Preferred for advanced ML/AI on SAP data; heavy-compute data engineering workloads.

---

### Microsoft Fabric
**Category:** Unified Analytics Platform (Microsoft)  
**Hosting:** Azure (SaaS)

**Key Capabilities:**
- **OneLake**: Single logical data lake (Azure Data Lake Gen2 underneath; Delta Parquet)
- **Lakehouse**: Spark-based data engineering on Delta tables
- **Data Warehouse**: T-SQL warehouse on OneLake
- **Dataflows Gen2**: Low-code ETL with SAP connector
- **Real-Time Intelligence**: Event streams, KQL database for streaming analytics
- **Power BI (embedded)**: Native BI tool; Direct Lake mode for high-performance queries
- **Microsoft Purview**: Unified governance and data catalog (included in Fabric)
- **Copilot**: AI assistance across all Fabric workloads

**SAP Integration Options:**
| Method | Description |
|---|---|
| **BDC** | Turnkey automated pipeline from SAP → OneLake |
| **Fabric Dataflows Gen2 (SAP connector)** | No-code extraction from S/4HANA via OData/RFC |
| **Azure Data Factory pipelines** | Enterprise-grade ETL; extensive SAP connector library |
| **Delta Sharing from Datasphere** | SAP Datasphere shares data as Delta tables to OneLake |
| **Copy Activity (SAP ECC / S/4HANA)** | Direct copy via SAP RFC / BAPI |

---

### Azure AI Foundry
**Category:** AI Development Platform (Microsoft)  
**Hosting:** Azure (portal + SDK)

**Key Capabilities:**
- **Model Catalog**: Azure OpenAI GPT-4o, Mistral, Llama, Phi models
- **AI Projects**: Workspace for building, evaluating, and deploying AI apps
- **Prompt Flow**: Visual orchestration for LLM chains (RAG, agents)
- **Azure AI Search**: Vector search + semantic ranking for RAG architectures
- **Evaluations**: Automated quality, safety, and groundedness metrics
- **Connections**: Integrate with Fabric, Databricks, ADLS, SAP OData

**SAP Integration Patterns:**
- SAP OData APIs → Azure AI Search (vector index) → AI Foundry RAG pipeline
- SAP Datasphere / Fabric data → AI Foundry Prompt Flow for business insights
- SAP Joule extension using Azure OpenAI as the LLM backbone

---

### Microsoft Power BI
**Category:** Business Intelligence / Data Visualization  
**Hosting:** Microsoft Fabric / Power BI Service (cloud); Power BI Desktop (client)

**Key Capabilities:**
- **Direct Lake Mode**: Query Delta tables in OneLake at HANA-level speed without import
- **DirectQuery**: Live query to SAP HANA, Datasphere, Azure Synapse, Databricks
- **Import Mode**: Scheduled refresh into in-memory VertiPaq engine
- **SAP HANA Connector**: Native certified connector for SAP HANA Cloud / Datasphere
- **SAP BW Connector**: Live connection to BW/4HANA hierarchies and variables
- **Copilot in Power BI**: Natural language report generation

**SAP Connectivity Options:**
| Connection | Latency | Volume |
|---|---|---|
| Direct Lake (via Fabric OneLake) | Real-time | Very High |
| DirectQuery → SAP HANA / Datasphere | Real-time | Medium-High |
| DirectQuery → SAP BW/4HANA | Real-time | Medium |
| Import (scheduled refresh) | Batch | High |

**Positioning:** Standard BI front-end for Microsoft-centric organizations; pairs with Fabric/BDC for SAP data.

---

## SAP Databricks

**What it is:** A co-developed, jointly-engineered offering from SAP and Databricks that embeds Databricks' Lakehouse Platform natively within the SAP Business Data Cloud (BDC) ecosystem. Not a simple connector — it is a first-class, branded product available on SAP BTP.

**Key capabilities:**
- Native Delta Lake and Unity Catalog integration surfaced through SAP BDC
- SAP semantic layer (Datasphere entities) shared to Databricks via Delta Sharing / OpenSharing
- Unified governance: SAP data access policies enforced inside Databricks Unity Catalog
- Joint Mosaic AI + SAP data pipeline support for ML on SAP datasets
- Provisioned and billed through SAP BTP marketplace

**Integration mechanisms:**
- Delta Sharing (zero-copy, bi-directional)
- SAP BDC Connector for Databricks (GA Sep 2026)
- Unity Catalog metadata auto-sync from SAP Data Products

**Positioning:** The strategic SAP+Databricks integration path for BDC customers; supersedes manual ADF or SLT-based ETL pipelines into Databricks.

**Key documentation:**
- https://help.sap.com/docs/business-data-cloud/databricks-integration
- https://www.databricks.com/product/sap

---

## SAP Business Data Cloud (BDC)

**What it is:** SAP's flagship cloud-native data and AI platform, combining SAP Datasphere (semantic layer + data integration) with SAP Analytics Cloud (BI), SAP AI Core (model hosting), and native Microsoft Fabric / Databricks connectors — all under a unified governance umbrella on BTP.

**Key capabilities:**
- Unified data products from SAP S/4HANA, BW/4HANA, and SuccessFactors
- Delta Sharing to Fabric and Databricks (zero-copy)
- SAP Knowledge Graph for semantic business context
- Built-in AI metadata layer (lineage, data quality, AI-ready datasets)
- Multi-cloud: Azure (primary), AWS, GCP
- Co-innovation with Microsoft (launched Q1 2025)

**Integration mechanisms:**
- SAP Datasphere as semantic/federation layer inside BDC
- SAP BDC Connector for Microsoft Fabric
- SAP BDC Connector for Databricks
- CDS Views + ODP for S/4HANA sourcing

**When to choose BDC over standalone Datasphere:**
- You need unified SAP + Microsoft analytics in a single governed platform
- You want joint Microsoft licensing/billing benefits
- Your roadmap includes Copilot/Joule integration with Fabric data
- You are a net-new SAP cloud customer (BDC is the forward path)

**Key documentation:**
- https://help.sap.com/docs/business-data-cloud
- https://learn.microsoft.com/en-us/azure/databricks/sap/business-data-cloud

---

## Databricks Mosaic AI

**What it is:** The AI/ML platform layer embedded in the Databricks Lakehouse. Covers the full ML lifecycle from data prep to model serving, with native support for LLM fine-tuning, RAG pipelines, agent frameworks, and real-time inference.

**Key capabilities:**
- **MLflow** — experiment tracking, model registry, deployment
- **Feature Store** — shared feature repo for real-time + batch ML
- **Model Serving** — managed inference endpoints (GPU-backed)
- **Vector Search** — Delta-native vector index for semantic search / RAG
- **Agent Framework** — LangChain-compatible orchestration for multi-agent apps
- **DBRX / external LLM gateway** — serve open-source or call OpenAI/Anthropic APIs
- **Auto-ML (AutoML)** — no-code baseline model generation

**Integration with SAP:**
- SAP data lands in Delta Lake via SAP Connector, BDC, or ADF → Mosaic AI trains/serves on it
- SAP Datasphere data products shared via Delta Sharing → Feature Store picks up as features
- Mosaic Agent Framework can call SAP APIs (OData) as tools in agentic workflows
- Results written back to SAP via Delta Sharing or REST

**Key documentation:**
- https://docs.databricks.com/machine-learning/index.html
- https://docs.databricks.com/generative-ai/index.html

---

## SAP Joule Studio

**What it is:** A no-code/low-code development environment on SAP BTP for building, configuring, and extending SAP Joule AI agents. Part of the SAP Build portfolio; allows business users and developers to create custom AI skills and agent workflows on top of SAP's enterprise data.

**Key capabilities:**
- Visual agent builder: define intents, tools, and conversation flows
- Connect agents to SAP systems via pre-built connectors (S/4HANA, Ariba, SuccessFactors)
- Knowledge base integration: connect to SAP Knowledge Graph for grounded answers
- Extend Joule with custom tools using BTP Integration Suite
- Multi-agent orchestration: chain Joule agents with external AI services
- Test and deploy agents to SAP BTP, embedded UIs, or Microsoft Teams

**Integration with SAP AI Core:**
- Joule agents hosted and served by SAP AI Core inference infrastructure
- Model selection: GPT-4o via Azure OpenAI proxy, or SAP-owned models on AI Core
- Logs and observability via SAP AI Launchpad

**When to use:**
- Business wants Joule-branded AI assistants in SAP Fiori / S/4HANA UIs
- Low-code agent creation without custom Python/LangChain development
- Regulated environments requiring SAP-managed AI governance

**Key documentation:**
- https://help.sap.com/docs/joule
- https://community.sap.com/topics/joule

---

## SAP Knowledge Graph

**What it is:** A semantic business knowledge layer on SAP BTP that encodes relationships, hierarchies, and context from SAP master data (products, customers, suppliers, cost centers) into a graph structure. Powers grounded AI responses by giving LLMs structured business context.

**Key capabilities:**
- Graph-based representation of SAP business objects and their relationships
- Semantic search over SAP master data concepts
- Context injection into Joule and custom LLM prompts
- Integration with SAP Datasphere data products for enriched datasets
- API-accessible from BTP applications and external AI agents

**Role in AI architectures:**
- Acts as the "knowledge layer" in SAP RAG architectures — provides business context beyond raw data
- Enables LLMs to answer questions like "Who are the top 5 suppliers for product X in region Y?" with grounded SAP data
- Reduces hallucination by grounding LLM outputs in verified SAP ontologies

**Key documentation:**
- https://help.sap.com/docs/sap-knowledge-graph
- https://community.sap.com/topics/knowledge-graph

---

## SAP AI Core

**What it is:** The AI runtime and model hosting infrastructure on SAP Business Technology Platform (BTP). Manages the full lifecycle of AI workloads — training jobs, model deployment, inference serving, and observability — using Kubernetes-based infrastructure.

**Key capabilities:**
- Host and serve open-source LLMs (Llama, Mistral) or fine-tuned models
- Proxy to Azure OpenAI (GPT-4o, embeddings) with SAP-managed credentials and audit logging
- Training pipelines: batch jobs on BTP using custom Docker images
- Inference endpoints: REST APIs consumed by Joule, BTP apps, or external systems
- Model lifecycle management via SAP AI Launchpad UI
- Bring-your-own-model (BYOM) support

**Key positioning:**
- SAP AI Core IS the compute backbone for Joule — every Joule response is served through AI Core
- Customers can add custom models alongside Joule without leaving the SAP governance boundary
- Supports responsible AI monitoring: drift detection, explanation logging

**Integration patterns:**
- BTP applications call AI Core inference endpoint → returns LLM response
- AI Core pulls training data from Datasphere or SAP HANA Cloud
- AI Launchpad provides the admin UI (model registry, deployment dashboard, logs)

**Key documentation:**
- https://help.sap.com/docs/sap-ai-core
- https://help.sap.com/docs/sap-ai-launchpad

---

## SAP AI Launchpad

**What it is:** The web-based operations and management UI for SAP AI Core. Provides model registry browsing, deployment management, scenario tracking, and run observability without requiring CLI access.

**Key capabilities:**
- Browse and deploy AI scenarios (pre-built and custom)
- Monitor deployments: health, inference latency, error rates
- Manage training runs and artifacts
- Multi-tenant: supports multiple AI Core instances in one Launchpad

**Relationship to AI Core:**
- AI Core = the runtime infrastructure (APIs, Kubernetes)
- AI Launchpad = the operator console (UI over AI Core APIs)
- Both are BTP services, typically deployed together

**Key documentation:**
- https://help.sap.com/docs/sap-ai-launchpad

---

## Azure OpenAI

**What it is:** Microsoft Azure's managed deployment of OpenAI models (GPT-4o, GPT-4, GPT-3.5-Turbo, text-embedding-ada-002, DALL-E) with enterprise SLAs, private networking, content filtering, and data residency controls.

**Key capabilities:**
- LLM inference: chat completions, function calling, structured outputs
- Embeddings: `text-embedding-3-large` / `text-embedding-ada-002` for RAG pipelines
- Fine-tuning (GPT-3.5-Turbo and GPT-4o fine-tune)
- Private endpoints via Azure VNet — no data leaves the customer's Azure subscription
- Audit logging, content filters, and abuse monitoring

**Integration with SAP:**
- **Via SAP AI Core proxy:** SAP manages the Azure OpenAI credentials; BTP apps call AI Core → AI Core calls Azure OpenAI. Audit trail stays in SAP governance boundary.
- **Direct from BTP:** SAP Integration Suite or BTP Destination Service can call Azure OpenAI REST API directly
- **Via Azure AI Foundry:** Orchestration pipelines in Azure consume SAP data from Datasphere/BDC then call Azure OpenAI
- **Via Databricks:** Mosaic AI gateway can proxy Azure OpenAI calls with rate limiting and logging

**Key documentation:**
- https://learn.microsoft.com/en-us/azure/ai-services/openai/overview
- https://learn.microsoft.com/en-us/azure/ai-foundry/

---

## Azure AI Search

**What it is:** Azure's managed search service supporting keyword (BM25), vector (HNSW), and hybrid (RRF-fused) retrieval. The primary vector store for RAG architectures built on Azure AI Foundry, used alongside Azure OpenAI embeddings.

**Key capabilities:**
- Hybrid search: combine full-text BM25 with dense vector retrieval in one query
- Semantic ranker: cross-encoder re-ranking for higher-precision results
- Integrated vectorization: auto-generate embeddings on ingest via Azure OpenAI connector
- Index from: Azure Blob, ADLS Gen2, SQL, Cosmos DB, SharePoint, and custom sources
- Skillsets: built-in OCR, entity extraction, key phrase, and custom Azure Function skills
- Security: field-level security trimming using AAD group membership

**Integration with SAP:**
- SAP data exported to ADLS Gen2 (via ADF, BDC, or SLT) → indexed into AI Search
- Datasphere views surfaced as OData → ADF pipeline → AI Search index
- SAP documents (PDFs, contracts from SAP DMS) indexed for semantic search
- AI Search used as retrieval layer in SAP + Azure AI Foundry RAG pipelines

**Key documentation:**
- https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search
- https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview

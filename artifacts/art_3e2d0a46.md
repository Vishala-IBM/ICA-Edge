<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>lighthouse-search SKILL.md</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#333}
pre{background:#f6f8fa;padding:1rem;overflow-x:auto;border-radius:4px}code{font-size:.9em}
img{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:.5rem}</style>
</head><body>
---
name: lighthouse-search
description: Search and retrieve documents from the Lighthouse knowledge portal using browser automation. Use this skill whenever the user wants to find Lighthouse docs, filter by tags, get document links or metadata, or surface knowledge assets for SAP, Azure, AWS, Power Platform, Databricks, or IBM Consulting — including requests like "search Lighthouse for", "find me a Lighthouse accelerator", "Lighthouse asset about", or "filter Lighthouse by tag".
---

# Lighthouse Search Skill

Lighthouse is a browser-only web portal for IBM's internal knowledge assets,
accelerators, methodologies, and reference documents. There is no public REST
API — all searching and retrieval must be done via **browser automation**
using the `browser` tool.

---

## 0. Quick-reference checklist

Before starting any search, gather:

| Parameter | Where it comes from |
|---|---|
| **Search term(s)** | User's request; refine with domain vocabulary (see §4) |
| **Domain tag(s)** | SAP · Azure · AWS · Power Platform · Databricks · Consulting (see §4) |
| **Content type** | Asset · Methodology · Template · Accelerator · Case Study |
| **Date range** | Optional; most users want "most recent" by default |
| **Output format** | Link-only · Metadata summary · Full document details |

---

## 1. Navigation & authentication

1. **Open Lighthouse** — navigate to the portal URL provided in
   `references/portal-config.md`.  If the URL is not yet configured, ask the
   user: *"What is the Lighthouse portal URL?"*

2. **Handle auth** — Lighthouse uses SSO. If you see a login page, CAPTCHA,
   or 2FA prompt:
   - STOP immediately
   - Tell the user: *"Lighthouse is showing a login screen. Please sign in in
     the Chrome window and then say `continue`."*
   - Wait for the user to say `continue` before proceeding.

3. **Confirm landing page** — after navigation, call `take_snapshot` and
   verify you see a search bar or document index.
   - ✅ **Search bar visible → proceed directly to §2** (session is active).
   - ❌ **Login / redirect page → stop and ask user to authenticate** (see §7).
   - ❓ **Unexpected page → `take_screenshot`** and describe what you see to the user.

---

## 2. Searching documents

### 2a. Keyword search

```
# Step A — take a snapshot to get fresh UIDs
browser(action="take_snapshot")

# Step B — fill the search box and submit using UID from snapshot
browser(action="fill", uid="<search-input-uid>", value="<term>")
browser(action="click", uid="<search-submit-uid>")
browser(action="wait_for", value="<results-list>")

# Step C — re-snapshot to get result UIDs
browser(action="take_snapshot")
```

- **Always use snapshot UIDs** (`uid=`) — never hard-code CSS selectors.
  Re-take the snapshot every time the page changes to get fresh UIDs.
- If no results appear within 5 seconds, try `wait_for` with a longer timeout
  or look for a "No results" message before retrying.

### 2b. Construct effective queries

| Goal | Query pattern |
|---|---|
| Find accelerators | `"accelerator" <technology>` |
| Find methodologies | `"methodology" OR "playbook" <topic>` |
| Find templates | `"template" <use-case>` |
| Find case studies | `"case study" <industry> <tech>` |
| Broad domain sweep | `<domain-tag>` alone (then filter in UI) |

For multi-word concepts, quote them: `"data migration"`, `"SAP S/4HANA"`.

---

## 3. Filtering by tags

After search results load, apply tag filters to narrow results:

1. `take_snapshot` — identify filter panel / tag-cloud UIDs.
2. For each tag the user requested, click its UID, then re-snapshot:
   ```
   browser(action="click", uid="<tag-uid>")
   browser(action="wait_for", value="<results-list>")
   browser(action="take_snapshot")   # always re-snapshot — UIDs change after filter
   ```
3. UIDs change after every filter click — always re-snapshot before the next click.
4. If multiple tags are needed, apply them sequentially (most portals AND
   them together).

### Supported tag taxonomy

See `references/tags.md` for the canonical tag list. Top-level domains:

| Domain | Primary tags | Sub-tags (examples) |
|---|---|---|
| **SAP** | `SAP` | `SAP S/4HANA`, `SAP BTP`, `SAP RISE`, `SAP Analytics Cloud`, `SAP IBP`, `SAP SuccessFactors`, `SAP Integration` |
| **Azure** | `Azure` | `Azure Data Factory`, `Azure Synapse`, `Azure OpenAI`, `Azure DevOps`, `Azure Arc`, `Azure Kubernetes Service` |
| **AWS** | `AWS` | `AWS Migration`, `AWS Landing Zone`, `Amazon Redshift`, `AWS Glue`, `Amazon SageMaker`, `Amazon Bedrock`, `Amazon EKS`, `AWS Security` |
| **Power Platform** | `Power Platform` | `Power BI`, `Power Apps`, `Power Automate`, `Power Automate RPA`, `Copilot Studio`, `Dataverse`, `Power Platform CoE` |
| **Databricks** | `Databricks` | `Delta Lake`, `MLflow`, `Databricks Lakehouse`, `Unity Catalog`, `Databricks SQL`, `Databricks Workflows` |
| **Consulting** | `IBM Consulting` | `Change Management`, `Project Delivery`, `Client Engagement`, `Business Case`, `RFP Response`, `Agile`, `CPIC` |

Always match tags exactly as they appear in the UI — casing matters.

---

## 4. Domain-specific search guidance

Load the relevant domain reference file for vocabulary, common asset types,
and query patterns before searching:

| Domain | Reference file |
|---|---|
| SAP | `references/sap.md` |
| Azure | `references/azure.md` |
| AWS | `references/aws.md` |
| Power Platform | `references/powerplatform.md` |
| Databricks | `references/databricks.md` |
| Consulting / General | `references/consulting.md` |

If the user's request spans multiple domains (e.g. "SAP on Azure"), load both
domain files and combine their vocabulary sets.

---

## 5. Extracting document metadata

For each result in the search result list, extract:

| Field | How to extract |
|---|---|
| **Title** | Heading text of the result card |
| **URL / Link** | `href` attribute of the title link |
| **Document type** | Badge/chip below title (e.g. "Asset", "Template") |
| **Tags / Labels** | Coloured tag chips on the card |
| **Author** | "By …" or avatar + name |
| **Date** | "Last updated" or "Published" timestamp |
| **Description / Abstract** | Short paragraph below title |
| **Rating / Downloads** | Star rating, download count (if visible) |

### Extraction workflow

```python
# Pseudocode — drive with browser UIDs from snapshot

results = []
for card_uid in result_card_uids:
    browser(action="get_page_text", mode="visible")   # or targeted snapshot
    results.append({
        "title":       <title text>,
        "url":         <href>,
        "type":        <document type badge>,
        "tags":        [<tag1>, <tag2>, ...],
        "author":      <author name>,
        "date":        <date string>,
        "description": <abstract>,
    })
```

- If the result list paginates, click **Next** and continue extraction until
  either (a) you have all results or (b) you've reached the user-requested
  limit (default: first 10 results).
- For deep metadata (full description, download count, related assets), click
  into the document's detail page, extract, then `navigate_page` back to the
  results list.

---

## 6. Returning results to the user

### Format: concise link list (default)

When the user just wants links, return:

```markdown
### Lighthouse Search Results — "<query>" [<tag1> · <tag2>]
> **N results** · Filters: <tag1>, <tag2>

1. **[Document Title](https://lighthouse.ibm.com/content/12345)**
   _Type: Asset · Tags: SAP S/4HANA, Migration · Updated: 2025-03-15_
   > Brief one-line description.

2. **[Document Title](https://lighthouse.ibm.com/content/23456)**
   ...

---
_Want me to open any of these, apply additional filters, or export as a metadata table?_
```

Document URLs always follow the pattern: `https://lighthouse.ibm.com/content/<numeric-id>`
— never use `/assets/`, `/doc/`, or slug-based paths.

### Format: metadata table

When the user asks for metadata or comparison, return:

```markdown
### Lighthouse Results — "<query>" [<tag1> · <tag2>]
> **N results** · Filters: <tag1>, <tag2>

| # | Title | Type | Tags | Author | Date | Link |
|---|-------|------|------|--------|------|------|
| 1 | … | … | … | … | YYYY-MM-DD | [Open](https://lighthouse.ibm.com/content/<id>) |

---
_Want me to open any of these, apply additional filters, or switch to link-list format?_
```

### Format: single document detail

When the user asks about a specific document:

```markdown
## <Document Title>

- **Type**: Asset
- **Tags**: SAP S/4HANA · Migration
- **Author**: Jane Smith
- **Last Updated**: 2025-03-15
- **Downloads**: 142
- **Description**: …
- **Link**: [Open in Lighthouse](URL)
- **Related Assets**: [Asset A](URL), [Asset B](URL)
```

---

## 7. Error handling & edge cases

| Situation | Action |
|---|---|
| Login / SSO wall | Stop, ask user to log in, wait for `continue` |
| CAPTCHA | Stop, ask user to solve it in the Chrome window |
| Zero results | Broaden the query (remove quotes, drop one tag); tell the user |
| Stale UIDs after page reload | Re-take snapshot before every click |
| Pagination missing | Scroll down and re-snapshot; lazy-loaded lists may need scroll |
| Ambiguous tag | List the matching tags to the user and ask which to apply |
| Session timeout | Re-authenticate (notify user if SSO required) |
| Document behind paywall/permissions | Note it and skip; include a "restricted" flag in output |

---

## 8. Performance tips

- **Batch the snapshot** — take one snapshot per page, extract all visible
  UIDs in that snapshot, then act. Don't snapshot after every click unless
  the page changes.
- **Limit depth** — default to extracting 10 results. If the user needs more,
  prompt: *"Found 47 results. Show first 10 or would you like more?"*
- **Cache filter state** — once a tag filter is active, note it in your plan
  so you don't re-click it on the next search within the same session.
- **Use `get_page_text`** for bulk text extraction on result pages rather
  than card-by-card navigation.

---

## 9. Composing a full search — end-to-end example

**User:** "Find me Lighthouse docs about SAP S/4HANA migration templates"

```
Step 1 — Navigate
  browser(action="navigate_page", url=<lighthouse-url>)
  browser(action="take_snapshot")  → ✅ search bar visible? proceed. ❌ login page? stop + ask user.

Step 2 — Search (use UIDs from snapshot)
  browser(action="fill",    uid=<search-input-uid>, value="SAP S/4HANA migration template")
  browser(action="click",   uid=<submit-uid>)
  browser(action="wait_for", value=<results>)
  browser(action="take_snapshot")   ← fresh UIDs after page change

Step 3 — Filter by tag (use UIDs from step-2 snapshot)
  browser(action="click",   uid=<SAP-S4HANA-tag-uid>)
  browser(action="wait_for", value=<results-refreshed>)
  browser(action="take_snapshot")   ← fresh UIDs after filter change

Step 4 — Extract metadata (first 10 results)
  browser(action="get_page_text", mode="visible")  → parse titles, types, dates, links

Step 5 — Return results
  Format as "concise link list" (§6); include result count, tag badges, and closing offer.
```

---

## 10. Skill boundaries

This skill covers:
- ✅ Searching the Lighthouse web portal
- ✅ Filtering by any tag in the taxonomy (see §3)
- ✅ Extracting metadata from result cards and document detail pages
- ✅ Returning formatted link lists, tables, or single-document details
- ✅ SAP, Azure, AWS, Power Platform, Databricks, and IBM Consulting content domains

This skill does NOT cover:
- ❌ Downloading or reading the full content of Lighthouse documents
  (use `universal-file-extract` skill after downloading)
- ❌ Creating or editing Lighthouse documents
- ❌ Lighthouse API endpoints (none exist; browser-only)
- ❌ Any Lighthouse instance other than the one configured in
  `references/portal-config.md`

</body></html>
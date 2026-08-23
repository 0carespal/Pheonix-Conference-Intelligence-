# Phoenix Intelligence — Conference Intelligence Engine

A self-healing conference talk tracker built for the **Into the Scrape-Verse**
hackathon (WeMakeDevs x Bright Data), August 17–23, 2026.

---

## What it does

1. A **Bright Data Scraper Studio collector** extracts structured talk data
   (talk title, speaker, conference name, topic) from a conference schedule
   page.
2. A **completeness validator** checks every extraction run and classifies it
   as Healthy / Warning / Broken based on required-field completeness.
3. When extraction breaks — simulated here via a controlled layout change on
   a mock conference page — **Bright Data's self-healing** repairs the
   scraper without any manual selector rewriting.
4. A lightweight **filter layer** lets you query the collected talks by
   topic and keyword (e.g. "AI Infrastructure" talks), and a manual AI
   summary call turns the filtered results into a short trend readout.

---

## Why a mock site for the healing demo

We could not rely on a real conference site redesigning itself on demand
during the hackathon window, so the break → detect → heal → recover cycle
is demonstrated against a controlled mock page with two layout versions
(`?version=A` and `?version=B`) serving the same underlying data under
different HTML structure — a standard way to reliably demo this mechanism.

The scraper architecture itself (extraction, validation, healing via
`bdata scraper heal`) is the same mechanism that would run against a real
conference source — the mock page exists to make the demo reproducible on
command, not because the underlying capability is different.

---

## Architecture

```
Mock/Real Conference Page
        ↓
Bright Data Scraper Studio Collector
        ↓
Validator (completeness check: talk_title, speaker_name,
           conference_name, topic — all required)
        ↓
   Healthy? ──Yes──> data_reports/talks.json
        │
        No
        ↓
Bright Data Self-Healing (heal → approve → re-run → re-validate)
        ↓
data_reports/talks.json
        ↓
backend/filter.py → filtered results (topic / keyword match)
        ↓
Manual AI summary (Antigravity CLI) → trend readout
```

---

## Tech stack

- **Scraping / self-healing:** Bright Data Scraper Studio, Bright Data CLI
- **Coding assistant:** Antigravity CLI (Gemini-based) — used for code
  generation, debugging, and extraction prompt drafting throughout the
  project. All generated code was reviewed before use.
- **Backend logic:** Python (`backend/filter.py`, `validators/validator.py`)
- **Frontend:** React + TypeScript + Tailwind CSS — a dashboard view over
  the collected talk data
- **AI:** used via Antigravity CLI for the extraction prompt and the
  trend-summary step

---

## Project structure

```
phoenix-intelligence/
├── collectors/
│   └── collector_id_demo.txt
├── data_reports/
|   ├── talks_raw.json             # Collected dataset
│   ├── talks.json                 # Re checked collected dataset
│   ├── talks_broken.json          # after simulated layout break
│   └── talks_healed.json          # after healing
├── validators/
│   └── validator.py               # completeness scoring + status
├── backend/
│   └── filter.py                  # topic/keyword filtering
├── frontend/
│   ├── mock-site/                 # controlled page used for the healing demo
│   └── src/                       # React + TS + Tailwind dashboard
└── README.md
```

---

## Running it

```bash
# Run the collector
bdata scraper run $(cat collectors/collector_id_demo.txt) > data_reports/talks.json

# Validate
python validators/validator.py data_reports/talks.json

# Filter
python backend/filter.py
```

---

## Example query

**Filter:** `topic="AI Infrastructure"`, `keywords=["AI", "infra"]`

**Output:** matching talks from `talks.json`, followed by a short
AI-generated summary of themes across the matched talks (generated via
Antigravity CLI, shown in the demo video / included below).

`[example output here]`

---

## Known limitations

- Query filtering is a hardcoded topic/keyword match, not a natural-language
  query planner — a real NL interface is a natural next step, not something
  built for this submission.
- The AI trend summary is generated manually per query rather than wired
  into an automated pipeline.
- No backend server/API — filtering and validation run as standalone
  scripts against local JSON files.
- Dataset is refreshed by manually running the collector, not on a
  schedule.
- The self-healing demo uses a controlled mock page (see note above) rather
  than a real live redesign, for reproducibility within the hackathon
  timeframe.


---

## Team

Solo submission — `SATVIK MISHRA`

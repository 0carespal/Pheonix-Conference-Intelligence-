import json

with open("data_reports/talks_raw.json", encoding="utf-16") as f:
    raw = json.load(f)

sessions = raw[0].get("sessions", []) if isinstance(raw, list) else raw.get("sessions", [])

normalized = [
    {
        "talk_title": s.get("talk_title"),
        "speaker_name": s.get("speaker"),
        "conference_name": s.get("conference_name"),
        "topic": s.get("track"),
    }
    for s in sessions
]

with open("data_reports/talks.json", "w", encoding="utf-8") as f:
    json.dump(normalized, f, indent=2)

print(f"Normalized {len(normalized)} records into data_reports/talks.json")
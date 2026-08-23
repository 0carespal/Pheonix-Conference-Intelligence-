import json
from pathlib import Path

def filter_talks(data: list[dict], topic: str | None = None, keywords: list[str] | str | None = None) -> list[dict]:
    kws = [keywords] if isinstance(keywords, str) else (keywords or [])
    filtered = []
    for talk in data:
        if topic and topic.lower() not in talk.get("topic", "").lower():
            continue
        if kws and not any(kw.lower() in talk.get("talk_title", "").lower() for kw in kws):
            continue
        filtered.append(talk)
    return filtered

if __name__ == "__main__":
    path = Path(__file__).resolve().parent.parent / "data_reports" / "talks.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(json.dumps(filter_talks(data, topic="AI"), indent=2))

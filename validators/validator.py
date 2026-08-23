import json
import sys

def main():
    path = sys.argv[1]
    with open(path, "rb") as f:
        content = f.read()

    encoding = "utf-16" if content.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig"
    raw = json.loads(content.decode(encoding))

    if isinstance(raw, list):
        sessions = raw[0].get("sessions", []) if len(raw) == 1 and isinstance(raw[0], dict) and "sessions" in raw[0] else raw
    else:
        sessions = raw.get("sessions", [])

    required_fields = ("talk_title", "speaker_name", "conference_name", "topic")

    total = len(sessions)
    complete = 0

    for record in sessions:
        if all(
            record.get(field) is not None
            and str(record.get(field)).strip() != ""
            and str(record.get(field)).strip().upper() != "N/A"
            for field in required_fields
        ):
            complete += 1

    if total == 0:
        print("No records found.")
        print("Status: BROKEN")
        return

    pct = (complete / total) * 100
    print(f"Completeness: {pct:.1f}% ({complete}/{total})")

    if pct >= 90:
        print("Status: HEALTHY")
    elif pct >= 60:
        print("Status: WARNING")
    else:
        print("Status: BROKEN")

if __name__ == "__main__":
    main()
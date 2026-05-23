import re
import json


# 🔹 SAMPLE TEST DATA (replace later with your md content)
sample_text = """
Traffic police may stop a vehicle to check documents like driving license, registration certificate, and insurance.

Driver must produce license on demand by police officer.

If a driver fails to produce documents, a challan can be issued.

Police must provide an official receipt for any fine collected.

Digital documents via DigiLocker are valid.

A driver has the right to ask for the reason for being stopped.
"""


# 🔹 Split into sections
def split_sections(text):
    sections = re.split(r"\n\n", text)
    return [s.strip() for s in sections if len(s.strip()) > 50]


# 🔹 Extract keywords
def extract_keywords(text):
    keywords = []
    
    if "fine" in text.lower():
        keywords.append("fine")
    if "license" in text.lower():
        keywords.append("license")
    if "police" in text.lower():
        keywords.append("traffic police")
    if "documents" in text.lower():
        keywords.append("documents")

    return list(set(keywords))


# 🔹 Build chunk
def build_chunk(section, idx):
    sentences = re.split(r"\. ", section)

    action_steps = []
    rights = []

    for s in sentences:
        s = s.strip()

        if len(s) < 25:
            continue

        # Action detection
        if any(word in s.lower() for word in ["must", "should", "ensure", "required"]):
            action_steps.append(s)

        # Rights detection
        if "right" in s.lower() or "allowed" in s.lower():
            rights.append(s)

    if len(action_steps) < 1:
        return None

    return {
        "id": idx,
        "scenario": sentences[0][:100],
        "action_steps": action_steps[:5],
        "rights": rights[:3],
        "authorities": ["Traffic Police", "RTO"],
        "law": "",
        "penalty": "",
        "keywords": extract_keywords(section)
    }


# 🔹 Run test
def main():
    print("\n🔍 TESTING RULE-BASED CHUNKING\n")

    sections = split_sections(sample_text)

    all_chunks = []

    for i, sec in enumerate(sections):
        print(f"\n--- Section {i+1} ---")
        print(sec)

        chunk = build_chunk(sec, i)

        if chunk:
            print("\n✅ Generated Chunk:")
            print(json.dumps(chunk, indent=2))
            all_chunks.append(chunk)
        else:
            print("\n❌ Skipped (not useful)")

    print("\n==============================")
    print(f"✅ Total Chunks Created: {len(all_chunks)}")
    print("==============================\n")


if __name__ == "__main__":
    main()
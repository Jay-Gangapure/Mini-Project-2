import os
import re
import json

# ================= PATH SETUP =================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT_FOLDER = os.path.join(BASE_DIR,"..", "data", "legal")
OUTPUT_FILE = os.path.join(BASE_DIR,"..", "rag_retrieved_output", "chunks.json")


# ================= READ FILES =================

def read_md_files(folder_path):
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return []

    data = []
    for file in os.listdir(folder_path):
        if file.endswith(".md"):
            file_path = os.path.join(folder_path, file)
            with open(file_path, "r", encoding="utf-8") as f:
                data.append((file, f.read()))

    print(f"✅ Loaded {len(data)} files")
    return data


# ================= CLEAN TEXT =================

def clean_text(text):
    text = re.sub(r"\s+", " ", text)  # remove extra spaces
    text = re.sub(r"Notwithstanding.*?,", "", text)  # remove legal noise
    text = re.sub(r"Provided that", "Exception:", text)
    return text.strip()


# ================= SPLIT SECTIONS =================

def split_sections(text):
    sections = re.split(r"\n## |\nSection |\nCHAPTER ", text)
    return [s.strip() for s in sections if len(s.strip()) > 100]


# ================= KEYWORDS =================

def extract_keywords(text):
    keywords = []

    text = text.lower()

    if "fine" in text:
        keywords.append("fine")
    if "license" in text:
        keywords.append("license")
    if "police" in text:
        keywords.append("traffic police")
    if "document" in text:
        keywords.append("documents")
    if "helmet" in text:
        keywords.append("helmet")

    return list(set(keywords))


# ================= SCENARIO =================

def generate_scenario(text):
    text = text.lower()

    if "helmet" in text:
        return "Riding motorcycle without helmet"
    if "license" in text:
        return "Driving without valid license"
    if "fine" in text:
        return "Traffic rule violation and fine"
    if "document" in text:
        return "Vehicle document verification"
    if "police" in text:
        return "Interaction with traffic police"

    return text[:80]


# ================= PENALTY =================

def extract_penalty(text):
    text = text.lower()

    if "fine" in text:
        return "Fine applicable as per law"
    if "imprisonment" in text:
        return "Possible imprisonment"

    return ""


# ================= INTENT =================

def detect_intent(text):
    text = text.lower()

    if "must" in text or "shall" in text:
        return "rule"
    if "penalty" in text or "fine" in text:
        return "penalty"
    if "right" in text or "allowed" in text:
        return "right"

    return "general"


# ================= BUILD CHUNK =================

def build_chunk(section, file_name, idx):
    section = clean_text(section)

    # Limit size for better retrieval
    if len(section) > 1000:
        section = section[:1000]

    sentences = re.split(r"\. ", section)

    action_steps = []
    rights = []

    for s in sentences:
        s = s.strip()

        if len(s) < 30:
            continue

        if any(word in s.lower() for word in ["must", "should", "ensure", "required", "shall"]):
            action_steps.append(s)

        if any(word in s.lower() for word in ["right", "allowed", "exempt"]):
            rights.append(s)

    if len(action_steps) < 1:
        return None

    return {
        "scenario": generate_scenario(section),
        "action_steps": action_steps[:4],
        "rights": rights[:3],
        "authorities": ["Traffic Police", "RTO"],
        "keywords": extract_keywords(section),
        
    }


# ================= MAIN =================

def main():
    all_chunks = []
    seen_chunks = set()   # 🔥 NEW: track duplicates

    md_files = read_md_files(INPUT_FOLDER)

    for file_name, file_text in md_files:
        sections = split_sections(file_text)

        for idx, section in enumerate(sections):
            if len(section.strip()) < 50:
                continue

            chunk = build_chunk(section,file_name,idx)

            if chunk:
                # 🔥 Convert chunk to string for comparison
                chunk_str = json.dumps(chunk, sort_keys=True)

                # 🔥 Skip duplicate
                if chunk_str in seen_chunks:
                    continue

                seen_chunks.add(chunk_str)
                all_chunks.append(chunk)

    # Save output
    os.makedirs(os.path.dirname(OUTPUT_FILE),exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {len(all_chunks)} unique chunks")
# ================= RUN =================

if __name__ == "__main__":
    main()
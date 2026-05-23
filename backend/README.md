# NyaySathi Backend API 🏛️
**Real-Time Legal Emergency Assistant**

A fully modular FastAPI backend providing situation-based legal guidance in English, Hindi, and Marathi.

---

## 📁 Project Structure

```
backend/
├── main.py                     # FastAPI app, CORS, router registration
├── requirements.txt
├── .env                        # Copy to .env and fill values
│
├── auth/
│   ├── __init__.py
│   └── jwt_handler.py          # JWT creation, decoding, Bearer dependency
│
├── database/
│   ├── __init__.py
│   └── connection.py           # Async Motor/MongoDB connection
│
├── models/
│   ├── __init__.py
│   ├── user.py                 # User Pydantic schemas
│   └── situation.py            # Situation / AI response schemas
│
├── routes/
│   ├── __init__.py
│   ├── auth.py                 # POST /auth/signup, /auth/login
│   ├── users.py                # GET/PATCH /users/me
│   ├── situations.py           # GET /situations, /situations/{id}
│   ├── ai_interpret.py         # POST /ai/interpret
│   ├── documents.py            # POST /documents/upload
│   └── directory.py            # GET /directory + sub-routes
│
├── services/
│   ├── __init__.py
│   ├── legal_data.py           # All scenario data in EN / HI / MR
│   ├── directory_data.py       # Static helplines, NGOs, legal contacts
│   └── ai_service.py           # Rule-based keyword scenario detection
│
└── utils/
    ├── __init__.py
    ├── config.py               # Pydantic settings (reads .env)
    └── responses.py            # success_response / error_response helpers
```

---

## ⚙️ Setup & Run

### 1. Prerequisites
- Python 3.11+
- MongoDB running locally on port 27017 (or update MONGO_URI)

### 2. Clone & enter directory
```bash
cd backend
```

### 3. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure environment
```bash
cp .env
# Edit .env if needed (Mongo URI, secret key, etc.)
```

### 6. Run the server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Open API docs
```
http://localhost:8000/docs      ← Swagger UI
http://localhost:8000/redoc     ← ReDoc
```

---

## 🔐 Authentication Flow

```
POST /auth/signup  →  returns JWT token
POST /auth/login   →  returns JWT token

All other routes require:
  Header: Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### Public (no auth)
| Method | Endpoint         | Description          |
|--------|-----------------|----------------------|
| GET    | /               | Health check         |
| GET    | /health         | Health check         |
| POST   | /auth/signup    | Register new user    |
| POST   | /auth/login     | Login, get JWT       |

### Protected (Bearer token required)
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | /users/me                       | Get current user profile             |
| PATCH  | /users/me                       | Update name / language               |
| GET    | /situations                     | List all scenario IDs + titles       |
| GET    | /situations/{scenario_id}       | Full legal guidance for scenario     |
| POST   | /ai/interpret                   | Detect scenario from free text       |
| GET    | /ai/scenarios                   | List AI-detectable scenarios         |
| POST   | /documents/upload               | Upload document, get dummy summary   |
| GET    | /documents/supported-types      | Supported upload file types          |
| GET    | /directory                      | Full legal directory                 |
| GET    | /directory/helplines            | Emergency helplines only             |
| GET    | /directory/ngos                 | NGOs only                            |
| GET    | /directory/legal-contacts       | Courts & commissions only            |
| GET    | /directory/search?q=keyword     | Search across directory              |

---

## 📋 Supported Legal Scenarios

| scenario_id          | Title (EN)                              |
|----------------------|-----------------------------------------|
| `traffic_police`     | Stopped by Traffic Police               |
| `salary_not_paid`    | Employer Not Paying Salary              |
| `cyber_fraud`        | Victim of Cyber Fraud / Online Scam     |
| `landlord_issue`     | Problem with Landlord / Tenancy Dispute |
| `consumer_complaint` | Consumer Complaint — Defective Product  |

### Language support
Append `?lang=en` (default), `?lang=hi`, or `?lang=mr` to any `/situations` call.

---

## 🧪 Quick Test with curl

```bash
# 1. Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya","email":"priya@test.com","password":"test123","preferred_language":"hi"}'

# 2. Copy the token from response, then:
TOKEN="<paste_token_here>"

# 3. Get a situation in Hindi
curl http://localhost:8000/situations/cyber_fraud?lang=hi \
  -H "Authorization: Bearer $TOKEN"

# 4. AI interpret
curl -X POST http://localhost:8000/ai/interpret \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"My boss has not paid my salary for 3 months","lang":"en"}'

# 5. Directory search
curl "http://localhost:8000/directory/search?q=cyber" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🌐 Frontend Integration

The frontend should:
1. Call `POST /auth/signup` or `POST /auth/login` and store the `access_token`
2. Send `Authorization: Bearer <token>` header on all subsequent requests
3. Use `GET /situations` to show scenario picker
4. Use `POST /ai/interpret` for the free-text input box
5. Use `POST /documents/upload` for document upload with `multipart/form-data`
6. Use `GET /directory` to show contacts/helplines

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (passlib)
- JWT tokens expire after **24 hours** (configurable in `.env`)
- CORS is open (`*`) for development — restrict `allow_origins` in production
- File uploads are validated by MIME type and capped at **10 MB**

---

## 📦 Key Dependencies

| Package              | Purpose                          |
|----------------------|----------------------------------|
| fastapi              | Web framework                    |
| uvicorn              | ASGI server                      |
| motor                | Async MongoDB driver             |
| pymongo              | MongoDB client                   |
| python-jose          | JWT encoding/decoding            |
| passlib[bcrypt]      | Password hashing                 |
| python-multipart     | File upload support              |
| pydantic[email]      | Data validation                  |
| pydantic-settings    | Environment config               |

---

*NyaySathi — Bringing legal knowledge to every citizen* 🇮🇳

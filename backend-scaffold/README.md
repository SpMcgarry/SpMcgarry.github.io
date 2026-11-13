# Career Advocate v2 - Railway Microservice Scaffold

A decoupled Python/Flask microservice designed to run on Railway and power the interactive AI advocate on your static GitHub Pages site (`https://spmcgarry.github.io`).

---

## 1. Quick Start Locally
```bash
cd backend-scaffold
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env with your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

python app.py
# Runs on http://localhost:5000
```

---

## 2. Deploying to Railway

1. **Create Service**:
   - In your Railway project, select **New Service > GitHub Repo** (or upload this folder).
2. **Environment Variables**:
   - Add `GEMINI_API_KEY` in Railway Service Settings.
3. **Custom Railway Subdomain**:
   - In Service **Settings > Networking > Public Networking**:
   - Click **Generate Domain**.
   - Edit the domain prefix to your preferred naming:
     - `seanmcgarry.up.railway.app`
     - *(or `seanpmcgarry.up.railway.app`)*
4. **CORS Verification**:
   - CORS is already pre-configured in `config.py` to accept requests from `https://spmcgarry.github.io`.

---

## 3. Ground Truth Knowledge
The knowledge facts live in `knowledge/ground_truth_resume.md`. Whenever you update your experience or certifications, simply edit this file and redeploy.

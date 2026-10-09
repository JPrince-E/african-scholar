# 🚀 African Scholar Deployment Guide (Railway & Docker)

This guide walks you through deploying the complete African Scholar ecosystem:
1. **MySQL Database**
2. **Backend API Service** (`backend_Service`)
3. **User Public Portal** (`user_service`)
4. **Admin Management Portal** (`admin_service`)

---

## 🛠️ Option 1: Deploy with Railway (Recommended)

Railway lets you deploy all 4 components in a single project with automatic internal networking, SSL, and managed MySQL.

### Step 1: Log in to Railway via CLI
Open PowerShell in this directory (`C:\African Scholar`) and log in:
```powershell
npx @railway/cli login
```
*(A browser window will open to authenticate your Railway account. If you are in a headless environment, use `npx @railway/cli login --browserless`)*.

---

### Step 2: Initialize or Link Your Project
Create a new Railway project for African Scholar:
```powershell
npx @railway/cli init
```
Choose **"Empty Project"** and give it a name like `african-scholar`.

---

### Step 3: Add the MySQL Database Service
In the Railway Web Dashboard ([railway.com](https://railway.com/dashboard)):
1. Open your `african-scholar` project.
2. Click **+ New** -> **Database** -> **Add MySQL**.
3. Railway will provision MySQL in seconds and automatically create connection variables (`MYSQL_URL`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`).

*(Alternatively, run `npx @railway/cli add -d mysql`)*.

---

### Step 4: Deploy the Backend API (`backend_Service`)
1. Go into the backend directory:
   ```powershell
   cd backend_Service
   ```
2. Link or create the backend service:
   ```powershell
   npx @railway/cli up
   ```
3. Set your Environment Variables in the Railway Dashboard under the **backend** service -> **Variables**:
   | Variable | Value / Reference |
   |---|---|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `DB_URI` | `${{ MySQL.MYSQL_URL }}` *(or automatically handled by our updated db.js)* |
   | `JWT_SECRET` | *(Your secure JWT secret string)* |
   | `CLOUDINARY_CLOUD_NAME` | `dkqzkvsew` |
   | `CLOUDINARY_API_KEY` | `211634516571953` |
   | `CLOUDINARY_API_SECRET` | `vueq5OJd2zhmLlEWqRTn5zLsNug` |
   | `PAYSTACK_SECRET_KEY` | `sk_test_e880f6f7bd7668bf342fc2da2d4fb9b60e425ade` |
   | `PAYSTACK_PUBLIC_KEY` | `pk_test_11ff0e7b42868c73b40b597d35418bd5c2bc034b` |
   | `USER_CLIENT_URL` | `https://<YOUR-USER-PORTAL-DOMAIN>.up.railway.app` |
   | `ADMIN_CLIENT_URL` | `https://<YOUR-ADMIN-PORTAL-DOMAIN>.up.railway.app` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | `adebayoea1@gmail.com` |
   | `SMTP_PASS` | `xphv axqw szkh qwcv` |
   | `SMTP_SECURE` | `tls` |

4. Generate a public domain:
   * In Railway, go to **Settings** -> **Public Networking** -> **Generate Domain** (e.g. `https://african-scholar-api.up.railway.app`).

---

### Step 5: Deploy the User Portal (`user_service`)
1. Go into the user service directory:
   ```powershell
   cd ..\user_service
   ```
2. Deploy the service:
   ```powershell
   npx @railway/cli up
   ```
3. In Railway dashboard for `user_service`:
   * Under **Settings** -> **Public Networking** -> **Generate Domain** (e.g. `https://african-scholar.up.railway.app`).
   * Under **Variables**, add build variables:
     * `VITE_API_URL` = `https://<YOUR-BACKEND-DOMAIN>.up.railway.app/api`
     * `VITE_ADMIN_URL` = `https://<YOUR-ADMIN-DOMAIN>.up.railway.app`

---

### Step 6: Deploy the Admin Portal (`admin_service`)
1. Go into the admin service directory:
   ```powershell
   cd ..\admin_service
   ```
2. Deploy the service:
   ```powershell
   npx @railway/cli up
   ```
3. In Railway dashboard for `admin_service`:
   * Under **Settings** -> **Public Networking** -> **Generate Domain** (e.g. `https://african-scholar-admin.up.railway.app`).
   * Under **Variables**, add build variables:
     * `VITE_API_URL` = `https://<YOUR-BACKEND-DOMAIN>.up.railway.app/api`
     * `VITE_USER_CLIENT_URL` = `https://<YOUR-USER-PORTAL-DOMAIN>.up.railway.app`

---

## 🐳 Option 2: Run / Test Everything Locally with Docker Compose

You can also run the entire production-grade stack locally using Docker:

```powershell
# From the root directory: C:\African Scholar
docker compose up --build -d
```

Services will be accessible at:
- **User Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MySQL Database**: `localhost:3307`

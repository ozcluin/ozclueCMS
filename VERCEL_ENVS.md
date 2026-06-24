# Vercel Environment Variables for OzClu

This document contains the exact environment variables needed for deploying both **Ozcluweb** (the main site) and **ozclueCMS** (the admin CMS) to Vercel.

> [!NOTE]
> **Only `MONGODB_URI` is required.** 
> * **Admin CMS Authentication:** Built-in and fully self-contained! It does **not** use NextAuth, meaning no `NEXTAUTH_SECRET` or external auth variables are needed. The session is managed securely via native Next.js cookies, and the login credentials are hardcoded and ready to use.
> * **Local URLs:** NOT required (Vercel automatically configures deployment domains).
> * **Other variables:** None (the codebases only read `MONGODB_URI`).

Both applications connect to the same MongoDB database, sharing the exact same simple environment configuration.

---

## 1. Main Website (`Ozcluweb` / `ozclu-site`)

In your Vercel project settings for **Ozcluweb**, add the following environment variable:

| Key | Value |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://ozcluin_db_user:j1TohysQswLhn9Yh@cluster0.ur6nwa3.mongodb.net/ozclu?retryWrites=true&w=majority&appName=Cluster0` |

### Copy-Paste Format (`.env` style)
If you are using the Vercel CLI or importing a file, you can copy-paste this:
```env
MONGODB_URI=mongodb+srv://ozcluin_db_user:j1TohysQswLhn9Yh@cluster0.ur6nwa3.mongodb.net/ozclu?retryWrites=true&w=majority&appName=Cluster0
```

---

## 2. Admin CMS (`ozclueCMS` / `ozclu-admincms`)

In your Vercel project settings for **ozclueCMS**, add the following environment variable:

| Key | Value |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://ozcluin_db_user:j1TohysQswLhn9Yh@cluster0.ur6nwa3.mongodb.net/ozclu?retryWrites=true&w=majority&appName=Cluster0` |

### Copy-Paste Format (`.env` style)
```env
MONGODB_URI=mongodb+srv://ozcluin_db_user:j1TohysQswLhn9Yh@cluster0.ur6nwa3.mongodb.net/ozclu?retryWrites=true&w=majority&appName=Cluster0
```

### 🔐 Administrative Login Credentials
The Admin CMS uses a built-in authentication system that works out-of-the-box. Use either of the following credentials to access the Operations Control Dashboard:

* **Username (Email):** `pkumar@cluso.in` or `indiaops@cluso.in`
* **Password:** `Cluso@2026`

---

## How to add them in the Vercel Dashboard:
1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** > **Environment Variables**.
3. Under **Key**, enter `MONGODB_URI`.
4. Under **Value**, paste the connection string.
5. Click **Add**, then redeploy your project.

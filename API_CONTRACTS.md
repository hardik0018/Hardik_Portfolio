# API_CONTRACTS.md — Backend API Documentation

This document describes the backend endpoints hosted on the Next.js portfolio application.

---

## 1. API Route Index

| Method | Route | Purpose | Auth | Request | Response | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/contact` | Submits the contact/inquiry form | None | JSON object with name, email, message, projectType | JSON confirmation payload | Incorporates honeypot field for bot spam detection. Escapes inputs to prevent HTML/XSS injection. Sends email via Resend API. |
| **POST** | `/api/revalidate` | Triggers Next.js ISR cache revalidation | Secret Header Token | JSON object with revalidate tag name | JSON confirmation payload | Validates key header `x-revalidate-secret`. Revalidates specific cache tags (e.g. `sanity:projects`). |

---

## 2. API Specifications

### 1. Contact Form Submission (`POST /api/contact`)

* **Endpoint URL**: `https://hardikvatukiya.vercel.app/api/contact`
* **Content-Type**: `application/json`
* **Authentication**: None

#### Request Payload
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "message": "Hi Hardik, I would love to work on a website project with you.",
  "projectType": "Web Development",
  "website": ""
}
```

* **Field Specifications**:
  * `name` (string, required): Sender name (Max 100 characters).
  * `email` (string, required): Sender email address (Max 150 characters, must match format `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  * `message` (string, required): Inquiry content (Max 5000 characters).
  * `projectType` (string, optional): Project category (Max 50 characters).
  * `website` (string, optional): Honeypot trap. **Must be kept empty by client**. If populated with data, the request is flagged as spam and discarded (returns `200 Success` to fool bot script).

#### Response Payloads

##### Success (200 OK)
```json
{
  "success": true,
  "message": "Email sent successfully."
}
```

##### Validation Failure (400 Bad Request)
```json
{
  "error": "Name, email, and message are required."
}
```
*(Or `"Invalid email address."`, `"Message too long."` etc.)*

##### Configuration Error (500 Internal Server Error)
```json
{
  "error": "Mail service not configured. Please add RESEND_API_KEY to your environment."
}
```

---

### 2. Cache Revalidation (`POST /api/revalidate`)

* **Endpoint URL**: `https://hardikvatukiya.vercel.app/api/revalidate`
* **Content-Type**: `application/json`
* **Headers**:
  * `x-revalidate-secret` (string, required): Header token configured inside Sanity Webhook triggers.

#### Request Payload
```json
{
  "tag": "projects"
}
```

* **Supported Tags**: `"hero"`, `"about"`, `"projects"`, `"skills"`, `"journey"`, `"contact"`, `"navigation"`.

#### Response Payloads

##### Success (200 OK)
```json
{
  "revalidated": true,
  "tag": "projects"
}
```

##### Unauthorized (401 Unauthorized)
```json
{
  "error": "Invalid revalidation secret"
}
```

##### Unsupported Request (400 Bad Request)
```json
{
  "error": "Unsupported revalidation tag"
}
```

##### Missing Environment Secret (500 Internal Server Error)
```json
{
  "error": "Revalidation service not configured"
}
```

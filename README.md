# BookingSystem
## 🛠 1️⃣ Setup in GitHub Codespaces
### **🔹 Open Codespace**
1. Go to your GitHub repository.
2. Click on **"Code"** → **"Codespaces"** → **"Create codespace on main"**.
3. Wait for the Codespace to initialize.

### **🔹 Install Dependencies & Start Servers**
```sh
cd backend
npm install
npm start &
cd ../frontend
npm install
npm run dev -- --host
```

---

## 📂 2️⃣ Project Folder Structure
```
/booking-system
│── backend/ (Node.js API)
│   │── server.js
│   │── package.json
│   │── .env (Environment Variables)
│   │── routes/
│   │── models/
│── frontend/ (React + Vite.js App)
│   │── src/
│   │── index.js
│   │── App.jsx
│   │── package.json
│── docker-compose.yml (Database setup)
│── README.md (This file)
```

---
## 📜 3️⃣ System Requirements Specification (SRS)

### **📌 Scope**
This system will cover:
- **User Registration & Authentication**
- **Service Provider Management**
- **Appointment Scheduling**
- **Payment Processing**
- **Notifications**

It targets **small to medium-sized service providers** across various industries. The system allows:
- **Service Providers** to:
  - List services, manage schedules, and accept appointments.
- **Clients** to:
  - Browse services, book appointments, and receive confirmations/reminders.
- **Administrators** to:
  - Manage users and system configurations.

(Note: For small businesses, service providers and admins might be equivalent.)

---

### **📌 Functional Requirements**
#### **1️⃣ Integration**
- Service providers must be able to integrate the booking system into their existing platforms.

#### **2️⃣ User Registration & Authentication**
- Clients and service providers must register using email or social media.
- Users must be able to reset passwords.
- Two-factor authentication (2FA) is required for added security.

#### **3️⃣ Service Provider Management (Not Part of Booking)**
- Service providers can create/manage profiles including:
  - **Business details**
  - **Working hours**
  - **Contact information**
- Providers can add/modify services offered with:
  - **Pricing**
  - **Duration**
  - **Availability**

#### **4️⃣ Service Listing (Not Part of Booking)**
- Clients can browse services by:
  - **Category**
  - **Location** (Is this required?)
  - **Availability**
- Search results must display:
  - **Service provider details**
  - **Service descriptions**
  - **Pricing**

#### **5️⃣ Booking Management**
- Clients can:
  - View available time slots.
  - Book appointments.
  - Cancel/reschedule appointments (with conditions).
- Booking slots are defined by:
  - **Service duration**
  - **Provider availability**

#### **6️⃣ Appointment Scheduling**
- Prevents **double bookings**.
- Supports **recurring appointments** (e.g., weekly meetings).
- Sends **confirmations & reminders** to clients and providers.

#### **7️⃣ Payment & Invoicing**
- Clients can **pay securely** through the system.
- Providers can **generate invoices** for completed services.
- Payments must comply with **industry standards** (e.g., German market regulations).

#### **8️⃣ Notifications**
- Clients & providers receive **email and in-app notifications** for:
  - Appointment confirmations
  - Reminders
  - Cancellations

#### **9️⃣ Admin Panel**
- Admins can **manage users & roles**.
- System settings such as **categories & locations** can be adjusted.
- Admins can **view reports & logs**.

---

### **📌 Non-Functional Requirements**
#### **1️⃣ Performance**
- System response time must be **≤2 seconds**. (Need industry standard confirmation.)
- Must **scale** to handle increased traffic.

#### **2️⃣ Security (Critical)**
- **User data encryption** (including passwords).
- **Role-based access** to sensitive data.
- Compliance with **data protection regulations**.

#### **3️⃣ Scalability**
- Handle **20% user growth within 6 months**.
- Database must **scale** with more users & bookings.

#### **4️⃣ Usability**
- UI must be **intuitive, modern & responsive**.
- Must support **accessibility** features.

#### **5️⃣ Reliability**
- Minimum **99.9% uptime**.
- **Backup & recovery procedures** must be in place.

---

### **📌 Constraints**
- **Compliance with local data protection laws**.
- **Mobile app support for Android & iOS**.

---


## 📅 4️⃣  Tech Stack Used
- **Frontend:** React (Vite.js) + TailwindCSS (for basic UI)
- **Backend:** Node.js + Express.js
- **Database:** MySQL (with migrations)

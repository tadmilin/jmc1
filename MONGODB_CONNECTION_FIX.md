# 🔧 แก้ไขปัญหา MongoDB Connection ใน Production

## 🚨 ปัญหาที่เกิดขึ้น

```
ERROR: Error: cannot connect to MongoDB. Details: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## 🔍 สาเหตุ

1. **SSL/TLS Configuration**: การตั้งค่า SSL ไม่เหมาะสมสำหรับ Vercel production environment
2. **MongoDB Atlas Network Access**: อาจมีปัญหา IP whitelist
3. **Connection String**: อาจต้องปรับ parameters ใน connection string

## 🛠️ การแก้ไข

### 1. ปรับปรุง MongoDB Connection Options

แก้ไข `src/payload.config.ts`:

```typescript
db: mongooseAdapter({
  url: process.env.DATABASE_URI || '',
  connectOptions: {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
}),
```

### 2. ปรับปรุง MongoDB Connection String

**Connection String ปัจจุบัน:**
```
mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/?retryWrites=true&w=majority&appName=jmc1
```

**Connection String ที่แนะนำสำหรับ Production:**
```
mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/jmc1?retryWrites=true&w=majority&ssl=true&authSource=admin&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000
```

### 3. ตรวจสอบ MongoDB Atlas Settings

#### A. Network Access (IP Whitelist)
1. ไปที่ [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. เลือก Project: jmc1
3. ไปที่ Network Access
4. ตรวจสอบว่ามี IP Address: `0.0.0.0/0` (Allow access from anywhere)
5. หากไม่มี ให้เพิ่ม:
   - IP Address: `0.0.0.0/0`
   - Comment: "Vercel Production Access"

#### B. Database Access (User Permissions)
1. ไปที่ Database Access
2. ตรวจสอบ User: `tadeyes1`
3. ตรวจสอบ Roles: ต้องมี `readWrite` บน database `jmc1`

### 4. Environment Variables สำหรับ Vercel

ใน Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URI=mongodb+srv://tadeyes1:oEo9elNLikhylKek@jmc1.jstakqn.mongodb.net/jmc1?retryWrites=true&w=majority&ssl=true&authSource=admin&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000
```

### 5. Alternative: สร้าง Database User ใหม่

หากปัญหายังคงมีอยู่ ให้สร้าง user ใหม่:

1. ไปที่ MongoDB Atlas → Database Access
2. คลิก "Add New Database User"
3. Authentication Method: Password
4. Username: `jmc-production`
5. Password: สร้าง password ใหม่ที่แข็งแรง
6. Database User Privileges: `readWrite` บน `jmc1`
7. อัปเดต `DATABASE_URI` ใน Vercel environment variables

## 🔄 ขั้นตอนการ Deploy

### 1. Push Code Changes
```bash
git add .
git commit -m "fix: improve MongoDB connection options for production SSL/TLS"
git push origin master
```

### 2. อัปเดต Environment Variables ใน Vercel
- ไปที่ Vercel Dashboard
- เลือกโปรเจค JMC
- Settings → Environment Variables
- อัปเดต `DATABASE_URI` ด้วย connection string ใหม่

### 3. Redeploy
- Vercel จะ auto-deploy หลัง push
- หรือ manual redeploy ใน Vercel Dashboard

## 🧪 การทดสอบ

### 1. ทดสอบ Connection ใน Development
```bash
npm run dev
# ตรวจสอบว่า MongoDB เชื่อมต่อได้ปกติ
```

### 2. ทดสอบ Production
- เข้า https://jmc111.vercel.app/admin
- ตรวจสอบว่า login ได้
- ตรวจสอบว่า collections โหลดได้

## 📝 หมายเหตุ

- **SSL/TLS**: จำเป็นสำหรับ MongoDB Atlas ใน production
- **IP Whitelist**: Vercel ใช้ dynamic IP ดังนั้นต้อง allow `0.0.0.0/0`
- **Connection Timeout**: ปรับให้เหมาะสมกับ serverless environment
- **Database Name**: ระบุชื่อ database ชัดเจนใน connection string

## 🚨 ถ้ายังมีปัญหา

1. ตรวจสอบ Vercel Function Logs
2. ตรวจสอบ MongoDB Atlas Logs
3. ลองสร้าง MongoDB Cluster ใหม่
4. ลองใช้ MongoDB connection string แบบ standard แทน SRV

---
*อัปเดตเมื่อ: ${new Date().toLocaleDateString('th-TH')} ${new Date().toLocaleTimeString('th-TH')}* 
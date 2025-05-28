@echo off
echo 🚀 เริ่มต้น Vercel Deployment Process...

echo 🧹 ล้าง cache และ dependencies...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 📦 ติดตั้ง dependencies...
npm install

echo 🔧 Generate Payload types และ importmap...
npm run generate:types
npm run generate:importmap

echo 🏗️ Building application...
npm run build

echo ✅ Build สำเร็จ!

echo 🌐 Deploy ไปยัง Vercel...
npx vercel --prod

echo 🎉 Deployment เสร็จสิ้น!
echo 📱 ทดสอบ Admin Panel ที่: https://jmc111.vercel.app/admin
echo 🔍 ตรวจสอบสถานะที่: https://jmc111.vercel.app/api/admin-health

pause 
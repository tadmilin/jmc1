#!/bin/bash

echo "🚀 เริ่มต้น Vercel Deployment Process..."

# ตรวจสอบ environment variables
echo "📋 ตรวจสอบ Environment Variables..."
if [ -z "$PAYLOAD_SECRET" ]; then
  echo "❌ PAYLOAD_SECRET ไม่ได้ตั้งค่า"
  exit 1
fi

if [ -z "$DATABASE_URI" ]; then
  echo "❌ DATABASE_URI ไม่ได้ตั้งค่า"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SERVER_URL" ]; then
  echo "❌ NEXT_PUBLIC_SERVER_URL ไม่ได้ตั้งค่า"
  exit 1
fi

echo "✅ Environment Variables ครบถ้วน"

# ล้าง cache และ build
echo "🧹 ล้าง cache และ dependencies..."
rm -rf .next
rm -rf node_modules/.cache

echo "📦 ติดตั้ง dependencies..."
npm install

echo "🔧 Generate Payload types และ importmap..."
npm run generate:types
npm run generate:importmap

echo "🏗️ Building application..."
npm run build

echo "✅ Build สำเร็จ!"

echo "🌐 Deploy ไปยัง Vercel..."
npx vercel --prod

echo "🎉 Deployment เสร็จสิ้น!"
echo "📱 ทดสอบ Admin Panel ที่: $NEXT_PUBLIC_SERVER_URL/admin"
echo "🔍 ตรวจสอบสถานะที่: $NEXT_PUBLIC_SERVER_URL/api/admin-health" 
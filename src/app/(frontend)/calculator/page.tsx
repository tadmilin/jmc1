import { Metadata } from 'next'
import { Calculator, Palette, Home } from 'lucide-react'
import { PaintCalculator } from './PaintCalculator'

export const metadata: Metadata = {
  title: 'คำนวณปริมาณสี | ร้านเจเอ็มซี - วัสดุก่อสร้าง',
  description:
    'คำนวณปริมาณสีที่ใช้ในการทาบ้าน ทั้งสีรองพื้นและสีจริง สำหรับผนัง เพดาน หรือพื้นที่ทั้งหมด',
  keywords: 'คำนวณสี, สีทาบ้าน, สีรองพื้น, ปริมาณสี, เกลอน, วัสดุก่อสร้าง',
}

export default function CalculatorPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/calculator/hero-background.webp')`,
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Fallback Background Pattern (if image doesn't load) */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <Palette className="w-16 h-16 text-blue-400 animate-float" />
        </div>
        <div className="absolute top-32 right-16 opacity-30">
          <Home className="w-20 h-20 text-green-400 animate-float-delay" />
        </div>
        <div className="absolute bottom-24 left-20 opacity-30">
          <Calculator className="w-14 h-14 text-purple-400 animate-float-bounce" />
        </div>
        <div className="absolute top-1/2 right-8 opacity-25">
          <Palette className="w-12 h-12 text-pink-400 animate-float" />
        </div>
        <div className="absolute bottom-32 right-32 opacity-25">
          <Home className="w-18 h-18 text-orange-400 animate-float-delay" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <Calculator className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              คำนวณปริมาณสี | ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              เครื่องมือคำนวณปริมาณสีอัจฉริยะ
              <br />
              คำนวณสีรองพื้นและสีจริงได้แม่นยำ ประหยัดเวลาและค่าใช้จ่าย
            </p>

            {/* Scroll Down Indicator */}
            <div className="animate-bounce-enhanced">
              <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center animate-pulse-scale">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Content */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-black">
            <PaintCalculator />
          </div>
        </div>
      </div>
    </>
  )
}

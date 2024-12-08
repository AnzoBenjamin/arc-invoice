import { useEffect, useState } from "react";
export default function Home() {
  const [currentYear, setCurrentYear] = useState(2080)
  useEffect(()=>{


    const date = new Date();
    const year = date.getFullYear()
    setCurrentYear(year)
  },[])
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-medium leading-tight mb-6">
            Easiest invoicing for freelancers and small businesses
          </h1>
          <p className="text-gray-600 mb-12">
            Streamline your billing process and get paid faster with our intuitive invoicing solution.
          </p>
          <div className="relative w-full aspect-video">
            <img
              src="https://res.cloudinary.com/almpo/image/upload/v1637241441/special/banner_izy4xm.png"
              alt="Invoicing app dashboard preview"
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © {currentYear} made by <a href="https://anzo-benjamin.vercel.app/">Anzo Benjamin</a>. All rights reserved.
        </div>
        </footer>
    </div>
  )
}
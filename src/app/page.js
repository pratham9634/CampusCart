
import Testimonials from "@/components/home/Testimonials";
import Works from "@/components/home/Works";
import Hero from "@/components/home/Hero";
import Faq from "@/components/home/Faq";
import WhyChoose from "@/components/home/WhyChoose";

export default function Home() {
  return (
    <main className="flex flex-col h-full w-full p-1">


      {/* Hero Section */}
        <Hero/>

      {/* How It Work Section*/}
        <Works/>

      {/* Why Choose Us Section */}
        <WhyChoose/>  
        
      {/*Testimonials */}
        <Testimonials/>

      {/* FAQ Section */}  
        <Faq/>

      

    </main>
  );
}

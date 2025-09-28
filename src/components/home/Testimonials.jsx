"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { data } from "@/constants/testimonials";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion"; // Import motion

const Testimonials = () => {
  return (
    <section className="w-full h-full px-4 py-24 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sigmar font-[900] text-center w-full mb-16 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-text"
      >
        What Our Users Say
        <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-full animate-pulse"></span>
      </motion.h1>

      {/* Wrap the Carousel in a motion.div to animate it as a whole block */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Carousel
          className="w-[70vw] md:w-[80vw] lg:w-[90vw] mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="ml-2">
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className="md:basis-1/2 lg:basis-1/3 p-4"
              >
                {/* Each card is now a motion component for hover effects */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full"
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.branch}, {item.year}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">
                    {item.testimonial}
                  </p>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: item.stars }, (_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    {Array.from({ length: 5 - item.stars }, (_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 text-gray-300 fill-current"
                      />
                    ))}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:flex justify-between mt-4 px-4">
            <CarouselPrevious className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-colors" />
            <CarouselNext className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-colors" />
          </div>
        </Carousel>
      </motion.div>
    </section>
  );
};

export default Testimonials;
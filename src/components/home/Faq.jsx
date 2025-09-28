"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants/faq";
import { motion } from "framer-motion"; // Import motion

// Define animation variants for the container (the accordion) and its items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each FAQ item will animate 0.1s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const Faq = () => {
  return (
    <section className="py-24 px-4 w-full bg-gray-50 overflow-x-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-lg md:text-2xl sigmar font-[900] text-center w-full mb-16 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 animate-text"
      >
        Frequently Asked Questions
        <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 rounded-full animate-text"></span>
      </motion.h2>

      <motion.div
        className="w-full px-8 md:px-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
      >
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqData.map((item) => (
            // Wrap each AccordionItem in a motion.div to apply the item variant
            <motion.div key={item.id} variants={itemVariants}>
              <AccordionItem
                value={item.id}
                className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow font-extrabold"
              >
                <AccordionTrigger className="px-4 py-2 text-sm text-left text-gray-800 font-medium hover:bg-gray-100 transition-colors rounded-t-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2 text-purple-700 bg-gray-50 rounded-b-lg">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default Faq;
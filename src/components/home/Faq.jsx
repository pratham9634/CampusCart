import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/constants/faq";



const Faq = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <h2 className="text-4xl sigmar font-[900] text-center w-full mb-16 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 animate-text">
  Frequently Asked Questions
  <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 rounded-full animate-text"></span>
</h2>




      <Accordion type="single" collapsible className="w-[80vw] mx-auto space-y-4">
        {faqData.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow font-extrabold ">
            <AccordionTrigger className="px-4 py-3 text-gray-800 font-medium hover:bg-gray-100 transition-colors rounded-t-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-neutral-900 bg-gray-50 rounded-b-lg">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;

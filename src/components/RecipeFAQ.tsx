import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { RecipeFAQ as RecipeFAQItem } from "@/lib/recipe-faqs";

interface Props {
  faqs: RecipeFAQItem[];
}

const RecipeFAQ = ({ faqs }: Props) => {
  if (!faqs?.length) return null;

  return (
    <div className="max-w-4xl mt-16 pt-12 border-t border-border">
      <h2 className="heading-section mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="max-w-2xl">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default RecipeFAQ;

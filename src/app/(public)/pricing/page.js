import FAQSection from "@/components/publicComponents/FAQSection";
import InKindSection from "@/components/publicComponents/InKindSection";
import PricingHeroSection from "@/components/publicComponents/PricingHeroSection";
import PricingSection from "@/components/publicComponents/PricingSection";
import WorkProcess from "@/components/publicComponents/WorkProcess";
import React from "react";

const PricingPage = () => {
  return (
    <div>
      <PricingHeroSection />
      <WorkProcess />
      <PricingSection />
      <InKindSection />
      <FAQSection />
    </div>
  );
};

export default PricingPage;

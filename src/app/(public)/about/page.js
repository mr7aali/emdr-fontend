import AboutHero from "@/components/publicComponents/AboutHero";
import ClinicCTA from "@/components/publicComponents/ClinicCTA";
import FounderSection from "@/components/publicComponents/FounderSection";
import WhatWeDo from "@/components/publicComponents/WhatWeDo";
import WhoWeAre from "@/components/publicComponents/WhoWeAre";
import React from "react";

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <FounderSection />
      <WhatWeDo />
      <WhoWeAre />
      <ClinicCTA />
    </div>
  );
}

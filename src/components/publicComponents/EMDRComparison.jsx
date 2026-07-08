import React from 'react';

const EMDRComparison = () => {
  const comparisonData = [
    { label: 'Treatment Duration', emdr: 'Faster', traditional: 'Extended' },
    { label: 'Between Sessions', emdr: 'Natural processing', traditional: 'Daily homework' },
    { label: 'Dropout Rate', emdr: '0-20%', traditional: '30-40%' },
    { label: 'Verbal Processing', emdr: 'Minimal', traditional: 'Extensive' },
    { label: 'Long-term Effect', emdr: 'Sustained', traditional: 'Variable' },
    { label: 'Cost-effectiveness', emdr: '#1 Ranked', traditional: 'Moderate' },
  ];

  return (
    <div className=" min-h-screen py-12 px-4 font-serif">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl text-[#2D312E] mb-4">
            EMDR vs Traditional Approaches
          </h1>
          <p className="text-[#8BA88E] italic text-sm md:text-base">
            Why leading organisations now recommend EMDR as first-line treatment
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* EMDR Therapy Card */}
          <div className="relative bg-[#DDE7E0] rounded-xl p-6 md:p-8 shadow-sm">
            <div className="absolute top-4 right-4 bg-[#4A6352] text-white text-[10px] px-3 py-1 rounded tracking-wider uppercase font-sans">
              Recommended
            </div>
            <h2 className="text-2xl text-center text-[#2D312E] mb-8">EMDR Therapy</h2>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-[#C5D1C9] pb-2 text-sm md:text-base">
                  <span className="text-[#555]">{item.label}</span>
                  <span className="font-medium text-[#2D312E]">{item.emdr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional / CBT Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl text-center text-[#2D312E] mb-8">Traditional / CBT</h2>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 text-sm md:text-base">
                  <span className="text-[#777]">{item.label}</span>
                  <span className="font-medium text-[#2D312E]">{item.traditional}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medication Comparison Footer Card */}
        <div className="bg-white/50 border border-gray-200 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-[#2D312E] mb-6">The Medication Comparison</h2>
          <p className="text-[#4A4A4A] leading-relaxed text-sm md:text-base max-w-3xl mx-auto">
            The landmark van der Kolk study (2007) revealed that whilst both EMDR and fluoxetine (Prozac) 
            initially reduced symptoms, only EMDR maintained benefits at 6-month follow-up. Adult onset 
            trauma showed <span className="font-semibold text-[#2D312E]">91% remission</span> with EMDR 
            versus <span className="font-semibold text-[#2D312E]">72% with medication</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EMDRComparison;
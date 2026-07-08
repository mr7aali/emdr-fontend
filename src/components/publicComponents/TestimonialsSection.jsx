"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react"; 

const testimonials = [
  {
    name: "John Walker",
    role: "CEO, company",
    image: "https://i.pravatar.cc/150?u=1",
    stars: 4,
    quote: "I've tried many platforms, but UI Wiki stands out for its attention to detail and clean aesthetics. Highly recommend!",
  },
  {
    name: "Harry Maguire",
    role: "CFO, company",
    image: "https://i.pravatar.cc/150?u=2",
    stars: 5,
    quote: "UI Wiki transformed our design process! The templates are modern, user-friendly, and saved us countless hours.",
  },
  {
    name: "Edgar Davids",
    role: "UI Designer, company",
    image: "https://i.pravatar.cc/150?u=3",
    stars: 4,
    quote: "UI Wiki's grid section templates are visually impressive and easy to customize. They've elevated my project presentations.",
  },
  {
    name: "Ashley Cook",
    role: "UX Designer, company",
    image: "https://i.pravatar.cc/150?u=4",
    stars: 5,
    quote: "We revamped our company website using these templates and the feedback has been overwhelming!",
  },
];

const TestimonialCard = ({ item }) => (
  <div className="min-w-[350px] md:min-w-[450px] bg-white p-8 rounded-[20px] border-2 border-[#92B09B] mx-4">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-bold text-[#2D312D]">{item.name}</h4>
          <p className="text-sm text-gray-500">{item.role}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < item.stars ? "#568261" : "none"}
            className={i < item.stars ? "text-[#568261]" : "text-gray-300"}
          />
        ))}
      </div>
    </div>
    
    <div className="text-[#568261] mb-2">
      <svg width="30" height="24" viewBox="0 0 30 24" fill="currentColor">
        <path d="M0 24V11.1341C0 7.51421 0.824961 4.78907 2.47488 2.95868C4.1248 1.12829 6.6338 0.139648 10 0V4.54224C8.42857 4.54224 7.23077 4.96541 6.40659 5.81176C5.58242 6.65811 5.17033 7.91501 5.17033 9.58245V11.1341H10V24H0ZM20 24V11.1341C20 7.51421 20.825 4.78907 22.4749 2.95868C24.1248 1.12829 26.6338 0.139648 30 0V4.54224C28.4286 4.54224 27.2308 4.96541 26.4066 5.81176C25.5824 6.65811 25.1703 7.91501 25.1703 9.58245V11.1341H30V24H20Z" />
      </svg>
    </div>

    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
      {item.quote}
    </p>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="bg-[#FCF9F4] py-10 overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-[#2D312D] mb-4">
          What People Are Saying
        </h2>
        <p className="text-[#568261] font-medium uppercase tracking-widest text-xs md:text-sm opacity-80">
          Hear the trusted feedback from customers who have put their faith in us
        </p>
      </div>


      <div className="relative flex flex-col gap-8">

        <div className="flex">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </motion.div>
        </div>

        <div className="flex">
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: 0 }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex"
          >
            {[...testimonials, ...testimonials].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
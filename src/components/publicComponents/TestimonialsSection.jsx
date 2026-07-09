"use client";

import React, { useMemo, useState } from "react";
import { MessageCircle, Send, Star } from "lucide-react";

const REVIEW_EMAIL =
  process.env.NEXT_PUBLIC_REVIEW_EMAIL || "clinical@inkind.uk";

const TestimonialsSection = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const canSubmit = message.trim().length > 0 && rating > 0;

  const emailBody = useMemo(
    () =>
      [
        `Rating: ${rating || "Not selected"} / 5`,
        name.trim() ? `Name: ${name.trim()}` : "Name: Anonymous",
        "",
        "Review:",
        message.trim(),
      ].join("\n"),
    [message, name, rating],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setStatus("Please choose a rating and write a short review first.");
      return;
    }

    const mailto = new URL(`mailto:${REVIEW_EMAIL}`);
    mailto.searchParams.set("subject", "InKind EMDR review");
    mailto.searchParams.set("body", emailBody);

    window.location.href = mailto.toString();
    setStatus("Your email app should open with your review ready to send.");
  };

  return (
    <section className="bg-[#FCF9F4] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DBE5DE] text-[#4A7C59]">
            <MessageCircle size={24} />
          </div>
          <h2 className="mb-4 font-serif text-4xl text-[#2D312D] md:text-5xl">
            Share Your Experience
          </h2>
          <p className="max-w-xl text-base leading-7 text-[#4A5A4E]">
            We have hidden the placeholder reviews while we collect real
            feedback. If InKind EMDR has helped you, you can leave a short note
            for the team here.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-[#DBE5DE] bg-white p-6 shadow-sm md:p-8"
        >
          <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.16em] text-[#568261]">
            Your rating
          </label>
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                className="rounded-full p-1 text-[#568261] transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#568261]/30"
              >
                <Star
                  size={28}
                  fill={value <= rating ? "#568261" : "none"}
                  className={
                    value <= rating ? "text-[#568261]" : "text-[#C9D7CE]"
                  }
                />
              </button>
            ))}
          </div>

          <label
            htmlFor="review-name"
            className="mb-2 block text-sm font-medium text-[#2D312D]"
          >
            Name optional
          </label>
          <input
            id="review-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mb-5 w-full rounded-xl border border-[#DBE5DE] px-4 py-3 text-[#2D312D] outline-none transition focus:border-[#568261] focus:ring-2 focus:ring-[#568261]/10"
            placeholder="Your name"
          />

          <label
            htmlFor="review-message"
            className="mb-2 block text-sm font-medium text-[#2D312D]"
          >
            Review
          </label>
          <textarea
            id="review-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="mb-5 w-full resize-none rounded-xl border border-[#DBE5DE] px-4 py-3 text-[#2D312D] outline-none transition placeholder:text-stone-400 focus:border-[#568261] focus:ring-2 focus:ring-[#568261]/10"
            placeholder="Write a few words about your experience..."
          />

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A7C59] px-5 py-3 font-semibold text-white transition hover:bg-[#3d6649] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit}
          >
            <Send size={18} />
            Send Review
          </button>

          {status && (
            <p className="mt-4 text-center text-sm text-[#568261]">{status}</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default TestimonialsSection;

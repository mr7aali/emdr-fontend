"use client";
import React from "react";

export default function WelcomeSection() {
  return (
    <div className="w-full py-10 relative z-10">
      <style>{`
        .welcome-text {
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(74, 124, 89, 0.08);
        }

        .welcome-text h2 {
            color: #2d4a3b;
            font-size: 1.5em;
            font-weight: 500;
            margin-bottom: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .welcome-text p {
            color: #5e8d6f;
            font-size: 0.95em;
            line-height: 1.6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }
      `}</style>

      <div className="welcome-text">
        <h2>After Hours</h2>
        <p>
          Your Personal Practice and Reflection Space
        </p>
        <p>
          The work doesn&apos;t stop when the session ends. Choose an area
          below to continue - at your own pace, in your own time. Each space
          holds exercises designed to support what&apos;s unfolding between
          sessions.
        </p>
      </div>
    </div>
  );
}

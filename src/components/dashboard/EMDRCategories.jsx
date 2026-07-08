"use client";
import React from "react";
import Link from "next/link";
export default function EMDRCategories() {
  const categories = [
    {
      title: "Behaviours",
      description: "Transform what you're doing or not doing",
      image: "/homeImage/gril.jpg",
      link: "/dashboard/behaviours",
      locked: true,
    },
    {
      title: "Thoughts",
      description: "Understanding and reshaping your thinking",
      image: "/homeImage/thu.jpg",
      link: "/dashboard/thoughts",
      locked: false,
    },
    {
      title: "Emotions",
      description: "Tools to manage bigger emotions",
      image: "/homeImage/gril.jpg",
      link: "/dashboard/emotions",
      locked: false,
    },
  ];

  return (
    <>
      <style>{`
        /* Homework bubbles container */
        .homework-grid {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 50px;
            flex-wrap: wrap;
            margin-top: 40px;
            position: relative;
            z-index: 10;
        }

        /* Circle bubbles */
        .homework-bubble {
            width: 280px;
            height: 280px;
            box-sizing: border-box;
            border-radius: 50%;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 30px 34px 34px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 10px 30px rgba(74, 124, 89, 0.1);
            position: relative;
            overflow: visible;
            animation: bubbleIn 0.8s ease-out both;
            border: 2px solid transparent;
            text-decoration: none;
        }

        .homework-bubble:nth-child(1) { animation-delay: 0.1s; }
        .homework-bubble:nth-child(2) { animation-delay: 0.2s; }
        .homework-bubble:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bubbleIn {
            from {
                opacity: 0;
                transform: scale(0.5);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .homework-bubble:hover {
            transform: translateY(-15px) scale(1.08);
            box-shadow: 0 20px 50px rgba(74, 124, 89, 0.25);
            background: linear-gradient(135deg, #ffffff 0%, #f0f7f3 100%);
            border: 2px solid #6b9f7f;
        }

        /* Bubble content */
        .bubble-icon {
            width: 96px;
            height: 96px;
            flex: 0 0 auto;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            overflow: hidden;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(74, 124, 89, 0.2);
        }

        .homework-bubble:hover .bubble-icon {
            transform: rotate(5deg) scale(1.1);
        }

        .bubble-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .bubble-title {
            font-size: 1.5em;
            line-height: 1.15;
            font-weight: 500;
            color: #2d4a3b;
            margin-bottom: 0;
            max-width: 170px;
            text-align: center;
            overflow-wrap: anywhere;
            flex: 0 0 auto;
        }

        .bubble-subtitle {
            font-size: 0.9em;
            color: #6b9f7f;
            text-align: center;
            width: 100%;
            max-width: 190px;
            padding: 0;
            line-height: 1.4;
            overflow-wrap: anywhere;
            flex: 0 0 auto;
        }

        /* Enter indicator */
        .enter-indicator {
            position: absolute;
            bottom: 50px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #4a7c59;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .homework-bubble:hover .enter-indicator {
            opacity: 1;
        }

        .enter-indicator svg {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: white;
        }

        /* Premium lock */
        .lock-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 32px;
            height: 32px;
            background: #6b9f7f;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(74, 124, 89, 0.2);
            z-index: 7872;
        }

        .lock-badge svg {
            width: 16px;
            height: 16px;
            fill: white;
            display: block;
        }

        /* Responsive design */
        @media (max-width: 968px) {
            .homework-grid {
                flex-direction: column;
                gap: 40px;
            }
            .homework-bubble {
                width: 250px;
                height: 250px;
                padding: 26px 30px 30px;
            }
            .bubble-icon {
                width: 84px;
                height: 84px;
            }
            .lock-badge {
                top: 20px;
                right: 20px;
            }
        }

        @media (max-width: 480px) {
            .homework-bubble {
                width: 220px;
                height: 220px;
                gap: 3px;
                padding: 24px 24px 28px;
            }
            .bubble-icon {
                width: 68px;
                height: 68px;
            }
            .bubble-title {
                font-size: 1.2em;
                max-width: 145px;
            }
            .bubble-subtitle {
                font-size: 0.78em;
                max-width: 150px;
            }
            .lock-badge {
                top: 16px;
                right: 16px;
            }
        }
      `}</style>

      <div className="homework-grid w-full">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.link || "#"}
            className="homework-bubble group"
          >
            {category.locked && (
              <div className="lock-badge">
                <svg viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                </svg>
              </div>
            )}

            <div className="bubble-icon">
              <img src={category.image} alt={category.title} />
            </div>

            <div className="bubble-title">{category.title}</div>

            <div className="bubble-subtitle">{category.description}</div>

            <div className="enter-indicator">
              <svg
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

import EMDRCategories from "@/components/dashboard/EMDRCategories";
import WelcomeSection from "@/components/dashboard/WelcomeSection";

export default function HomeworkPage() {
  return (
    <div className="space-y-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] relative min-h-screen pb-12 font-sans">
      <style>{`
        /* Header */
        .homework-header {
            text-align: center;
            padding: 40px 20px 40px;
            position: relative;
            z-index: 10;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .homework-header h1 {
            font-size: 2.8em;
            font-weight: 300;
            color: #2d4a3b;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
            animation: fadeIn 1s ease-out;
        }

        .homework-header p {
            font-size: 1.1em;
            color: #5e8d6f;
            font-weight: 400;
            animation: fadeIn 1s ease-out 0.2s both;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
      `}</style>

      {/* Page Header */}
      <div className="homework-header">
        <h1>EMDR Homework Portal</h1>
        <p>Your personal space for growth and healing</p>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <WelcomeSection></WelcomeSection>
        <EMDRCategories></EMDRCategories>
      </div>
    </div>
  );
}

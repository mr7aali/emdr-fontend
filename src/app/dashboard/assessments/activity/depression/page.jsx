'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import Link from 'next/link';
import { useStoredAuth, getStoredTokens } from '@/redux/authStorage';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
});

const config = {
  name: "Depression",
  items: [
    { text: "A heaviness or flatness has sat with me through the day.", reverse: false },
    { text: "The things that usually pull me in have felt dull or pointless.", reverse: false },
    { text: "I have moved through the day with little fuel.", reverse: false },
    { text: "I have judged myself harshly or felt fundamentally bad.", reverse: false },
    { text: "My thinking has felt sluggish, foggy, or hard to direct.", reverse: false },
    { text: "I have felt that the future holds something good.", reverse: true },
    { text: "My sleep has been off — too little, too much, or restless.", reverse: false },
    { text: "My relationship to food has shifted noticeably.", reverse: false },
    { text: "I have felt either weighted down or restless and unable to settle.", reverse: false },
    { text: "I have had thoughts about not being here, or about ending things.", reverse: false }
  ],
  bands: [
    { max: 9, label: "Minimal", description: "Few symptoms of low mood reported in the past week. This is within the range commonly experienced in everyday life." },
    { max: 17, label: "Mild", description: "Some signs of low mood present. These may be noticeable to you but are unlikely to be substantially disrupting daily functioning. Worth tracking week to week as you work through the programme." },
    { max: 25, label: "Moderate", description: "A meaningful pattern of depressive symptoms over the past week. EMDR can be helpful for the experiences that often underlie depression. Track this score over time to notice changes." },
    { max: 32, label: "Marked", description: "Substantial depressive symptoms with likely impact on energy, motivation, and wellbeing. Continue gently with the programme, and consider whether speaking to your GP or a mental health professional might offer useful additional support." },
    { max: 40, label: "Severe", description: "A high level of depressive symptoms with significant impact across multiple areas of life. At this level, additional support is strongly recommended alongside the programme — please consider speaking to your GP or a qualified mental health professional." }
  ],
  alerts: [
    {
      item: 10,
      trigger: ">=1",
      title: "Important",
      message: "Item 10 has been answered above zero. Any thoughts about not wanting to be here deserve careful attention and are not something to work through alone with a self-directed programme. Please pause your EMDR work for now and reach out for support: contact your GP, the Samaritans (116 123 in the UK), or NHS 111. If you are in immediate danger, call 999."
    }
  ],
  options: [
    { value: 0, label: "Never" },
    { value: 1, label: "Rarely" },
    { value: 2, label: "Sometimes" },
    { value: 3, label: "Often" },
    { value: 4, label: "Almost always" }
  ]
};

export default function DepressionAssessment() {
  const { token } = useStoredAuth();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const resultsRef = useRef(null);
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || '';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  const handleOptionChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const calculateScore = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const rawAnswers = config.items.map((_, i) => answers[i]);

    try {
      if (token && baseUrl) {
        const { token: currentToken } = getStoredTokens();
        const response = await fetch(`${baseUrl}/api/symptom-tracker/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${currentToken || token}`,
          },
          body: JSON.stringify({
            trackerType: 'depression',
            answers: rawAnswers,
            stemValue: null,
          }),
        });

        const result = await response.json();

        if (response.ok && result?.success && result?.data) {
          const itemScores = (result.data.itemScores || []).map((itemScore) => ({
            raw: itemScore.rawAnswer,
            scored: itemScore.scored,
            reverse: !!config.items[itemScore.itemIndex]?.reverse,
          }));
          const band =
            config.bands.find((entry) => entry.label === result.data.severityBand) ||
            config.bands.find((entry) => (result.data.totalScore ?? 0) <= entry.max);
          const bandIndex = config.bands.indexOf(band);

          // Alert calculation (local filter for alerts if needed)
          const triggeredAlerts = config.alerts.filter((alert) => {
            const score = itemScores[alert.item - 1].scored;
            if (alert.trigger === '>=1') return score >= 1;
            if (alert.trigger === '>=2') return score >= 2;
            if (alert.trigger === '>=3') return score >= 3;
            return false;
          });

          setResults({
            total: result.data.totalScore ?? 0,
            itemScores,
            band,
            bandIndex,
            alerts: triggeredAlerts,
          });
          setShowResults(true);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to submit depression tracker:', error);
      setSubmitError('Could not save this result to your history. Showing local result instead.');
    }

    let total = 0;
    const itemScores = [];

    config.items.forEach((item, i) => {
      const raw = answers[i];
      const scored = item.reverse ? 4 - raw : raw;
      itemScores.push({ raw, scored, reverse: !!item.reverse });
      total += scored;
    });

    const band = config.bands.find((b) => total <= b.max);
    const bandIndex = config.bands.indexOf(band);

    const triggeredAlerts = config.alerts.filter((alert) => {
      const score = itemScores[alert.item - 1].scored;
      if (alert.trigger === '>=1') return score >= 1;
      if (alert.trigger === '>=2') return score >= 2;
      if (alert.trigger === '>=3') return score >= 3;
      return false;
    });

    setResults({
      total,
      itemScores,
      band,
      bandIndex,
      alerts: triggeredAlerts,
    });
    setShowResults(true);
  };

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResults]);

  const resetTracker = () => {
    setAnswers({});
    setShowResults(false);
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === config.items.length;

  return (
    <div className={`${fraunces.variable} ${instrumentSans.variable} font-sans bg-[#F5F1EA]/50 text-[#1A1814] min-h-screen antialiased selection:bg-[#6B4D5F]/20 rounded-2xl`}>
      <div className="max-w-[720px] mx-auto px-8 py-16 md:py-24 pb-32">

        {/* Header */}
        <header className="border-b border-[#DDD5C5] pb-8 mb-12">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[#8A8278] font-medium mb-6">
            <span className="w-6 h-[1px] bg-[#6B4D5F]"></span>
            InKind EMDR · Symptom Tracker · 02
          </div>
          <h1 className="font-fraunces text-5xl md:text-6xl font-normal leading-[1.05] tracking-tight mb-6 opsz-144">
            Depression
          </h1>
          <p className="font-fraunces text-xl font-light text-[#4A4540] leading-relaxed max-w-[560px] opsz-36">
            A brief check-in on mood, energy, and the texture of daily life over the past week.
          </p>
        </header>

        {/* Notice */}
        <div className="bg-[#FBF8F2] border-l-2 border-[#6B4D5F] p-6 md:p-8 my-10 text-sm leading-relaxed text-[#4A4540]">
          <strong className="block font-fraunces text-base font-medium text-[#1A1814] mb-2 tracking-tight">
            Please read
          </strong>
          This is a symptom tracker designed to help you notice patterns in how you're feeling and to monitor changes as you work through the InKind EMDR programme. It is not a diagnostic instrument and cannot diagnose any condition.
        </div>

        {/* Instructions */}
        <section className="mb-14">
          <h2 className="font-fraunces text-2xl font-normal tracking-tight mb-4 opsz-36">
            Instructions
          </h2>
          <p className="text-[#4A4540] mb-3 text-[15px]">
            For each statement, please choose the response that best describes how true it has been for you over the <strong>past week</strong>. There are no right or wrong answers — try to respond honestly rather than how you think you should.
          </p>
          <p className="text-[#4A4540] mb-6 text-[15px]">
            The whole tracker takes around three minutes to complete.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#DDD5C5] border border-[#DDD5C5] mt-6 overflow-hidden">
            {config.options.map((opt) => (
              <div key={opt.value} className="bg-[#FBF8F2] p-3 text-center">
                <div className="font-fraunces text-lg text-[#6B4D5F] font-medium mb-1">{opt.value}</div>
                <div className="text-[#4A4540] uppercase tracking-wider text-[10px] font-medium">{opt.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tracker Form */}
        <form onSubmit={calculateScore}>
          <div className="space-y-0">
            {config.items.map((item, i) => (
              <div key={i} className="py-8 border-t border-[#EAE3D3] last:border-b last:border-[#EAE3D3]">
                <span className="font-fraunces text-[13px] text-[#6B4D5F] tabular-nums mb-3 block tracking-wide">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <div className={`font-fraunces text-xl md:text-[21px] leading-snug font-normal text-[#1A1814] mb-6 tracking-tight opsz-36 ${item.reverse ? "after:content-['\u00A0\u21BB'] after:text-[#8A8278] after:text-sm after:align-super" : ""}`}>
                  {item.text}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {config.options.map((opt) => (
                    <div key={opt.value} className="relative">
                      <input
                        type="radio"
                        id={`q${i}-${opt.value}`}
                        name={`q${i}`}
                        value={opt.value}
                        checked={answers[i] === opt.value}
                        onChange={() => handleOptionChange(i, opt.value)}
                        className="peer absolute opacity-0 pointer-events-none"
                      />
                      <label
                        htmlFor={`q${i}-${opt.value}`}
                        className="block py-3.5 px-2 bg-[#FBF8F2] border border-[#DDD5C5] text-center cursor-pointer transition-all duration-150 hover:border-[#6B4D5F] hover:bg-[#EFE9EC] peer-checked:bg-[#6B4D5F] peer-checked:border-[#6B4D5F] peer-checked:text-[#F5F1EA] select-none"
                      >
                        <span className="font-fraunces text-lg font-medium block mb-0.5">{opt.value}</span>
                        <span className="text-[9px] uppercase tracking-widest text-[#8A8278] peer-checked:text-[#D4C5CC]">
                          {opt.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="text-[13px] text-[#8A8278] mb-5 tabular-nums">
              <span className="text-[#1A1814] font-medium">{answeredCount}</span> of <span>{config.items.length}</span> answered
            </div>
            <button
              type="submit"
              disabled={!isComplete}
              className="bg-[#1A1814] text-[#F5F1EA] px-12 py-4.5 font-medium text-[14px] tracking-[0.06em] uppercase transition-all duration-200 hover:bg-[#6B4D5F] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Calculate score
            </button>
          </div>
        </form>

        {/* Results Section */}
        {showResults && results && (
          <section ref={resultsRef} className="mt-16 p-10 md:p-12 bg-[#FBF8F2] border border-[#DDD5C5] animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="text-[11px] tracking-[0.18em] uppercase text-[#8A8278] mb-4">
              Your tracker result
            </div>

            {submitError ? (
              <div className="mb-6 border-l-2 border-[#6B4D5F] bg-[#F1EEF0] p-4 text-sm leading-relaxed text-[#1A1814]">
                {submitError}
              </div>
            ) : null}

            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-fraunces text-7xl md:text-8xl font-normal text-[#6B4D5F] leading-none tracking-tighter tabular-nums">
                {results.total}
              </span>
              <span className="font-fraunces text-3xl text-[#8A8278] font-light">/ 40</span>
            </div>

            <div className="font-fraunces text-3xl md:text-4xl mb-4 tracking-tight opsz-72 text-[#1A1814]">
              {results.band.label}
            </div>
            <p className="text-[15px] text-[#4A4540] leading-relaxed mb-8">
              {results.band.description}
            </p>

            <div className="grid grid-cols-5 gap-0.5 mb-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 transition-colors duration-500 ${i <= results.bandIndex ? 'bg-[#6B4D5F]' : 'bg-[#DDD5C5]'}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-0.5 text-[10px] text-[#8A8278] uppercase tracking-widest text-center">
              <div>Minimal</div>
              <div>Mild</div>
              <div>Moderate</div>
              <div>Marked</div>
              <div>Severe</div>
            </div>

            {/* Alerts */}
            {results.alerts && results.alerts.length > 0 && (
              <div className="mt-8 space-y-4">
                {results.alerts.map((alert, i) => (
                  <div key={i} className="bg-[#F4E4DD] border-l-2 border-[#A8553D] p-5 text-sm leading-relaxed text-[#1A1814]">
                    <strong className="block font-fraunces text-base font-medium text-[#A8553D] mb-1.5 tracking-tight">
                      {alert.title}
                    </strong>
                    {alert.message}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-[#DDD5C5]">
              <h3 className="font-fraunces text-lg font-normal mb-4 text-[#4A4540]">Item-by-item</h3>
              <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                {results.itemScores.map((s, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center border border-[#DDD5C5] font-fraunces text-lg relative tabular-nums
                      ${s.scored === 0 ? 'bg-[#FBF8F2] text-[#1A1814]' : ''}
                      ${s.scored === 1 ? 'bg-[#EFE9EC] text-[#1A1814]' : ''}
                      ${s.scored === 2 ? 'bg-[#D4C5CC] text-[#1A1814]' : ''}
                      ${s.scored === 3 ? 'bg-[#A88B99] text-white' : ''}
                      ${s.scored === 4 ? 'bg-[#6B4D5F] text-white' : ''}
                    `}
                    title={`Item ${i + 1}: raw ${s.raw}${s.reverse ? ' (reverse)' : ''} \u2192 ${s.scored}`}
                  >
                    <span className="absolute top-1 left-1.5 font-sans text-[9px] text-[#8A8278] font-medium leading-none">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    {s.scored}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <button
                onClick={resetTracker}
                className="text-[12px] text-[#4A4540] border border-[#DDD5C5] px-6 py-3 transition-all hover:bg-[#F5F1EA] hover:text-[#1A1814] hover:border-[#1A1814]"
              >
                Take again
              </button>
              <Link
                href="/dashboard/results"
                className="text-[12px] bg-[#1A1814] text-[#F5F1EA] px-6 py-3 transition-all hover:bg-[#6B4D5F] flex items-center gap-2"
              >
                View Progress Chart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-[#DDD5C5] text-[12px] text-[#8A8278] tracking-wide">
          <span className="font-fraunces font-medium text-[#1A1814] italic">InKind EMDR</span> · Symptom Tracker
        </footer>
      </div>

      <style jsx global>{`
        .opsz-144 { font-variation-settings: "opsz" 144; }
        .opsz-72 { font-variation-settings: "opsz" 72; }
        .opsz-36 { font-variation-settings: "opsz" 36; }
      `}</style>
    </div>
  );
}

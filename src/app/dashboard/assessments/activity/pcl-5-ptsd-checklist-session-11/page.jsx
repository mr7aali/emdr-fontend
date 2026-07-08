'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  name: 'Worry',
  items: [
    { text: 'My mind has chewed over things long past the point of usefulness.', reverse: false },
    { text: 'Worry has hopped from one topic to the next without resolving.', reverse: false },
    { text: 'Once a worry has its hook in me, it has been hard to unhook.', reverse: false },
    { text: 'I have spent energy on things that probably will not happen.', reverse: false },
    { text: 'Worry has kept me awake or pulled me out of sleep.', reverse: false },
    {
      text: 'I have been able to put a worry down when I needed to attend to something else.',
      reverse: true,
    },
    { text: 'I have worried about things I cannot do anything about anyway.', reverse: false },
    {
      text: 'The worry has shown up in my body - tight shoulders, clenched jaw, churning stomach, headaches.',
      reverse: false,
    },
    { text: 'I have looked to others for reassurance to quiet the worry.', reverse: false },
    { text: 'Worry has crowded out my ability to focus or get things done.', reverse: false },
  ],
  bands: [
    {
      max: 9,
      label: 'Minimal',
      description:
        'Few signs of problematic worry over the past week. The mental activity described is within the range of everyday experience.',
    },
    {
      max: 17,
      label: 'Mild',
      description:
        'Some worry present, with limited impact on daily life. Worth noticing the pattern as you work through the programme.',
    },
    {
      max: 25,
      label: 'Moderate',
      description:
        'A meaningful pattern of worry over the past week. Chronic worry often runs as a habit, and EMDR can help with the experiences that taught the mind to brace this way.',
    },
    {
      max: 32,
      label: 'Marked',
      description:
        'Substantial worry with likely impact on sleep, focus, and wellbeing. Continue with the programme, and consider whether additional support might be useful.',
    },
    {
      max: 40,
      label: 'Severe',
      description:
        'A high level of worry with significant impact across multiple areas of life. At this level, additional support is recommended alongside the programme - please consider speaking to your GP or a qualified mental health professional.',
    },
  ],
  options: [
    { value: 0, label: 'Never' },
    { value: 1, label: 'Rarely' },
    { value: 2, label: 'Sometimes' },
    { value: 3, label: 'Often' },
    { value: 4, label: 'Almost always' },
  ],
};

export default function Pcl5PtsdChecklistSession11Page() {
  const { token } = useStoredAuth();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const resultsRef = useRef(null);
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || '';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  const handleOptionChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
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
            trackerType: 'worry',
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

          setResults({
            total: result.data.totalScore ?? 0,
            itemScores,
            band,
            bandIndex,
          });
          setShowResults(true);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to submit worry tracker:', error);
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

    const band = config.bands.find((entry) => total <= entry.max);
    const bandIndex = config.bands.indexOf(band);

    setResults({
      total,
      itemScores,
      band,
      bandIndex,
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
    <div
      className={`${fraunces.variable} ${instrumentSans.variable} rounded-2xl bg-[#F5F1EA]/50 font-sans text-[#1A1814] min-h-screen antialiased selection:bg-[#4F627A]/20`}
    >
      <div className="mx-auto max-w-[720px] px-5 py-10 pb-20 md:px-8 md:py-16 md:pb-32">
        <header className="mb-12 border-b border-[#DDD5C5] pb-8">
          <div className="mb-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A8278]">
            <span className="h-px w-6 bg-[#4F627A]"></span>
            InKind EMDR | Symptom Tracker | 11
          </div>
          <h1 className="font-fraunces mb-6 text-5xl font-normal leading-[1.05] tracking-tight md:text-6xl opsz-144">
            Worry
          </h1>
          <p className="font-fraunces max-w-[560px] text-xl font-light leading-relaxed text-[#4A4540] opsz-36">
            A brief check-in on the patterns and pull of worry over the past week.
          </p>
        </header>

        <div className="my-10 border-l-2 border-[#4F627A] bg-[#FBF8F2] p-6 text-sm leading-relaxed text-[#4A4540] md:p-8">
          <strong className="font-fraunces mb-2 block text-base font-medium tracking-tight text-[#1A1814]">
            Please read
          </strong>
          This is a symptom tracker designed to help you notice patterns in how you&apos;re feeling and to monitor
          changes as you work through the InKind EMDR programme. It is not a diagnostic instrument and cannot diagnose
          any condition.
        </div>

        <section className="mb-14">
          <h2 className="font-fraunces mb-4 text-2xl font-normal tracking-tight opsz-36">Instructions</h2>
          <p className="mb-3 text-[15px] text-[#4A4540]">
            For each statement, please choose the response that best describes how true it has been for you over the{' '}
            <strong>past week</strong>. There are no right or wrong answers. Try to respond honestly rather than how
            you think you should.
          </p>
          <p className="mb-6 text-[15px] text-[#4A4540]">The whole tracker takes around three minutes to complete.</p>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD5C5] bg-[#DDD5C5] md:grid-cols-5">
            {config.options.map((option) => (
              <div key={option.value} className="bg-[#FBF8F2] p-3 text-center">
                <div className="font-fraunces mb-1 text-lg font-medium text-[#4F627A]">{option.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#4A4540]">{option.label}</div>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={calculateScore}>
          <div>
            {config.items.map((item, index) => (
              <div key={index} className="border-t border-[#EAE3D3] py-8 last:border-b last:border-[#EAE3D3]">
                <span className="font-fraunces mb-3 block text-[13px] tracking-wide text-[#4F627A]">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div
                  className={`font-fraunces mb-6 text-xl font-normal leading-snug tracking-tight text-[#1A1814] md:text-[21px] opsz-36 ${item.reverse ? "after:align-super after:text-sm after:text-[#8A8278] after:content-['\\00a0\\21bb']" : ''
                    }`}
                >
                  {item.text}
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                  {config.options.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={`q${index}-${option.value}`}
                        name={`q${index}`}
                        value={option.value}
                        checked={answers[index] === option.value}
                        onChange={() => handleOptionChange(index, option.value)}
                        className="peer pointer-events-none absolute opacity-0"
                      />
                      <label
                        htmlFor={`q${index}-${option.value}`}
                        className="block cursor-pointer select-none border border-[#DDD5C5] bg-[#FBF8F2] px-4 py-3 text-center transition-all duration-150 hover:border-[#4F627A] hover:bg-[#E8ECF1] peer-checked:border-[#4F627A] peer-checked:bg-[#4F627A] peer-checked:text-[#F5F1EA] md:px-2 md:py-3.5"
                      >
                        <span className="font-fraunces mb-0.5 block text-lg font-medium">{option.value}</span>
                        <span className="text-[11px] uppercase tracking-widest text-[#8A8278] peer-checked:text-[#C8D0DA] md:text-[9px]">
                          {option.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="mb-5 text-[13px] text-[#8A8278]">
              <span className="font-medium text-[#1A1814]">{answeredCount}</span> of <span>{config.items.length}</span>{' '}
              answered
            </div>
            <button
              type="submit"
              disabled={!isComplete}
              className="bg-[#1A1814] px-12 py-4 text-[14px] font-medium uppercase tracking-[0.06em] text-[#F5F1EA] transition-all duration-200 hover:-translate-y-px hover:bg-[#4F627A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Calculate score
            </button>
          </div>
        </form>

        {showResults && results && (
          <section
            ref={resultsRef}
            className="animate-in slide-in-from-bottom-3 fade-in mt-16 border border-[#DDD5C5] bg-[#FBF8F2] p-6 duration-500 md:p-10"
          >
            <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[#8A8278]">Your tracker result</div>

            {submitError ? (
              <div className="mb-6 border-l-2 border-[#4F627A] bg-[#EBEDF0] p-4 text-sm leading-relaxed text-[#1A1814]">
                {submitError}
              </div>
            ) : null}

            <div className="mb-6 flex items-baseline gap-4">
              <span className="font-fraunces text-7xl font-normal leading-none tracking-tighter text-[#4F627A] md:text-8xl">
                {results.total}
              </span>
              <span className="font-fraunces text-3xl font-light text-[#8A8278]">/ 40</span>
            </div>

            <div className="font-fraunces mb-4 text-3xl tracking-tight text-[#1A1814] md:text-4xl opsz-72">
              {results.band.label}
            </div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#4A4540]">{results.band.description}</p>

            <div className="mb-2 grid grid-cols-5 gap-0.5">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-1.5 transition-colors duration-500 ${index <= results.bandIndex ? 'bg-[#4F627A]' : 'bg-[#DDD5C5]'
                    }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-0.5 text-center text-[10px] uppercase tracking-widest text-[#8A8278]">
              <div>Minimal</div>
              <div>Mild</div>
              <div>Moderate</div>
              <div>Marked</div>
              <div>Severe</div>
            </div>

            <div className="mt-10 border-t border-[#DDD5C5] pt-8">
              <h3 className="font-fraunces mb-4 text-lg font-normal text-[#4A4540]">Item-by-item</h3>
              <div className="grid grid-cols-5 gap-1.5 md:gap-2">
                {results.itemScores.map((score, index) => (
                  <div
                    key={index}
                    className={`relative flex aspect-square items-center justify-center border border-[#DDD5C5] font-fraunces text-lg tabular-nums
                      ${score.scored === 0 ? 'bg-[#FBF8F2] text-[#1A1814]' : ''}
                      ${score.scored === 1 ? 'bg-[#E8ECF1] text-[#1A1814]' : ''}
                      ${score.scored === 2 ? 'bg-[#C8D0DA] text-[#1A1814]' : ''}
                      ${score.scored === 3 ? 'bg-[#869AB1] text-white' : ''}
                      ${score.scored === 4 ? 'bg-[#4F627A] text-white' : ''}
                    `}
                    title={`Item ${index + 1}: raw ${score.raw}${score.reverse ? ' (reverse)' : ''} -> ${score.scored}`}
                  >
                    <span className="absolute left-1.5 top-1 font-sans text-[9px] font-medium leading-none text-[#8A8278]">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    {score.scored}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={resetTracker}
                className="border border-[#DDD5C5] px-6 py-3 text-[12px] text-[#4A4540] transition-all hover:border-[#1A1814] hover:bg-[#F5F1EA] hover:text-[#1A1814]"
              >
                Take again
              </button>
              <Link
                href="/dashboard/results"
                className="text-[12px] bg-[#1A1814] text-[#F5F1EA] px-6 py-3 transition-all hover:bg-[#4F627A] flex items-center gap-2"
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

        <footer className="mt-24 border-t border-[#DDD5C5] pt-8 text-[12px] tracking-wide text-[#8A8278]">
          <span className="font-fraunces italic font-medium text-[#1A1814]">InKind EMDR</span> | Symptom Tracker
        </footer>
      </div>

      <style jsx global>{`
        .opsz-144 {
          font-variation-settings: 'opsz' 144;
        }

        .opsz-72 {
          font-variation-settings: 'opsz' 72;
        }

        .opsz-36 {
          font-variation-settings: 'opsz' 36;
        }
      `}</style>
    </div>
  );
}

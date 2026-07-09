'use client';

import { useState } from 'react';
import PlanDisplay from './PlanDisplay';

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseTimeToSeconds(str) {
  if (!str) return null;
  const parts = str.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function validateGoalTime(timeStr, distance) {
  const seconds = parseTimeToSeconds(timeStr);
  if (!seconds) return 'Please enter a valid time (mm:ss or h:mm:ss).';
  const ranges = {
    '10k':    { min: 30 * 60, max: 90 * 60, label: '30:00 to 1:30:00' },
    half:     { min: 65 * 60, max: 210 * 60, label: '1:05:00 to 3:30:00' },
    marathon: { min: 140 * 60, max: 420 * 60, label: '2:20:00 to 7:00:00' },
  };
  const r = ranges[distance];
  if (r && (seconds < r.min || seconds > r.max)) return `Please enter a time between ${r.label}.`;
  return null;
}

// ─── UI Primitives ───────────────────────────────────────────────────────────

function RadioCard({ label, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${
        selected
          ? 'border-[#3bb8ff] bg-[#3bb8ff]/8 text-white'
          : 'border-white/10 bg-white/3 text-white/65 hover:border-white/25 hover:text-white/85'
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      {description && <span className="block text-xs text-white/40 mt-0.5">{description}</span>}
    </button>
  );
}

function CheckCard({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${
        selected
          ? 'border-[#3bb8ff] bg-[#3bb8ff]/8 text-white'
          : 'border-white/10 bg-white/3 text-white/65 hover:border-white/25 hover:text-white/85'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
          selected ? 'bg-[#3bb8ff] border-[#3bb8ff]' : 'border-white/25'
        }`}>
          {selected && (
            <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 10">
              <path d="M2 5l2.5 2.5L8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </button>
  );
}

function TextInput({ id, label, type = 'text', placeholder, value, onChange, required, helper }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/80">
        {label}{required && <span className="text-white/30 ml-1">*</span>}
      </label>
      {helper && <p className="text-xs text-white/40">{helper}</p>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#3bb8ff]/60 transition-colors"
      />
    </div>
  );
}

function FieldLabel({ children, helper }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-white/80">{children}</p>
      {helper && <p className="text-xs text-white/40">{helper}</p>}
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-white/35 uppercase tracking-wider">
          Step {step} of {total}
        </span>
      </div>
      <div className="h-px bg-white/10 rounded-full">
        <div
          className="h-px bg-[#3bb8ff] rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = 'Continue', loading, disabled }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || loading}
        className="px-7 py-2.5 rounded-full bg-white text-black text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
      >
        {loading ? 'Building your plan...' : nextLabel}
      </button>
    </div>
  );
}

// ─── Interstitial ────────────────────────────────────────────────────────────

function Interstitial({ type, onProceed, onAdjust }) {
  if (type === 'marathon_no_base') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#d9ff63] uppercase tracking-widest">Heads up</p>
          <h2 className="text-2xl font-bold text-white">Let's make sure this is the right plan for you.</h2>
          <p className="text-white/60 leading-relaxed">
            You've chosen the marathon, but based on your current mileage, a 16 week build is the right call, and I'd suggest starting with the 10km plan first to build a proper base. You can absolutely still do the marathon, but let's set you up for a good experience, not a tough one.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onAdjust}
            className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all"
          >
            Switch to 10km plan
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 rounded-full border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Continue with marathon (16 weeks)
          </button>
        </div>
      </div>
    );
  }

  if (type === 'c25k_already_running') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#d9ff63] uppercase tracking-widest">Quick note</p>
          <h2 className="text-2xl font-bold text-white">You're already past couch level.</h2>
          <p className="text-white/60 leading-relaxed">
            You're already running three or more times a week. The Couch to 5km programme is designed for people starting from nothing. The 10km plan would challenge you properly and get you to a real goal.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onAdjust}
            className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all"
          >
            Switch to 10km plan
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3 rounded-full border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Keep Couch to 5km
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Step components ─────────────────────────────────────────────────────────

function Step1({ answers, update }) {
  const [goalTimeError, setGoalTimeError] = useState('');

  function handleGoalTimeChange(val) {
    update('goal_time_input', val);
    setGoalTimeError('');
  }

  function toggleMotivation(val) {
    const current = answers.motivations || [];
    if (current.includes(val)) {
      update('motivations', current.filter((v) => v !== val));
    } else {
      update('motivations', [...current, val]);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">The goal</h2>
        <p className="text-sm text-white/45">Tell me what you're aiming for.</p>
      </div>

      <div className="space-y-3">
        <FieldLabel>Which distance are you training for?</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'c25k', label: 'Couch to 5km' },
            { value: '10k', label: '10km' },
            { value: 'half', label: 'Half Marathon' },
            { value: 'marathon', label: 'Marathon' },
          ].map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={answers.distance === opt.value}
              onClick={() => {
                update('distance', opt.value);
                update('goal_type', opt.value === 'c25k' ? 'finish' : '');
                update('marathon_weeks', '');
              }}
            />
          ))}
        </div>
      </div>

      {answers.distance && answers.distance !== 'c25k' && (
        <div className="space-y-3">
          <FieldLabel>Do you have a goal time, or is finishing the goal?</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <RadioCard label="Finish strong" selected={answers.goal_type === 'finish'} onClick={() => update('goal_type', 'finish')} />
            <RadioCard label="I have a goal time" selected={answers.goal_type === 'time'} onClick={() => update('goal_type', 'time')} />
          </div>
        </div>
      )}

      {answers.goal_type === 'time' && answers.distance && answers.distance !== 'c25k' && (
        <div className="space-y-1.5">
          <TextInput
            id="goal_time"
            label="What's your goal time?"
            placeholder={answers.distance === '10k' ? 'e.g. 55:00' : answers.distance === 'half' ? 'e.g. 1:55:00' : 'e.g. 3:45:00'}
            value={answers.goal_time_input || ''}
            onChange={handleGoalTimeChange}
            helper={answers.distance === '10k' ? 'mm:ss format' : 'h:mm:ss format'}
          />
          {goalTimeError && <p className="text-xs text-red-400">{goalTimeError}</p>}
        </div>
      )}

      {answers.distance === 'marathon' && (
        <div className="space-y-3">
          <FieldLabel helper="16 weeks builds a bigger aerobic base and suits first timers. 12 weeks suits runners who've been consistent recently.">
            How long do you want your build to be?
          </FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <RadioCard label="16 weeks" description="First timer or building base" selected={answers.marathon_weeks === '16'} onClick={() => update('marathon_weeks', '16')} />
            <RadioCard label="12 weeks" description="Already consistent runner" selected={answers.marathon_weeks === '12'} onClick={() => update('marathon_weeks', '12')} />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <TextInput
          id="race_date"
          label="Got a race date locked in?"
          type="date"
          value={answers.race_date || ''}
          onChange={(v) => update('race_date', v)}
          helper="Optional. Adds real dates to each week of your plan."
        />
      </div>

      <div className="space-y-3">
        <FieldLabel helper="Select all that apply.">Why is this important to you?</FieldLabel>
        <div className="space-y-2">
          {[
            { value: 'improve_physical_health', label: 'Improve my physical health and fitness' },
            { value: 'challenge_myself', label: 'Challenge myself and see what I\'m capable of' },
            { value: 'accountability_structure', label: 'Accountability and structure to stay consistent' },
            { value: 'mental_health', label: 'Improve my mental health and wellbeing' },
            { value: 'weight_loss', label: 'Lose body fat' },
            { value: 'event_with_others', label: 'Training for an event with friends or family' },
          ].map((opt) => (
            <CheckCard
              key={opt.value}
              label={opt.label}
              selected={(answers.motivations || []).includes(opt.value)}
              onClick={() => toggleMotivation(opt.value)}
            />
          ))}
          <CheckCard
            label="Other"
            selected={(answers.motivations || []).includes('other')}
            onClick={() => toggleMotivation('other')}
          />
        </div>
        {(answers.motivations || []).includes('other') && (
          <TextInput
            id="motivation_other"
            label="Tell me more"
            placeholder="What's driving you?"
            value={answers.motivation_other || ''}
            onChange={(v) => update('motivation_other', v)}
          />
        )}
      </div>
    </div>
  );
}

function Step2({ answers, update }) {
  function toggleInjury(val) {
    const current = answers.injuries || [];
    if (val === 'none') {
      update('injuries', ['none']);
      return;
    }
    const without = current.filter((v) => v !== 'none' && v !== val);
    if (current.includes(val)) {
      update('injuries', without);
    } else {
      update('injuries', [...without, val]);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Where you're at</h2>
        <p className="text-sm text-white/45">Honest answers here mean accurate paces.</p>
      </div>

      <div className="space-y-3">
        <FieldLabel>How would you describe your current running?</FieldLabel>
        <div className="space-y-2">
          {[
            { value: 'none', label: 'Not running at all' },
            { value: 'occasional', label: 'Occasional runs when I feel like it' },
            { value: '1_2_per_week', label: '1 to 2 runs a week' },
            { value: '3_plus_per_week', label: '3 or more runs a week' },
          ].map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={answers.run_frequency === opt.value}
              onClick={() => update('run_frequency', opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel>What was your longest run in the last month?</FieldLabel>
        <div className="space-y-2">
          {[
            { value: 'none', label: 'None' },
            { value: 'under_3k', label: 'Under 3km' },
            { value: '3_5k', label: '3 to 5km' },
            { value: '5_10k', label: '5 to 10km' },
            { value: '10k_plus', label: 'Over 10km' },
          ].map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={answers.longest_recent_run === opt.value}
              onClick={() => update('longest_recent_run', opt.value)}
            />
          ))}
        </div>
      </div>

      <TextInput
        id="current_5k_time"
        label="Know your current 5km time, or a recent race result?"
        placeholder="e.g. 28:30"
        value={answers.current_5k_input || ''}
        onChange={(v) => update('current_5k_input', v)}
        helper="Optional. Powers real pace zones. If you skip this, I'll estimate from your answers."
      />

      <div className="space-y-3">
        <FieldLabel>Any current niggles or injury history? (Select all that apply)</FieldLabel>
        <div className="space-y-2">
          {[
            { value: 'none', label: 'None' },
            { value: 'knees', label: 'Knees' },
            { value: 'lower_back', label: 'Lower back' },
            { value: 'shins', label: 'Shins / shin splints' },
            { value: 'hips_itb', label: 'Hips or ITB' },
          ].map((opt) => (
            <CheckCard
              key={opt.value}
              label={opt.label}
              selected={(answers.injuries || []).includes(opt.value)}
              onClick={() => toggleInjury(opt.value)}
            />
          ))}
          <CheckCard
            label="Other"
            selected={(answers.injuries || []).includes('other')}
            onClick={() => toggleInjury('other')}
          />
          {(answers.injuries || []).includes('other') && (
            <TextInput
              id="injury_other"
              label="Tell me more"
              placeholder="What area?"
              value={answers.injury_other || ''}
              onChange={(v) => update('injury_other', v)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Step3({ answers, update }) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Your life</h2>
        <p className="text-sm text-white/45">Real plans fit real schedules.</p>
      </div>

      {answers.distance !== 'c25k' && (
        <div className="space-y-3">
          <FieldLabel helper="Be honest. A 3 day plan you complete beats a 5 day plan you abandon.">
            How many days a week can you realistically run?
          </FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {['3', '4', '5'].map((n) => (
              <RadioCard
                key={n}
                label={`${n} days`}
                selected={answers.days_per_week === n}
                onClick={() => update('days_per_week', n)}
              />
            ))}
          </div>
        </div>
      )}

      {answers.distance === 'c25k' && (
        <div className="border border-white/8 bg-white/3 rounded-lg px-4 py-3">
          <p className="text-sm text-white/55">The Couch to 5km programme runs 3 days per week by design. That's built into your plan.</p>
        </div>
      )}

      <div className="space-y-3">
        <FieldLabel>Do you currently do any strength training?</FieldLabel>
        <div className="space-y-2">
          {[
            { value: 'regularly', label: 'Yes, regularly (2+ times a week)' },
            { value: 'sometimes', label: 'Sometimes, not consistently' },
            { value: 'no', label: 'No strength training at all' },
          ].map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={answers.strength_training === opt.value}
              onClick={() => update('strength_training', opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({ answers, update }) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Last step</h2>
        <p className="text-sm text-white/45">I'll send your full plan as a PDF.</p>
      </div>

      <TextInput
        id="first_name"
        label="First name"
        placeholder="Sam"
        value={answers.first_name || ''}
        onChange={(v) => update('first_name', v)}
        required
      />

      <TextInput
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={answers.email || ''}
        onChange={(v) => update('email', v)}
        required
        helper="I'll send your full plan as a PDF. No spam."
      />

      <div className="space-y-3">
        <FieldLabel>How did you first find out about Pave The Way?</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'google_search', label: 'Google search' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'referral', label: 'Word of mouth' },
            { value: 'google_ads', label: 'Google ad' },
          ].map((opt) => (
            <RadioCard
              key={opt.value}
              label={opt.label}
              selected={answers.discovery_source === opt.value}
              onClick={() => update('discovery_source', opt.value)}
            />
          ))}
          <RadioCard
            label="Other"
            selected={answers.discovery_source === 'other'}
            onClick={() => update('discovery_source', 'other')}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/80">
          What resonates most with you when you hear &lsquo;Pave The Way&rsquo;?
          <span className="text-white/30 ml-1">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="e.g. the no-nonsense approach, building real habits, the results..."
          value={answers.what_resonated || ''}
          onChange={(e) => update('what_resonated', e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#3bb8ff]/60 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

export default function RunningPlanClient() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [interstitial, setInterstitial] = useState(null);
  const [errors, setErrors] = useState({});
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function update(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validateStep(n) {
    const errs = {};

    if (n === 1) {
      if (!answers.distance) errs.distance = 'Please select a distance.';
      if (answers.distance && answers.distance !== 'c25k' && !answers.goal_type) errs.goal_type = 'Please select one.';
      if (answers.goal_type === 'time') {
        const err = validateGoalTime(answers.goal_time_input, answers.distance);
        if (err) errs.goal_time = err;
      }
      if (answers.distance === 'marathon' && !answers.marathon_weeks) errs.marathon_weeks = 'Please select a duration.';
      if (!answers.motivations?.length) errs.motivation = 'Please select at least one.';
    }

    if (n === 2) {
      if (!answers.run_frequency) errs.run_frequency = 'Please select one.';
      if (!answers.longest_recent_run) errs.longest_recent_run = 'Please select one.';
      if (!answers.injuries || answers.injuries.length === 0) errs.injuries = 'Please select at least one.';
    }

    if (n === 3) {
      if (answers.distance !== 'c25k' && !answers.days_per_week) errs.days_per_week = 'Please select one.';
      if (!answers.strength_training) errs.strength_training = 'Please select one.';
    }

    if (n === 4) {
      if (!answers.first_name?.trim()) errs.first_name = 'Please enter your first name.';
      if (!answers.email?.trim() || !answers.email.includes('@')) errs.email = 'Please enter a valid email.';
    }

    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Check interstitials after step 1
    if (step === 1) {
      if (
        answers.distance === 'marathon' &&
        (answers.run_frequency === 'none' || answers.longest_recent_run === 'none' || answers.longest_recent_run === 'under_3k')
      ) {
        // Force 16 weeks for marathon with no base, show interstitial
        update('marathon_weeks', '16');
        setInterstitial('marathon_no_base');
        return;
      }
      if (answers.distance === 'c25k' && answers.run_frequency === '3_plus_per_week') {
        setInterstitial('c25k_already_running');
        return;
      }
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleInterstitialProceed() {
    setInterstitial(null);
    setStep((s) => s + 1);
  }

  function handleInterstitialAdjust() {
    if (interstitial === 'marathon_no_base') {
      update('distance', '10k');
      update('marathon_weeks', '');
    } else if (interstitial === 'c25k_already_running') {
      update('distance', '10k');
    }
    setInterstitial(null);
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    const errs = validateStep(4);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setSubmitError('');

    const payload = {
      distance: answers.distance,
      goal_type: answers.goal_type || undefined,
      goal_time_seconds: answers.goal_type === 'time' ? parseTimeToSeconds(answers.goal_time_input) || undefined : undefined,
      marathon_weeks: answers.marathon_weeks ? parseInt(answers.marathon_weeks) : undefined,
      race_date: answers.race_date || undefined,
      motivation: (answers.motivations || []).join(', '),
      motivation_other: answers.motivation_other || undefined,
      run_frequency: answers.run_frequency,
      longest_recent_run: answers.longest_recent_run,
      current_5k_seconds: parseTimeToSeconds(answers.current_5k_input) || undefined,
      injuries: answers.injuries || [],
      injury_other: answers.injury_other || undefined,
      days_per_week: answers.distance === 'c25k' ? 3 : parseInt(answers.days_per_week) || 3,
      strength_training: answers.strength_training,
      first_name: answers.first_name.trim(),
      email: answers.email.trim(),
      discovery_source: answers.discovery_source || undefined,
      what_resonated: answers.what_resonated || undefined,
    };

    try {
      const res = await fetch('/api/running-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Fire Google Ads conversion
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-18270655297/QYPHCPO1iMUcEMGmkIhE' });
      }

      setPlan(data.plan);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  function handleReset() {
    setStep(1);
    setAnswers({});
    setErrors({});
    setPlan(null);
    setInterstitial(null);
    setSubmitError('');
  }

  if (plan) {
    return <PlanDisplay plan={plan} onReset={handleReset} />;
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-mono text-[#3bb8ff] uppercase tracking-widest">Pave The Way Fitness</p>
        <h1 className="text-3xl font-bold text-white">Free Running Plan</h1>
        <p className="text-sm text-white/45">Answer a few questions and I'll build your personalised training plan.</p>
      </div>

      <ProgressBar step={interstitial ? step : step} total={TOTAL_STEPS} />

      {interstitial ? (
        <Interstitial
          type={interstitial}
          onProceed={handleInterstitialProceed}
          onAdjust={handleInterstitialAdjust}
        />
      ) : (
        <>
          {step === 1 && <Step1 answers={answers} update={update} />}
          {step === 2 && <Step2 answers={answers} update={update} />}
          {step === 3 && <Step3 answers={answers} update={update} />}
          {step === 4 && <Step4 answers={answers} update={update} />}

          {hasErrors && (
            <div className="text-xs text-red-400">
              {Object.values(errors).filter(Boolean).map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}

          {submitError && (
            <div className="text-xs text-red-400 border border-red-400/20 bg-red-400/5 rounded-lg px-4 py-3">
              {submitError}
            </div>
          )}

          <NavButtons
            onBack={step > 1 ? handleBack : null}
            onNext={step < TOTAL_STEPS ? handleNext : handleSubmit}
            nextLabel={step === TOTAL_STEPS ? 'Build my plan' : 'Continue'}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

'use client';

const SESSION_TYPE_COLOURS = {
  'VO2 MAX': 'bg-[#3bb8ff]/10 text-[#3bb8ff] border-[#3bb8ff]/20',
  TEMPO: 'bg-[#d9ff63]/10 text-[#d9ff63] border-[#d9ff63]/20',
  'LONG RUN': 'bg-white/5 text-white/80 border-white/10',
  EASY: 'bg-white/5 text-white/60 border-white/10',
  CHALLENGE: 'bg-[#ff8c3b]/10 text-[#ff8c3b] border-[#ff8c3b]/20',
  'RACE DAY': 'bg-white text-black border-white',
};

function SessionTypeTag({ type }) {
  const cls = SESSION_TYPE_COLOURS[type] || 'bg-white/5 text-white/60 border-white/10';
  return (
    <span className={`inline-block text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${cls}`}>
      {type}
    </span>
  );
}

function SessionCard({ session }) {
  return (
    <div className="border border-white/8 rounded-lg p-4 space-y-2">
      <div className="flex items-start gap-3">
        <div className="min-w-[90px] text-xs font-mono text-white/40 uppercase tracking-wider pt-0.5">
          {session.day}
        </div>
        <div className="flex-1 space-y-1.5">
          <SessionTypeTag type={session.type} />
          <p className="text-sm font-semibold text-white/90">{session.title}</p>
          <p className="text-sm text-white/55 leading-relaxed">{session.detail}</p>
        </div>
      </div>
    </div>
  );
}

function WeekCard({ week }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-white/30 uppercase tracking-wider">
            Week {week.weekNumber}
            {week.dateRange ? ` · ${week.dateRange}` : ''}
          </span>
          <span className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider">
            {week.label}
          </span>
        </div>
        {week.weekKm && (
          <span className="text-[10px] font-mono text-white/35 border border-white/10 rounded px-2 py-0.5 uppercase tracking-wider">
            ~{week.weekKm}km
          </span>
        )}
      </div>
      <div className="space-y-2">
        {week.sessions.map((session, i) => (
          <SessionCard key={i} session={session} />
        ))}
      </div>
      {week.coachNote && (
        <div className="pl-4 border-l border-[#3bb8ff]/30">
          <p className="text-sm text-white/50 italic">{week.coachNote}</p>
        </div>
      )}
    </div>
  );
}

function BlockSection({ block }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-wide text-white">{block.name}</h3>
        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">{block.weekRange}</p>
        <p className="text-sm text-white/55">{block.purpose}</p>
      </div>
      <div className="space-y-8">
        {block.weeks.map((week) => (
          <WeekCard key={week.weekNumber} week={week} />
        ))}
      </div>
    </div>
  );
}

export default function PlanDisplay({ plan, onReset }) {
  const { meta, paceZones, intro, blocks, nutrition, strengthSection } = plan;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24 space-y-16">
      {/* Header */}
      <div className="pt-12 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-mono text-[#3bb8ff] uppercase tracking-widest">
            Pave The Way Fitness
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {meta.distanceLabel} Plan
          </h1>
          <p className="text-white/50">Personalised for {meta.firstName}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Goal', value: meta.goalLabel },
            { label: 'Current', value: meta.currentBenchmark },
            { label: 'Days/week', value: `${meta.daysPerWeek} days` },
            { label: 'Duration', value: `${meta.weeks} weeks` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/8 rounded-lg p-3 space-y-1">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Intro */}
        <p className="text-white/65 leading-relaxed">{intro}</p>

        {meta.estimatedPaces && (
          <div className="text-xs text-white/40 font-mono border-l-2 border-white/10 pl-3">
            Paces are estimated. Run the Week 1 tempo session and adjust: if the talk test doesn't match the pace, trust the talk test.
          </div>
        )}
      </div>

      {/* Pace zones */}
      {paceZones && paceZones.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your Pace Zones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-4 text-[10px] font-mono text-white/40 uppercase tracking-wider font-normal">Zone</th>
                  <th className="text-left py-2 pr-4 text-[10px] font-mono text-white/40 uppercase tracking-wider font-normal">Pace</th>
                  <th className="text-left py-2 text-[10px] font-mono text-white/40 uppercase tracking-wider font-normal">Effort</th>
                </tr>
              </thead>
              <tbody>
                {paceZones.map((zone, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-white/80 font-medium">{zone.name}</td>
                    <td className="py-3 pr-4 font-mono text-[#3bb8ff] text-xs">{zone.pace}</td>
                    <td className="py-3 text-white/45 text-xs">{zone.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Training blocks */}
      <div className="space-y-14">
        <h2 className="text-xl font-semibold text-white">Your Training Plan</h2>
        {blocks.map((block) => (
          <BlockSection key={block.name} block={block} />
        ))}
      </div>

      {/* Nutrition */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Nutrition</h2>
          <p className="text-sm text-white/45">Simple fuel for the work ahead.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {nutrition.map((item, i) => (
            <div key={i} className="border border-white/8 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-white">{item.heading}</p>
              <p className="text-sm text-white/55 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strength section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">The missing piece: strength for runners</h2>
          <p className="text-sm text-white/55 leading-relaxed max-w-2xl">{strengthSection.intro}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {strengthSection.sessions.map((session, i) => (
            <div key={i} className="border border-white/8 rounded-lg p-4 space-y-3">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-white">{session.name}</p>
                <p className="text-xs font-mono text-white/35 uppercase tracking-wider">{session.slot}</p>
                <p className="text-xs text-white/40">{session.duration}</p>
              </div>
              <div className="space-y-2">
                {session.exercises.map((ex, j) => (
                  <div key={j} className="space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm text-white/80">{ex.exercise}</p>
                      <p className="text-xs font-mono text-white/40 shrink-0">{ex.sets}</p>
                    </div>
                    <p className="text-xs text-white/35">{ex.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-[#d9ff63]/15 bg-[#d9ff63]/5 rounded-lg p-5 space-y-4">
          <p className="text-sm text-white/65 leading-relaxed">{strengthSection.bridgeCopy}</p>
          <a
            href={strengthSection.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-white text-black text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
          >
            Book your free consultation
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-white/25 uppercase tracking-wider">
          Pave The Way Fitness · {meta.distanceLabel} · pavethewayfit.com
        </p>
        <button
          onClick={onReset}
          className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
        >
          Build a new plan
        </button>
      </div>
    </div>
  );
}

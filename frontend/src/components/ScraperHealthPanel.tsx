import React from 'react';
import { TalkRecord } from '../data/types';

interface ScraperHealthPanelProps {
  talks: TalkRecord[];
}

export const ScraperHealthPanel: React.FC<ScraperHealthPanelProps> = ({ talks }) => {
  const total = talks ? talks.length : 0;

  const requiredFields: (keyof TalkRecord)[] = ['talk_title', 'speaker_name', 'conference_name', 'topic'];
  let completeCount = 0;

  if (total > 0) {
    talks.forEach(t => {
      const isComplete = requiredFields.every(field => {
        const val = t[field];
        return val !== null && val !== undefined && String(val).trim() !== '' && String(val).trim().toUpperCase() !== 'N/A';
      });
      if (isComplete) completeCount++;
    });
  }

  const pct = total > 0 ? (completeCount / total) * 100 : 0;
  let status: 'HEALTHY' | 'WARNING' | 'BROKEN' = 'BROKEN';
  let badgeColorClass = 'text-red-400';

  if (total > 0) {
    if (pct >= 90) {
      status = 'HEALTHY';
      badgeColorClass = 'text-green-400';
    } else if (pct >= 60) {
      status = 'WARNING';
      badgeColorClass = 'text-yellow-400';
    } else {
      status = 'BROKEN';
      badgeColorClass = 'text-red-400';
    }
  }

  const hasData = total > 0;

  return (
    <div className="terminal-card font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5 mb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            SCRAPER_PIPELINE_STATUS
            <span className={`terminal-badge ${hasData ? 'terminal-badge-green' : ''}`}>
              {hasData ? '[DATA_COLLECTED]' : '[NO_COLLECTOR_RUN]'}
            </span>
          </h3>
          <p className="text-[10px] text-slate-400">Bright Data Scraper Studio execution status & validator audit</p>
        </div>
      </div>

      {/* Real Pipeline Telemetry Box */}
      {!hasData ? (
        <div className="terminal-empty-state font-mono">
          [NO DATA YET — RUN THE COLLECTOR TO POPULATE THIS VIEW]
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-slate-500 uppercase">COLLECTED_RECORDS</span>
            <div className="text-lg font-bold text-green-400 mt-0.5">{total}</div>
          </div>
          <div className="p-2.5 bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-slate-500 uppercase">COMPLETENESS_SCORE</span>
            <div className="text-lg font-bold text-slate-100 mt-0.5">{pct.toFixed(1)}%</div>
          </div>
          <div className="p-2.5 bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-slate-500 uppercase">VALIDATION_STATUS</span>
            <div className={`text-lg font-bold ${badgeColorClass} mt-0.5`}>{status}</div>
          </div>
          <div className="p-2.5 bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-slate-500 uppercase">DATA_REPORT_FILE</span>
            <div className="text-xs font-bold text-slate-200 mt-1">talks.json</div>
          </div>
        </div>
      )}
    </div>
  );
};

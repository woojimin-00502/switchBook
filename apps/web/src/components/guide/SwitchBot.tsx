import { useState } from 'react';
import { useGuideStore, type GuideLevel } from '@/store/useGuideStore';

const messages: Record<Exclude<GuideLevel, 'off'>, string> = {
  novice: '안녕! 처음이라면 스위치부터 골라봐. 키압이 가벼울수록 손이 편해!',
  intermediate: '필터로 키압·재질·마운트까지 좁혀볼 수 있어.',
  expert: '필요한 스펙만 빠르게. 단축 필터를 활용해봐.',
};

export function SwitchBot() {
  const { level, setLevel } = useGuideStore();
  const [open, setOpen] = useState(true);

  if (level === null || level === 'off' || !open) {
    return level === 'off' ? (
      <button
        type="button"
        onClick={() => setLevel('novice')}
        className="fixed bottom-4 right-4 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs shadow dark:border-slate-700 dark:bg-slate-900"
      >
        가이드 다시 켜기
      </button>
    ) : null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-2">
        <div className="text-2xl">🤖</div>
        <div className="flex-1">
          <div className="text-sm font-semibold">SwitchBot</div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{messages[level]}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-slate-500 hover:underline"
        >
          잠시 닫기
        </button>
        <button
          type="button"
          onClick={() => setLevel('off')}
          className="text-xs text-slate-500 hover:underline"
        >
          저리가
        </button>
      </div>
    </div>
  );
}

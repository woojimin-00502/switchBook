import { useSearchParams } from 'react-router-dom';

const categories = [
  { value: 'switch', label: '스위치', icon: '🔘' },
  { value: 'housing', label: '하우징', icon: '📦' },
  { value: 'plate', label: '보강판', icon: '🛡️' },
];

const switchTypes = [
  { value: '', label: '전체' },
  { value: 'LINEAR', label: '리니어' },
  { value: 'TACTILE', label: '택타일' },
  { value: 'CLICKY', label: '클리키' },
];

export function PartFilters() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? 'switch';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next, { replace: true });
  };

  return (
    <aside className="space-y-6">
      {/* Category */}
      <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-900">카테고리</h3>
        <div className="space-y-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update('category', c.value)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                category === c.value
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Switch-specific filters */}
      {category === 'switch' && (
        <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-5">
          <h3 className="mb-4 text-sm font-bold text-gray-900">스위치 타입</h3>
          <div className="flex flex-wrap gap-2">
            {switchTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update('type', t.value)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  (params.get('type') ?? '') === t.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <h3 className="mb-3 mt-6 text-sm font-bold text-gray-900">키압 (g)</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="min"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              value={params.get('minG') ?? ''}
              onChange={(e) => update('minG', e.target.value)}
            />
            <span className="text-gray-300">~</span>
            <input
              type="number"
              placeholder="max"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              value={params.get('maxG') ?? ''}
              onChange={(e) => update('maxG', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="rounded-2xl border border-gray-100 bg-[#f8faf9] p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-900">태그</h3>
        <input
          type="text"
          placeholder="예: silent, smooth"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          value={params.get('tag') ?? ''}
          onChange={(e) => update('tag', e.target.value)}
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => setParams({ category: 'switch' }, { replace: true })}
        className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 transition hover:border-emerald-300 hover:text-emerald-600"
      >
        필터 초기화
      </button>
    </aside>
  );
}

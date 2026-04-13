import { Link } from 'react-router-dom';
import type { PartSummary } from '@/lib/api';

export function PartCard({ part }: { part: PartSummary }) {
  return (
    <Link
      to={`/parts/${part.category}/${part.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        {part.imageUrl ? (
          <img
            src={part.imageUrl}
            alt={part.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl opacity-40">⌨️</div>
              <div className="mt-2 text-[10px] text-gray-300">{part.category}</div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs font-medium text-gray-400">{part.manufacturer}</div>
        <div className="mt-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-emerald-600">
          {part.name}
        </div>
        {part.priceKrw != null && (
          <div className="mt-2 text-sm font-semibold text-emerald-600">
            ₩{part.priceKrw.toLocaleString()}
          </div>
        )}
        {part.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {part.tags.slice(0, 3).map((t) => (
              <span
                key={`${t.kind}-${t.value}`}
                className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700"
              >
                {t.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

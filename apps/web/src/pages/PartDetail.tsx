import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getPart, type PartCategory } from '@/lib/api';

export function PartDetail() {
  const { category, id } = useParams<{ category: PartCategory; id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['part', category, id],
    queryFn: () => getPart(category!, id!),
    enabled: !!category && !!id,
  });

  if (isLoading)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );

  if (isError || !data)
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="text-5xl">😵</div>
        <p className="mt-4 text-gray-500">부품을 찾지 못했습니다.</p>
        <Link to="/explore" className="mt-4 inline-block text-sm font-medium text-brand-dark hover:underline">
          탐색으로 돌아가기
        </Link>
      </div>
    );

  const categoryLabel = { switch: '스위치', housing: '하우징', plate: '보강판' }[category!] ?? category;

  return (
    <>
      <Helmet>
        <title>{data.name} · SwitchBook</title>
        <meta name="description" content={`${data.manufacturer} ${data.name} 상세 정보`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3 text-sm text-gray-400">
          <Link to="/" className="hover:text-brand-dark">홈</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-brand-dark">부품 탐색</Link>
          <span>/</span>
          <Link to={`/explore?category=${category}`} className="hover:text-brand-dark">{categoryLabel}</Link>
          <span>/</span>
          <span className="text-gray-700">{data.name}</span>
        </div>
      </div>

      <article className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gray-50">
            {data.imageUrl ? (
              <img src={data.imageUrl} alt={data.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl opacity-30">⌨️</div>
                  <p className="mt-4 text-sm text-gray-300">이미지 준비 중</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
              {categoryLabel}
            </span>
            <div className="mt-3 text-sm text-gray-400">{data.manufacturer}</div>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{data.name}</h1>
            {data.priceKrw != null && (
              <div className="mt-3 text-2xl font-bold text-brand-dark">
                ₩{data.priceKrw.toLocaleString()}
              </div>
            )}

            {/* Specs */}
            {category === 'switch' && (
              <dl className="mt-8 grid grid-cols-2 gap-3">
                <Field label="타입" value={data.type} />
                <Field label="액추에이션" value={`${data.actuationG}g`} />
                <Field label="바닥 키압" value={`${data.bottomG}g`} />
                <Field label="상판 재질" value={data.topMat} />
                <Field label="하판 재질" value={data.bottomMat} />
                <Field label="스템 재질" value={data.stemMat} />
                <Field label="공장 윤활" value={data.factoryLubed ? '예' : '아니오'} />
              </dl>
            )}

            {/* Tags */}
            {data.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {data.tags.map((t) => (
                  <span
                    key={`${t.kind}-${t.value}`}
                    className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    #{t.value}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-10 flex gap-3">
              <Link
                to="/build"
                className="rounded-xl bg-brand-dark px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-green-700"
              >
                빌드에 추가
              </Link>
              <button
                type="button"
                className="rounded-xl border border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-600 transition hover:border-brand hover:text-brand-dark"
              >
                비교하기
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <dt className="text-xs font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-gray-900">{value}</dd>
    </div>
  );
}

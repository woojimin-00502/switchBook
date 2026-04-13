import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { searchParts, type PartCategory, type SearchPartsParams } from '@/lib/api';
import { PartFilters } from '@/components/parts/PartFilters';
import { PartCard } from '@/components/parts/PartCard';

export function Explore() {
  const [params, setParams] = useSearchParams();

  const query: SearchPartsParams = {
    category: (params.get('category') as PartCategory) ?? 'switch',
    type: params.get('type') ?? undefined,
    minG: params.get('minG') ? Number(params.get('minG')) : undefined,
    maxG: params.get('maxG') ? Number(params.get('maxG')) : undefined,
    tag: params.get('tag') ?? undefined,
    page: params.get('page') ? Number(params.get('page')) : 1,
    limit: 24,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['parts', query],
    queryFn: () => searchParts(query),
  });

  const currentPage = query.page ?? 1;
  const totalPages = data ? Math.ceil(data.total / (query.limit ?? 24)) : 1;

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(page));
    setParams(next, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>부품 탐색 · SwitchBook</title>
      </Helmet>

      <section className="bg-[#f3f5f4] px-4 pb-5 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-r from-[#d8efe3] via-[#e8f7ee] to-[#d8efe3] p-7 sm:p-9">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="inline-flex rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Product List
              </p>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Let's configure your own
                <br />
                print product
              </h1>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">
                카테고리, 타입, 태그 필터로 원하는 상품을 빠르게 찾을 수 있습니다.
              </p>
            </div>
            <div className="hidden rounded-3xl bg-white/80 px-8 py-6 text-6xl shadow-sm md:block">🛍️</div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3 text-sm text-gray-400">
          <Link to="/" className="hover:text-emerald-600">홈</Link>
          <span>/</span>
          <span className="text-gray-700">상품 리스트</span>
        </div>
      </div>

      <section className="bg-white pb-12 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 px-6 lg:grid-cols-[280px_1fr]">
            <PartFilters />

            <section>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                {data && (
                  <span className="text-sm text-gray-500">
                    총 <span className="font-semibold text-gray-900">{data.total}</span>개 상품
                  </span>
                )}
              </div>
                <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-emerald-300">
                <option>최신순</option>
                <option>인기순</option>
                <option>가격 낮은순</option>
                <option>가격 높은순</option>
              </select>
            </div>

            {isLoading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            )}

            {isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <div className="text-3xl">😵</div>
                <p className="mt-2 text-sm font-medium text-red-700">
                  부품을 불러오지 못했습니다.
                </p>
                <p className="mt-1 text-xs text-red-500">API 서버가 켜져 있는지 확인하세요.</p>
              </div>
            )}

            {data && (
              <>
                {data.data.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="text-5xl">🔍</div>
                    <p className="mt-4 text-gray-500">조건에 맞는 부품이 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {data.data.map((p) => (
                      <PartCard key={p.id} part={p} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40"
                    >
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => goToPage(p)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                          p === currentPage
                            ? 'bg-emerald-500 text-white'
                            : 'border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40"
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            )}
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

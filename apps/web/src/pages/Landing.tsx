import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useGuideStore, type GuideLevel } from '@/store/useGuideStore';
import { searchParts, type PartCategory } from '@/lib/api';
import { PartCard } from '@/components/parts/PartCard';

const levels: {
  value: GuideLevel;
  title: string;
  desc: string;
  badge: string;
  icon: string;
}[] = [
  {
    value: 'novice',
    title: '입문자',
    desc: '용어부터 천천히 알려드릴게요.',
    badge: '처음 시작',
    icon: '🌱',
  },
  {
    value: 'intermediate',
    title: '중급자',
    desc: '필터·비교 기능을 능숙하게.',
    badge: '밸런스 추천',
    icon: '⚡',
  },
  {
    value: 'expert',
    title: '전문가',
    desc: '핵심 스펙만 빠르게.',
    badge: '빠른 탐색',
    icon: '🔥',
  },
];

const menuCategories: {
  label: string;
  to: string;
  iconSrc: string;
  countCategory: PartCategory | null;
}[] = [
  { label: '하우징', to: '/explore?category=housing', iconSrc: '/assets/icons/하우징.png', countCategory: 'housing' },
  { label: '기판', to: '/explore', iconSrc: '/assets/icons/기판.png', countCategory: null },
  { label: '보강판', to: '/explore?category=plate', iconSrc: '/assets/icons/보강판.png', countCategory: 'plate' },
  { label: '스위치', to: '/explore?category=switch', iconSrc: '/assets/icons/스위치.png', countCategory: 'switch' },
  { label: '키캡', to: '/explore', iconSrc: '/assets/icons/키캡.png', countCategory: null },
  { label: '기타장비', to: '/explore', iconSrc: '/assets/icons/기타.png', countCategory: null },
];

const HERO_SLIDE_MS = 5000;

const heroBannerSlides = [
  {
    src: '/assets/banners/home/banner-01.png',
    fallbackSrc: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&w=1400&q=85',
    alt: '기계식 키보드 클로즈업',
  },
  {
    src: '/assets/banners/home/banner-02.png',
    fallbackSrc: 'https://images.unsplash.com/photo-1618389483223-18f647bd0710?auto=format&w=1400&q=85',
    alt: '데스크 위 키보드',
  },
  {
    src: '/assets/banners/home/banner-03.png',
    fallbackSrc: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&w=1400&q=85',
    alt: '키캡 디테일',
  },
  {
    src: '/assets/banners/home/banner-04.png',
    fallbackSrc: 'https://images.unsplash.com/photo-1541140532154-b0243e1bbde9?auto=format&w=1400&q=85',
    alt: '커스텀 키보드',
  },
] as const;

const keyboardFlowSteps = [
  {
    title: '자신의 취향을 선택해주세요',
    desc: '모양, 색, 디자인, 소리 등 자유롭게 선택해요',
  },
  {
    title: '추천 부품을 둘러보세요',
    desc: '비슷한 부품과 특징을 살펴볼 수 있어요',
  },
  {
    title: '나만의 키보드를 만들어요',
    desc: '추천 부품 인기 부품을 참고할 수 있어요',
  },
  {
    title: '최저가 링크로 구매하세요',
    desc: '원하는 곳에서 최저 가격으로 구매하세요',
  },
] as const;

export function Landing() {
  const navigate = useNavigate();
  const setLevel = useGuideStore((s) => s.setLevel);
  const current = useGuideStore((s) => s.level);
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeCustomStep, setActiveCustomStep] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroSlide((i) => (i + 1) % heroBannerSlides.length);
    }, HERO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  const { data: popularParts } = useQuery({
    queryKey: ['parts', 'popular'],
    queryFn: () => searchParts({ limit: 8 }),
  });

  const categoryTotals = useQueries({
    queries: (['housing', 'plate', 'switch'] as const).map((category) => ({
      queryKey: ['parts-total', category],
      queryFn: () => searchParts({ category, limit: 1 }),
      staleTime: 60_000,
    })),
  });

  const totalByCategory: Record<PartCategory, number | undefined> = {
    housing: categoryTotals[0].data?.total,
    plate: categoryTotals[1].data?.total,
    switch: categoryTotals[2].data?.total,
  };

  const menuCount = (cat: PartCategory | null) => {
    if (!cat) return '—';
    const n = totalByCategory[cat];
    if (n === undefined) return '…';
    return n;
  };

  const choose = (lv: GuideLevel) => {
    setLevel(lv);
    navigate('/explore');
  };

  return (
    <>
      <Helmet>
        <title>SwitchBook - 나만의 키보드, 책처럼 펼쳐보세요</title>
      </Helmet>

      <section className="relative overflow-hidden pb-16">
        {/* 초록 박스 바깥(전체 히어로 영역) 배경 슬라이드 */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {heroBannerSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                index === heroSlide ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallbackApplied === '1') return;
                img.dataset.fallbackApplied = '1';
                img.src = slide.fallbackSrc;
              }}
            />
          ))}
          <div className="absolute inset-0 bg-white/35" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-emerald-400/90 bg-gradient-to-br from-emerald-100/88 via-emerald-50/82 to-teal-100/85 p-8 shadow-xl shadow-black/[0.08] backdrop-blur-md backdrop-saturate-150 sm:p-12 lg:p-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  나만의 키보드,
                  <br />
                  책처럼 펼쳐보세요
                </h1>
                <p className="mt-4 max-w-xl text-sm text-gray-600 sm:text-base">
                  스위치부터 키캡까지, 취향에 맞는 부품을 골라 세상에 하나뿐인 키보드를 만들어보세요.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/explore"
                    className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600"
                  >
                    Shop now
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:text-emerald-600"
                  >
                    Join now
                  </Link>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-xs text-gray-400">New Collection</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">Spring Mood Set</p>
                  <div className="mt-4 flex h-36 items-center justify-center rounded-2xl bg-emerald-50 text-5xl">🛍️</div>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-xs text-gray-400">Best Item</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">Graphic T-Shirt</p>
                  <div className="mt-4 flex h-36 items-center justify-center rounded-2xl bg-slate-50 text-5xl">👕</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="flex items-center justify-center gap-3 text-2xl font-semibold uppercase tracking-[0.22em] text-black sm:gap-4 sm:text-3xl md:text-4xl">
            <span className="h-px w-10 shrink-0 bg-neutral-400 sm:w-14 md:w-16" aria-hidden />
            MENU
            <span className="h-px w-10 shrink-0 bg-neutral-400 sm:w-14 md:w-16" aria-hidden />
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <p className="text-center text-sm text-gray-500">어떤 상품을 찾으시나요?</p>
            <Link to="/explore" className="text-sm font-medium text-emerald-600 hover:underline">
              전체보기
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 justify-items-center gap-x-4 gap-y-10 sm:grid-cols-6 sm:gap-x-6 md:gap-x-10">
            {menuCategories.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="group flex w-full max-w-[6.5rem] flex-col items-center sm:max-w-[7.5rem] md:max-w-[8.5rem]"
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-full bg-neutral-100 text-[clamp(1.6rem,5.5vw,2.5rem)] shadow-inner transition group-hover:bg-neutral-200/90">
                  <img
                    src={item.iconSrc}
                    alt={item.label}
                    className="h-[64%] w-[64%] object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-baseline gap-0.5">
                    <span className="text-sm font-bold text-gray-900">{item.label}</span>
                    <sup className="translate-y-[-2px] text-[10px] font-normal tabular-nums text-gray-400 sm:text-[11px]">
                      {menuCount(item.countCategory)}
                    </sup>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#DBF4E2] to-[#F6FDEC] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="flex items-center justify-center gap-3 text-2xl font-semibold uppercase tracking-[0.22em] text-black sm:gap-4 sm:text-3xl md:text-4xl">
              <span className="h-px w-10 shrink-0 bg-neutral-400 sm:w-14 md:w-16" aria-hidden />
              CUSTOM
              <span className="h-px w-10 shrink-0 bg-neutral-400 sm:w-14 md:w-16" aria-hidden />
            </h2>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <p className="text-center text-sm text-gray-500 sm:text-base">취향에 맞춰 커스텀 키보드를 제작해보세요</p>
              <Link to="/build" className="text-sm font-medium text-emerald-600 hover:underline sm:text-base">
                제작하기
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              {keyboardFlowSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative"
                  onMouseEnter={() => setActiveCustomStep(index)}
                  onMouseLeave={() => setActiveCustomStep(null)}
                >
                  {(() => {
                    const isActive = activeCustomStep === null ? index === 0 : activeCustomStep === index;
                    return (
                      <>
                        {index < keyboardFlowSteps.length - 1 ? (
                          <span
                            className="pointer-events-none absolute right-[-1.1rem] top-1/2 hidden -translate-y-1/2 text-teal-400 xl:block"
                            aria-hidden
                          >
                            - - -
                          </span>
                        ) : null}
                        <Link
                          to="/build"
                          className={`group relative block min-h-[126px] rounded-xl bg-white px-6 pb-5 pt-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                            isActive ? 'ring-1 ring-emerald-400' : 'ring-1 ring-gray-100'
                          }`}
                        >
                          <span
                            className={`select-none text-6xl font-bold leading-none ${
                              isActive ? 'text-emerald-500/90' : 'text-gray-100'
                            }`}
                            aria-hidden
                          >
                            {index + 1}
                          </span>
                          <p className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">{step.title}</p>
                          <p className="mt-2 text-sm font-medium text-gray-400">{step.desc}</p>
                          <div className="mt-4 text-sm font-medium text-emerald-600 opacity-0 transition group-hover:opacity-100">
                            -&gt; 제작하기
                          </div>
                        </Link>
                      </>
                    );
                  })()}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_2.1fr] lg:items-center lg:gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">원하는 가이드를 선택해주세요</h2>
              <p className="mt-2 text-sm text-gray-500">설명 방식만 다르고 결과는 동일해요. 편한 방식으로 시작해보세요.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {levels.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => choose(l.value)}
                  className={`group relative rounded-2xl border p-6 text-left transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg ${
                    current === l.value
                      ? 'border-emerald-300 bg-emerald-50/70 shadow-md'
                      : 'border-gray-100 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl transition group-hover:bg-emerald-200">
                      {l.icon}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        current === l.value
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                      }`}
                    >
                      {l.badge}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-gray-900">{l.title} 가이드</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {l.desc}
                    </p>
                  </div>

                  <div className="mt-5 h-px w-full bg-gray-100" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 transition group-hover:opacity-0">
                      선택 후 탐색 화면으로 이동
                    </span>
                    <span
                      className={`absolute bottom-6 right-6 text-sm font-semibold text-emerald-600 opacity-0 transition group-hover:opacity-100 ${
                        current === l.value ? 'text-emerald-700' : ''
                      }`}
                    >
                      시작하기 -&gt;
                    </span>
                  </div>

                  <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset transition ${
                      current === l.value ? 'ring-emerald-300' : 'ring-transparent group-hover:ring-emerald-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f7] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">인기상품</h2>
              <p className="mt-1 text-sm text-gray-500">시안의 리스트 영역처럼 카드형 그리드로 제공합니다.</p>
            </div>
            <Link
              to="/explore"
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              더보기
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popularParts?.data.map((p) => (
              <PartCard key={p.id} part={p} />
            ))}
            {!popularParts && (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200" />
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

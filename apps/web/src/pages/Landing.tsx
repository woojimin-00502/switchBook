import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useGuideStore, type GuideLevel } from '@/store/useGuideStore';
import { searchParts, type PartCategory } from '@/lib/api';
import { PartCard } from '@/components/parts/PartCard';

const levels: { value: GuideLevel; title: string; desc: string; emoji: string }[] = [
  { value: 'novice', title: '입문자', desc: '용어부터 천천히 알려드릴게요.', emoji: '🌱' },
  { value: 'intermediate', title: '중급자', desc: '필터·비교 기능을 능숙하게.', emoji: '⚡' },
  { value: 'expert', title: '전문가', desc: '핵심 스펙만 빠르게.', emoji: '🔥' },
];

const menuCategories: {
  label: string;
  to: string;
  emoji: string;
  countCategory: PartCategory | null;
}[] = [
  { label: '하우징', to: '/explore?category=housing', emoji: '📦', countCategory: 'housing' },
  { label: '기판', to: '/explore', emoji: '🔲', countCategory: null },
  { label: '보강판', to: '/explore?category=plate', emoji: '🛡️', countCategory: 'plate' },
  { label: '축', to: '/explore?category=switch', emoji: '⚙️', countCategory: 'switch' },
  { label: '키캡', to: '/explore', emoji: '⌨️', countCategory: null },
  { label: '기타장비', to: '/explore', emoji: '🧰', countCategory: null },
];

const HERO_SLIDE_MS = 5000;

const heroBannerSlides = [
  {
    src: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&w=1400&q=85',
    alt: '기계식 키보드 클로즈업',
  },
  {
    src: 'https://images.unsplash.com/photo-1618389483223-18f647bd0710?auto=format&w=1400&q=85',
    alt: '데스크 위 키보드',
  },
  {
    src: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&w=1400&q=85',
    alt: '키캡 디테일',
  },
  {
    src: 'https://images.unsplash.com/photo-1541140532154-b0243e1bbde9?auto=format&w=1400&q=85',
    alt: '커스텀 키보드',
  },
  {
    src: 'https://images.unsplash.com/photo-1511467687858-23d96c32e343?auto=format&w=1400&q=85',
    alt: '작업 공간과 키보드',
  },
] as const;

const keyboardFlowSteps = [
  '자신의 취향을 선택해주세요',
  '어떤 상품이 좋을지 추천 부품을 둘러보세요',
  '가격과 비슷한 상품을 보며 나만의 키보드를 만들어요',
  '최저가 링크로 구매하세요',
] as const;

function KeyboardCustomizerIllustration() {
  return (
    <div
      className="relative mx-auto flex max-w-none items-start justify-center gap-4 sm:gap-6 md:gap-8"
      aria-hidden
    >
      <div className="relative w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-[30rem] lg:max-w-[34rem]">
        <div
          className="absolute left-1/2 top-0 z-10 h-2.5 w-[10rem] -translate-x-1/2 -translate-y-3 rounded-full border border-gray-200 bg-white shadow-sm sm:h-3 sm:w-[12rem] md:w-[14rem]"
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-xl sm:rounded-3xl sm:p-4 md:p-5">
          <div className="flex h-[14rem] overflow-hidden rounded-xl bg-slate-100 sm:h-[17rem] md:h-[19rem] md:rounded-2xl">
            <div className="flex w-[42%] flex-col items-center justify-center bg-gray-900 px-3 py-4">
              <div className="relative flex aspect-[3/4] w-full max-w-[7rem] items-center justify-center rounded-xl bg-gray-800 sm:max-w-[8.5rem] md:max-w-[10rem]">
                <span className="text-5xl sm:text-6xl md:text-7xl">👕</span>
                <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-xl shadow sm:bottom-3 sm:right-3 sm:h-10 sm:w-10 sm:text-2xl">
                  🧑‍🚀
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded-md bg-gray-300/90 sm:h-3" />
                <div className="h-2.5 w-[80%] rounded-md bg-gray-300/80 sm:h-3" />
                <div className="h-2.5 w-[60%] rounded-md bg-gray-300/70 sm:h-3" />
              </div>
              <div className="flex items-center gap-2.5 pt-1 sm:gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-xs font-semibold text-emerald-600 sm:h-10 sm:w-10">
                  ✓
                </span>
                <span className="h-9 w-9 rounded-full border-2 border-gray-200 bg-pink-100 sm:h-10 sm:w-10" />
                <span className="h-9 w-9 rounded-full border-2 border-gray-200 bg-sky-100 sm:h-10 sm:w-10" />
              </div>
              <div className="mt-auto">
                <div className="h-11 w-full rounded-xl bg-emerald-500 shadow-inner sm:h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex w-12 shrink-0 flex-col items-center gap-3 rounded-xl bg-emerald-500 py-4 text-white shadow-md sm:mt-12 sm:w-14 md:mt-14 md:w-16 md:gap-4 md:py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20 text-sm font-semibold sm:h-10 sm:w-10">〜</span>
        <span className="text-sm opacity-90">□</span>
        <span className="text-base font-serif font-bold sm:text-lg">T</span>
        <span className="text-sm">🖼</span>
      </div>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const setLevel = useGuideStore((s) => s.setLevel);
  const current = useGuideStore((s) => s.level);
  const [heroSlide, setHeroSlide] = useState(0);

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
            />
          ))}
          <div className="absolute inset-0 bg-white/35" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-emerald-400/90 bg-gradient-to-br from-emerald-100/88 via-emerald-50/82 to-teal-100/85 p-7 shadow-xl shadow-black/[0.08] backdrop-blur-md backdrop-saturate-150 sm:p-10">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-xs text-gray-400">New Collection</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">Spring Mood Set</p>
                  <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-emerald-50 text-5xl">🛍️</div>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-xs text-gray-400">Best Item</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">Graphic T-Shirt</p>
                  <div className="mt-4 flex h-28 items-center justify-center rounded-2xl bg-slate-50 text-5xl">👕</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">- MENU -</h2>
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
                  <span aria-hidden>{item.emoji}</span>
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
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">- 나만의 키보드 만들기 -</h2>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <p className="text-center text-sm text-gray-500 sm:text-base">취향에 맞춰 커스텀 키보드를 제작해보세요</p>
              <Link to="/build" className="text-sm font-medium text-emerald-600 hover:underline sm:text-base">
                제작하기
              </Link>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <div className="min-w-0 max-w-xl lg:max-w-none">
              <ul className="m-0 list-none p-0">
                {keyboardFlowSteps.map((text, index) => (
                  <li key={text} className="flex gap-4 sm:gap-5">
                    <div className="flex w-8 shrink-0 flex-col items-center sm:w-9">
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ring-2 ring-[#e8f8ef] sm:h-9 sm:w-9 sm:text-sm ${
                          index === 0
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-emerald-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < keyboardFlowSteps.length - 1 ? (
                        <div
                          className="mt-1 min-h-[2rem] flex-1 border-l-2 border-dashed border-gray-300 sm:min-h-[2.25rem]"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <p className="pb-8 pt-1 text-sm font-medium leading-snug text-gray-900 last:pb-0 sm:text-base md:pt-1.5 md:leading-relaxed">
                      {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-w-0 justify-center lg:justify-end">
              <KeyboardCustomizerIllustration />
            </div>
          </div>

        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">원하는 가이드를 선택해주세요</h2>
              <p className="mt-2 text-sm text-gray-500">처음 방문한 사용자도 바로 시작할 수 있도록 구성했습니다.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {levels.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => choose(l.value)}
                className={`group rounded-2xl border p-6 text-left transition-all hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 ${
                  current === l.value
                    ? 'border-emerald-300 bg-emerald-50 shadow-md'
                    : 'border-gray-100 bg-white shadow-sm'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-2xl group-hover:bg-emerald-100">
                  {l.emoji}
                </div>
                <div className="mt-4 text-lg font-bold text-gray-900">{l.title}</div>
                <div className="mt-2 text-sm text-gray-500">{l.desc}</div>
                <div className="mt-4 text-sm font-medium text-emerald-600 opacity-0 transition group-hover:opacity-100">
                  시작하기 →
                </div>
              </button>
            ))}
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

import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SwitchBot } from './guide/SwitchBot';
import { useAuthStore } from '@/store/useAuthStore';

const navMenus = [
  {
    key: 'home',
    label: 'HOME',
    to: '/',
    sections: [
      {
        title: '메인 바로가기',
        links: [
          { label: '메인 홈', to: '/' },
          { label: '신규 아이템', to: '/#new-items' },
          { label: '가이드 선택', to: '/#guide' },
        ],
      },
    ],
  },
  {
    key: 'parts',
    label: '부품',
    to: '/explore',
    sections: [
      {
        title: '카테고리',
        links: [
          { label: '스위치', to: '/explore?category=switch' },
          { label: '하우징', to: '/explore?category=housing' },
          { label: '보강판', to: '/explore?category=plate' },
        ],
      },
      {
        title: '빠른필터',
        links: [
          { label: '리니어', to: '/explore?category=switch&type=LINEAR' },
          { label: '택타일', to: '/explore?category=switch&type=TACTILE' },
        ],
      },
    ],
  },
  {
    key: 'typing',
    label: '타건',
    to: '/community',
    sections: [
      {
        title: '타건 콘텐츠',
        links: [
          { label: '타건 가이드', to: '/community' },
          { label: '추천 사운드', to: '/community' },
          { label: '리뷰 모음', to: '/community' },
        ],
      },
    ],
  },
  {
    key: 'event',
    label: '이벤트',
    to: '/community',
    sections: [
      {
        title: '진행 중 이벤트',
        links: [
          { label: '신규회원 혜택', to: '/community' },
          { label: '시즌 특가', to: '/community' },
          { label: '쿠폰 안내', to: '/community' },
        ],
      },
    ],
  },
  {
    key: 'build',
    label: '키보드만들기',
    to: '/build',
    sections: [
      {
        title: '빌드 시작',
        links: [
          { label: '나만의 조합 만들기', to: '/build' },
          { label: '추천 빌드 보기', to: '/build' },
        ],
      },
    ],
  },
] as const;

const SCROLL_TOP_THRESHOLD = 320;

export function RootLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const user = useAuthStore((s) => s.user);
  const cartCount = useAuthStore((s) => s.cartCount);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo — 로그인 화면 시안과 동일한 SWITCHBOOK 워드마크 */}
          <Link
            to="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-900 transition hover:opacity-90 sm:text-base"
          >
            SWITCHBOOK
          </Link>

          {/* Nav */}
          <nav
            className="hidden items-center gap-2 md:flex"
            onMouseLeave={() => setOpenMenu(null)}
          >
            {navMenus.map((menu) => (
              <div
                key={menu.key}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.key)}
              >
                <NavLink
                  to={menu.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 px-3 py-2 text-[16px] font-semibold transition-colors ${
                      isActive ? 'text-emerald-500' : 'text-gray-900 hover:text-emerald-500'
                    }`
                  }
                  onClick={() => setOpenMenu((prev) => (prev === menu.key ? null : menu.key))}
                >
                  {menu.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${openMenu === menu.key ? 'rotate-180 text-emerald-500' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </NavLink>

                {openMenu === menu.key && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-[260px] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                    <div className="space-y-4">
                      {menu.sections.map((section) => (
                        <div key={section.title}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                            {section.title}
                          </p>
                          <ul className="space-y-1">
                            {section.links.map((item) => (
                              <li key={item.label}>
                                <Link
                                  to={item.to}
                                  className="block rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-600"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions — 검색은 아이콘 자리에서 인라인으로 펼침 */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
            {searchOpen ? (
              <div className="w-[min(100%,17rem)] shrink-0 sm:w-72 md:w-80">
                <label
                  htmlFor="header-search"
                  className="flex cursor-text items-center gap-2 rounded-xl border border-emerald-400/80 bg-[#f6f7f6] px-2.5 py-1.5 shadow-sm transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 sm:px-3 sm:py-2"
                >
                  <span className="shrink-0 text-gray-900" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </span>
                  <input
                    id="header-search"
                    type="search"
                    placeholder="키보드 부품을 검색하세요..."
                    className="min-w-0 flex-1 border-0 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 outline-none ring-0 sm:text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchOpen(false);
                    }}
                    className="shrink-0 cursor-pointer rounded-lg p-1 text-gray-500 transition hover:bg-white/80 hover:text-gray-900"
                    aria-label="검색 닫기"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </label>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="shrink-0 rounded-full p-2 text-gray-900 transition hover:bg-neutral-100"
                aria-expanded={false}
                aria-label="검색 열기"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </button>
            )}

            {user ? (
              <>
                <Link
                  to="/explore"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-gray-900 transition hover:bg-neutral-200"
                  aria-label={`장바구니, 상품 ${cartCount}개`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                </Link>
                <div className="flex min-w-0 max-w-[100px] flex-col sm:max-w-[200px]">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">PRO</span>
                  <span className="truncate text-sm font-bold text-gray-900">{user.nickname}</span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:px-5 sm:text-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-900 transition hover:text-emerald-600"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:px-5 sm:text-sm"
                >
                  회원가입
                </Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition md:hidden"
              aria-label="메뉴"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 text-lg font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs text-white">S</span>
                SwitchBook
              </div>
              <p className="mt-3 text-sm text-gray-500">
                나만의 키보드, 책처럼 펼쳐보세요.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900">서비스</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><Link to="/explore" className="hover:text-emerald-600">부품 탐색</Link></li>
                <li><Link to="/build" className="hover:text-emerald-600">빌드 시뮬레이터</Link></li>
                <li><Link to="/community" className="hover:text-emerald-600">커뮤니티</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">지원</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><span className="cursor-pointer hover:text-emerald-600">이용약관</span></li>
                <li><span className="cursor-pointer hover:text-emerald-600">개인정보처리방침</span></li>
                <li><span className="cursor-pointer hover:text-emerald-600">문의하기</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">소셜</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li><span className="cursor-pointer hover:text-emerald-600">Instagram</span></li>
                <li><span className="cursor-pointer hover:text-emerald-600">Twitter</span></li>
                <li><span className="cursor-pointer hover:text-emerald-600">Discord</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
            <p className="text-xs text-gray-400">&copy; 2025 SwitchBook. All rights reserved.</p>
            <div className="flex gap-4">
              <div className="h-1 w-6 rounded-full bg-emerald-500" />
              <div className="h-1 w-6 rounded-full bg-yellow-400" />
              <div className="h-1 w-6 rounded-full bg-blue-400" />
              <div className="h-1 w-6 rounded-full bg-pink-400" />
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-[45] flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-white/80 transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 sm:h-12 sm:w-12 ${
          showScrollTop ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="맨 위로 이동"
        title="맨 위로"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <SwitchBot />
    </div>
  );
}

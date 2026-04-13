import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nickname = email.split('@')[0]?.trim() || '키보드 짱짱맨';
    login({ nickname, isPro: true });
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>로그인 · SwitchBook</title>
      </Helmet>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f3f5f4] px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-emerald-100 bg-[#d7efe3] p-4 shadow-xl shadow-emerald-100/70 md:grid-cols-[1.1fr_1fr] md:gap-4 md:p-6">
          <div className="relative hidden overflow-hidden rounded-3xl bg-white/50 md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-emerald-50" />
            <div className="relative p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">SwitchBook</p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">Login</h1>
              <p className="mt-2 max-w-xs text-sm text-gray-500">
                쉽고 빠르게 로그인하고 나만의 상품 구성을 이어서 확인하세요.
              </p>
              <div className="mt-10 flex h-44 items-center justify-center rounded-3xl border border-white/80 bg-white shadow-sm">
                <span className="text-7xl">🐱</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-8">
            <div className="md:hidden">
              <h1 className="text-2xl font-bold text-gray-900">Login</h1>
              <p className="mt-1 text-sm text-gray-500">SwitchBook에 오신 것을 환영합니다</p>
            </div>
            <div className="mt-6 space-y-4 md:mt-0">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-300" />
                로그인 유지
              </label>
              <button type="button" className="text-emerald-600 hover:underline">
                비밀번호 찾기
              </button>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600"
            >
              로그인
            </button>
            <p className="text-center text-sm text-gray-500">
              아직 계정이 없으신가요?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
                회원가입
              </Link>
            </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

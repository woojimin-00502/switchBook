import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="py-20 text-center">
      <div className="text-5xl">🔍</div>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾지 못했어요</h1>
      <Link to="/" className="mt-4 inline-block text-brand-dark hover:underline dark:text-brand">
        홈으로 돌아가기
      </Link>
    </section>
  );
}

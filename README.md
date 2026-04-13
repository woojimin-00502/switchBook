# SwitchBook

커스텀 키보드 빌드 시뮬레이션 및 데이터 아카이브 SaaS.

## 구조 (모노레포)

- `apps/web` — React (Vite + TS) SPA, Tailwind, Zustand, TanStack Query
- `apps/api` — NestJS + Prisma + PostgreSQL(Supabase)

## 개발 시작

```bash
# 루트
npm install

# DB 준비 (apps/api/.env 에 DATABASE_URL 설정 후)
npm run -w @switchbook/api prisma:migrate
npm run -w @switchbook/api prisma:seed

# 동시 실행
npm run dev
# web: http://localhost:5173
# api: http://localhost:3001
```

## Phase 1 MVP 범위

- 부품 DB + 검색/필터 (`/explore`)
- 부품 상세 (`/parts/:category/:id`)
- 캐릭터 가이드 SwitchBot (숙련도 영속화)

Phase 2(빌드 시뮬레이터/호환성/로그인), Phase 3(커뮤니티/AI) 예정.

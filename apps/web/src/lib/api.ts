const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export type PartCategory = 'switch' | 'housing' | 'plate';

export interface PartSummary {
  id: string;
  category: PartCategory;
  name: string;
  manufacturer: string;
  imageUrl: string | null;
  priceKrw: number | null;
  tags: { kind: string; value: string }[];
}

export interface SwitchDetail extends PartSummary {
  type: 'LINEAR' | 'TACTILE' | 'CLICKY';
  actuationG: number;
  bottomG: number;
  topMat: string;
  bottomMat: string;
  stemMat: string;
  factoryLubed: boolean;
}

export interface SearchPartsParams {
  category?: PartCategory;
  type?: string;
  minG?: number;
  maxG?: number;
  tag?: string;
  page?: number;
  limit?: number;
}

export function searchParts(params: SearchPartsParams) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
  });
  return apiFetch<{ data: PartSummary[]; total: number; page: number; limit: number }>(
    `/parts?${qs.toString()}`,
  );
}

export function getPart(category: PartCategory, id: string) {
  return apiFetch<SwitchDetail>(`/parts/${category}/${id}`);
}

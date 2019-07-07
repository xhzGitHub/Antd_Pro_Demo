import request from '@/utils/request';
import { withQuery } from './helpers';

export default function testing() {
  return 'testing is successful';
}

export function getSchemas() {
  return request(`/api/data/schemas`);
}

export function getBargainOverview() {
  return request(`/api/data/bargain-overview`);
}

export function getBargainFunnel(query?: any) {
  return request(withQuery(`/api/bargain-funnel`, query));
}

export function getBargainShopFunnel(query?: any) {
  return request(withQuery(`/api/bargain-shop-funnel`, query));
}

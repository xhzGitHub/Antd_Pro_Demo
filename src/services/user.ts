import request from '@/utils/request';
import { withQuery } from './helpers';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export function getUserList(query?: any) {
  return request(withQuery(`/api/user-list`, query));
}
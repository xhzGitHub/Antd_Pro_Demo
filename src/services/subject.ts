import request from '@/utils/request';
import { withQuery } from './helpers';

export function getSubjectPools() {
  return request('/api/subject-pools?city_id=97');
}

export function getSubjectPool(id) {
  return request(`/api/subject-pools/${id}?city_id=97`);
}

export function getSubjectRegionList() {
  return request(`/api/subject-region?city_id=97`);
}

export function setRegionOnlineStatus({ id, payload }) {
  return request(`/api/subject-region/online/${id}?city_id=97`, {
    method: 'PUT',
    body: payload
  });
}

export function getSubjectRegionDetail(id) {
  return request(`/api/subject-region/${id}`);
}

export function getSearchRegionList(query: any) {
  return request(withQuery(`/api/subject-region/un-conf?city_id=97`, query));
}

export function getStatisticGraph() {
  return request(`/api/subject-statistics-graph`)
  .then(res => res.url)
  .catch(err => {
    console.log('fetch statisticGraph url fail', err);
    return '';
  })
}

export function getSubjectList(query: any) {
   return request(withQuery(`/api/subjects`, query));
}
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

export function getUserInfo(user_id) {
  return request(`/api/user/${user_id}`);
}

export function updateUserInfo({ user_id, payload }) {
  return request(`/api/user/${user_id}`, {
    method: 'POST',
    body: payload,
  });
}

export function rewardPointToUser({ user_id, payload }) {
  return request(`/api/user-point/${user_id}`, {
    method: 'POST',
    body: payload,
  });
}

export function getShieldTypes(): Promise<User.ShieldTypeArray> {
  return request(`/api/shield-user-function/list`)
    .then(types => {
      let typeArray: User.ShieldTypeArray = [];
      for (const key of Object.keys(types)) {
        typeArray.push({
          id: types[key],
          name: key
        });
      }
      return typeArray;
    });
}

export function getShieldUserList(query?: any) {
  return request(withQuery(`/api/user-list`, query));
}

export function setShieldUser(payload) {
  return request(`/api/shield-user-function/add`, {
    method:'POST',
    body: payload
  });
}

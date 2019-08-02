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

export function getShieldedUsers(): Promise<User.ShieldedUsersList> {
  return request(`/api/shield-user-function/all`).then(users => {
    const usersArray: User.ShieldedUsersList = [];
    for (const key of Object.keys(users)) {
      usersArray.push({
        type: key,
        users: users[key]
      });
    }
    return usersArray;
  });
}

export function removeShieldedUsers(payload) {
  return request(`/api/shield-user-function/remove`, {
    method: 'POST',
    body: payload
  });
}

export function getAdmins(query) {
  return request(withQuery(`/api/user-admins`, query));
}

export function resetAdminPassword(payload) {
   return request(`/api/reset-password`, {
     method: 'POST',
     body: payload
   });
}

export function getPermissions() {
  return request(`/api/user-permission`);
}

export function getAdminPermissions(user_id) {
  return request(`/api/user-permission/${user_id}`);
}

export function postAdminPermissions(payload) {
   return request(`/api/user-permission`, {
     method: 'POST',
     body: payload
   });
}

export function createAdmin(payload) {
  return request(`/api/new-administrator`, {
    method: 'POST',
    body: payload
  });
}

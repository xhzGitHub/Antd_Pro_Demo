import request from "@/utils/request";
// import { withQuery } from './helpers';

export function getPopupList() {
  return request(`/api/list-pop-up-windows?city_id=97`);
}

export function updatePopupList(params: any) {
  return request(`/api/update-pop-up-window-status?city_id=97`, {
    method: "POST",
    body: params
  });
}

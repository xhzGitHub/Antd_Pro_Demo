export namespace AppPopup {
  export interface ListItem {
    accept_user_type_description: AcceptUserType;
    h5_picture_url: string;
    jump_h5: 0 | 1;
    operator_id: User.UserID;
    operator_name: User.BasicInfo["name"];
    picture_url: string;
    switch: 0 | 1;
    title: string;
    window_id: string;
  }

  export enum NavigateType {
    "文章详情" = 1,
    "文章列表",
    "商品详情",
    "商品列表",
    "外链",
    "首页",
    "更多福利列表",
    "热门话题列表"
  }

  export enum AcceptUserType {
    "全城" = 1,
    "Kol"
  }
}

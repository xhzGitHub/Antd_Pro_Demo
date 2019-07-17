declare type CityID = number;
declare type CityName = string;

declare interface City {
  id: CityID;
  name: CityName;
};

declare namespace User {
  interface ShieldType {
    id: number;
    name: string;
  }

  type ShieldTypeArray = ShieldType[];

  type UserID = number;

  type JPushID = string;

  type ShieldFunctionID = number;

  enum Gender {
    '男' = 1,
    '女'
  }

  interface BasicInfo {
    id: UserID;
    name: string;
    tel: string;
    gender: Gender;
    city: City['name'];
    created_at: string;
    bg_credit: number;
    bg_level: number;
  }

  interface ListItem extends BasicInfo {
    point: number;
    jpush_id: JPushID;
    feature_count: number;
    official_bookmark_count: number;
    teCc: number;
  }

  type List = ListItem[];

  type FuzzySearch = UserID;

  interface ShieldedUsers {
    type: ShieldType["name"];
    users: UserID[];
  }

  type ShieldedUsersList = ShieldedUsers[];

};
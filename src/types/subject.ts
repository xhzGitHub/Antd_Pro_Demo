declare namespace Subject {
  interface Category {
    text: string;
    value: string;
  }

  type Categories = Category[];

  interface NationalCategory {
    id: number;
    content: string;
    is_show: 0 | 1;
  }

  type NationalCategories = NationalCategory[];

  interface ReviewStats<T> {
    all: T;
    today: T;
    yesterday: T;
  }

  interface SubjectDetail {
    alias: string;
    body: string;
    bookmark_count: number;
    category_id: string;
    category_name: "上海";
    created_at: string;
    images: Image[];
    is_featured: boolean;
    istop: 0 | 1;
    lacking_count: number;
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    like_count: number;
    official_bookmark: boolean;
    picture_holy_land: boolean;
    share_count: number;
    status: number;
    title: string;
    updated_at: string;
    user: User;
    user_liked: boolean;
    video: Video;
    view_count: number;
  }

  interface Image {
    id: string;
    url: string;
    h: number;
    w: number;
  }

  interface User {
    user_alias: string;
    user_avt: string;
    user_id: User.UserID;
    user_name_display: string;
    user_tel: string;
  }

  interface Video {
    alias: string;
    cover: string;
    height: number;
    weight: number;
    url: string;
  }
}

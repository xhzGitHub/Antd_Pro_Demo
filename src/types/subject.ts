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
}

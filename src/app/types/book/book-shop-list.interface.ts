interface Shop {
  name: string;
  url: string;
}

interface CountryShopList {
  country: string;
  shops: Shop[];
}

interface BookShopLink {
  text: string;
  url: string;
}

export interface BookShopList {
  byCountry: CountryShopList[];
  search?: BookShopLink[];
  universities?: BookShopLink[];
  libraries?: BookShopLink[];
};
export interface Item {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number;
  max_price: number;
  mean_price: number;
  median_price: number;
  quantity: number;
  created_at: number;
  updated_at: number;
}

export interface MergedItem {
  name: string;
  tradable_min_price?: number;
  non_tradable_min_price?: number;
}

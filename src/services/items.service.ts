import axios from "axios";
import redisClient from "../redis";
import { Item, MergedItem } from "../types/item.interface";

export class ItemService {
  async getItems() {
    const cacheKey = "skinportItems";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit, returning cached data");
      return JSON.parse(cachedData);
    }

    const [tradableResponse, nonTradableResponse] = await Promise.all([
      axios.get<Item[]>("https://api.skinport.com/v1/items?tradable=true"),
      axios.get<Item[]>("https://api.skinport.com/v1/items?tradable=false"),
    ]);

    const tradableData = tradableResponse.data;
    const nonTradableData = nonTradableResponse.data;

    const itemMap = new Map<string, MergedItem>();

    tradableData.forEach((item) => {
      if (!itemMap.has(item.market_hash_name)) {
        itemMap.set(item.market_hash_name, { name: item.market_hash_name });
      }
      itemMap.get(item.market_hash_name)!.tradable_min_price = item.min_price;
    });

    nonTradableData.forEach((item) => {
      if (!itemMap.has(item.market_hash_name)) {
        itemMap.set(item.market_hash_name, { name: item.market_hash_name });
      }
      itemMap.get(item.market_hash_name)!.non_tradable_min_price =
        item.min_price;
    });

    const mergedData = Array.from(itemMap.values());

    console.log("Setting cache");
    await redisClient.set(cacheKey, JSON.stringify(mergedData), { EX: 200 });

    return mergedData;
  }
}

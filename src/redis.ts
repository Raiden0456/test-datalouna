import { createClient } from "redis";
import { config } from "./config";

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

export default redisClient;

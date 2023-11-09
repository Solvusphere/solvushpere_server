var redis = require("redis");
var client = redis.createClient(6379);

client.on("connect", function () {
  console.log("Redis Database connected");
});

client.on("reconnecting", function () {
  console.log("Redis client reconnecting");
});

client.on("ready", function () {
  console.log("Redis client is ready");
});

client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

client.on("end", function () {
  console.log("\nRedis client disconnected");
  process.exit();
});

module.exports.redisSet = (key, value) => {
  client.set(key, value);
};

module.exports.redisReSet = (key, value) => {
  client.set(key, value);
  client.expire(key, 200);
};

module.exports.setObject = (datas) => {
  console.log(datas);
  client.set(datas.email, JSON.stringify(datas), (err) => {
    if (err) return false;
  console.log(datas);
    client.expire(datas.email, 300);
    return true;
  });
};

module.exports.redisGet = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, function (error, result) {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports.redisDel = (key) => {
  client.del(key);
};

module.exports.close = () => {
  client.quit();
};

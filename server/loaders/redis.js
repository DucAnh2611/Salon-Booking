const Redis = require("../services/redis");

module.exports = async () => {
    let redis = null;
    try {
        redis = await Redis.getInstance().getClient();
    }
    catch(err) {
        console.log(err);
    }

    return redis;
}
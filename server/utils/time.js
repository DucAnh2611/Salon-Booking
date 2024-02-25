
const caltime = (time, type = "") => {
    switch(type) {
        case "d":
            return time * caltime(24, "h");
        case "h":
            return time * caltime(60, "m");
        case "m":
            return time * caltime(60, "s");
        default:
            return time;
}
}

module.exports = {
    caltime
}
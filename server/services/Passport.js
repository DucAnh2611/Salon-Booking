class PassportOAuth {
    constructor() {}

    static googleCallback(accessToken, done, profile) {
        console.log(profile);
        //signup
    }

    static facebookCallBack(accessToken, done, profile) {
        console.log(profile);
        //signup
    }
}

module.exports = PassportOAuth;
class ServerAPIBuilder {

    constructor() {
        this.app = null;
        this.port = null;
        this.servername = "";
    }

    setApp(app) {
        this.app = app;
        return this;
    }

    setPort(port) {
        this.port = port;
        return this;
    }

    setServername(name) {
        this.servername = name;
        return this;
    }


}

module.exports = ServerAPIBuilder;
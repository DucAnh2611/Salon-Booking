class ServerAPI {

    constructor(builder) {
        this.app = builder.app;
        this.server = builder.server;
        this.port = builder.port;
        this.servername = builder.servername;
        this.io = builder.io;
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`server is listening on port ${this.port}`);
        });
        return this;
    }

}

module.exports = ServerAPI;
class ServerAPI {

    constructor(builder) {
        this.app = builder.app;
        this.port = builder.port;
        this.servername = builder.servername;
    }

    listen() {
        const handler = servername => (req, res) => {
            console.log(servername, req.method, req.url);
            res.json({msg: `Hello from ${this.servername}`});
        }
        this.app.get("*", handler(this.servername)).post("*", handler(this.servername));

        this.app.listen(this.port, () => {
            console.log(`server is listening on port ${this.port}`);
        })
    }

}

module.exports = ServerAPI;
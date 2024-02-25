class ResponseFormat {
    constructor() {
        this.resetState();
    }

    getCurrentResponse() {
        return this;
    }

    setSuccess(success) {
        this.success = success;
        return this;
    }    
    setStatus(status) {
        this.status = status;
        return this;
    }    
    setBody(body) {
        this.body = body;
        return this;
    }    
    setMessage(message) {
        this.message = message;
        return this;
    }

    resetState() {
        this.success = false;
        this.status = 404;
        this.body = {};
        this.message = "";
    }

    ServerSuccess200() {
        this.success = true;
        this.status = 200;

        return this;
    }
    
    ServerError500() {
        this.success = false;
        this.status = 500;
        this.message = "Something wrong on server!";
        this.body = {};

        return this;
    } 
}

module.exports = ResponseFormat;
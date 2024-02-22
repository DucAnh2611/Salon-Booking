class ResponseFormat {
    constructor() {
        this.success = false;
        this.status = 404;
        this.body = {};
        this.message = "";
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
}
module.exports = ResponseFormat;
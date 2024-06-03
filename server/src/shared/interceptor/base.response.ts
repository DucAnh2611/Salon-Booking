import { HttpStatus } from '@nestjs/common';

export class AppBaseResponse {
    private statusCode: HttpStatus;
    private result: object | object[];

    constructor({ result, statusCode }: { result: object; statusCode: HttpStatus }) {
        this.statusCode = statusCode;
        this.result = result;
    }

    getStatus() {
        return this.statusCode;
    }

    getResult() {
        return this.result;
    }
}

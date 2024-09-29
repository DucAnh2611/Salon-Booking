import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { LockStateEnum } from '../../common/enum/lock-state.enum';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { ClientService } from '../../module/client/service/client.service';
import { NotLockState } from '../decorator/not-lock-state.decorator';
import { BadRequest } from '../exception/error.exception';

@Injectable()
export class NotLockStateGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly clientService: ClientService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const notLockStates = this.reflector.get(NotLockState, context.getHandler());
        if (!notLockStates || !notLockStates.length) {
            return true;
        }
        const request: AppRequest = context.switchToHttp().getRequest();

        const { accessPayload } = request;

        if (!accessPayload.clientId && accessPayload.employeeId) return true;

        const client = await this.clientService.findOneBy({ id: accessPayload.clientId });

        for (const lockState of notLockStates) {
            switch (lockState) {
                case LockStateEnum.ACCOUNT:
                    if (client.lockAccount) {
                        throw new BadRequest({ message: DataErrorCodeEnum.ACCOUNT_LOCK });
                    }
                    break;
                case LockStateEnum.ORDER:
                    if (client.lockAccount) {
                        throw new BadRequest({ message: DataErrorCodeEnum.ORDER_LOCK });
                    }
                    break;
                default:
                    return true;
            }
        }

        return true;
    }
}

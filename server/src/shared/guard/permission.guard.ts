import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AppRequest } from '../../common/interface/custom-request.interface';
import { TargetActionRequire } from '../decorator/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const targetActionRequires = this.reflector.get(TargetActionRequire, context.getHandler());
    const request: AppRequest = context.switchToHttp().getRequest();

    return true;
  }
}

import { UserTypeEnum } from '../enum/user.enum';

export interface AccessTokenPayload {
    userId: string;
    employeeId?: string;
    clientId?: string;
    email?: string;
    phone?: string;
    type?: UserTypeEnum;
    eRoleId?: string;
}

export interface RefreshTokenPayload {
    userId: string;
    employeeId?: string;
    clientId?: string;
}

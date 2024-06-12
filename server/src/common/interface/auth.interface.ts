export interface AccessTokenPayload {
    userId: string;
    employeeId?: string;
    clientId?: string;
    email?: string;
    phone?: string;
    uRoleId: string;
    eRoleId?: string;
}

export interface RefreshTokenPayload {
    userId: string;
    employeeId?: string;
    clientId?: string;
}

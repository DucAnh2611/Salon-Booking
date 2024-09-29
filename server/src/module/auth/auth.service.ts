import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { UserTypeEnum } from '../../common/enum/user.enum';
import { AccessTokenPayload, RefreshTokenPayload } from '../../common/interface/auth.interface';
import { jwtConfig } from '../../config/jwt.config';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { HashPasswordUtil } from '../../shared/utils/hash-password.utils';
import { JwtTokenUtil } from '../../shared/utils/token.utils';
import { RegisterClientDto } from '../client/dto/client-create.dto';
import { ClientService } from '../client/service/client.service';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { LoginClientDto, LoginEmpDto } from './dto/auth-login.dto';
import { ETypeExistAuth } from './enum/auth.enum';
import { TExistAuth } from './type/auth.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenUtil: JwtTokenUtil,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly mailService: MailService,
        private readonly clientService: ClientService,
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
    ) {}

    async empLogin(emp: LoginEmpDto): Promise<{ accessToken: string; refreshToken: string }> {
        const exist = await this.IsExist({
            query: { username: emp.username },
            type: ETypeExistAuth.EMPLOYEE,
        });
        if (!exist) throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });

        const empInfo = await this.employeeRepository.findOneBy({ username: emp.username });
        const userInfo = await this.userService.findOneById(empInfo.userId);

        const matchPassword = await HashPasswordUtil.comparePassword(emp.password, userInfo.password);
        if (!matchPassword) {
            throw new BadRequest({ message: DataErrorCodeEnum.WRONG_PASSWORD });
        }

        const accessToken = this.jwtTokenUtil.generateToken<AccessTokenPayload>({
            payload: {
                phone: userInfo.phone,
                type: userInfo.type,
                eRoleId: empInfo.eRoleId,
                userId: empInfo.userId,
                employeeId: empInfo.id,
            },
            key: jwtConfig.access.secret,
            options: { expiresIn: jwtConfig.access.expire },
        });

        const refreshToken = this.jwtTokenUtil.generateToken<RefreshTokenPayload>({
            payload: { userId: empInfo.userId, employeeId: empInfo.id },
            key: jwtConfig.refresh.secret,
            options: { expiresIn: jwtConfig.refresh.expire },
        });

        return { accessToken, refreshToken };
    }

    async clientLogin(emp: LoginClientDto) {
        const findClient = await this.clientService.findByEmail(emp.email);
        if (!findClient) throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });

        if (findClient.lockAccount) {
            throw new BadRequest({ message: DataErrorCodeEnum.ACCOUNT_LOCK });
        }

        const userInfo = await this.userService.findOneById(findClient.userId);

        const matchPassword = await HashPasswordUtil.comparePassword(emp.password, userInfo.password);
        if (!matchPassword) {
            throw new BadRequest({ message: DataErrorCodeEnum.WRONG_PASSWORD });
        }

        const accessToken = this.jwtTokenUtil.generateToken<AccessTokenPayload>({
            payload: {
                phone: userInfo.phone,
                email: findClient.email,
                type: userInfo.type,
                userId: findClient.userId,
                clientId: findClient.id,
            },
            key: jwtConfig.access.secret,
            options: { expiresIn: jwtConfig.access.expire },
        });

        const refreshToken = this.jwtTokenUtil.generateToken<RefreshTokenPayload>({
            payload: { userId: findClient.userId, clientId: findClient.id },
            key: jwtConfig.refresh.secret,
            options: { expiresIn: jwtConfig.refresh.expire },
        });

        return { accessToken, refreshToken };
    }

    async clientRegister(client: RegisterClientDto) {
        const [existEmail, existPhone] = await Promise.all([
            this.IsExist({
                query: { email: client.email },
                type: ETypeExistAuth.CLIENT,
            }),
            this.IsExist({
                query: { userBase: { phone: client.phone } },
                type: ETypeExistAuth.CLIENT,
            }),
        ]);
        if ((client.email && existEmail) || (client.phone && existPhone))
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_CLIENT });

        const { email, phone, ...userInfo } = client;

        const user = await this.userService.create({ ...userInfo, type: UserTypeEnum.CLIENT, phone });
        if (!user) throw new InternalServer();

        const newClient = await this.clientService.create({
            email,
            userId: user.id,
        });

        if (!newClient) throw new InternalServer();

        return newClient;
    }

    async refreshTokens({ userId, employeeId, clientId }: { userId: string; employeeId?: string; clientId?: string }) {
        const userInfo = await this.userService.findOneById(userId);

        const { accessPayload, refreshPayload } = {
            accessPayload: {
                phone: userInfo.phone,
                type: userInfo.type,
                userId,
            } as AccessTokenPayload,
            refreshPayload: {
                userId,
            } as RefreshTokenPayload,
        };
        if (employeeId) {
            const { eRoleId } = await this.employeeRepository.findOneBy({ id: employeeId });
            accessPayload.employeeId = employeeId;
            accessPayload.eRoleId = eRoleId;

            refreshPayload.employeeId = employeeId;
        } else if (clientId) {
            accessPayload.clientId = clientId;

            refreshPayload.clientId = clientId;
        } else {
            throw new BadRequest({ message: DataErrorCodeEnum.MISSING_DATA });
        }

        const accessToken = this.jwtTokenUtil.generateToken<AccessTokenPayload>({
            payload: accessPayload,
            key: jwtConfig.access.secret,
            options: { expiresIn: jwtConfig.access.expire },
        });

        const refreshToken = this.jwtTokenUtil.generateToken<RefreshTokenPayload>({
            payload: refreshPayload,
            key: jwtConfig.refresh.secret,
            options: { expiresIn: jwtConfig.refresh.expire },
        });

        return { accessToken, refreshToken };
    }

    async IsExist(data: TExistAuth) {
        const { query, type } = data;
        let isExist = null;

        switch (type) {
            case ETypeExistAuth.CLIENT:
                isExist = await this.clientService.findOneBy(query);
                break;

            case ETypeExistAuth.EMPLOYEE:
                isExist = await this.employeeRepository.findOne({
                    where: {
                        ...query,
                        userBase: {
                            type: UserTypeEnum.STAFF,
                        },
                    },
                    loadEagerRelations: false,
                    relations: {
                        userBase: true,
                    },
                });
                break;

            default:
                throw new InternalServer();
        }
        return !!isExist;
    }
}

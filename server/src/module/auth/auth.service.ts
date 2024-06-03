import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE_TITLE } from '../../common/constant/role.constant';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { AccessTokenPayload, RefreshTokenPayload } from '../../common/interface/auth.interface';
import { jwtConfig } from '../../config/jwt.config';
import { BadRequest, InternalServer } from '../../shared/exception/error.exception';
import { HashPasswordUtil } from '../../shared/utils/hash-password.utils';
import { EmployeeEntity } from '../employee/entity/employee.entity';
import { MailService } from '../mail/mail.service';
import { RoleService } from '../role/role.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginEmpDto } from './dto/auth-login.dto';
import { CreateEmpDto } from './dto/create-auth.dto';
import { ETypeExistAuth } from './enum/auth.enum';
import { TExistAuth } from './type/auth.type';
import { JwtTokenUtil } from './utils/token.utils';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtTokenUtil: JwtTokenUtil,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly mailService: MailService,
        @InjectRepository(EmployeeEntity) private readonly employeeRepository: Repository<EmployeeEntity>,
    ) {}

    async empSignup(emp: CreateEmpDto) {
        const { username, ...userData } = emp;

        const exist = await this.IsExist({
            query: { username },
            type: ETypeExistAuth.EMPLOYEE,
        });
        if (exist) throw new BadRequest({ message: DataErrorCodeEnum.EXIST });

        const roleStaff = await this.roleService.getRole({ title: ROLE_TITLE.staff, deletable: false });
        const roleEmployee = await this.roleService.getRole({ title: ROLE_TITLE.employee, deletable: false });

        const user: UserEntity = await this.userService.create({ ...userData, roleId: roleStaff.id });

        const newEmp = this.employeeRepository.create({
            eRoleId: roleEmployee.id,
            username,
            userId: user.id,
        });

        const empInserted = await this.employeeRepository.save(newEmp);

        await this.mailService.signupSuccess({ email: user.email });

        return { empInserted, user };
    }

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
                email: userInfo.email,
                uRoleId: userInfo.roleId,
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

    empLogout() {}

    clientLogout() {}

    refreshAccessToken() {}

    async IsExist(data: TExistAuth) {
        const { query, type } = data;
        let isExist = null;

        switch (type) {
            case ETypeExistAuth.CLIENT:
                isExist = null;
                break;

            case ETypeExistAuth.EMPLOYEE:
                isExist = await this.employeeRepository.findOneBy(query);
                break;

            default:
                throw new InternalServer({ message: DataErrorCodeEnum.INTERNAL });
        }

        return !!isExist;
    }
}

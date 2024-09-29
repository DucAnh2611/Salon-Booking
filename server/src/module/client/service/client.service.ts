import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { OTP_EXPIRE } from '../../../common/constant/otp.constant';
import { REDIS_EMAIL_OTP_FORMAT, REDIS_OTP_FORMAT } from '../../../common/constant/redis.constant';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { appConfig } from '../../../config/app.config';
import { jwtConfig } from '../../../config/jwt.config';
import { BadRequest } from '../../../shared/exception/error.exception';
import { generateOTP } from '../../../shared/utils/otp.utils';
import { TimeUtil } from '../../../shared/utils/parse-time.util';
import { joinString } from '../../../shared/utils/string';
import { JwtTokenUtil } from '../../../shared/utils/token.utils';
import { MailService } from '../../mail/mail.service';
import { RedisService } from '../../redis/redis.service';
import { UserService } from '../../user/user.service';
import { CreateClientDto } from './../dto/client-create.dto';
import { TokenOTP } from './../dto/client-otp.dto';
import { ClientEntity } from './../entity/client.entity';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity) private readonly clientRepository: Repository<ClientEntity>,
        private readonly redisService: RedisService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly jwtTokenUtil: JwtTokenUtil,
    ) {}

    me(clientId: string) {
        return this.clientRepository.findOne({
            where: { id: clientId },
            loadEagerRelations: false,
            relations: {
                userBase: {
                    userAvatar: true,
                },
                cartProduct: true,
                cartService: true,
            },
        });
    }

    async create(newClient: Omit<CreateClientDto, 'phone'>) {
        const clientInstance = this.clientRepository.create({
            ...newClient,
            phoneVerified: false,
            emailVerified: false,
        });
        const newEmployee = await this.clientRepository.save(clientInstance);

        return newEmployee;
    }

    async findOneBy(query: FindOptionsWhere<ClientEntity>) {
        const { userBase, ...q } = query;
        return this.clientRepository.findOne({
            where: {
                ...q,
                userBase: {
                    ...(userBase as object),
                    type: UserTypeEnum.CLIENT,
                },
            },
            loadEagerRelations: false,
            relations: {
                userBase: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.clientRepository.findOne({ where: { email } });
    }

    async verifyEmail({ email }: { email: string }) {
        const { user, client } = await this.getUserAndClientInfoByEmail(email);

        if (client.emailVerified) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMAIL_ALREADY_VERIFIED });
        }

        const createCacheKey = REDIS_EMAIL_OTP_FORMAT.replace(REDIS_OTP_FORMAT.USER_ID, user.id)
            .replace(REDIS_OTP_FORMAT.CLIENT_ID, client.id)
            .replace(REDIS_OTP_FORMAT.EMAIL, email);

        const existedOTP: any = await this.redisService.get(createCacheKey);
        if (existedOTP) {
            return { expired: new Date(existedOTP.expired) };
        }

        const otp = generateOTP({ length: 6, type: 'number' });
        const exp = TimeUtil.toMilisecond({ time: OTP_EXPIRE });
        const tokenRedirect = this.jwtTokenUtil.generateToken<TokenOTP>({
            payload: { email },
            key: jwtConfig.otp.secret,
            options: {
                expiresIn: OTP_EXPIRE,
            },
        });
        const redirectURL = joinString({
            joinString: '/',
            strings: [
                appConfig.url,
                appConfig.prefix,
                ROUTER.CLIENT,
                CLIENT_ROUTE.VERIFY_EMAIL_OTP,
                `?token=${tokenRedirect}`,
            ],
        });

        await this.mailService.clientVerifyEmail({
            email: client.email,
            otp,
            name: joinString({ joinString: ' ', strings: [user.firstname, user.lastname] }),
            redirectURL,
        });
        const expired = new Date(Date.now() + exp);
        await this.redisService.set(createCacheKey, { otp, expired }, exp);

        return { expired };
    }

    async verifyEmailOTPByToken({ token }: { token: string }) {
        const decodedToken = this.jwtTokenUtil.decodeToken<TokenOTP>({ token, key: jwtConfig.otp.secret });
        if (!decodedToken) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_TOKEN });
        }

        const { email } = decodedToken;
        const { user, client } = await this.getUserAndClientInfoByEmail(email);

        if (client.emailVerified) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMAIL_ALREADY_VERIFIED });
        }
        const createCacheKey = REDIS_EMAIL_OTP_FORMAT.replace(REDIS_OTP_FORMAT.USER_ID, user.id)
            .replace(REDIS_OTP_FORMAT.CLIENT_ID, client.id)
            .replace(REDIS_OTP_FORMAT.EMAIL, email);

        const existedOTP = await this.redisService.get(createCacheKey);
        if (!existedOTP) {
            throw new BadRequest({ message: DataErrorCodeEnum.OTP_EXPIRED });
        }

        await Promise.all([
            this.redisService.del(createCacheKey),
            this.clientRepository.save({
                ...client,
                id: client.id,
                emailVerified: true,
            }),
        ]);

        return existedOTP;
    }

    async verifyEmailOTP({ email, otp }: { email: string; otp: string }) {
        const { user, client } = await this.getUserAndClientInfoByEmail(email);

        if (client.emailVerified) {
            throw new BadRequest({ message: DataErrorCodeEnum.EMAIL_ALREADY_VERIFIED });
        }

        const createCacheKey = REDIS_EMAIL_OTP_FORMAT.replace(REDIS_OTP_FORMAT.USER_ID, user.id)
            .replace(REDIS_OTP_FORMAT.CLIENT_ID, client.id)
            .replace(REDIS_OTP_FORMAT.EMAIL, email);

        const existedOTP: any = await this.redisService.get(createCacheKey);
        const { otp: cacheOtp } = existedOTP;

        if (!existedOTP) {
            throw new BadRequest({ message: DataErrorCodeEnum.OTP_EXPIRED });
        }
        if (cacheOtp !== otp) {
            throw new BadRequest({ message: DataErrorCodeEnum.OTP_NOT_MATCH });
        }

        await Promise.all([
            this.redisService.del(createCacheKey),
            this.clientRepository.save({
                ...client,
                id: client.id,
                emailVerified: true,
            }),
        ]);

        return DataSuccessCodeEnum.OK;
    }

    async getUserAndClientInfoByEmail(email: string) {
        const client = await this.clientRepository.findOne({ where: { email } });
        if (!client) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }

        const user = await this.userService.findOneById(client.userId);
        if (!user) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST });
        }

        return { user, client };
    }
}

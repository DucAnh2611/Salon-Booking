import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { OTP_EXPIRE } from '../../../common/constant/otp.constant';
import { REDIS_EMAIL_OTP_FORMAT, REDIS_OTP_FORMAT } from '../../../common/constant/redis.constant';
import { CLIENT_ROUTE, ROUTER } from '../../../common/constant/router.constant';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { UserTypeEnum } from '../../../common/enum/user.enum';
import { appConfig } from '../../../config/app.config';
import { jwtConfig } from '../../../config/jwt.config';
import { multerConfig } from '../../../config/multer.configs';
import { BadRequest } from '../../../shared/exception/error.exception';
import { generateOTP } from '../../../shared/utils/otp.utils';
import { TimeUtil } from '../../../shared/utils/parse-time.util';
import { joinString } from '../../../shared/utils/string';
import { JwtTokenUtil } from '../../../shared/utils/token.utils';
import { MailService } from '../../mail/mail.service';
import { MediaService } from '../../media/service/media.service';
import { RedisService } from '../../redis/redis.service';
import { UserService } from '../../user/user.service';
import { ClientUpdateInfoDto } from '../dto/client-update.dto';
import { CreateClientDto } from './../dto/client-create.dto';
import { TokenOTP } from './../dto/client-otp.dto';
import { ClientEntity } from './../entity/client.entity';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity) private readonly clientRepository: Repository<ClientEntity>,
        private readonly redisService: RedisService,
        private readonly mediaService: MediaService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly jwtTokenUtil: JwtTokenUtil,
    ) {}

    async me(clientId: string) {
        const redisName = joinString({ joinString: '_', strings: ['me', clientId] });

        const getCache = await this.redisService.get(redisName);
        if (getCache) {
            return getCache;
        }

        const me = await this.clientRepository.findOne({
            where: { id: clientId },
            loadEagerRelations: false,
            relations: {
                userBase: {
                    userAvatar: true,
                },
                cartProduct: true,
                cartService: true,
            },
            select: {
                userBase: {
                    firstname: true,
                    lastname: true,

                    password: false,
                },
            },
        });

        await this.redisService.set(redisName, me, 15 * 60 * 1000);

        return me;
    }

    async info(clientId: string) {
        const redisName = joinString({ joinString: '_', strings: ['me', 'info', clientId] });

        const getCache = await this.redisService.get(redisName);
        if (getCache) {
            return getCache;
        }
        const info = await this.clientRepository.findOne({
            where: { id: clientId },
            loadEagerRelations: false,
            relations: {
                userBase: {
                    userAvatar: true,
                },
            },
        });

        await this.redisService.set(redisName, info, 15 * 60 * 1000);

        return info;
    }

    async update(userId: string, clientId: string, body: ClientUpdateInfoDto, file: Express.Multer.File) {
        const { phone, birthday, firstname, gender, lastname } = body;

        const checkClient = await this.clientRepository.findOne({
            where: {
                id: clientId,
            },
            loadEagerRelations: false,
            relations: {
                userBase: true,
            },
        });
        if (!checkClient) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_CLIENT });
        }

        const checkExist = await this.clientRepository.find({
            where: {
                id: Not(clientId),
                userBase: {
                    phone,
                    type: UserTypeEnum.CLIENT,
                },
            },
            loadEagerRelations: false,
            relations: {
                userBase: true,
            },
        });

        if (checkExist.length !== 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXIST_EMAIL_OR_PHONE });
        }

        let imageId = '';

        if (file) {
            const saveImage = await this.mediaService.save(
                userId,
                file,
                joinString({ joinString: '/', strings: [multerConfig.client, clientId] }),
            );
            imageId = saveImage.id;
        }

        await this.clientRepository.update(
            { id: clientId },
            {
                ...(phone !== checkClient.userBase.phone ? { phoneVerified: false } : {}),
            },
        );
        await this.userService.update(userId, {
            phone,
            firstname,
            lastname,
            birthday,
            gender,
            avatar: !!imageId ? imageId : checkClient.userBase.avatar,
        });

        const redisNameInfo = joinString({ joinString: '_', strings: ['me', 'info', clientId] });
        const redisNameMe = joinString({ joinString: '_', strings: ['me', clientId] });

        await Promise.all([this.redisService.del(redisNameInfo), this.redisService.del(redisNameMe)]);

        return this.info(clientId);
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
        const expM = joinString({ joinString: '', strings: [OTP_EXPIRE.time.toString(), OTP_EXPIRE.unit] });
        const exp = TimeUtil.toMilisecond({
            time: expM,
        });
        const tokenRedirect = this.jwtTokenUtil.generateToken<TokenOTP>({
            payload: { email },
            key: jwtConfig.otp.secret,
            options: {
                expiresIn: expM,
            },
        });
        const redirectURL = joinString({
            joinString: '/',
            strings: [
                appConfig.url,
                appConfig.prefix,
                ROUTER.CLIENT,
                `${CLIENT_ROUTE.VERIFY_EMAIL_URL}?token=${tokenRedirect}`,
            ],
        });

        await this.mailService.clientVerifyEmail({
            email: client.email,
            otp,
            minutes: OTP_EXPIRE.time,
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

        const redisNameInfo = joinString({ joinString: '_', strings: ['me', 'info', client.id] });
        const redisNameMe = joinString({ joinString: '_', strings: ['me', client.id] });

        await Promise.all([
            this.redisService.del(redisNameInfo),
            this.redisService.del(redisNameMe),
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

        const redisNameInfo = joinString({ joinString: '_', strings: ['me', 'info', client.id] });
        const redisNameMe = joinString({ joinString: '_', strings: ['me', client.id] });

        await Promise.all([
            this.redisService.del(redisNameInfo),
            this.redisService.del(redisNameMe),
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

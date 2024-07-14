import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

    async create(user: CreateUserDto) {
        const newUser = this.userRepository.create(user);
        const createdUser = await this.userRepository.save(newUser);

        return createdUser;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOneById(id: string) {
        return this.userRepository.findOneBy({ id: id });
    }

    async update(id: string, body: any) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_USER });
        }

        const newUserInfo: UserEntity = {
            ...user,
            ...body,
        };

        const updatedUser = await this.userRepository.save(newUserInfo);

        return updatedUser;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}

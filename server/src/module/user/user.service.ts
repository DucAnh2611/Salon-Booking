import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

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

    update(id: number) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassificationEntity } from './entity/classification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClassificationEntity])],
})
export class ClassificationModule {}

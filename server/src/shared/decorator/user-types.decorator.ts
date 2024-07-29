import { Reflector } from '@nestjs/core';

export const UserType = Reflector.createDecorator<string | 0>();

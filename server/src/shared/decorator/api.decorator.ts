import { Reflector } from '@nestjs/core';

export const ApiKey = Reflector.createDecorator<string | undefined>();

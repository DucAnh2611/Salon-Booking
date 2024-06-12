import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
    imports: [],
    controllers: [OAuthController],
    providers: [GoogleStrategy, FacebookStrategy],
})
export class OAuthModule {}

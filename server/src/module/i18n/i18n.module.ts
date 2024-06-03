import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { i18nConfig } from '../../config/i18n.config';

@Module({
    imports: [
        I18nModule.forRootAsync({
            useFactory: () => ({
                fallbackLanguage: i18nConfig.fallback,
                loaderOptions: {
                    path: join(__dirname, '/'),
                    watch: true,
                },
            }),
            resolvers: [
                new QueryResolver(['lang', 'l']),
                new HeaderResolver(['x-custom-lang']),
                new CookieResolver(),
                AcceptLanguageResolver,
            ],
        }),
    ],
    controllers: [],
})
export class I18nAppModule {}

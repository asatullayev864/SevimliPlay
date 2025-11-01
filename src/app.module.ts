import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DevicesModule } from './devices/devices.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ContentsModule } from './contents/contents.module';
import { TagsModule } from './tags/tags.module';
import { ContentTagsModule } from './content-tags/content-tags.module';
import { CategoriesModule } from './categories/categories.module';
import { ContentCategoriesModule } from './content-categories/content-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: true,
        autoLoadEntities: true,
        logging: ['error', 'warn'],
      }),
    }),

    UsersModule,
    AdminsModule,
    AuthModule,
    PlansModule,
    SubscriptionsModule,
    DevicesModule,
    ProfilesModule,
    ContentsModule,
    TagsModule,
    ContentTagsModule,
    CategoriesModule,
    ContentCategoriesModule,
  ],
})
export class AppModule { }
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { FamiliesController } from './families/families.controller';
import { MembersController } from './members/members.controller';
import { MembersService } from './members/members.service';
import { FamiliesService } from './families/families.service';
import { FamiliesModule } from './families/families.module';
import { MembersModule } from './members/members.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'test'),
        autoLoadEntities: true,
        entities: [User],
        synchronize:true
      }),

      }),
    UserModule,
    FamiliesModule,
    MembersModule
  ],
  controllers: [AppController, FamiliesController, MembersController],
  providers: [AppService, MembersService, FamiliesService, JwtService, UserService],
})
export class AppModule {}

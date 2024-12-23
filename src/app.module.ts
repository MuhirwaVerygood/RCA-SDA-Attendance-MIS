import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({  isGlobal: true})],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}

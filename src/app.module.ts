import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORmConfigService } from './config/typeorm.config.service';
import { LocalStrategy } from './auth/strategy/local.strategy';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { StaffModule } from './staff/staff.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeORmConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
    StaffModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule {}

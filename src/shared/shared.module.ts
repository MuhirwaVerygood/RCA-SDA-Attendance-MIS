import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from 'src/families/families.entity';
import { Member } from 'src/members/members.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { User } from 'src/auth/user.entity';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET', 'INITIAL VALUE'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'test'),
        ssl: {
          rejectUnauthorized: true,
          ca: `-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUKHn5eGCpxoHYgqhHr82CWLp/oZ0wDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1YjMxZmZkMjQtY2FkMC00MjE0LTkwNjUtNzA1ZmI1NWFj
ZjU1IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMjI4MDkyNjEzWhcNMzUwMjI2MDky
NjEzWjBAMT4wPAYDVQQDDDViMzFmZmQyNC1jYWQwLTQyMTQtOTA2NS03MDVmYjU1
YWNmNTUgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANOm8y+zuh6/avyJ6Yx5JM4Rg0s+kS3wtcMXxt05+PmGrxt/EKBkjzEf
yQXpsrTpVxTAGbMBNDYaahP9LIxuKHc6uzY0e+bmWQtjkBmkn12eSh2M/mLAB2iN
3Csr4siK0jzNxPAEOa3H1iGW5NTyo4bqyvjvNTuPLWWQ+bAsKMA4oEB/dqDEDQ7C
8lXdDXMapABNsdgVTBGXfsdp0EICQoNhBE8tCGk7oUjyANcKqLpV57jKE17dhp1X
kQEGG8WT8SqD10mhqk5pAImEbl1h218/9PVCLi7iUiZubaP2KGPo5+A5PNWnswMl
/eGu6/xSp7bu+Dugf1hCzwvQ+QFIzfYJdXMCebHSKAML8Ga4kw+4bXAW22WrmHwD
QSNXUs17eKXZmjHuyGtN0lRG/Fo4d0leBhVUUW5giDUz8y9pMUzCez7QZfcDpSS3
USSdnjVAFybR7ejayw/WsbzgoUzw1ZGVKDubTabv/TyTWmOZzxk4YV7HsPQDYjRC
CJInuNA9MwIDAQABoz8wPTAdBgNVHQ4EFgQUFQsDV15JW5/Wsd7IS6KtUnY4WrAw
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AJX5zmr0gYy0dGYVcuFYMh2mowDy+G7sGo09Uvn/ml7DbpgZxxV1KDIJWETmxU0Z
SghCMQAvAuztXk1+ru1Mugz32WpFQF7ovUZyr0k7pcE4WiV52l1Y/lgllTH7XSHe
w73V+5j6GX/FAY7tzhcUHeyQ+x4eiN4xtpuvpussvLxheC4cXmNq4ekelfoi1h1i
j0lfHykr7pC3lDGImOzRYG9kyVVkCfy95FtbXJxfA65yelqQrvVR5Yoe2criJcMO
Jsl0GkcBIpRBHMqDiXWHB+ANsvJKO0MxOUnasxsev6iC1EWZvrfuXDZb+cR+82Oy
hsXtxE3RWW+9qQO+SzJijVikpRMfp64HfqtBjz1Ttp7UKYCmSvNGxZOCrupWklmi
TmXg5pIy4xd8HrVxa073fo1VwPXLZITS0peGgrdXo41tNAk7TXfK6lM0bCXjQLrU
9EPP92hiHhUw3OM5wdLRo4/Xk7SX1IPrQuuqc3vfYYg1OAi4TVTo6bjTcpDwo6GJ
mQ==
-----END CERTIFICATE-----`,
        },

        autoLoadEntities: true,
        entities: [User, Family, Member],
        synchronize: true,
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  exports: [JwtModule, TypeOrmModule, MailerModule],
})
export class SharedModule {}

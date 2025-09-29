import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { LogMiddleware } from './common/middleware/log.middleware';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';

@Module({
  imports: [
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => ({
			type: 'postgres',
			host: configService.get('DB_HOST'),
			port: configService.get<number>('DB_PORT'),
			username: configService.get('DB_USERNAME'),
			password: configService.get('DB_PASSWORD'),
			database: configService.get('DB_DATABASE'),
			synchronize: configService.get('DB_SYNCHRONIZE'),
			logging: configService.get('DB_LOGGING'),
			entities: [
				UsersModel,
			],
		}),
	}),
	CommonModule,
	AuthModule,
	UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				LogMiddleware
			)
			.forRoutes({
				path: '*',
				method: RequestMethod.ALL,
			});
	}
}

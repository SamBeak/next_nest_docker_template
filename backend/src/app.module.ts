import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
			entities: [],
		}),
	}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

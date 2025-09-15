import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongoProviderModule } from 'src/providers/mongo/mongo-provider.module';
import { mongoConfig } from 'src/providers/config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
    UsersModule,
    MongoProviderModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

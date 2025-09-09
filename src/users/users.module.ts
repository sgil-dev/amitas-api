import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoProviderModule } from 'src/providers/mongo/mongo-provider.module';

@Module({
  providers: [
    {
      provide: 'UsersInterface',
      useClass: UsersService,
    }
  ],
  imports: [MongoProviderModule],
  controllers: [UsersController],
  exports: [
    {
      provide: 'UsersInterface',
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongoProviderModule } from 'src/providers/mongo/mongo-provider.module';
import { GroupPolicies } from './group.policies';

@Module({
  controllers: [GroupController],
  providers: [
    {
      provide: 'GroupInterface',
      useClass: GroupService,
    },
    GroupPolicies,
  ],
  imports: [MongoProviderModule],
  exports: [
    {
      provide: 'GroupInterface',
      useClass: GroupService,
    }
  ],
})
export class GroupModule {}

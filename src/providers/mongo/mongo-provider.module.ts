import { Module } from '@nestjs/common';
import { schemas } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { repositories } from './repositories';

@Module({
    imports: [
        MongooseModule.forFeature(schemas)
    ],
    providers: [...repositories],
    exports: [MongooseModule, ...repositories],
})
export class MongoProviderModule {}

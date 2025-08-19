import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { User } from '../entities/user.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Rating, User])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
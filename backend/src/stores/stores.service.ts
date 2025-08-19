import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const owner = await this.usersRepository.findOneBy({ id: createStoreDto.owner_id });
    if (!owner || owner.role !== UserRole.STORE_OWNER) {
      throw new BadRequestException('Invalid owner ID or user is not a store owner.');
    }
    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async findAllForUser(userId: number, query: any) {
    const stores = await this.storesRepository.find();
    const ratings = await this.ratingsRepository.find({ where: { user_id: userId } });
    
    const storesWithRatings = stores.map(store => {
      const userRating = ratings.find(r => r.store_id === store.id);
      return {
        ...store,
        myRating: userRating ? userRating.rating_value : null,
      };
    });

    // This is where you would also calculate the average rating for each store
    // For brevity, this part is omitted but would involve another query/calculation.
    
    return storesWithRatings;
  }

  async getOwnerDashboard(ownerId: number) {
    const store = await this.storesRepository.findOne({ where: { owner_id: ownerId } });
    if (!store) {
      throw new NotFoundException('Store not found for this owner.');
    }

    const ratings = await this.ratingsRepository.find({
      where: { store_id: store.id },
      relations: ['user'],
    });

    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating_value, 0) / ratings.length || 0;

    const ratingsDetails = ratings.map(r => ({
      userName: r.user.name,
      ratingValue: r.rating_value,
      submittedAt: r.created_at,
    }));

    return {
      storeId: store.id,
      storeName: store.name,
      averageRating: parseFloat(averageRating.toFixed(2)),
      ratings: ratingsDetails,
    };
  }

  async submitOrUpdateRating(userId: number, storeId: number, ratingValue: number): Promise<Rating> {
    const existingRating = await this.ratingsRepository.findOne({ where: { user_id: userId, store_id: storeId } });

    if (existingRating) {
      // Update existing rating
      existingRating.rating_value = ratingValue;
      return this.ratingsRepository.save(existingRating);
    } else {
      // Create new rating
      const newRating = this.ratingsRepository.create({
        user_id: userId,
        store_id: storeId,
        rating_value: ratingValue,
      });
      return this.ratingsRepository.save(newRating);
    }
  }
}
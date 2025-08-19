import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { CreateUserDto } from '../users/dto/create-user.dto'; // FIX: Path was incorrect

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.usersRepository.count();
    const totalStores = await this.storesRepository.count();
    const totalRatings = await this.ratingsRepository.count();
    return { totalUsers, totalStores, totalRatings };
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> { // FIX: Corrected return type
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: createUserDto.password,
    });
    const savedUser: User = await this.usersRepository.save(user);
    
    const { password_hash, ...result } = savedUser;
    return result;
  }

  async findAll(query: any): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    
    if (query.name) {
      queryBuilder.andWhere('user.name ILIKE :name', { name: `%${query.name}%` });
    }
    if (query.email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${query.email}%` });
    }
    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    // Select all columns except password_hash
    queryBuilder.select([
        'user.id', 
        'user.name', 
        'user.email', 
        'user.address', 
        'user.role'
    ]);

    return queryBuilder.getMany();
  }
}
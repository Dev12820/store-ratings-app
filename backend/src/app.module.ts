import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT || '5432', 10), // FIX: Added default value
    //   username: process.env.DATABASE_USER,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   entities: [User, Store, Rating],
    //   synchronize: true,
    // }),
    // backend/src/app.module.ts

TypeOrmModule.forRoot({
  type: 'postgres',
  // Use the database URL from environment variables
  url: process.env.DATABASE_URL, 
  // This is required for connecting to Render's database
  ssl: { 
    rejectUnauthorized: false,
  },
  entities: [User, Store, Rating],
  synchronize: true, // Note: For real production, use migrations
}),
    AuthModule,
    UsersModule,
    StoresModule,
  ],
})
export class AppModule {}
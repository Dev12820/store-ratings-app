import { Controller, Get, Post, Body, UseGuards, Request, Param, Put, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/guards/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('api/v1/stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // Admin endpoint to create a store
  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  @UseGuards(RolesGuard)
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.createStore(createStoreDto);
  }

  // Normal user endpoint to get all stores
  @Get()
  @Roles(UserRole.NORMAL_USER, UserRole.SYSTEM_ADMIN)
  @UseGuards(RolesGuard)
  findAllStores(@Request() req, @Query() query: any) {
    return this.storesService.findAllForUser(req.user.userId, query);
  }

  // Store owner endpoint to view their dashboard
  @Get('dashboard')
  @Roles(UserRole.STORE_OWNER)
  @UseGuards(RolesGuard)
  getOwnerDashboard(@Request() req) {
    return this.storesService.getOwnerDashboard(req.user.userId);
  }

  // Normal user endpoint to submit a rating
  @Post(':storeId/ratings')
  @Roles(UserRole.NORMAL_USER)
  @UseGuards(RolesGuard)
  submitRating(@Request() req, @Param('storeId') storeId: number, @Body() createRatingDto: CreateRatingDto) {
    return this.storesService.submitOrUpdateRating(req.user.userId, storeId, createRatingDto.rating_value);
  }
  
  // Normal user endpoint to update a rating
  @Put(':storeId/ratings')
  @Roles(UserRole.NORMAL_USER)
  @UseGuards(RolesGuard)
  updateRating(@Request() req, @Param('storeId') storeId: number, @Body() createRatingDto: CreateRatingDto) {
    return this.storesService.submitOrUpdateRating(req.user.userId, storeId, createRatingDto.rating_value);
  }
}
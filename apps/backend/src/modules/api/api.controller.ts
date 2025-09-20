import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { User } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('users')
  getUsers(): User[] {
    return this.apiService.getUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string): User | undefined {
    return this.apiService.getUserById(Number(id));
  }

  @Post('users')
  createUser(@Body() userData: Omit<User, 'id'>): User {
    return this.apiService.createUser(userData);
  }

  @Get('data')
  getData(@Query('type') type: string) {
    return this.apiService.getData(type);
  }
}
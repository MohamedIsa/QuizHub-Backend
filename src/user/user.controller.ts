import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { supaClient } from 'src/supabase/supabase.config';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updates: any) {
    return this.userService.updateUser(id, updates);
  }
}

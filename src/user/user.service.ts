import { BadRequestException, Injectable } from '@nestjs/common';
import { supaClient } from 'src/supabase/supabase.config';
import { UsersDto } from './dto/users.dto';

@Injectable()
export class UserService {
  async createUser(user: UsersDto) {
    try {
      const { data, error } = await supaClient
        .from('users')
        .insert({
          ...user,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new BadRequestException(`Database error: ${error.message}`);
      }
      return data;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      console.error('Unexpected error in createUser:', err);
      throw new BadRequestException('Failed to create user');
    }
  }

  async existEmail(email: string): Promise<boolean> {
    try {
      const { data, error } = await supaClient
        .from('users')
        .select('email')
        .eq('email', email);

      if (error && error.code !== 'PGRST116') {
        throw new BadRequestException(error.message);
      }
      return !!(data && data.length > 0);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      return false;
    }
  }
  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supaClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async userNameExist(username: string): Promise<boolean> {
    try {
      const { data, error } = await supaClient
        .from('users')
        .select('username')
        .eq('username', username);

      if (error && error.code !== 'PGRST116') {
        throw new BadRequestException(error.message);
      }
      return !!(data && data.length > 0);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      return false;
    }
  }

  // Get all users
  async findAll() {
    const { data, error } = await supaClient.from('users').select('*');
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async updateUser(id: string, updates: any) {
    const { data, error } = await supaClient
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}

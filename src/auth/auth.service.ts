import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { auth } from 'src/firebase/firebase.config';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signUp(signupDto: SignupDto) {
    const { email, username, password, confirmPassword, role, nickname } =
      signupDto;
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const emailExists = await this.userService.existEmail(email);
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const usernameExists = await this.userService.userNameExist(username);
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }

    let firebaseUser;
    try {
      // Create Firebase user
      firebaseUser = await auth.createUser({
        email,
        password,
      });

      if (!firebaseUser) {
        throw new BadRequestException('Error creating user in Firebase');
      }

      const userId = firebaseUser.uid;

      // Try to create user in Supabase database
      const createUserResult = await this.userService.createUser({
        id: userId,
        email,
        username,
        role: role ?? 'user',
        nickname,
      });

      if (!createUserResult) {
        // If Supabase insertion fails, delete the Firebase user
        await auth.deleteUser(userId);
        throw new BadRequestException('Error creating user in database');
      }

      return { message: 'Account Created Successfully' };
    } catch (error) {
      // If we have a Firebase user but something went wrong after, clean it up
      if (firebaseUser && firebaseUser.uid) {
        try {
          await auth.deleteUser(firebaseUser.uid);
          console.log(`Cleaned up Firebase user: ${firebaseUser.uid}`);
        } catch (cleanupError) {
          console.error('Error cleaning up Firebase user:', cleanupError);
          // Log the cleanup error but don't throw it, as we want to throw the original error
        }
      }

      // Re-throw the original error
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error during user registration');
    }
  }
}

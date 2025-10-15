import {
  IsEmail,
  Matches,
  IsOptional,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long and contain at least one letter and one number',
    },
  )
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin' = 'user';

  @IsOptional()
  nickname?: string;
}

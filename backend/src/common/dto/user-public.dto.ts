import { ApiProperty } from '@nestjs/swagger';

export class UserPublicDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  static from(user: { id: string; email: string }): UserPublicDto {
    return { id: user.id, email: user.email };
  }
}

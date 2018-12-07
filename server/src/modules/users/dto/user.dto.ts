import { IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
  uid: string;
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(user: any) {
    this.uid = user.uid;
    this.name = user.name;
  }
}

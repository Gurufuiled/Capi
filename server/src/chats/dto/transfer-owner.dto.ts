import { IsNotEmpty, IsString } from 'class-validator';

export class TransferOwnerDto {
  @IsString()
  @IsNotEmpty()
  user_id!: string;
}

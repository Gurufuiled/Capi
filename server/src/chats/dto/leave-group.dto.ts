import { IsBoolean, IsOptional, IsString } from 'class-validator';

/** Body for POST /chats/:id/leave. Only the group owner needs any of these fields. */
export class LeaveGroupDto {
  /** Owner leaving: user id of the member who becomes the new owner. */
  @IsOptional()
  @IsString()
  transfer_to_user_id?: string;

  /** Owner leaving a group without other admins: confirm that the group is deleted for everyone. */
  @IsOptional()
  @IsBoolean()
  delete_group?: boolean;
}

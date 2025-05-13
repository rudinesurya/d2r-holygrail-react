import { UserDto } from "./user.dto";

export class GetUserResponseDto {
    system_message?: string;
    data!: {
        user: UserDto;
    };
}
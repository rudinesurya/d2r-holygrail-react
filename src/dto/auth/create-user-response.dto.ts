import { UserDto } from "./user.dto";

export class CreateUserResponseDto {
    system_message?: string;
    data!: {
        user: UserDto;
    };
}
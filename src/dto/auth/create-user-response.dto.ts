import { UserDto } from "./user.dto";

export class CreateUserResponseDto {
    message?: string;
    data!: {
        user: UserDto;
    };
}
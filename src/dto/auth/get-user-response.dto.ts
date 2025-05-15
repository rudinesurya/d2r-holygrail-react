import { UserDto } from "./user.dto";

export class GetUserResponseDto {
    message?: string;
    data!: {
        user: UserDto;
    };
}
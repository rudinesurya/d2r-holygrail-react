export class LoginUserResponseDto {
    system_message?: string;
    data!: {
        token: string;
    };
}
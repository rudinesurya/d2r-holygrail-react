export class LoginUserResponseDto {
    message?: string;
    data!: {
        token: string;
    };
}
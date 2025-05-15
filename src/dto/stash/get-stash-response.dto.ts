import { LedgeDto } from "./ledge.dto";

export class GetStashResponseDto {
    message?: string;
    data!: {
        stash: LedgeDto[];
    };
}
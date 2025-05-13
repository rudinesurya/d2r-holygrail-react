import { ItemCountDto } from "./item-counts.dto";

export class GetItemCountsResponseDto {
    system_message?: string;
    data!: {
        itemCounts: ItemCountDto[];
    };
}
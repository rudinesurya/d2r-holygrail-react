import { ItemDto } from "./item.dto";

export class GetItemsResponseDto {
    message?: string;
    data!: {
        items: ItemDto[];
    };
}
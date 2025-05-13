import { ItemDto } from "./item.dto";

export class GetItemsResponseDto {
    system_message?: string;
    data!: {
        items: ItemDto[];
    };
}
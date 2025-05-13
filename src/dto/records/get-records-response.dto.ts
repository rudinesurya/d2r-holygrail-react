import { RecordDto } from "./record.dto";

export class GetRecordsResponseDto {
    system_message?: string;
    data!: {
        records: RecordDto[];
    };
}
import { RecordDto } from "./record.dto";

export class GetRecordsResponseDto {
    message?: string;
    data!: {
        records: RecordDto[];
    };
}
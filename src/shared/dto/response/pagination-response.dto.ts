import { ApiProperty } from "@nestjs/swagger";

export class PaginationResponseDto<T> {
    @ApiProperty({ description: 'The pagination information' })
    pagination: PaginationInfo;

    @ApiProperty({ description: 'The data' })
    data: T[];
}

export class PaginationInfo {
    @ApiProperty({ description: 'The total number of items' })
    total: number;

    @ApiProperty({ description: 'The page number' })
    page?: number;

    @ApiProperty({ description: 'The number of items per page' })
    limit?: number
}


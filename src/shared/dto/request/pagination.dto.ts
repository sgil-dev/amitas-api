import { IsOptional, IsNumber, Min, Max, ValidateNested } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    page?: number;
}
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  skip!: number;

  @ApiProperty()
  take!: number;
}

export class PaginatedResponseDto<T> {
  items!: T[];
  meta!: PaginationMetaDto;

  static of<T>(
    items: T[],
    meta: PaginationMetaDto,
  ): PaginatedResponseDto<T> {
    return { items, meta };
  }
}

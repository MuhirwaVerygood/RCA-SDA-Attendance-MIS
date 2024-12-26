import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class CreateFamilyDto {
    @ApiProperty({ example: 'Smith Family', description: 'The name of the family' })
    @IsString()
    familyName: string;

    @ApiProperty({ example: 'John Smith', description: 'The father of the family' })
    @IsString()
    father: string;

    @ApiProperty({ example: 'Jane Smith', description: 'The mother of the family' })
    @IsString()
    mother: string;
}



export class UpdateFamilyDto {
    @ApiPropertyOptional({ example: 'Johnson Family', description: 'The name of the family' })
    @IsString()
    @IsOptional()
    familyName?: string;

    @ApiPropertyOptional({ example: 'Michael Johnson', description: 'The father of the family' })
    @IsString()
    @IsOptional()
    father?: string;

    @ApiPropertyOptional({ example: 'Laura Johnson', description: 'The mother of the family' })
    @IsString()
    @IsOptional()
    mother?: string;
}

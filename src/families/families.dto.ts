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




    @ApiProperty({ example: 'janesmith@gmail.com', description: 'The email of mother of the family' })
    @IsString()
    mother_email: string;
    
    @ApiProperty({ example: 'verygoodmuhirwa@gmail.com', description: 'The email of father of the family' })
    @IsString()
    father_email: string;


    @ApiProperty({ example: 'Y2D', description: 'The class of father of the family' })
    @IsString()
    father_class: string;

    @ApiProperty({ example: 'Y2D', description: 'The class of mother of the family' })
    @IsString()
    mother_class: string;


    @ApiProperty({ example: 'verygoodmuhirwa235', description: 'The initial password for family heads' })
    @IsString()
    password: string;
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

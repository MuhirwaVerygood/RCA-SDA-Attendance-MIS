import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateMemberDTO {
    @ApiProperty({ description: 'The name of the member', example: 'John Doe' })
    name: string;

    @ApiProperty({ description: 'The class of the member', example: 'A' })
    class: string;
}



export class UpdateMemberDTO extends PartialType(CreateMemberDTO) {
    @ApiProperty({ description: 'The updated name of the member', example: 'Jane Doe', required: false })
    name?: string;

    @ApiProperty({ description: 'The updated class of the member', example: 'B', required: false })
    class?: string;
}

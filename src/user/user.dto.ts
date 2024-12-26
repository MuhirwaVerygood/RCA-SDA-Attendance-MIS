import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
    @ApiProperty({ description: 'The username of the user', example: 'johndoe' })
    username: string;

    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password: string;

    @ApiProperty({ description: 'Indicates if the user is an admin', example: false })
    isAdmin: boolean;

    @ApiProperty({ description: 'Indicates if the user is a father', example: false })
    isFather: boolean;

    @ApiProperty({ description: 'Indicates if the user is a mother', example: false })
    isMother: boolean;
}

export class LoginUserDTO {
    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    email: string;

    @ApiProperty({ description: 'The password of the user', example: 'password123' })
    password: string;
}

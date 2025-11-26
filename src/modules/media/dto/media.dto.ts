import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    format: 'binary',
    type: 'string',
    required: true,
    nullable: false,
  })
  file: Express.Multer.File;
}

export class MultipleFilesUploadDto {
  @ApiProperty({
    format: 'binary',
    type: 'string',
    required: true,
    nullable: false,
    isArray: true,
  })
  file: Express.Multer.File[];
}

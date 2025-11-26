import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2023-11-29T08:12:24.980Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-11-29T08:12:24.980Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}

import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@modules/common/entity/base.entity";

@Entity({ name: "search_history" })
@Index(['userId', 'updatedAt'])
@Index(['userId', 'query'], { unique: true })
export class SearchHistory extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    query: string;
}

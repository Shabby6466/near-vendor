import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "@modules/common/entity/base.entity";

export enum AnalyticsEventType {
    IMPRESSION = 'IMPRESSION',
    VIEW = 'VIEW',
    SEARCH = 'SEARCH',
}

@Entity({ name: "analytics_events" })
@Index(['targetId', 'eventType', 'createdAt'])
export class AnalyticsEvent extends BaseEntity {
    @Column()
    targetId: string;

    @Column({
        type: 'enum',
        enum: AnalyticsEventType,
    })
    eventType: AnalyticsEventType;

    @Column({ nullable: true })
    userId: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;
}

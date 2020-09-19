import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { User } from './../../user/entity/user.entity';

@Entity('todos')
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public title: string;

    @ManyToOne(() => User, (user: User) => user.todos)
    @JoinColumn({ name: 'userId' })
    public user: User;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;
}

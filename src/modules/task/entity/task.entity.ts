import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { Todo } from './../../todo/entity/todo.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public readonly title: string;

    @Column({ type: 'varchar', nullable: false })
    public readonly todoId: string;

    @ManyToOne(() => Todo, (todo: Todo) => todo.tasks)
    @JoinColumn({ name: 'todoId' })
    public readonly todo: Todo;

    @Column({ type: 'boolean', nullable: false, default: false })
    public readonly status: boolean;

    @CreateDateColumn()
    public readonly createdAt: Date;

    @UpdateDateColumn()
    public readonly updatedAt: Date;

    @DeleteDateColumn()
    public readonly deletedAt: Date;
}

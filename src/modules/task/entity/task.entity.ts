import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { Todo } from './../../todo/entity/todo.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public title: string;

    @Column({ type: 'varchar', nullable: false })
    public todoId: string;

    @ManyToOne(() => Todo, (todo: Todo) => todo.tasks)
    @JoinColumn({ name: 'todoId' })
    public todo: Todo;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;
}

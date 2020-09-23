import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';

import { User } from './../../user/entity/user.entity';
import { Task } from './../../task/entity/task.entity';

@Entity('todos')
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public title: string;

    @OneToMany(() => Task, (task: Task) => task.todo, { cascade: ['remove'] })
    public tasks: Task[];

    @Column({ type: 'varchar', nullable: false })
    public userId: string;

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

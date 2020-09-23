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
import { Category } from './../../category/entity/category.entity';

@Entity('todos')
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public readonly title: string;

    @Column({ type: 'varchar', nullable: false })
    public readonly userId: string;

    @Column({ type: 'varchar', nullable: false })
    public readonly categoryId: string;

    @OneToMany(() => Task, (task: Task) => task.todo)
    public readonly tasks: Task[];

    @ManyToOne(() => User, (user: User) => user.todos)
    @JoinColumn({ name: 'userId' })
    public readonly user: User;

    @ManyToOne(() => Category, (category: Category) => category.todos)
    @JoinColumn({ name: 'categoryId' })
    public readonly category: Category;

    @CreateDateColumn()
    public readonly createdAt: Date;

    @UpdateDateColumn()
    public readonly updatedAt: Date;

    @DeleteDateColumn()
    public readonly deletedAt: Date;
}

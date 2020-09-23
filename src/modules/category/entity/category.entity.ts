import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';

import { Todo } from './../../todo/entity/todo.entity';
import { User } from './../../user/entity/user.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ type: 'varchar', nullable: false, length: 200 })
    public readonly title: string;

    @Column({ type: 'varchar', nullable: false })
    public readonly userId: string;

    @OneToMany(() => Todo, (todo: Todo) => todo.category)
    public readonly todos: Todo[];

    @ManyToOne(() => User, (user: User) => user.categories)
    @JoinColumn({ name: 'userId' })
    public readonly user: User;

    @CreateDateColumn()
    public readonly createdAt: Date;

    @UpdateDateColumn()
    public readonly updatedAt: Date;

    @DeleteDateColumn()
    public readonly deletedAt: Date;
}

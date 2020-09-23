import {
    BaseEntity,
    Entity,
    Unique,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    OneToMany, 
    JoinColumn,
} from 'typeorm';
import { hash, genSalt } from 'bcryptjs';
import { randomBytes } from 'crypto';

import { UserRoleType } from './../types/userRole.type';
import { Todo } from './../../todo/entity/todo.entity';
import { Category } from 'src/modules/category/entity/category.entity';
import { Task } from 'src/modules/task/entity/task.entity';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public readonly email: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public readonly firstName: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public readonly lastName: string;

    @Column({ type: 'enum', enum: UserRoleType, default: 'user' })
    public readonly role: string;

    @Column({ nullable: false, type: 'boolean', default: false })
    public readonly isActive: boolean;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false })
    public salt: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    public confirmationToken: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    public recoverToken: string;

    @OneToMany(() => Todo, (todo: Todo) => todo.user, { cascade: ['remove'] })
    public readonly todos: Todo[];

    @OneToMany(() => Category, (category: Category) => category.user, { cascade: ['remove'] })
    public readonly categories: Category[];

    @OneToMany(() => Task, (task: Task) => task.user, { cascade: ['remove'] })
    public readonly tasks: Task[];

    @CreateDateColumn()
    public readonly createdAt: Date;

    @UpdateDateColumn()
    public readonly updatedAt: Date;

    @DeleteDateColumn()
    public readonly deletedAt: Date;

    @BeforeInsert()
    private async setHashPasswordAndSalt(): Promise<void> {
        const salt = await genSalt();
        this.salt = salt;
        this.password = await hash(this.password, salt);
    }

    @BeforeInsert()
    private setConfirmationToken(): void {
        this.confirmationToken = randomBytes(32).toString('hex');
    }

    public getRandomStringBytes(): string {
        return randomBytes(32).toString('hex');
    }

    public async getPasswordAndSalt(newPassword: string): Promise<{ salt: string; password: string }> {
        const salt = await genSalt();
        const password = await hash(newPassword, salt);

        return { salt, password };
    }

    public async checkPassword(password: string): Promise<boolean> {
        const newHash = await hash(password, this.salt);
        return newHash === this.password;
    }
}

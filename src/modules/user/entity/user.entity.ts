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
} from 'typeorm';
import { hash, genSalt } from 'bcryptjs';
import { randomBytes } from 'crypto';

import { UserRoleType } from './../types/userRole.type';
import { Todo } from './../../todo/entity/todo.entity';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public email: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public firstName: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    public lastName: string;

    @Column({ type: 'enum', enum: UserRoleType, default: 'user' })
    public role: string;

    @Column({ nullable: false, type: 'boolean', default: false })
    public isActive: boolean;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false })
    public salt: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    public confirmationToken: string;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    public recoverToken: string;

    @OneToMany(() => Todo, (todo: Todo) => todo.user, { cascade: ['remove'] })
    public todos: Todo[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;

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

import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

import { UserRoleType } from './../types/userRole.type';

@Entity()
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

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @DeleteDateColumn()
    public deletedAt: Date;
}

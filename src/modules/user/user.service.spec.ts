import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/createUser.dto';
import { User } from './entity/user.entity';

import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

const mockUserRepository = () => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserById: jest.fn(),
    getUserByConfirmationToken: jest.fn(),
    getUserByRecoverToken: jest.fn(),
    getUserByEmail: jest.fn(),
    findUsers: jest.fn(),
    getUserByEmailWithCredentials: jest.fn(),
});

describe('UserService', () => {
    let userRepository: UserRepository;
    let service: UserService;
    let mockUser: User | Promise<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useFactory: mockUserRepository,
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('createUser', () => {
        let mockCreateUserDTO: CreateUserDTO;

        beforeEach(() => {
            mockCreateUserDTO = {
                email: 'mock@email.com',
                firstName: 'Mock User',
                lastName: 'Mock User',
                password: 'mockPassword',
                passwordConfirmation: 'mockPassword',
            };
        });

        it('should create an user if passwords match', async () => {
            jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);
            const result = await service.createUser(mockCreateUserDTO);

            expect(userRepository.createUser).toHaveBeenCalledWith(mockCreateUserDTO);
            expect(result).toEqual(mockUser);
        });

        it("should throw an error if passwords doesn't match", async () => {
            mockCreateUserDTO.passwordConfirmation = 'wrongPassword';
            expect(service.createUser(mockCreateUserDTO)).rejects.toThrow(UnprocessableEntityException);
        });
    });
});

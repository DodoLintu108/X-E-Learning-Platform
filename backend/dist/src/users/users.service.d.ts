import { Model } from 'mongoose';
import { User } from './users.entity';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    deleteUser(id: string): Promise<string>;
}

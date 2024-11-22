import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
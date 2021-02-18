import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async all(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(data): Promise<User> {
    try {
      const user = await this.userRepository.save(data);
      return user;
    } catch (error) {
      throw new BadRequestException('이미 존재하는 유저입니다.');
    }
  }

  async findOne(condition): Promise<User> {
    return await this.userRepository.findOne(condition);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async all(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async create(data): Promise<Role> {
    try {
      const role = await this.roleRepository.save(data);
      return role;
    } catch (error) {
      throw new BadRequestException('이미 존재하는 유저입니다.');
    }
  }

  async findOne(condition): Promise<Role> {
    return await this.roleRepository.findOne(condition, { relations: ['permissions'] });
  }

  async update(id: number, data): Promise<any> {
    return this.roleRepository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.roleRepository.delete(id);
  }
}

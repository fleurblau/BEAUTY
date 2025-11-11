import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer, OrganizerStatus } from '../database/entities/organizer.entity';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
  ) {}

  findAll() {
    return this.organizersRepository.find();
  }

  findById(id: string) {
    return this.organizersRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: OrganizerStatus) {
    const organizer = await this.findById(id);
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }
    organizer.status = status;
    return this.organizersRepository.save(organizer);
  }
}

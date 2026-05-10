import { Injectable } from '@nestjs/common';
import { CreateTesterDto } from './dto/create-tester.dto';
import { UpdateTesterDto } from './dto/update-tester.dto';

@Injectable()
export class TesterService {
  create(createTesterDto: CreateTesterDto) {
    return 'This action adds a new tester';
  }

  findAll() {
    return `This action returns all tester`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tester`;
  }

  update(id: number, updateTesterDto: UpdateTesterDto) {
    return `This action updates a #${id} tester`;
  }

  remove(id: number) {
    return `This action removes a #${id} tester`;
  }
}

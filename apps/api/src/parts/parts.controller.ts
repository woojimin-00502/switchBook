import { Controller, Get, Param, Query } from '@nestjs/common';
import { PartsService } from './parts.service';
import { SearchPartsDto, type PartCategory } from './dto/search-parts.dto';

@Controller('parts')
export class PartsController {
  constructor(private readonly parts: PartsService) {}

  @Get()
  search(@Query() query: SearchPartsDto) {
    return this.parts.search(query);
  }

  @Get(':category/:id')
  getOne(@Param('category') category: PartCategory, @Param('id') id: string) {
    return this.parts.getOne(category, id);
  }
}

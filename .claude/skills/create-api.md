---
name: create-api
description: NestJS API 엔드포인트 생성 스킬
---

# Create API

## Usage
NestJS에서 새로운 API 엔드포인트(Module + Controller + Service + DTO)를 생성한다.

## Steps
1. DTO 정의 (create/update/response)
2. Service 비즈니스 로직 구현
3. Controller 라우트 및 데코레이터 설정
4. Module 등록

## Template
```typescript
// dto/create-item.dto.ts
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

// item.service.ts
@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemDto) {
    return this.prisma.item.create({ data: dto })
  }
}

// item.controller.ts
@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto)
  }
}
```

---
name: db-design
description: Prisma 스키마 설계 스킬
---

# DB Design

## Usage
Prisma 스키마에 새로운 모델을 설계하고 마이그레이션을 생성한다.

## Steps
1. `schema.prisma`에 모델 정의
2. 관계(relation) 설정
3. `npx prisma migrate dev --name <name>` 실행
4. `npx prisma generate` 실행

## Conventions
- 모델명: PascalCase 단수형
- 필드명: camelCase
- PK: `id String @id @default(cuid())`
- 타임스탬프: `createdAt`, `updatedAt` 기본 포함

## Template
```prisma
model Item {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  userId String
}
```

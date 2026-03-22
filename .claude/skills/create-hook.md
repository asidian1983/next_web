---
name: create-hook
description: React 커스텀 훅 생성 스킬
---

# Create Hook

## Usage
로직을 캡슐화하는 커스텀 React 훅을 생성한다.

## Steps
1. `hooks/use[HookName].ts` 생성
2. 반환 타입 명시
3. 에러 상태 처리 포함

## Template
```typescript
import { useState, useEffect } from 'react'

interface UseHookNameReturn {
  data: DataType | null
  isLoading: boolean
  error: Error | null
}

export function useHookName(param: string): UseHookNameReturn {
  const [data, setData] = useState<DataType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // logic
  }, [param])

  return { data, isLoading, error }
}
```

## Conventions
- 훅 이름은 `use` 접두사 필수
- 서버 상태는 React Query (`useQuery`, `useMutation`) 활용
- 클라이언트 상태는 Zustand 활용

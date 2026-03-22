---
name: create-component
description: React 컴포넌트 생성 스킬
---

# Create Component

## Usage
재사용 가능한 React 컴포넌트를 생성한다.

## Steps
1. `components/[category]/[ComponentName].tsx` 생성
2. Props 타입 정의
3. Tailwind로 스타일링
4. 필요 시 Storybook 스토리 추가

## Template
```tsx
interface Props {
  label: string
  onClick?: () => void
}

export function ComponentName({ label, onClick }: Props) {
  return (
    <div className="..." onClick={onClick}>
      {label}
    </div>
  )
}
```

## Structure
```
components/
├── ui/          # 공통 UI (Button, Input, Modal...)
├── layout/      # 레이아웃 (Header, Sidebar, Footer)
└── features/    # 기능별 컴포넌트
```

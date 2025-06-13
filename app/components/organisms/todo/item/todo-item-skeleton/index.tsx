import React from 'react'
import { Skeleton } from '@mantine/core'
import TodoItemLayoutSection from '../todo-item-layout-section'

const TodoItemSkeleton = () => {
  return (
    <TodoItemLayoutSection
      checkboxSection={
        <Skeleton
          height={22}
          circle
        />
      }
      titleSection={
        <Skeleton
          width={90}
          height={20}
        />
      }
      descriptionSection={
        <Skeleton
          width={40}
          height={12}
        />
      }
      actionSection={
        <>
          <div>
            <Skeleton
              width={26}
              height={24}
            />
          </div>

          <div>
            <Skeleton
              width={26}
              height={24}
            />
          </div>
        </>
      }
    />
  )
}

export default TodoItemSkeleton

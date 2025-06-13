import React from 'react'

const { VITE_APP_NAME } = import.meta.env

function MainPage() {
  return <div />
}

export function HydrateFallback() {
  return <div />
}

export default MainPage

export function meta() {
  return [
    { title: VITE_APP_NAME },
    { name: 'description', content: '기록이 생활이 되는 곳' }
  ]
}

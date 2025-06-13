import { index, layout, prefix, route } from '@react-router/dev/routes'

import type { RouteConfig } from '@react-router/dev/routes'

export default [
  layout('components/templates/layouts/default/index.tsx', [
    index('components/pages/main/index.tsx')
  ]),
  layout('components/templates/layouts/auth/not-logged-in/index.tsx', [
    ...prefix('auth', [
      ...prefix('sign-in', [
        index('components/pages/auth/sign-in/index.tsx'),
        route(
          'magic-link/result',
          'components/pages/auth/sign-in/magic-link/result/index.tsx'
        )
      ]),
      ...prefix('sign-up', [
        index('components/pages/auth/sign-up/index.tsx'),
        route(
          'magic-link/result',
          'components/pages/auth/sign-up/magic-link/result/index.tsx'
        )
      ]),
      ...prefix('callback', [index('components/pages/auth/callback/index.tsx')])
    ])
  ]),
  layout('components/templates/layouts/auth/logged-in/index.tsx', [
    layout('components/templates/layouts/todo/index.tsx', [
      ...prefix('todo', [
        route(':projectId', 'components/pages/todo/index.tsx')
      ])
    ])
  ])
] satisfies RouteConfig

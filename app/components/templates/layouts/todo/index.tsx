import React from 'react'
import { NavLink, Outlet, redirect } from 'react-router'

import {
  AppShell,
  Avatar,
  Burger,
  Container,
  Divider,
  Menu,
  Tooltip,
  UnstyledButton
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { HiOutlineChevronLeft, HiOutlineChevronDown } from 'react-icons/hi2'
import { IoIosLogOut } from 'react-icons/io'

import { LOGOUT_LABEL } from '~/constants'
import HoverButton from '~/components/atoms/button/hover-button'
import { useAuth } from '~/hooks/auth/use-auth'
import supabaseClient from '~/libs/supabase/client'
import type { Route } from '../../../templates/layouts/todo/+types'

export async function clientLoader({ params }: Route.LoaderArgs) {
  const profileData = await supabaseClient.from('profiles').select(`
    id,
    username
  `)

  const projectData = await supabaseClient
    .from('projects')
    .select(
      `
        id,
        title,
        type
      `
    )
    .order('created_at', { ascending: false })

  const isExistProject = projectData?.data?.find(
    data => data.id === params?.projectId
  )

  if (!isExistProject) {
    return redirect(`/todo/${projectData?.data?.[0]?.id}`)
  }

  return {
    profile: profileData?.data?.[0] || null,
    project: projectData?.data || []
  }
}

function TodoLayout({ loaderData }: Route.ComponentProps) {
  const [navbarOpened, navbarHandlers] = useDisclosure(false)
  const { handleLogout } = useAuth()

  const smGreaterThan = useMediaQuery('(min-width: 768px)')

  return (
    <AppShell
      navbar={{
        width: `var(--default-navbar-width)`,
        breakpoint: 'sm',
        collapsed: { desktop: navbarOpened, mobile: !navbarOpened }
      }}>
      <AppShell.Navbar>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Menu
                width={160}
                position="bottom-start">
                <Menu.Target>
                  <HoverButton>
                    <Avatar
                      name={loaderData?.profile?.username}
                      color="initials"
                      size={'sm'}
                    />

                    <p className="mx-2 h-6 max-w-30 truncate text-left text-[14px] leading-6 font-bold">
                      {loaderData?.profile?.username}
                    </p>

                    <div>
                      <HiOutlineChevronDown />
                    </div>
                  </HoverButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IoIosLogOut />}
                    onClick={handleLogout}>
                    <p className="text-xs">{LOGOUT_LABEL}</p>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>

            <div>
              <Tooltip label="사이드바 닫기">
                <UnstyledButton
                  onClick={navbarHandlers.toggle}
                  c={'var(--mantine-color-gray-9)'}>
                  <HiOutlineChevronLeft />
                </UnstyledButton>
              </Tooltip>
            </div>
          </div>

          <div>
            <Divider className="my-4" />
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between">
              <p className="font-bold text-[var(--mantine-color-gray-9)]">
                프로젝트
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {loaderData?.project?.map(data => (
                <li
                  key={data.id}
                  className="text-sm text-[var(--mantine-color-gray-8)]">
                  <HoverButton
                    renderRoot={props => {
                      return (
                        <NavLink
                          to={`/todo/${data?.id}`}
                          {...props}
                        />
                      )
                    }}
                    styles={{
                      inner: {
                        fontWeight: 400
                      }
                    }}
                    fullWidth>
                    # {data.title}
                  </HoverButton>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="relative">
          {(!smGreaterThan || navbarOpened) && (
            <div className="absolute top-4 left-4">
              <Tooltip label="사이드바 열기">
                <Burger
                  onClick={navbarHandlers.toggle}
                  size="sm"
                />
              </Tooltip>
            </div>
          )}

          <div>
            <Container size={'xl'}>
              <Outlet />
            </Container>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export function HydrateFallback() {
  return <div />
}

export default TodoLayout

import { Notification3, Search } from 'reicon-react'
import { Field } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

const _SearchInput = () => {
  return (
    <Field className="mx-auto max-w-sm">
      <InputGroup>
        <InputGroupInput
          id="input-group-url"
          placeholder="جستجو فاکتور یا مشتری"
        />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

const UserInfo = () => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>SG</AvatarFallback>
    </Avatar>
  )
}

export const NavHeader = () => {
  return (
    <header className="p-2">
      <nav className="flex items-center gap-x-2">
        <SidebarTrigger className={'ms-1 ml-auto'} />
        {/* <SearchInput /> */}
        <ModeToggle />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto"
        />
        <Button variant={'ghost'} size={'icon'}>
          <Notification3 />
        </Button>
        <UserInfo />
      </nav>
    </header>
  )
}

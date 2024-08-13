import { PropsWithChildren } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { cn } from '@/lib/utils'

import { itensNav, NavMainItem } from './NavMainItens'

export function NavMain({
  listaItensMenu,
  className,
  ...props
}: PropsWithChildren<{ listaItensMenu: Array<itensNav>; className?: string }>) {
  return (
    <nav
      className={cn(
        'flex items-center space-x-2 md:space-x-4 lg:space-x-6',
        className,
      )}
      {...props}
    >
      {listaItensMenu.map((itemNav) => {
        return (
          <NavMainItem
            key={uuidv4()}
            refRouter={itemNav.refRouter}
            titleItem={itemNav.titleItem}
            className={'hover:text-primary'}
          />
        )
      })}
    </nav>
  )
}

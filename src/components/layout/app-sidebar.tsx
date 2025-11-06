import { Home, UserRoundX, Truck, Settings, ChevronUp, Database } from 'lucide-react';
import { Link } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Menu items.
const items = [
  {
    title: 'Прием отчетов',
    url: '/',
    icon: Home,
  },
  {
    title: 'Авторизация',
    url: '/authorization',
    icon: UserRoundX,
  },
  {
    title: 'База данных',
    url: '/database',
    icon: Database,
  },
  {
    title: 'Отгрузка',
    url: '/shipment',
    icon: Truck,
  },
  {
    title: 'Настройки',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="">TERMET SERVICE</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer с пользователем */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>Профиль</DropdownMenuItem>
                {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
                <DropdownMenuItem>Выход</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

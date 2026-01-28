import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { useMatches } from 'react-router';
import { ThemeProvider } from '../shared/theme-provider';
import { ModeToggle } from '../shared/mode-toggle';

interface RouteHandle {
  title?: string;
}

interface RouteMatch {
  handle?: RouteHandle;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches() as RouteMatch[];

  const currentTitle = matches.find((m) => m.handle?.title)?.handle?.title ?? '';

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Левая панель */}
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-lg font-medium">{currentTitle}</h1>
              </div>
              <div>
                <ModeToggle />
              </div>
            </div>

            {/* content row */}
            <div className="flex min-w-0 flex-1 p-6">
              <main className="min-w-0 flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

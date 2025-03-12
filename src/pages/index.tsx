import { GitHubLogoIcon } from '@radix-ui/react-icons';
import {
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  CoffeeIcon,
  CompassIcon,
  HomeIcon,
  MailIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  ScrollTextIcon,
  ClipboardSignatureIcon,
  FileTextIcon,
  PlusIcon,
  Pencil,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { useActiveUser, useNdk } from 'nostr-hooks';
import { Link, Outlet, createBrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from './error';
import { ErrorPage } from './error/error-page';

// shadcn/ui コンポーネント
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/shared/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { useTheme } from '@/shared/components/theme-provider';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { LanguageSwitcher } from '@/shared/components/language-switcher';

import { ActiveUserWidget } from '@/features/active-user-widget';
import { LoginWidget } from '@/features/login-widget';
import { SearchWidget } from '@/features/search-widget';
import { TrendingNotesWidget } from '@/features/trending-notes-widget';
import { ZapWidget } from '@/features/zap-widget';

const Layout = () => {
  const { ndk } = useNdk();
  const { activeUser } = useActiveUser();
  const { setTheme, theme } = useTheme();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  // スクロール検出のためのイベントリスナー
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background">
      {/* ヘッダー - デスクトップ */}
      <header
        className={`hidden md:flex w-full border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img src="/nostribe-64.png" alt="PetitioNstr" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold">PetitioNstr</span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      {t('common.home')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/petitions">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      {t('common.petition')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <CompassIcon className="mr-2 h-4 w-4" />
                    {t('common.explore')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                      <li>
                        <Link to="/notifications" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <BellIcon className="h-6 w-6 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">{t('common.notifications')}</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t('notifications.checkReactions')}
                          </p>
                        </Link>
                      </li>
                      <li>
                        <SearchWidget>
                          <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md cursor-pointer">
                            <SearchIcon className="h-6 w-6 mb-2" />
                            <div className="mb-2 mt-4 text-lg font-medium">{t('common.search')}</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {t('search.searchUsersAndPosts')}
                            </p>
                          </div>
                        </SearchWidget>
                      </li>
                      <li className="col-span-2">
                        <Link to="/petitioning" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <Plus className="h-6 w-6 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">{t('common.startPetition')}</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t('petition.startPetitionDesc')}
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SearchWidget>
                    <Button variant="ghost" size="icon" aria-label={t('common.search')}>
                      <SearchIcon className="h-5 w-5" />
                    </Button>
                  </SearchWidget>
                </TooltipTrigger>
                <TooltipContent>{t('common.search')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t('common.theme')} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{theme === 'dark' ? t('common.switchToLightMode') : t('common.switchToDarkMode')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <LanguageSwitcher />
                </TooltipTrigger>
                <TooltipContent>{t('common.language')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {activeUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={activeUser.profile?.image} alt={activeUser.profile?.displayName || 'ユーザー'} />
                      <AvatarFallback>{activeUser.profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${activeUser.npub}`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {t('common.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks" className="flex items-center">
                      <BookmarkIcon className="mr-2 h-4 w-4" />
                      {t('common.bookmarks')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/petitioning" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('common.startPetition')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ActiveUserWidget />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginWidget />
            )}
          </div>
        </div>
      </header>

      {/* ヘッダー - モバイル */}
      <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('common.menu')}>
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <img src="/nostribe-64.png" alt="PetitioNstr" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold">PetitioNstr</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent">
                    <HomeIcon className="h-5 w-5" />
                    <span>{t('common.home')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/petitions" className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent">
                    <FileTextIcon className="h-5 w-5" />
                    <span>{t('common.petition')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/notifications" className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent">
                    <BellIcon className="h-5 w-5" />
                    <span>{t('common.notifications')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/bookmarks" className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent">
                    <BookmarkIcon className="h-5 w-5" />
                    <span>{t('common.bookmarks')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <SearchWidget>
                    <div className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent cursor-pointer">
                      <SearchIcon className="h-5 w-5" />
                      <span>{t('common.search')}</span>
                    </div>
                  </SearchWidget>
                </SheetClose>
                <Separator />
                <SheetClose asChild>
                  <Link to="/petitioning" className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent">
                    <Plus className="h-5 w-5" />
                    <span>{t('common.startPetition')}</span>
                  </Link>
                </SheetClose>
                <Separator />
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm text-muted-foreground">{t('common.theme')}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? (
                      <div className="flex items-center gap-2">
                        <SunIcon className="h-4 w-4" />
                        <span>{t('common.light')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MoonIcon className="h-4 w-4" />
                        <span>{t('common.dark')}</span>
                      </div>
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm text-muted-foreground">{t('common.language')}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => i18n.changeLanguage('ja')}
                      className={i18n.language === 'ja' ? 'bg-accent' : ''}
                    >
                      🇯🇵 日本語
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => i18n.changeLanguage('en')}
                      className={i18n.language === 'en' ? 'bg-accent' : ''}
                    >
                      🇺🇸 English
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  {activeUser ? <ActiveUserWidget /> : <LoginWidget />}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <img src="/nostribe-64.png" alt="PetitioNstr" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold">PetitioNstr</span>
          </Link>

          <div className="flex items-center gap-1">
            <SearchWidget>
              <Button variant="ghost" size="icon" aria-label={t('common.search')}>
                <SearchIcon className="h-5 w-5" />
              </Button>
            </SearchWidget>

            {activeUser ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/profile/${activeUser.npub}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activeUser.profile?.image} alt={activeUser.profile?.displayName || 'ユーザー'} />
                    <AvatarFallback>{activeUser.profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <LoginWidget />
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container py-4 md:py-6 lg:py-8 pb-16 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* サイドバー - デスクトップ */}
          <aside className="hidden md:block md:col-span-3 space-y-6 sticky top-20 self-start">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('common.quickAccess')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Link to="/" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors">
                  <HomeIcon className="h-5 w-5" />
                  <span>{t('common.home')}</span>
                </Link>
                <Link to="/petitions" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors">
                  <FileTextIcon className="h-5 w-5" />
                  <span>{t('common.petition')}</span>
                </Link>
                <Link to="/notifications" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors">
                  <BellIcon className="h-5 w-5" />
                  <span>{t('common.notifications')}</span>
                </Link>
                <Link to="/bookmarks" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors">
                  <BookmarkIcon className="h-5 w-5" />
                  <span>{t('common.bookmarks')}</span>
                </Link>
                <SearchWidget>
                  <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
                    <SearchIcon className="h-5 w-5" />
                    <span>{t('common.search')}</span>
                  </div>
                </SearchWidget>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/petitioning">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('common.startPetition')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {activeUser && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('common.profile')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={activeUser.profile?.image} alt={activeUser.profile?.displayName || t('common.user')} />
                      <AvatarFallback>{activeUser.profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="font-medium">{activeUser.profile?.displayName || t('common.user')}</h3>
                      <p className="text-sm text-muted-foreground">@{activeUser.profile?.name || activeUser.npub.slice(0, 8)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/profile/${activeUser.npub}`}>
                      {t('common.viewProfile')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </aside>

          {/* メインコンテンツエリア */}
          <div className="md:col-span-9 h-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* モバイルナビゲーション */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="container flex items-center justify-between py-2">
          <Link to="/" className="flex flex-col items-center gap-1 p-1">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs">{t('common.home')}</span>
          </Link>

          <Link to="/petitions" className="flex flex-col items-center gap-1 p-1">
            <FileTextIcon className="h-6 w-6" />
            <span className="text-xs">{t('common.petition')}</span>
          </Link>

          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12" asChild>
            <Link to="/petitioning">
              <Plus className="h-6 w-6" />
            </Link>
          </Button>

          <Link to="/notifications" className="flex flex-col items-center gap-1 p-1">
            <BellIcon className="h-6 w-6" />
            <span className="text-xs">{t('common.notifications')}</span>
          </Link>

          <SearchWidget>
            <div className="flex flex-col items-center gap-1 p-1 cursor-pointer">
              <SearchIcon className="h-6 w-6" />
              <span className="text-xs">{t('common.search')}</span>
            </div>
          </SearchWidget>
        </div>
      </nav>


    </div>
  );
};

const HomePage = () => import('./home');
const NotePage = () => import('./note');
const ProfilePage = () => import('./profile');
const MessagesPage = () => import('./messages');
const NotificationsPage = () => import('./notifications');
const PetitionsPage = () => import('./petitions-list');
const PetitionPage = () => import('./petition');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <ErrorBoundary>
        <ErrorPage />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/',
        async lazy() {
          return { Component: (await HomePage()).HomePage };
        },
      },
      {
        path: '/note/:noteId',
        async lazy() {
          return { Component: (await NotePage()).NotePage };
        },
      },
      {
        path: '/profile/:npub',
        async lazy() {
          return { Component: (await ProfilePage()).ProfilePage };
        },
      },
      {
        path: '/messages',
        async lazy() {
          return { Component: (await MessagesPage()).MessagesPage };
        },
      },
      {
        path: '/messages/:npub',
        async lazy() {
          return { Component: (await MessagesPage()).MessagesPage };
        },
      },
      {
        path: '/notifications',
        async lazy() {
          return { Component: (await NotificationsPage()).NotificationsPage };
        },
      },
      {
        path: '/petitions',
        async lazy() {
          return { Component: (await PetitionsPage()).PetitionsPage };
        },
      },
      {
        path: '/petition/:petitionId',
        async lazy() {
          return { Component: (await PetitionPage()).PetitionPage };
        }
      }
    ],
  },
]);

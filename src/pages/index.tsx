import {
  BellIcon,
  FileTextIcon,
  HomeIcon,
  MenuIcon,
  MoonIcon,
  Plus,
  PowerIcon,
  SearchIcon,
  SunIcon,
  User,
  InfoIcon
} from 'lucide-react';
import { useActiveUser, useLogin, useRealtimeProfile } from 'nostr-hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from './error';
import { ErrorPage } from './error/error-page';

// shadcn/ui コンポーネント
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Separator } from '@/shared/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/shared/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

import { LanguageSwitcher } from '@/shared/components/language-switcher';
import { useTheme } from '@/shared/components/theme-provider';

import { LoginWidget } from '@/features/login-widget';

const Layout = () => {
  const { activeUser } = useActiveUser();
  const { profile } = useRealtimeProfile(activeUser?.pubkey);
  const { logout } = useLogin();
  const { setTheme, theme } = useTheme();
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
        className={`hidden md:flex w-full border-b fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8">
                <img src="/petitionstr.png" alt="PetitioNstr" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold">PetitioNstr</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">


            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('common.theme')}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {theme === 'dark' ? t('common.switchToLightMode') : t('common.switchToDarkMode')}
                </TooltipContent>
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
                      <AvatarImage src={profile?.image} alt={profile?.displayName} />
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <PowerIcon className="w-4 h-4 mr-2" />
                    Logout
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
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                    <img
                      src="/petitionstr.png"
                      alt="PetitioNstr"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xl font-bold">PetitioNstr</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {activeUser && (
                  <SheetClose asChild>
                    <Link
                      to={`/profile/${activeUser.npub}`}
                      className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={profile?.image}
                          alt={profile?.displayName || 'ユーザー'}
                        />
                        <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span>{t('common.profile')}</span>
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span>{t('common.home')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/petitions"
                    className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                  >
                    <FileTextIcon className="h-5 w-5" />
                    <span>{t('common.petition')}</span>
                  </Link>
                </SheetClose>
                {activeUser && (
                  <SheetClose asChild>
                    <Link
                      to="/notifications"
                      className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                    >
                      <BellIcon className="h-5 w-5" />
                      <span>{t('common.notifications')}</span>
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link
                    to="/search"
                    className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <SearchIcon className="h-5 w-5" />
                    <span>{t('common.search')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                  >
                    <InfoIcon className="h-5 w-5" />
                    <span>{t('common.about')}</span>
                  </Link>
                </SheetClose>
                <Separator />
                <SheetClose asChild>
                  <Link
                    to="/petitioning"
                    className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-accent"
                  >
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
                <div className="flex flex-col gap-2 px-2 py-1">
                  <span className="text-sm text-muted-foreground">{t('common.language')}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => i18n.changeLanguage('ja')}
                      className={`w-1/2 ${i18n.language === 'ja' ? 'bg-accent' : ''}`}
                    >
                      日本語
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => i18n.changeLanguage('en')}
                      className={`w-1/2 ${i18n.language === 'en' ? 'bg-accent' : ''}`}
                    >
                      English
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <img src="/petitionstr.png" alt="PetitioNstr" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold">PetitioNstr</span>
          </Link>

          <div className="flex items-center gap-1">

            {activeUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.image} alt={profile?.displayName || 'ユーザー'} />
                      <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <PowerIcon className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginWidget />
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container pt-20 md:pt-24 pb-16 md:pb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* サイドバー - デスクトップ */}
          <aside className="hidden md:block w-[280px] space-y-6 fixed top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('common.quickAccess')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>{t('common.home')}</span>
                </Link>
                <Link
                  to="/petitions"
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <FileTextIcon className="h-5 w-5" />
                  <span>{t('common.petition')}</span>
                </Link>
                {activeUser && (
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <BellIcon className="h-5 w-5" />
                    <span>{t('common.notifications')}</span>
                  </Link>
                )}
                <Link
                  to="/search"
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <SearchIcon className="h-5 w-5" />
                  <span>{t('common.search')}</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <InfoIcon className="h-5 w-5" />
                  <span>{t('common.about')}</span>
                </Link>
                {activeUser && (
                  <Link
                    to={`/profile/${activeUser.npub}`}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={profile?.image} alt={profile?.displayName || 'ユーザー'} />
                      <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span>{t('common.profile')}</span>
                  </Link>
                )}
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
          </aside>

          {/* メインコンテンツエリア */}
          <div className="w-full md:ml-[310px] md:w-[calc(100%-310px)]">
            <Outlet />
          </div>
        </div>
      </main>


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
const PetitioningPage = () => import('./petitioning');
const SearchPage = () => import('./search');
const AboutPage = () => import('./about');

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
        },
      },
      {
        path: 'petitioning',
        async lazy() {
          return { Component: (await PetitioningPage()).PetitioningPage };
        },
      },
      {
        path: '/search',
        async lazy() {
          return { Component: (await SearchPage()).SearchPage };
        },
      },
      {
        path: '/about',
        async lazy() {
          return { Component: (await AboutPage()).AboutPage };
        },
      },
    ],
  },
]);

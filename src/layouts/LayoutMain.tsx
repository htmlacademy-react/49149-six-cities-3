import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import { Paths } from '../enums/paths';
import { useTypedSelector } from '../hooks/useTypedSelector';

export default function LayoutMain() {
  const { pathname } = useLocation() as { pathname: Paths };
  const isMain = pathname === Paths.Main;
  const isLogin = pathname === Paths.Login;
  const activeCity = useTypedSelector((state: { app: { activeCity: string } }) => state.app.activeCity);
  const isMainCity = pathname === (Paths.MainCity.replace(':city', String(activeCity)) as Paths);
  const authorizationStatus = useTypedSelector((state) => state.app.authorizationStatus);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`page ${isMain || isMainCity ? 'page--gray page--main' : ''} ${isLogin ? 'page--gray page--login' : ''} `}>
      <Header hasAccess={authorizationStatus} />
      <Outlet />
    </div>
  );
}

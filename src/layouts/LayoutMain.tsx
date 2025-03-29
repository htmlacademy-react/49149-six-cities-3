import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Paths } from '../enums/paths';
import { AuthStatus } from '../enums/auth';

export default function LayoutMain() {
  const { pathname } = useLocation() as { pathname: Paths };
  const isMain = pathname === Paths.Main;
  const isLogin = pathname === Paths.Login;

  return (
    <div className={`page ${isMain ? 'page--gray page--main' : ''} ${isLogin ? 'page--gray page--login' : ''} `}>
      <Header hasAccess={AuthStatus.NoAuth} />
      <Outlet />
    </div>
  );
}

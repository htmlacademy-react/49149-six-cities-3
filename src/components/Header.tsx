import { Link, useLocation } from 'react-router-dom';

import { Paths } from '../enums/paths';
import { AuthStatus } from '../enums/auth';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { dropToken, getToken } from '../services/token';
import { useTypedActions } from '../hooks/useTypedActions';
import { User } from '../types';
import { useGetFavoriteQuery, useLogoutUserMutation } from '../services/api';

export default function Header({ hasAccess }: { hasAccess: AuthStatus }) {
  const { pathname } = useLocation();
  const typePathname = pathname as Paths;
  const isMain = typePathname === Paths.Main;
  const isLogin = typePathname === Paths.Login;
  const user = useTypedSelector((state) => state.app.user);
  const { setUser, setAuthorizationStatus } = useTypedActions();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const token = getToken();
  const { data: favorites, isLoading: isLoadingFavorite } = useGetFavoriteQuery();

  const handleLogout = () => {
    try {
      logoutUser().unwrap();
      dropToken();
      setAuthorizationStatus(AuthStatus.NoAuth);
      setUser({} as User);
    } catch (error) {
      // console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header className='header'>
      <div className='container'>
        <div className='header__wrapper'>
          <div className='header__left'>
            {isMain ? (
              <a className='header__logo-link header__logo-link--active'>
                <img className='header__logo' src='img/logo.svg' alt='6 cities logo' width='81' height='41' />
              </a>
            ) : (
              <Link className='header__logo-link' to={Paths.Main}>
                <img className='header__logo' src='img/logo.svg' alt='6 cities logo' width='81' height='41' />
              </Link>
            )}
          </div>
          {isLogin ? null : (
            <nav className='header__nav'>
              <ul className='header__nav-list'>
                {hasAccess === AuthStatus.Auth && token ? (
                  <>
                    <li className='header__nav-item user'>
                      <Link className='header__nav-link header__nav-link--profile' to={Paths.Favorites}>
                        <div className='header__avatar-wrapper user__avatar-wrapper' style={{ backgroundImage: `url(${user?.avatarUrl})` }}></div>
                        <span className='header__user-name user__name'>{user?.email ?? '...'}</span>
                        <span className='header__favorite-count'>{isLoadingFavorite ? '...' : favorites?.length}</span>
                      </Link>
                    </li>

                    <li className='header__nav-item'>
                      <Link to={Paths.Main} onClick={handleLogout} className={`header__nav-link ${isLoading ? 'header__nav-link--disabled' : ''}`}>
                        <span className='header__signout'>Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className='header__nav-item user'>
                    <Link className='header__nav-link header__nav-link--profile' to={Paths.Login}>
                      <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                      <span className='header__login'>Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

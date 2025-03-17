import { Link, useLocation } from 'react-router-dom';
import { Paths } from '../enums/paths';
import { AuthStatus } from '../enums/auth';

export default function Header({ hasAccess }: { hasAccess: AuthStatus }) {
  const { pathname } = useLocation();
  const typePathname = pathname as Paths;
  const isMain = typePathname === Paths.Main;
  const isLogin = typePathname === Paths.Login;
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
                {hasAccess === AuthStatus.Auth ? (
                  <>
                    <li className='header__nav-item user'>
                      <a className='header__nav-link header__nav-link--profile' href='#'>
                        <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                        <span className='header__user-name user__name'>Oliver.conner@gmail.com</span>
                        <span className='header__favorite-count'>3</span>
                      </a>
                    </li>

                    <li className='header__nav-item'>
                      <a className='header__nav-link' href='#'>
                        <span className='header__signout'>Sign out</span>
                      </a>
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

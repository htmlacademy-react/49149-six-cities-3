import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { useLoginUserMutation } from '../services/api';
import { useTypedActions } from '../hooks/useTypedActions';
import { AuthStatus } from '../enums/auth';
import { saveToken } from '../services/token';
import { ApiError } from '../types';
import { handleError } from '../services/errorHandler';
import { Paths } from '../enums/paths';

type FromState = {
  from: string;
};

export default function Login() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation() as Location<FromState>;

  const from = location.state?.from || Paths.Main;
  const { setAuthorizationStatus, setUser } = useTypedActions();

  const handleFormSubmitAsync = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!loginRef.current || !passwordRef.current) {
      return;
    }

    try {
      const credentials = {
        email: loginRef.current.value,
        password: passwordRef.current.value,
      };

      const result = await loginUser(credentials).unwrap();
      setAuthorizationStatus(AuthStatus.Auth);
      saveToken(result.token);
      setUser(result);

      navigate(from, { replace: true });
    } catch (error) {
      const typeError = error as ApiError;
      handleError({ error: typeError, setAuthorizationStatus, setUser });
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    void handleFormSubmitAsync(event);
  };

  return (
    <main className='page__main page__main--login'>
      <div className='page__login-container container'>
        <section className='login'>
          <h1 className='login__title'>Sign in</h1>
          <form className='login__form form' action='#' method='post' onSubmit={handleFormSubmit}>
            <div className='login__input-wrapper form__input-wrapper'>
              <label className='visually-hidden'>E-mail</label>
              <input ref={loginRef} className='login__input form__input' type='email' name='email' placeholder='Email' required />
            </div>
            <div className='login__input-wrapper form__input-wrapper'>
              <label className='visually-hidden'>Password</label>
              <input ref={passwordRef} className='login__input form__input' type='password' name='password' placeholder='Password' required />
            </div>
            <button className='login__submit form__submit button' type='submit' disabled={isLoading}>
              Sign in
            </button>
          </form>
        </section>
        <section className='locations locations--login locations--current'>
          <div className='locations__item'>
            <a className='locations__item-link' href='#'>
              <span>Amsterdam</span>
            </a>
          </div>
        </section>
      </div>
      <ToastContainer />
    </main>
  );
}

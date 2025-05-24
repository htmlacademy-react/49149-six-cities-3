import { Location, Navigate, useLocation } from 'react-router-dom';
import { Paths } from '../enums/paths';
import { useTypedSelector } from '../hooks/useTypedSelector';

type PrivateRouteProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

type FromState = {
  from: string;
}

export default function PrivateRoute({ children, onlyUnAuth = false }: PrivateRouteProps) {
  const location: Location<FromState> = useLocation() as Location<FromState>;
  const user = useTypedSelector((state) => state.app.user);

  if (onlyUnAuth && user) {
    const from = location.state?.from || Paths.Main;
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to={Paths.Login}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

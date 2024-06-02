import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user';

type Props = {
  children: JSX.Element;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
  const user = useUserStore(state => state.user);

  const location = useLocation();

  if (!user) {
    return <Navigate to='/auth' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

const PrivateRoute = ({ children } : {children: any}) => {
  const user = useSelector((state: RootState) => state.user.user);

  return !!user ? children : <Navigate to="/" />;
};

export default PrivateRoute;

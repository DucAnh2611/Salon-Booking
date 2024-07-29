import { ROUTER_PATH } from "@/constants/router.constant";
import { TOKEN } from "@/constants/token.constant";
import { authTokenAction } from "@/lib/redux/actions/auth.action";
import { authSelector } from "@/lib/redux/selector";
import { useAppDispatch } from "@/lib/redux/store";
import React, { ComponentType, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface WithAuthProps {
    // Add any additional props that might be required
}

const withAuth = <P extends object>(
    WrappedComponent: ComponentType<P>
): React.FC<P & WithAuthProps> => {
    const WithAuth: React.FC<P & WithAuthProps> = (props) => {
        const { authentication, user } = useSelector(authSelector);
        const dispatch = useAppDispatch();

        const navigate = useNavigate();

        useEffect(() => {
            if (!authentication && localStorage.getItem(TOKEN.LCS)) {
                dispatch(authTokenAction());
                return;
            }
            if (!authentication && !user) {
                navigate(ROUTER_PATH.LOGIN);
            }
        }, [authentication]);

        return <WrappedComponent {...props} />;
    };

    return WithAuth;
};

export default withAuth;

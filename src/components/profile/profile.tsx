import { Typography } from "@material-ui/core";
import { useContext } from "react";
import AuthenticationContext from "../authentication";

const ProfileView = () => {
    const { user } = useContext(AuthenticationContext);

    return (<>
        <Typography variant="h4">Profile</Typography>
        <Typography>Welcome, {user.username}!</Typography>
    </>);
};

export default ProfileView;

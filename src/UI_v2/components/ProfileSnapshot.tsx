import {Avatar, Box, IconButton, Tooltip} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../story-generator-frontend/src/utils/redux/store";
import {logout} from "../../../../story-generator-frontend/src/utils/redux/userSlice";
import {changePage} from "../../../../story-generator-frontend/src/utils/redux/appSlice";


const ProfileSnapshot = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const user = (useSelector((state: RootState) => state.user.user));
    const dispatch = useDispatch();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        setAnchorElUser(null);

        localStorage.removeItem("email")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        localStorage.removeItem("jwt")

        dispatch(changePage('auth'))
        dispatch(logout());
    }

    return (
        <Box sx={{flexGrow: 0}}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                    <Avatar alt={`${user?.firstName} ${user?.lastName}`} src="/static/images/avatar/2.jpg"/>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{mt: '45px'}}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem key={'logout'} onClick={handleLogout}>
                    <Typography sx={{textAlign: 'center'}}>Log out</Typography>
                </MenuItem>
                {/*{settings.map((setting) => (*/}
                {/*    <MenuItem key={setting} onClick={handleCloseUserMenu}>*/}
                {/*        <Typography sx={{textAlign: 'center'}}>{setting}</Typography>*/}
                {/*    </MenuItem>*/}
                {/*))}*/}
            </Menu>
        </Box>
    )
}

export default ProfileSnapshot;

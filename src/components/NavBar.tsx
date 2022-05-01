import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"

const NavBar = ({ onLogout }) => {
    return (
        <AppBar position="fixed">
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <Box>
                    <LocalFireDepartmentIcon sx={{ fontSize: "35px" }} />
                </Box>
                <Typography variant="h6" component="p">
                    Events
                </Typography>
                <Button onClick={onLogout} color="inherit">
                    Log out
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar

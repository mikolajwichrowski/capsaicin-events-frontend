import React, { useState } from "react"
import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Typography,
} from "@mui/material"
import { useFormik } from "formik"
import { useQuery } from "react-query"
import * as yup from "yup"
import { useNavigate } from "react-router-dom"

const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup
        .string()
        .min(8, "Password should be of minimum 8 characters length")
        .required("Password is required"),
})

const Login = () => {
    const navigate = useNavigate()
    const [authenticationOrLogin, setAuthenticationOrLogin] =
        useState<string>("authenticate")
    const [userData, setUserData] = useState<object | null>(null)
    const [isHttpError, setIsHttpError] = useState<boolean>(false)

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setUserData(values),
    })

    const { isError, isLoading } = useQuery(
        "userLogin",
        () =>
            fetch(`/api/${authenticationOrLogin}`, {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    setIsHttpError(true)
                }
            }),
        {
            enabled: !!userData,
            retry: false,
            retryOnMount: true,
            useErrorBoundary: true,
            onSuccess: (data) => {
                if (typeof data !== "object") {
                    setIsHttpError(true)
                    setUserData(null)
                    return
                }
                navigate("/")
            },
        }
    )

    if (isLoading) {
        return null
    }

    return (
        <Box
            sx={{
                padding: "10px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "50px",
                }}
            >
                <Typography variant="h4">Capcaisin Events</Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ flex: 1 }}></Box>
                <Typography sx={{ color: "red", flex: 1 }}>
                    {isError || (isHttpError && "Wrong username or password")}
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={authenticationOrLogin}
                    onChange={(event, value: string) =>
                        setAuthenticationOrLogin(value)
                    }
                >
                    <ToggleButton value="authenticate">Login</ToggleButton>
                    <ToggleButton value="register">Register</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        marginBottom: "10px",
                        marginTop: "10px",
                        "> div": { marginBottom: "10px" },
                    }}
                >
                    <TextField
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.username &&
                            Boolean(formik.errors.username)
                        }
                        helperText={
                            formik.touched.username && formik.errors.username
                        }
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                    />
                </Box>
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                >
                    {authenticationOrLogin === "authenticate"
                        ? "Login"
                        : "Register"}
                </Button>
            </form>
        </Box>
    )
}

export default Login

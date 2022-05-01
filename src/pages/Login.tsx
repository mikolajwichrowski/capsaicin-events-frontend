import React, { useState } from "react"
import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
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

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => setUserData(values),
    })

    const { isError, isLoading, data } = useQuery(
        "userLogin",
        () =>
            fetch(`/api/${authenticationOrLogin}`, {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()),
        {
            enabled: !!userData,
            retry: false,
            retryOnMount: true,
            onError: (err) => {
                console.error(err)
                setUserData(null)
            },
            onSuccess: () => {
                navigate("/")
            },
        }
    )

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <ToggleButtonGroup
                color="primary"
                exclusive
                value={authenticationOrLogin}
                onChange={(event, value: string) =>
                    setAuthenticationOrLogin(value)
                }
            >
                <ToggleButton value="authenticate">Authenticate</ToggleButton>
                <ToggleButton value="register">Register</ToggleButton>
            </ToggleButtonGroup>
            {isError && <div>Wrong username or password</div>}
            <form onSubmit={formik.handleSubmit}>
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
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default Login

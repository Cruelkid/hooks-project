import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const loginFormReducer = (state, action) => {
    if (action.type === "USER_EMAIL_INPUT") {
        return { value: action.val, isValid: action.val.includes("@") };
    }

    if (action.type === "EMAIL_UNFOCUSED") {
        return { value: state.value, isValid: state.value.includes("@") };
    }

    if (action.type === "USER_PASSWORD_INPUT") {
        return { value: action.val, isValid: action.val.trim().length > 6 };
    }

    if (action.type === "PASSWORD_UNFOCUSED") {
        return { value: state.value, isValid: state.value.trim().length > 6 };
    }

    return { value: "", isValid: false };
};

const Login = (props) => {
    const authCtx = useContext(AuthContext);
    // const [enteredEmail, setEnteredEmail] = useState("");
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState("");
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, emailDispatcher] = useReducer(loginFormReducer, {
        value: "",
        isValid: null,
    });

    const [passwordState, passwordDispatcher] = useReducer(loginFormReducer, {
        value: "",
        isValid: null,
    });

    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        const identifier = setTimeout(() => {
            setFormIsValid(emailIsValid && passwordIsValid);
        }, 500);

        return () => {
            clearTimeout(identifier);
        };
    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event) => {
        emailDispatcher({ type: "USER_EMAIL_INPUT", val: event.target.value });

        setFormIsValid(
            event.target.value.includes("@") && passwordIsValid
        );
    };

    const passwordChangeHandler = (event) => {
        passwordDispatcher({
            type: "USER_PASSWORD_INPUT",
            val: event.target.value,
        });

        setFormIsValid(emailIsValid && passwordIsValid);
    };

    const validateEmailHandler = () => {
        emailDispatcher({ type: "EMAIL_UNFOCUSED" });
    };

    const validatePasswordHandler = () => {
        passwordDispatcher({ type: "PASSWORD_UNFOCUSED" });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        authCtx.onLogin(emailState.value, passwordState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    value={emailState.value}
                    onChangeHandler={emailChangeHandler}
                    onBlurHandler={validateEmailHandler}
                    isValid={emailIsValid}
                    type="email"
                    id="email"
                    label="E-Mail"
                />

                <Input
                    value={passwordState.value}
                    onChangeHandler={passwordChangeHandler}
                    onBlurHandler={validatePasswordHandler}
                    isValid={passwordIsValid}
                    type="password"
                    id="password"
                    label="Password"
                />

                <div className={classes.actions}>
                    <Button
                        type="submit"
                        className={classes.btn}
                        disabled={!formIsValid}
                    >
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;

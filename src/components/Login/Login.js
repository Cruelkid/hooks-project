import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const loginFormReducer = (state, action) => {
    if (action.type === "USER_EMAIL_INPUT") {
        return {value: action.val, isValid: action.val.includes("@")};
    }

    if (action.type === "EMAIL_UNFOCUSED") {
        return {value: state.value, isValid: state.value.includes("@")};
    }
    
    if (action.type === "USER_PASSWORD_INPUT") {
        return { value: action.val, isValid: action.val.trim().length > 6 };
    }

    if (action.type === "PASSWORD_UNFOCUSED") {
        return { value: state.value, isValid: state.value.trim().length > 6 };
    }

    return { value: "", isValid: false };
}

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
            event.target.value.includes("@") && passwordState.isValid
        );
    };

    const passwordChangeHandler = (event) => {
        passwordDispatcher({
            type: "USER_PASSWORD_INPUT",
            val: event.target.value,
        });

        setFormIsValid(emailState.isValid && passwordState.isValid);
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
                <div
                    className={`${classes.control} ${
                        emailState.isValid === false ? classes.invalid : ""
                    }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${
                        passwordState.isValid === false ? classes.invalid : ""
                    }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
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

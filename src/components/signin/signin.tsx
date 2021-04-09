import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form";
import { Redirect, useLocation } from "react-router-dom"
import AuthenticationContext from "../authentication"

type SigninFormFields = {
    username: string,
    password: string
}

export const Signin = () => {

    const {register, handleSubmit, errors} = useForm<SigninFormFields>();
    
    const authContext = useContext(AuthenticationContext)

    const [redirectToReferrer, setRedirectToReferrer] = useState(false)
    const { state } = useLocation<any>()

    const handleLogin = (formData: SigninFormFields) => {
        authContext.authenticate({username: formData.username, password: formData.password}).then(_ => setRedirectToReferrer(true));
    }

    if (redirectToReferrer === true) {
        return <Redirect to={state?.from || '/'} />
    }

    return (<>
        <p>Type username of mocked user (temporary)</p>
        <form onSubmit={handleSubmit(handleLogin)}>
            <label>Username: </label>
            <input name="username" ref={register({required: true, maxLength: 64})}/>
            {errors.username && 'Required and max length is 64.'}
            <br/>

            {/* <label>Password: </label>
            <input name="password" type="password" ref={register({required: true, maxLength: 64})}/>
            {errors.password && 'Required and max length is 64.'}
            <br/> */}

            <button type="submit">Sign-in</button>
        </form>
    </>)
}

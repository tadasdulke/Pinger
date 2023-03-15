import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Link } from 'react-router-dom';

import { Button, withErrorWrapper, TextInput } from '@Common'
import { ROUTES } from '@Router';
import { authenticate, setUserName, setUserId } from '@Store/slices/auth';
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems'

import useLogin from './hooks/useLogin';

const LoginForm = ({errorHandler}) => {
    const FIELDS = {
        USERNAME: 'username',
        PASSWORD: 'password',
    }

    const {loaded, sendAction} = useLogin(errorHandler);
    const dispath = useDispatch();

    const handleSubmit = async ({username, password}) => {
        const response = await sendAction(username, password);

        if(response.status === 200) {
            const { id, userName } = response.data;

            dispath(authenticate());
            dispath(setUserId(response.data.id));
            dispath(setUserName(response.data.userName));
            localStorage.setItem(LOCAL_STORAGE_ITEMS.IS_AUTHENTICATED, true);
            localStorage.setItem(LOCAL_STORAGE_ITEMS.USER_ID, id);
            localStorage.setItem(LOCAL_STORAGE_ITEMS.USER_NAME, userName);
        }
    }

    return (
        <div className="bg-white p-[32px] rounded-[3px] drop-shadow-2xl">
            <h1 className="text-2xl text-center font-medium">
                Login
            </h1>
            <Formik 
                initialValues={{ [FIELDS.USERNAME]: "", [FIELDS.PASSWORD]: "" }} 
                onSubmit={handleSubmit}
                validationSchema={Yup.object().shape({
                    [FIELDS.USERNAME]: Yup.string().required("Required"),
                    [FIELDS.PASSWORD]: Yup.string().required("Required")
                })}    
            >
                {({values, handleChange}) => (
                    <Form className="flex flex-col">
                        <Field 
                            type="text"
                            name={FIELDS.USERNAME}
                            label="Email"
                            component={TextInput}
                            value={values.username}
                            onChange={handleChange}
                            wrapperClassName="mb-[20px]"
                        />
                        <Field 
                            type="password" 
                            name={FIELDS.PASSWORD}
                            label="Password"
                            component={TextInput}
                            value={values.password}
                            onChange={handleChange}
                        />
                        <Button type="submit" className="mt-[20px] mb-[10px]">
                            Login
                        </Button>
                        <span className="flex">
                            <p className="mr-[10px]">Need an account?</p>
                            <Link className="text-cyan-600 hover:text-cyan-900 hover:underline" to={ROUTES.REGISTER}>Register</Link>
                        </span>
                    </Form>  
                )}
            </Formik>   
        </div>
    )
}

export default withErrorWrapper(LoginForm);
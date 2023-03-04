import React from 'react';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from 'react-router-dom';

import { Button, withErrorWrapper, TextInput } from '@Common'
import { ROUTES } from '@Router';

import useRegistration from './hooks/useRegistration';

const RegisterForm = ({errorHandler}) => {
    const FIELDS = {
        EMAIL: 'email',
        USERNAME: 'username',
        PASSWORD: 'password',
    }

    const {loaded, sendAction} = useRegistration(errorHandler);
    const navigate = useNavigate();

    const handleSubmit = async ({email, username, password}) => {
        const response = await sendAction(email, username, password);
        console.log(response)
        
        if(response.status === 200) {
            navigate(ROUTES.LOGIN)
        }
    }

    return (
        <div className="bg-white p-[32px] rounded-[3px] drop-shadow-2xl">
            <h1 className="text-2xl text-center font-medium">
                Sign up
            </h1>
            <Formik 
                initialValues={{ 
                    [FIELDS.EMAIL]: "",
                    [FIELDS.PASSWORD]: "",
                    [FIELDS.USERNAME]: ""
                }} 
                onSubmit={handleSubmit}
                validationSchema={Yup.object().shape({
                    [FIELDS.EMAIL]: Yup.string().email("Email format is invalid").required("Required"),
                    [FIELDS.USERNAME]: Yup.string().required("Required"),
                    [FIELDS.PASSWORD]: Yup.string().required("Required")
                })}    
            >
                {({values, handleChange}) => (
                    <Form className="flex flex-col">
                        <Field 
                            type="text"
                            name={FIELDS.EMAIL}
                            label="Email"
                            component={TextInput}
                            value={values.email}
                            onChange={handleChange}
                            wrapperClassName="mb-[20px]"
                        />
                        <Field 
                            type="text"
                            name={FIELDS.USERNAME}
                            label="Username"
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
                            Sign up
                        </Button>
                        <span className="flex">
                            <p className="mr-[10px]">Already have an account?</p>
                            <Link className="text-cyan-600 hover:text-cyan-900 hover:underline" to={ROUTES.LOGIN}>Login</Link>
                        </span>
                    </Form>  
                )}
            </Formik>   
        </div>
    )
}

export default withErrorWrapper(RegisterForm);
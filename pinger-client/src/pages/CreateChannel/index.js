import React from 'react';
import {Row, Col} from 'react-grid-system';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Button, TextInput, withErrorWrapper } from '@Common'

import useCreateChannel from './hooks/useCreateChannel'

const CreateChannel = ({errorHandler}) => {
    const { createChannel } = useCreateChannel(errorHandler)

    const FIELDS = {
        NAME: "NAME",
    }

    const handleSubmit = async (values) => {
        await createChannel(values[FIELDS.NAME])
    }

    return (
        <Row>
            <Col lg={7}>
                <div className="text-white pt-[30px] px-[30px]">
                    <h1 className="text-3xl">
                        Create channel
                    </h1>
                    <p className="mt-[10px]">
                        Channels are place where multiple members of the chatspace can communicate.
                    </p>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={{
                            [FIELDS.NAME]: ''
                        }}
                        validationSchema={Yup.object().shape({
                            [FIELDS.NAME]: Yup.string().required("Required"),
                        })}    
                    >
                        {({values, handleChange}) => (
                            <Form className="flex flex-col mt-[40px]">
                                <Field 
                                    type="text"
                                    name={FIELDS.NAME}
                                    label="Channel name"
                                    component={TextInput}
                                    value={values[FIELDS.NAME]}
                                    onChange={handleChange}
                                    labelClassName="text-white"
                                    wrapperClassName="mb-[20px] text-black"
                                />
                                <Button type="submit" className="my-[10px]">
                                    Create
                                </Button>
                            </Form>  
                        )}
                    </Formik>
                </div>       
            </Col>
        </Row>
    )
}

export default withErrorWrapper(CreateChannel);
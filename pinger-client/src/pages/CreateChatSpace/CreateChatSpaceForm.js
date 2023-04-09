import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import {
  Button, TextInput, useApiAction,
} from '@Common';
import createChatSpace from './services/createChatSpace';

function CreateChatSpaceForm() {
  const navigate = useNavigate();
  const FIELDS = {
    NAME: 'name',
  };

  const { sendAction } = useApiAction((name) => createChatSpace(name));

  const handleSubmit = async (values) => {
    const name = values[FIELDS.NAME];
    const {status} = await sendAction(name);
    
    if(status === 204) {
      navigate(ROUTES.CHATSPACES)
    }
  };

  return (
    <div className="bg-white p-[32px] rounded-[3px] drop-shadow-2xl">
      <h1 className="text-2xl text-center font-medium">
        Create chatspace
      </h1>
      <Formik
        initialValues={{ [FIELDS.NAME]: '' }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          [FIELDS.NAME]: Yup.string().trim().required('Required'),
        })}
      >
        {({ values, handleChange }) => (
          <Form className="flex flex-col">
            <Field
              type="text"
              name={FIELDS.NAME}
              label="Name"
              component={TextInput}
              value={values[FIELDS.NAME]}
              onChange={handleChange}
            />
            <Button type="submit" className="mt-[20px] mb-[10px]">
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateChatSpaceForm;

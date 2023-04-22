import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'
import {
  Button, 
  TextInput, 
} from '@Common';

import { useCreateChatSpace } from './hooks'

function CreateChatSpaceForm() {
  const navigate = useNavigate();
  const FIELDS = {
    NAME: 'name',
    PRIVATE: 'private',
  };

  const { sendAction } = useCreateChatSpace();

  const handleSubmit = async (values) => {
    const name = values[FIELDS.NAME];
    const isPrivate = values[FIELDS.PRIVATE];
    const {status} = await sendAction(name, isPrivate);
    
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
        initialValues={{ [FIELDS.NAME]: '', [FIELDS.PRIVATE]: false }}
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
              id="name"
              component={TextInput}
              value={values[FIELDS.NAME]}
              onChange={handleChange}
            />
            <label className="mt-[10px]">
              <Field type="checkbox" name={FIELDS.PRIVATE} />
              <span className="ml-[10px]">
                Private
              </span>
            </label>
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

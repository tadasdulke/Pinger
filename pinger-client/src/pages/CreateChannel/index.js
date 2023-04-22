import React from 'react';
import { Row, Col } from 'react-grid-system';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { RotatingLines } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { ROUTES } from '@Router';
import { Button, TextInput } from '@Common';

import useCreateChannel from './hooks/useCreateChannel';
import { addChannel } from '@Store/slices/channels';

function CreateChannel() {
  const { channelCreated, createChannel } = useCreateChannel();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const FIELDS = {
    NAME: 'NAME',
    PRIVATE: 'PRIVATE',
  };

  const handleSubmit = async (values) => {
    const { status, data } = await createChannel(
      values[FIELDS.NAME],
      values[FIELDS.PRIVATE]
    );

    if (status === 200) {
      const { id, name } = data;
      navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`);
      dispatch(addChannel({id, name}))
    }
  };

  return (
    <Row nogutter>
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
              [FIELDS.NAME]: '',
            }}
            validationSchema={Yup.object().shape({
              [FIELDS.NAME]: Yup.string().trim().required('Required'),
            })}
          >
            {({ values, handleChange }) => (
              <Form className="flex flex-col mt-[40px]">
                <Field
                  type="text"
                  name={FIELDS.NAME}
                  label="Channel name"
                  id="channel name"
                  component={TextInput}
                  value={values[FIELDS.NAME]}
                  onChange={handleChange}
                  labelClassName="text-white"
                  wrapperClassName="text-black"
                />
                <label className="mt-[10px] mb-[20px]">
                  <Field type="checkbox" name={FIELDS.PRIVATE} />
                  <span className="ml-[10px]">
                    Private
                  </span>
                </label>
                <Button type="submit" className="my-[10px] flex justify-center">
                  {!channelCreated
                    ? (
                      <RotatingLines
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="24"
                      />
                    )
                    : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Col>
    </Row>
  );
}

export default CreateChannel;

import React from 'react';
import { Row, Col } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { RotatingLines } from 'react-loader-spinner';
import { ROUTES } from '@Router';
import { Button, TextInput } from '@Common';
import { modifyChannelName } from '@Store/slices/channels';

import { useEditChannel, useFetchChannel } from './hooks';

function EditChannel() {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { channelEdited, editChannelAction } = useEditChannel(channelId)
  const { channelLoaded, channelResult } = useFetchChannel(channelId)

  const FIELDS = {
    NAME: 'NAME',
  };

  const handleSubmit = async (values) => {
    const { status, data } = await editChannelAction(values[FIELDS.NAME]);

    if (status === 200) {
      const { id, name } = data;
      dispatch(modifyChannelName({id, name}))
      navigate(`${ROUTES.USE_CHATSPACE}/${ROUTES.CHANNEL_CHAT}/${id}`);
    }
  };
  return (
    <Row nogutter>
      <Col lg={7}>
        <div className="text-white pt-[30px] px-[30px]">
          <h1 className="text-3xl">
            Edit channel
          </h1>
          {channelLoaded && <Formik
            onSubmit={handleSubmit}
            initialValues={{
              [FIELDS.NAME]: channelResult?.data?.name,
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
                  wrapperClassName="mb-[20px] text-black"
                />
                <Button type="submit" className="my-[10px] flex justify-center">
                  {!channelEdited
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
          </Formik>}
        </div>
      </Col>
    </Row>
  );
}

export default EditChannel;

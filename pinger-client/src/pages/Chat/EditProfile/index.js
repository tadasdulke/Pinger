import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-grid-system';
import { Formik, Field, Form } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import cx from 'classnames';
import { setUserName, setProfilePictureId } from '@Store/slices/auth';
import {
  Button, TextInput, useFetchData, useApiAction, useLoadedImage,
  FilePicker,
} from '@Common';
import LOCAL_STORAGE_ITEMS from '@Common/config/localStorageItems';

import getSelf from './services/getSelf';
import updateSelf from './services/updateSelf';

function EditProfile() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageSrc, setProfileImageSrc] = useState(null);
  const [localImageUrl, setLocalImgUrl] = useState(null);
  const imageUrlSrc = useLoadedImage(profileImageSrc, 'http://localhost:5122/public/profile-pic.png');

  const { loaded, result: self } = useFetchData(
    getSelf,
  );

  const { sendAction: sendUpdateSelfAction } = useApiAction(
    (file, userName) => updateSelf(file, userName),
  );

  const FIELDS = {
    USER_NAME: 'USER_NAME',
  };
  
  const handleSubmit = async (values) => {
    const userName = values[FIELDS.USER_NAME];
    const { status, data } = await sendUpdateSelfAction(selectedFile, userName);

    if (status === 200) {
      const { userName, profilePictureId } = data;
      dispatch(setUserName(userName));
      dispatch(setProfilePictureId(profilePictureId));
      localStorage.setItem(LOCAL_STORAGE_ITEMS.USER_NAME, userName);
      localStorage.setItem(LOCAL_STORAGE_ITEMS.PROFILE_PICTURE_ID, profilePictureId);
    }
  };

  const handleFileSelect = ({ target }) => {
    const file = target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setLocalImgUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (self && self.data) {
      setProfileImageSrc(`http://localhost:5122/api/public-file/${self.data.profilePictureId}`);
    }
  }, [self?.data]);

  const imageSrc = localImageUrl || imageUrlSrc;
  
  return (
    <Row nogutter>
      <Col xs={12} md={8} lg={5}>
        <div className="text-white pt-[30px] px-[30px]">
          <h1 className="text-3xl mb-[30px]">
            Edit your profile
          </h1>
          <Row>
            <Col xs={10} md={8} xl={6} offset={{ md: 2, xl: 3, xs: 1 }}>
              <div className="mx-auto min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px]">
                {imageSrc && (
                <img
                  src={imageSrc}
                  width="100%"
                  height="100%"
                  className={cx('rounded-full aspect-square')}
                />
                )}
              </div>
              <div className="flex justify-center mt-[20px]">
                <FilePicker
                  onChange={handleFileSelect}
                  multiple={false}
                  accept="image/png, image/jpeg"
                >
                  <span className="px-[16px] py-[9px] bg-green-600 rounded-[3px] text-white">Change picture</span>
                </FilePicker>
              </div>
            </Col>
          </Row>
          {self && (
            <Formik
              onSubmit={handleSubmit}
              initialValues={{
                [FIELDS.USER_NAME]: self?.data?.userName,
              }}
              validationSchema={Yup.object().shape({
                [FIELDS.USER_NAME]: Yup.string().required('User name is required'),
              })}
            >
              {({ values, handleChange }) => (
                <Form className="flex flex-col mt-[40px]">
                  <Field
                    type="text"
                    name={FIELDS.USER_NAME}
                    label="User name"
                    component={TextInput}
                    value={values[FIELDS.USER_NAME]}
                    onChange={handleChange}
                    labelClassName="text-white"
                    wrapperClassName="mb-[20px] text-black"
                  />
                  <Button type="submit" className="mt-[10px]">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </Col>
    </Row>
  );
}

export default EditProfile;

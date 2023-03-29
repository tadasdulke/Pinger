import React, {useState, useEffect} from 'react';
import {Row, Col} from 'react-grid-system';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import cx from 'classnames'
import { Button, TextInput, withErrorWrapper, useFetchData, useApiAction } from '@Common'
import { FilePicker } from '@Common'

import getSelf from './services/getSelf'
import updateSelf from './services/updateSelf'

const EditProfile = ({errorHandler}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { loaded, result: self } = useFetchData(
        getSelf,
        errorHandler,
    )

    const { sendAction: sendUpdateSelfAction } = useApiAction(
        (file, userName) => updateSelf(file, userName),
        errorHandler
    )

    const FIELDS = {
        USER_NAME: "USER_NAME",
    }

    const handleSubmit = async (values) => {
        const userName = values[FIELDS.USER_NAME]
        await sendUpdateSelfAction(selectedFile, userName);
    }

    const handleFileSelect = ({target}) => {
        const file = target.files[0];
        setSelectedFile(file);
    }

    useEffect(() => {
        if(selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(objectUrl)

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile])

    useEffect(() => {
        if(self && self.data && self.data.profilePictureId) {
            setPreviewUrl(`http://localhost:5122/api/public-file/${self.data.profilePictureId}`)
        }
    }, [self?.data])

    const profileImage = previewUrl || "http://localhost:5122/public/profile-pic.png";

    if(!loaded) {
        return null;
    }


    return (
        <Row>
            <Col lg={7}>
                <div className="text-white pt-[30px] px-[30px]">
                    <h1 className="text-3xl mb-[30px]">
                        Edit your profile
                    </h1>
                    <Row>
                        <Col xs={10} md={6} xl={4} offset={{md: 3, xl: 4, xs:1}}>
                            <img 
                                src={profileImage} 
                                width="100%" 
                                height="100%" 
                                className={cx("rounded-full aspect-square", {hidden: !imageLoaded})} 
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="flex justify-center mt-[20px]">
                                <FilePicker 
                                    onChange={handleFileSelect}
                                    multiple={false}
                                    accept="image/png, image/jpeg"
                                >
                                    <span className="px-[16px] py-[9px] bg-green-600 rounded-[3px] text-white">Change profile picture</span>
                                </FilePicker>
                            </div>
                        </Col>
                    </Row>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={{
                            [FIELDS.USER_NAME]: self?.data?.userName
                        }}
                        validationSchema={Yup.object().shape({
                            [FIELDS.USER_NAME]: Yup.string(),
                        })}    
                    >
                        {({values, handleChange}) => (
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
                </div>       
            </Col>
        </Row>
    )
}

export default withErrorWrapper(EditProfile);
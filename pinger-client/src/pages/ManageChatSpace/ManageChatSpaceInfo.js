import React from 'react';
import { TextInput, Expandable, Loader, ButtonWithLoader, useApiAction } from '@Common';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux'

import updateChatSpace from './services/updateChatSpace'
import useFetchChatSpace from '../Chat/ChatSpaceInformation/hooks/useFetchChatSpace';
import { changeName } from '../../store/slices/workspaces';
import { addNotification } from '../../store/slices/notifications';

const ManageChatSapceInfo = () => {
    const { currentWorkspaceId } = useSelector(state => state.workspace)
    const dispath = useDispatch();

    const { result } = useFetchChatSpace(currentWorkspaceId);

    const FIELDS = {
        NAME: 'name',
    };

    const { loaded, sendAction: sendUpdateChatSpaceAction } = useApiAction(
        (name) => updateChatSpace(name)
    );

    const handleSubmit = async (values) => {
        const name = values[FIELDS.NAME];
        const { status } = await sendUpdateChatSpaceAction(name)
    
        if(status === 204) {
            dispath(changeName(name))
            dispath(addNotification({
                notification: "Chatspace was updated successfuly",
            }))
        }
    };


    return (
        <Expandable text="Chatspace info">
            <div className="px-[30px]">
                <Loader loaded={result?.data}>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={{
                            [FIELDS.NAME]: result?.data.name,
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
                            label="Chatspace name"
                            id="chatspace name"
                            component={TextInput}
                            value={values[FIELDS.NAME]}
                            onChange={handleChange}
                            labelClassName="text-white"
                            wrapperClassName="mb-[20px] text-black"
                            />
                            <ButtonWithLoader loaded={loaded} type="submit" className="my-[10px] flex justify-center">
                                Submit
                            </ButtonWithLoader>
                        </Form>
                    )}
                    </Formik>
                </Loader>
            </div>
            </Expandable>
    )
}

export default ManageChatSapceInfo;
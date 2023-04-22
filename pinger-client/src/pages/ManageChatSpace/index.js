import React from 'react';
import { Row, Col } from 'react-grid-system';
import ManageChatSapceInfo from './ManageChatSpaceInfo';
import ManageChatSpaceMembers from './ManageChatSpaceMembers';
import ManageChatSpaceChannels from './ManageChatSpaceChannels';
import InviteMembers from './InviteMembers';

const ManageChatSpace = () => {

    return (
        <Row nogutter>
          <Col lg={7}>
            <div className="text-white py-[30px] px-[30px]">
                <h1 className="text-3xl">
                    Manage your chatspace
                </h1>
            </div>
            <ManageChatSapceInfo/>
            <ManageChatSpaceMembers/>
            <ManageChatSpaceChannels/>
            <InviteMembers/>
          </Col>
        </Row>
      );
}

export default ManageChatSpace;
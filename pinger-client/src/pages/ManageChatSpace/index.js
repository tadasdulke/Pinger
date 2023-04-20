import React from 'react';
import { Row, Col } from 'react-grid-system';
import { Expandable } from '@Common';

import ManageChatSapceInfo from './ManageChatSpaceInfo';
import ManageChatSpaceMembers from './ManageChatSpaceMembers';

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
            <Expandable text="Manage chatspace users">
                manage chatspace channels
            </Expandable>
            <Expandable text="Invite users">
                invite users
            </Expandable>
          </Col>
        </Row>
      );
}

export default ManageChatSpace;
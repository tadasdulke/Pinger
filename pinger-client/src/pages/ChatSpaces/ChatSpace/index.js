import React from 'react';
import cx from 'classnames';
import { Col } from 'react-grid-system';

function ChatSpace({
  name, image, className, onClick,
}) {
  return (
    <Col xs={3}>
      <button className="w-full mt-[10px]" onClick={onClick}>
        <div className={cx('hover:border-2 border-white w-full aspect-square bg-black rounded-full', className)}>
          {image}
        </div>
        <p className="text-white text-center mt-[20px]">
          {name}
        </p>
      </button>
    </Col>
  );
}

export default ChatSpace;

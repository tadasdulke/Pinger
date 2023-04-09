import React from 'react';

const ListItem = ({ children, onClick }) => {
    return (
      <button className="mx-[-16px] px-[16px] py-[10px] text-left hover:bg-tuna-darker" onClick={onClick}>
        {children}
      </button>
    );
}

export default ListItem; 
import React from 'react';

const NavItem = ({ children, onClick }) => {
  return (
    <button className="nav-item" onClick={onClick}>
      {children}
    </button>
  );
};

export default NavItem;

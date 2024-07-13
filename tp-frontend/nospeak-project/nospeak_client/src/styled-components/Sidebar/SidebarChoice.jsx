import React from 'react';
import { Choices } from './styles';

const SidebarChoice = ({ title, Icon, onClick, isActive }) => {
  return (
    <Choices onClick={onClick} isActive={isActive}>
      {Icon && <Icon style={{ color: isActive ? 'white' : 'gray' }} />}
      {Icon ? <h4 style={{ marginLeft: '5px', color: isActive ? 'white' : 'gray' }}>{title}</h4> : <p>{title}</p>}
    </Choices>
  );
};

export default SidebarChoice;

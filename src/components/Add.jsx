import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class Add extends React.Component {
  render() {
    const { section, onAdd } = this.props;

    return (
      <DropdownButton
        id="dropdown-basic-button"
        title="Add Item"
      >
        <Dropdown.Item onClick={() => onAdd(section, 'inputArray')}>Add Array - [ ]</Dropdown.Item>
        <Dropdown.Item onClick={() => onAdd(section, 'inputObject')}>Add Object - {'{ }'}</Dropdown.Item>
        <Dropdown.Item onClick={() => onAdd(section, 'inputValue')}>Add Value - ...</Dropdown.Item>
      </DropdownButton>
    )
  }
}

Add.defaultParam = {
  section: null,
}

export default Add;
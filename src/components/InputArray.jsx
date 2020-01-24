import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

import Add from './Add';

class InputArray extends React.Component {
  render() {
    const { section, addSection, onChange } = this.props;

    return (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>[ ]</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Enter label"
          value={section.label}
          onChange={e => onChange(e.target.value, section.id)}
        />
        <InputGroup.Append>
          <Add
          onAdd={addSection}
          section={section}
        />
        </InputGroup.Append>
      </InputGroup>
    )
  }
}

export default InputArray;
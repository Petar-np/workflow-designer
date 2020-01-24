import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

class InputValue extends React.Component {
  render() {
    const { onChange, section } = this.props;
    return (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>...</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Enter label"
          value={section.label}
          onChange={e => onChange(e.target.value, section.id, 'label')}
        />
        <FormControl
          placeholder="Enter value"
          value={section.value}
          onChange={e => onChange(e.target.value, section.id, 'value')}
        />
      </InputGroup>
    )
  }
}

export default InputValue;
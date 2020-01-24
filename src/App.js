import React from "react";
import uuid from "uuid/v4";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

import { Container, Row, Col, Button } from 'react-bootstrap';


// Components
import Add from "./components/Add";
import InputArray from './components/InputArray';
import InputObject from './components/InputObject';
import InputValue from './components/InputValue';

// Constants
const INPUT_TYPE = {
  inputArray: 'inputArray',
  inputObject: 'inputObject',
  inputValue: 'inputValue',
}

class App extends React.Component {
  state = {
    sections: []
  };

  // ========================================= //
  // ============ ADDING SECTIONS ============ //
  // ========================================= //


  // Initial value of new section
  handleInitialSection = (type) => ({
    id: uuid(),
    type: type,
    label: '',
    value: this.handleNewSectionValue(type),
  })

  // Value itself depend on section type
  handleNewSectionValue = (type) => {
    switch(type) {
      case INPUT_TYPE.inputArray:
      case INPUT_TYPE.inputObject:
        return [];
      case INPUT_TYPE.inputValue:
        return '';
      default:
        return '';
    }
  }

  // Adding subsections
  handleAddSubSection = (section, parentSection, type) => {
    if (section.id === parentSection.id) {
      const initialSection = this.handleInitialSection(type);

      return {
        ...section,
        value: [...section.value, { ...initialSection, parentId: parentSection.id}],
      };
    } else if (isArray(section.value) && section.value.length) {
      return {
        ...section,
        value: section.value.map(item => this.handleAddSubSection(item, parentSection, type)),
      };
    } else {
      return section;
    }
  };

  // Adding section
  handleAddSection = (section = null, type = '') => {
    if (section) {
      this.setState(prevState => ({
        sections: prevState.sections.map(item => this.handleAddSubSection(item, section, type))
      }));
    } else  {
      const initialSection = this.handleInitialSection(type);

      this.setState(prevState => ({
        sections: [
          ...prevState.sections,
          initialSection,
        ],
      }));
    }
  };

  // =================================== //
  // ============ RENDERING ============ //
  // =================================== //

  // Render section depend on type
  handleRenderSection = (section) => {
    switch (section.type) {
      case INPUT_TYPE.inputArray:
        return <InputArray
          addSection={this.handleAddSection}
          onChange={this.handleUpdateState}
          section={section}
        />
      case INPUT_TYPE.inputObject:
        return <InputObject
          addSection={this.handleAddSection}
          onChange={this.handleUpdateState}
          section={section}
        />
      case INPUT_TYPE.inputValue:
        return <InputValue
          onChange={this.handleUpdateState}
          section={section}
        />
      default:
        return null;
    }
  }

  // Loop sections and render it
  handleRenderNode = (section) => {
    if (
      section.type === INPUT_TYPE.inputValue
      || !section.value.length
    ) {
      return (
        <div key={section.id}>
          {this.handleRenderSection(section)}
        </div>
      )
    } else {
      return (
        <div key={section.id}>
          {this.handleRenderSection(section)}
          <div style={{ marginLeft: '1rem' }}>
            {section.value.map(this.handleRenderNode)}
          </div>
        </div>
      )
    }
  };

  // ======================================== //
  // ============ EXPORTING JSON ============ //
  // ======================================== //
  handleExportingJSON = () => {
    const { sections } = this.state;
  
    const result = this.handleGenerateJSON(sections);

    return result;
  }

  handleGenerateJSON = (sections, nodeType = {}) => {
    const result = nodeType;
    
    sections.forEach(section => {
      if (section.type === INPUT_TYPE.inputArray) {
        if (isArray(nodeType)) {
          result.push(this.handleGenerateJSON(section.value, []))
        } else if (isObject(nodeType)) {
          result[section.label || section.id] = this.handleGenerateJSON(section.value, []);
        }
      } else if (section.type === INPUT_TYPE.inputObject) {
        if (isArray(nodeType)) {
          result.push(this.handleGenerateJSON(section.value, {}))
        } else if (isObject(nodeType)) {
          result[section.label || section.id] = this.handleGenerateJSON(section.value, {});
        }
      } else if (section.type === INPUT_TYPE.inputValue) {
        if (isArray(nodeType)) {
          result.push(section.value)
        } else if (isObject(nodeType)) {
          result[section.label || section.id] = section.value;
        }
      }
    });

    return result;
  }

  // ====================================== //
  // ============ UPDATE STATE ============ //
  // ====================================== //
  handleUpdateState = (value, id, type = 'label') => {
    const { sections } = this.state;

    const result = this.handleUpdateItemState(sections, value, id, type)

    this.setState({
      sections: result,
    });
  }


  handleUpdateItemState = (sections, value, id, type) => {
    let result;

    result = sections.map(section => {
      if (section.id === id) {
        return {
          ...section,
          [type]: value,
        };
      } else if (isArray(section.value)) {
        return {
          ...section,
          value: this.handleUpdateItemState(section.value, value, id, type),
        }
      } else {
        return section;
      }
    });

    return result;
  }

  render() {
    const { sections } = this.state;

    return (
      <Container fluid>
        <Row>
          <Col>
            {sections.map(this.handleRenderNode)}
            <Row style={{ marginTop: '3rem'}}>
              <Col>
                <Add onAdd={this.handleAddSection} />
              </Col>
              <Col>
                <Button
                  block
                  variant="outline-primary"
                  onClick={this.handleExportingJSON}
                >
                  Export JSON
                </Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <pre>
              {JSON.stringify(sections, undefined, 2)}
            </pre>
          </Col>
          <Col>
            <pre>
              {JSON.stringify(this.handleExportingJSON(), undefined, 2)}
            </pre>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;

import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import { Button } from 'react-bootstrap';
import 'react-select/dist/react-select.css';

export class EditableSelector extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        buttons: labels[labelTopics.button]
      }
      , value: this.props.initialValue
      , options: this.props.options
    };
    this.callBack = this.callBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onRemoveAllClick = this.onRemoveAllClick.bind(this);
  };

  componentWillReceiveProps = (nextProps) => {
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;
    this.setState({
      labels: {
        buttons: labels[labelTopics.button]
      }
      , value: nextProps.initialValue
      , options: nextProps.options
    });
  };

  callBack = () => {
      this.props.changeHandler(this.state.value, this.state.options);
  };

  handleChange = (selection) => {
      this.setState({ value: selection.value }, this.callBack);
  };

  onRemoveClick = () => {
    let value = this.state.value;
    let options = [];
    options = this.state.options.filter(function(el) {
      return el.value !== value;
    });
    this.setState({ options: options, value: "" }, this.callBack);
  };

  onRemoveAllClick = () => {
    this.setState({ options: [], value: "" }, this.callBack);
  };

  render () {
    return (
        <div className="resourceSelector">
          <div className="resourceSelectorPrompt">{this.props.title}</div>
          <Select.Creatable
              name="form-field-name"
              value={this.state.value}
              options={this.state.options}
              onChange={this.handleChange}
              multi={this.props.multiSelect}
              autosize={true}
              clearable
          />
          <div className="App resourceSelectorButtons">
          <Button
              className="App App-Button"
              bsStyle="primary"
              onClick={this.onRemoveClick}>{this.state.labels.buttons.remove}
              </Button>
          <Button
              className="App App-Button"
              bsStyle="warning"
              onClick={this.onRemoveAllClick}>{this.state.labels.buttons.removeAll}
          </Button>
          </div>
        </div>
    )
  }
}

EditableSelector.propTypes = {
  session: PropTypes.object.isRequired
  , initialValue: PropTypes.string
  , options: PropTypes.array.isRequired
  , changeHandler: PropTypes.func.isRequired
  , multiSelect: PropTypes.bool.isRequired
  , title: PropTypes.string
};

// set default values for props here
EditableSelector.defaultProps = {
  initialValue: ""
  , title: ""
};

export default EditableSelector;
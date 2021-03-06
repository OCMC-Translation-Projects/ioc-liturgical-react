import React from 'react';
import PropTypes from 'prop-types';

import {Button, Modal, Well} from 'react-bootstrap';
import MessageIcons from '../helpers/MessageIcons';
import ReactSelector from './ReactSelector';

/**
 * Display modal window to allow user to select an item from a list.
 */
export class ModalReactSelector extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.ModalReactSelector]
        , messages: labels[labelTopics.messages]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , selectedValue: ""
      , showModal: true
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  };

  PropTypesWillMount = () => {
  };

  close = () => {
    this.setState({showModal: false});
  };

  open = () => {
    this.setState({showModal: true});
  };

  handleSelectionChange = (selection) => {
    let value = selection["value"];
    this.setState({
      selectedValue: value
    }, this.props.callBack(value));
  };

  render() {
    return (
        <div>
          <Modal  backdrop={"static"} show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.labels.thisClass.panelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="App-modal-body">
                <Well>
                  <ReactSelector
                      initialValue={this.props.initialValue}
                      resources={this.props.resources}
                      changeHandler={this.handleSelectionChange}
                      multiSelect={false}
                  />
                </Well>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.state.labels.thisClass.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalReactSelector.propTypes = {
  session: PropTypes.object.isRequired
  , resources: PropTypes.array.isRequired
  , initialValue: PropTypes.string
  , callBack: PropTypes.func.isRequired
};
ModalReactSelector.defaultProps = {
  initialValue: ""
};

export default ModalReactSelector;


import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import {Col, ControlLabel, Glyphicon, Grid, Row, Well } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from './MessageIcons';
import server from "./Server";

class WorkflowForm extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    let thisClassLabels = Labels.getWorkflowFormLabels(languageCode);
    this.state = {
      labels: { //
        thisClass: thisClassLabels
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , library: props.library
      , selectedStatus: props.status
      , selectedStatusIcon: "edit"
      , selectedVisibility: props.visibility
      , selectedVisibilityIcon: "lock"
      , selectedUser: props.session.userInfo.username
      , workflow: {
        userRolesForLibrary: {
          admins: []
          , authors: []
          , readers: []
          , reviewers: []
        }
        , statusDropdown: [
          {value: "EDITING", label: thisClassLabels.statusTypes.edit}
          , {value: "REVIEWING", label: thisClassLabels.statusTypes.review}
          , {value: "FINALIZED", label: thisClassLabels.statusTypes.final}
        ]
        , visibilityDropdown: [
          {value: "PERSONAL", label: thisClassLabels.visibilityTypes.personal}
          , {value: "PRIVATE", label: thisClassLabels.visibilityTypes.private}
          , {value: "PUBLIC", label: thisClassLabels.visibilityTypes.public}
        ]
        , isPublic: false
        , stateEnabled: false
        , workflowEnabled: false
        , defaultStatusAfterEdit: "FINALIZED"
        , defaultStatusAfterFinalization: "FINALIZED"
      }
    };

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    this.fetchData(undefined);
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      let currentLibrary = this.state.library;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getWorkflowFormLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
            , library: props.library
          }
          , message: Labels.getMessageLabels(languageCode).initial
          , selectedStatus: nextProps.status
          , selectedVisibility: nextProps.visibility
        }
      }, function () { return this.fetchData(currentLibrary)});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  fetchData = (library) => {
    if (library && library === this.state.library) {
      // ignore.  No need to call the web service
    } else {
      server.getDropdownUsersForLibrary(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , this.props.library
          , this.handleFetchCallback
      );
    }
  };


  // use these (below) in the handleFetchCallback if want dropdowns from the web service
// , statusDropdown: restCallResult.data.values[1].statusDropdown
// , visibilityDropdown: restCallResult.data.values[2].visibilityDropdown

  handleFetchCallback = (restCallResult) => {
    if (restCallResult
        && restCallResult.data.values
        && restCallResult.data.values.length > 0
    ) {
      let config = restCallResult.data.values[3].config;

      this.setState({
        workflow: {
          userRolesForLibrary: restCallResult.data.values[0]
          , isPublic: config.isPublic
          , stateEnabled: config.stateEnabled
          , workflowEnabled: config.workflowEnabled
          , defaultStatusAfterEdit: config.defaultStatusAfterEdit
          , defaultStatusAfterFinalization: config.defaultStatusAfterFinalization
          , statusDropdown: this.state.workflow.statusDropdown
          , visibilityDropdown: this.state.workflow.visibilityDropdown
        }
      });
    }
  };

  handleCallback = () => {
    this.props.callback(
        this.state.selectedVisibility
        , this.state.selectedStatus
        , this.state.selectedUser
    );
  };

  handleStatusChange = (selection) => {
    let icon = "edit";
    let value = selection["value"];
    switch(value) {
      case ("EDITING"): {
        icon = "edit";
        break;
      }
      case ("REVIEWING"): {
        icon = "eye-open";
        break;
      }
      case ("FINALIZED"): {
        icon = "check";
        break;
      }
    }
    this.setState({
      selectedStatus: value
      , selectedStatusIcon: icon
    }, this.handleCallback);
  };

  handleVisibilityChange = (selection) => {
    let icon = "edit";
    let value = selection["value"];
    switch(value) {
      case ("PERSONAL"): {
        icon = "lock";
        break;
      }
      case ("PRIVATE"): {
        icon = "share-alt";
        break;
      }
      case ("PUBLIC"): {
        icon = "globe";
        break;
      }
    }
    this.setState({
      selectedVisibility: value
      , selectedVisibilityIcon: icon
    }, this.handleCallback);
  };

  handleUserChange = (selection) => {
    this.setState({
      selectedUser: selection["value"]
    }, this.handleCallback);
  };

  getUserRow = () => {
    if (this.props.assignable) {
      return (
          <Row  className="show-grid App App-Workflow-Selector-Row">
            <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
              <ControlLabel>Assigned To:</ControlLabel>
            </Col>
            <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
              <Select
                  name="App-Workflow-Selector-User"
                  className="App App-Workflow-Selector-User"
                  value={this.state.selectedUser}
                  options={this.state.workflow.userRolesForLibrary.readers}
                  onChange={this.handleUserChange}
                  multi={false}
                  autosize={true}
                  clearable
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  render() {
    return (
      <Well>
        <Grid>
          <Row  className="show-grid App App-Workflow-Selector-Row">
            <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
              <ControlLabel><FontAwesome  className="App-Workflow-Selector-icon"
                  name={this.state.selectedVisibilityIcon}/>Visibility:
              </ControlLabel>
            </Col>
            <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
              <Select
                  name="App-Workflow-Selector-Visibility"
                  className="App App-Workflow-Selector-Visibility"
                  value={this.state.selectedVisibility}
                  options={this.state.workflow.visibilityDropdown}
                  onChange={this.handleVisibilityChange}
                  multi={false}
                  autosize={true}
                  clearable
              />
            </Col>
          </Row>
        <Row  className="show-grid App App-Workflow-Selector-Row">
          <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
            <ControlLabel>
              <Glyphicon
                  className="App-Workflow-Selector-icon"
                  glyph={this.state.selectedStatusIcon}/>
              Status:
            </ControlLabel>
          </Col>
          <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
            <Select
                name="App-Workflow-Selector-Status"
                className="App App-Workflow-Selector-Status"
                value={this.state.selectedStatus}
                options={this.state.workflow.statusDropdown}
                onChange={this.handleStatusChange}
                multi={false}
                autosize={true}
                clearable
            />
          </Col>
        </Row>
        </Grid>
      </Well>
    )
  }
};

WorkflowForm.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , library: PropTypes.string.isRequired
  , status: PropTypes.string
  , visibility: PropTypes.string
  , assignable: PropTypes.bool
};

// set default values for props here
WorkflowForm.defaultProps = {
  languageCode: "en"
  , status: "EDITING"
  , visibility: "PERSONAL"
  , assignable: false
};

export default WorkflowForm;

import React from 'react';
import PropTypes from 'prop-types';

import { Editor } from '@tinymce/tinymce-react';

import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

/**
 * This is a template for a new component.
 * To use it:
 * 1. Rename all occurrences of NewComponentTemplate to your component name.
 * 2. Replace Labels.getViewReferenceLabels with a call to get your component's labels
 * 3. Add content to the render function, etc...
 */
// TODO: rename class
class TextNodeEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { // TODO: replace getViewReferencesLabels with method for this class
        thisClass: Labels.getViewReferencesLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
    }

    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }

  // TODO: add the content for the render function
  render() {
    return (
        <div className="App-New-Component-Template">
          <Editor
              apiKey="MceEditorKey"
              init={{ plugins: 'link table' }}
          />
        </div>
    )
  }
}

// TODO: rename class and add any additional propTypes you need
// TODO: review the structure of the Session class, which also holds User, UiSchemas, and Dropdowns
TextNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
};

// set default values for props here
// TODO: rename class
TextNodeEditor.defaultProps = {
  languageCode: "en"
};

// TODO: rename class for export
export default TextNodeEditor;

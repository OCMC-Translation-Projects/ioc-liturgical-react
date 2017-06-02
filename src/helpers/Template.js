import React from 'react';

/**
 * Use this as an example starting point for new React components
 */
class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
        }
    )
  }

  render() {
        return (
            <div></div>
        )
  }
}

Template.propTypes = {
    languageCode: React.PropTypes.string.isRequired
};

Template.defaultProps = {
};

export default Template;
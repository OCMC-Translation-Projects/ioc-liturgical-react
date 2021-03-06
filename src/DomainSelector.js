import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import server from './helpers/Server';
import {DropdownButton, MenuItem} from 'react-bootstrap';

class DomainSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverNotCalled: true
    };
    this.getMenuItems = this.getMenuItems.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount = () => {
    this.fetchData();
  };

  onSelect = (index) => {
    let item = this.state.items[index];
    let idParts = item.value.split("|");
    let domain = item.value;
    if (idParts.length === 3) {
      domain = idParts[2];
    }
    this.props.callback(domain, item.label);
  };

  domainObjectsToStringArray(domains) {
    let values = domains.values;
  }

  fetchData() {
    var config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    this.setState({serverNotCalled: false});
    axios.get(this.props.session.restServer + server.getDbServerDropdownsSearchTextApi(), config)
        .then(response => {
          this.setState( { items: response.data.values[0].domains} );
        })
        .catch( (error) => {
          this.setState( { data: error.message });
          this.props.callback(error.message, "");
        });
  }

  getMenuItems = (items) => {
    let itemsList = items.map(function(item, index){
      let domain = item.value;
      let idParts = item.value.split("_");
      if (idParts.length === 3) {
        domain = idParts[2];
      }
      return <MenuItem key={domain} eventKey={ index }>{item.value + ": " + item.label}</MenuItem>;
    });
    return  itemsList ;
  };

  render() {
    if (this.state.items) {
        return (
            <div className="App-DomainSelector">
              <h3 className="App-DomainSelector-prompt">{this.props.formPrompt}</h3>
              <DropdownButton
                  bsStyle={this.props.style}
                  bsSize={this.props.size}
                  title={this.props.title}
                  id={this.props.id}
                  onSelect={this.onSelect}
              >
                {this.getMenuItems(this.state.items)}
              </DropdownButton>
            </div>
        );
    } else {
      return (<div className="Resource"><p>Loading domains!</p></div>);
    }
  }
}

DomainSelector.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , id: PropTypes.string.isRequired
  , title: PropTypes.string.isRequired
  , size: PropTypes.string
  , style: PropTypes.string
  , filterLanguage: PropTypes.string
  , publicOnly: PropTypes.bool
};

DomainSelector.defaultProps = {
  size: "small"
  , style: "primary"
  , filterLanguage: ""
  , publicOnly: true
};

export default DomainSelector;

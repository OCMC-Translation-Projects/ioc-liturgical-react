import React from 'react';
import PropTypes from 'prop-types';
import MessageIcons from '../helpers/MessageIcons';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

/**
 * Use this as an example starting point for new React components
 */
class GlossBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.handleRowSelect = this.handleRowSelect.bind(this);
  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  };

  setTheState = (props) => {
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    return (
        {
          labels: {
            thisClass: labels[labelTopics.GlossBuilder]
            , messages: labels[labelTopics.messages]
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: labels[labelTopics.messages].initial
          , values: this.props.values
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
        }
    )
  };

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
      , showIdPartSelector: true
      , showModalCompareDocs: true
    });
  };

  render() {
        return (
              <div className="App App-GlossBuilder">
                <div className="row">
                  <BootstrapTable
                      data={this.state.values}
                      trClassName={"App-data-tr"}
                      search
                      striped
                      hover
                      pagination
                      options={ this.state.options }
                      selectRow={ this.state.selectRow }
                  >
                    <TableHeaderColumn
                        isKey
                        dataField='id'
                        hidden
                    >ID</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='library'
                        tdClassname="tdDomain"
                        width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerDomain}</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='topic'
                        width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerTopic}</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='key'
                        width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerKey}</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='value'
                        dataSort={ true }
                    >{this.props.resultsTableLabels.headerValue}</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              </div>
        )
  }
}

GlossBuilder.propTypes = {
  session: PropTypes.object.isRequired
  , values: PropTypes.array.isRequired
  , callBack: PropTypes.func.isRequired
};

GlossBuilder.defaultProps = {
};

export default GlossBuilder;

import React from 'react';
import PropTypes from 'prop-types';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios';
import Server from '../helpers/Server';
import Spinner from '../helpers/Spinner';
import Grammar from './Grammar';

/**
 * Display modal content.
 */
export class CompareDocs extends React.Component {

  constructor(props) {
    super(props);
    this._isMounted = false;

    let topic = props.selectedIdParts[1].label;
    let key = props.selectedIdParts[2].label;
    let query = "~"
        + topic
        + "~"
        + key;

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        messages: labels[labelTopics.messages]
      }
      , showSearchResults: false
      , message: this.props.labels.msg1
      ,
      messageIcon: this.messageIcons.info
      ,
      data: {values: [{"id": "", "value:": ""}]}
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
        , hideSelectColumn: (this.props.handleRowSelect ? false : true)
        , clickToSelect: false
        , onSelect: this.handleRowSelect
        , className: "App-row-select"
        , selected: []
      }
      ,
      showSelectionButtons: false
      ,
      selectedId: ""
      ,
      selectedValue: ""
      ,
      selectedSeq: ""
      ,
      selectedIdPartsPrompt: "Select one or more ID parts, then click on the search icon:"
      ,
      selectedIdParts: [
        {key: "domain", label: ""},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      ,
      showIdPartSelector: false
      , showModalCompareDocs: false
      , idColumnSize: "130px"
      , query: query
      , lastQuery: undefined
      , domain: "*"
      , selectedBook: "*"
      , selectedChapter: "*"
      , docProp: "id"
      , matcher: "ew"
      , unmounted: false
      , idTopic: topic
      , idKey: key
    };

    this.fetchData = this.fetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getGrammar = this.getGrammar.bind(this);
    this.getTable = this.getTable.bind(this);
    this.evaluateNeedToFetch = this.evaluateNeedToFetch.bind(this);
    this.sendLibrariesInfo = this.sendLibrariesInfo.bind(this);
  };

  componentWillReceiveProps = (nextProps) => {
    let lastQuery = undefined;
    if (this.state.lastQuery) {
      lastQuery = this.state.lastQuery;
    }
    let topic = nextProps.selectedIdParts[1].label;
    let key = nextProps.selectedIdParts[2].label;
    let query = "~"
        + topic
        + "~"
        + key;
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;

      this.setState({
            labels: {
              messages: labels[labelTopics.messages]
            }
            , showModal: nextProps.showModal
            , query: query
            , lastQuery: lastQuery
            , unmounted: false
            , idTopic: topic
            , idKey: key
          }
          , function () {
            this.evaluateNeedToFetch();
          }
      );
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.fetchData();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  };

  setMessage(message) {
      this.setState({
        message: message
      });
  };

  evaluateNeedToFetch = () => {
      if (this.state.lastQuery === this.state.query) {
        // do nothing
      } else {
        this.fetchData();
      }
  };

  fetchData() {
    if (this._isMounted) {
      this.setState({message: this.props.labels.msg2, messageIcon: this.messageIcons.info});
      let config = {
        auth: {
          username: this.props.session.userInfo.username
          , password: this.props.session.userInfo.password
        }
      };

      let parms =
          "?t=" + encodeURIComponent(this.props.docType)
          + "&d=" + encodeURIComponent(this.state.domain)
          + "&b=" + encodeURIComponent(this.state.selectedBook)
          + "&c=" + encodeURIComponent(this.state.selectedChapter)
          + "&q=" + encodeURIComponent(this.state.query)
          + "&p=" + encodeURIComponent(this.state.docProp)
          + "&m=" + encodeURIComponent(this.state.matcher)
      ;
      let path = this.props.session.restServer + Server.getWsServerDbApi() + 'docs' + parms;
      axios.get(path, config)
          .then(response => {
            // if one of the values is greek, then make it the selected row
            let selectedId = "";
            let selectedValue = "";
            let selectRow = this.state.selectRow;
            let greekId = "";
            if (response.data.values) {
              // select the Greek value.  If not, if there is only one item, select it
              let theItem = response.data.values.find(o => o.id.startsWith("gr_"));
              if (theItem) {
                selectedId = theItem.id;
                selectedValue = theItem.value;
                selectRow.selected = [selectedId];
                greekId = selectedId;
              } else {
                if (response.data.values.length === 1) {
                  theItem = response.data.values[0];
                  selectedId = theItem.id;
                  selectedValue = theItem.value;
                  selectRow.selected = [selectedId];
                }
              }
            }
            let values = response.data.values.filter((row) => {
              return row.value.length > 0;
            });
            let libraries = values.map((row) => {
              return {library: row.library , topic: row.topic, key: row.key, id: row.id} ;
            });
            response.data.values = values;
            if (this._isMounted) {
                this.setState({
                      selectRow: selectRow
                      , selectedId: selectedId
                      , selectedValue: selectedValue
                      , data: response.data
                      , lastQuery: this.state.query
                    }
                );
            }

            let resultCount = 0;
            let message = this.props.labels.foundNone
            let found = this.props.labels.foundMany;
            if (response.data.valueCount) {
              resultCount = response.data.valueCount;
              if (resultCount === 0) {
                message = this.props.labels.foundNone;
              } else if (resultCount === 1) {
                message = this.props.labels.foundOne;
              } else {
                message = found
                    + " "
                    + resultCount
                    + ".";
              }
            }
            if (this._isMounted) {
              this.setState({
                    message: message
                    , messageIcon: this.messageIcons.info
                    , showSearchResults: true
                    , greekId: greekId
                    , libraries: libraries
                  }
                  , this.sendLibrariesInfo
              );
            }
          })
          .catch((error) => {
            let message = error.message;
            let messageIcon = this.messageIcons.error;
            if (error && error.response && error.response.status === 404) {
              message = this.props.labels.foundNone;
              messageIcon = this.messageIcons.warning;
              if (this._isMounted) {
                this.setState({
                  data: message
                  , message: message
                  , messageIcon: messageIcon
                  , dataFetched: true
                  , lastQuery: this.state.query
                });
              }
            }
          });
    }
  };

  sendLibrariesInfo = () => {
      if (this.props.librariesInfoCallback && this.state.libraries) {
        this.props.librariesInfoCallback(
            this.props.docType
            , this.state.greekId
            , this.state.libraries
        );
      }
  };

  handleRowSelect = (row) => {
    let selectRow = this.state.selectRow;
    selectRow.selected = [row["id"]];
    let idParts = row["id"].split("~");
    this.setState({
      selectRow: selectRow
      , selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
      , selectedSeq: row["seq"]
    });
    if (this.props.handleRowSelect) {
      this.props.handleRowSelect(row);
    }
  };

  getTable = () => {
    if (this.state.showSearchResults) {
      return (
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  data={this.state.data.values}
                  trClassName={"App-data-tr"}
                  striped
                  hover
                  pagination
                  options={ this.state.options }
                  selectRow={ this.state.selectRow }
              >
                <TableHeaderColumn
                    isKey
                    dataField='id'
                    dataSort={ true }
                    hidden
                >ID</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='seq'
                    hidden
                >ID</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='library'
                    dataSort={ true }
                    width={this.state.idColumnSize}>Domain</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='value'
                    dataSort={ true }
                >Value</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
      )
    } else {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      )
    }
  };

  getGrammar = () => {
    if (this.props && this.props.docType && this.props.docType === "Liturgical") {
      return (
          <Grammar
              session={this.props.session}
              idTopic={this.state.idTopic}
              idKey={this.state.idKey}
              full={false}
          />
      );
    }
  };

  render() {
    return (
        <div>
            {this.state.showSelectionButtons && this.getSelectedDocOptions()}
            {this.getTable()}
            {this.getGrammar()}
        </div>
    );
  }
}
CompareDocs.propTypes = {
  session: PropTypes.object.isRequired
  , handleRowSelect: PropTypes.func
  , title: PropTypes.string.isRequired
  , docType: PropTypes.string.isRequired
  , selectedIdParts: PropTypes.array.isRequired
  , labels: PropTypes.object.isRequired
  , instructions: PropTypes.string
  , librariesInfoCallback: PropTypes.func
};

CompareDocs.defaultProps = {
};

export default CompareDocs;


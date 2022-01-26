import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import '../index.css'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
      }

      handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
      }

      render() {
        return (
        <Form.Control
            type="text"
            placeholder="Search..."
            value={this.props.filterText}
            onChange={this.handleFilterTextChange} />
        );
    }
}

export default SearchBar
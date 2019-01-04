import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import {getRoles, subscribeToRolesReceived, removeRolesReceived} from '../api';

export default class RolesSelect extends Component {
  static propTypes = {
    userRoles: PropTypes.shape().isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      roleOptions: [],
      defaultValueList: [],
    };

    this.onRolesReceived = ({roles}) => {
      const {userRoles} = this.props;

      const roleOptions = roles.map(({id, name}) => ({
        value: id,
        label: name,
      }));

      const userRolesObject = userRoles.reduce(
        (acc, cur) => ({...acc, [cur.id]: true}),
        {},
      );

      const defaultValueList = roleOptions.filter(
        ({value}) => userRolesObject[value],
      );

      this.setState({roleOptions, defaultValueList, areRolesFetching: false});
    };

    subscribeToRolesReceived(this.onRolesReceived);
  }

  componentDidMount() {
    this.setState({areRolesFetching: true});
    getRoles();
  }

  componentWillUnmount() {
    removeRolesReceived(this.onRolesReceived);
  }

  handleChange = selectedOptions => {
    const {onChange} = this.props;
    const newUserRoles = selectedOptions.map(({value, label}) => ({
      id: value,
      name: label,
    }));
    onChange(newUserRoles);
  };

  render() {
    const {areRolesFetching, roleOptions, defaultValueList} = this.state;

    if (areRolesFetching) {
      return null;
    }

    return (
      <Select
        closeMenuOnSelect={false}
        defaultValue={defaultValueList}
        isMulti
        options={roleOptions}
        onChange={this.handleChange}
      />
    );
  }
}

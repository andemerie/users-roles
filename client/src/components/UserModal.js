import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  createUser,
  updateUser,
  subscribeToUserCreated,
  subscribeToUserUpdated,
  removeUserCreated,
  removeUserUpdated,
} from '../api';
import {validateRequired} from '../validators';
import Modal from './common/Modal';
import Input from './common/Input';
import RolesSelect from './RolesSelect';

export default class UserModal extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      roles: PropTypes.shape().isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {user} = this.props;

    this.state = {
      user,
      nameError: '',
    };

    this.onUserEdited = () => {
      const {onEditUser, onClose} = this.props;
      onEditUser();
      onClose();
    };

    const isEditMode = !!user.id;
    const action = isEditMode ? subscribeToUserUpdated : subscribeToUserCreated;

    action(this.onUserEdited);
  }

  componentWillUnmount() {
    const isEditMode = !!this.props.user.id;
    const action = isEditMode ? removeUserUpdated : removeUserCreated;
    action(this.onUserEdited)
  }

  handleChangeField = (fieldName, value) =>
    this.setState(({user}) => ({user: {...user, [fieldName]: value}}));

  setNameError = () =>
    this.setState(({user}) => ({nameError: validateRequired(user.name)}));

  handleSubmit = () => {
    this.setNameError();

    const {user: originalUser} = this.props;
    const {user: editableUser, nameError} = this.state;

    if (nameError) {
      return;
    }

    const isEditMode = !!originalUser.id;
    const action = isEditMode ? updateUser : createUser;

    action(editableUser);
  };

  render() {
    const {onClose, user: originalUser} = this.props;
    const {user: editableUser, nameError} = this.state;

    const isEditMode = !!originalUser.id;

    return (
      <Modal
        className="user-modal"
        title={isEditMode ? 'Edit User' : 'Create User'}
        onClose={onClose}
        onSubmit={this.handleSubmit}
      >
        <Input
          label="Name"
          value={editableUser.name}
          onChange={({target}) => this.handleChangeField('name', target.value)}
          onBlur={this.setNameError}
          icon="user"
          errorText={nameError}
        />
        <label className="label">Roles</label>
        <RolesSelect
          userRoles={editableUser.roles}
          onChange={value => this.handleChangeField('roles', value)}
        />
      </Modal>
    );
  }
}

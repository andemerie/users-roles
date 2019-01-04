import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  createRole,
  updateRole,
  subscribeToRoleCreated,
  subscribeToRoleUpdated,
} from '../api';
import {validateRequired} from '../validators';
import Modal from './common/Modal';
import Input from './common/Input';

export default class RoleModal extends Component {
  static propTypes = {
    role: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    onEditRole: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {role} = this.props;

    this.state = {
      role,
      nameError: '',
    };

    const isEditMode = !!role.id;
    const action = isEditMode ? subscribeToRoleUpdated : subscribeToRoleCreated;

    action(err => {
      if (err) {
        console.error(err);
        return;
      }
      const {onEditRole, onClose} = this.props;
      onEditRole();
      onClose();
    });
  }

  handleChangeName = ({target}) =>
    this.setState(({role}) => ({role: {...role, name: target.value}}));

  setNameError = () =>
    this.setState(({role}) => ({nameError: validateRequired(role.name)}));

  handleSubmit = () => {
    this.setNameError();

    const {role: originalRole} = this.props;
    const {role: editableRole, nameError} = this.state;

    if (nameError) {
      return;
    }

    const isEditMode = !!originalRole.id;
    const action = isEditMode ? updateRole : createRole;

    action(editableRole);
  };

  render() {
    const {onClose, role: originalRole} = this.props;
    const {role: editableRole, nameError} = this.state;

    const isEditMode = !!originalRole.id;

    return (
      <Modal
        title={isEditMode ? 'Edit Role' : 'Create Role'}
        onClose={onClose}
        onSubmit={this.handleSubmit}
      >
        <Input
          label="Name"
          value={editableRole.name}
          onChange={this.handleChangeName}
          onBlur={this.setNameError}
          icon="user-cog"
          errorText={nameError}
        />
      </Modal>
    );
  }
}

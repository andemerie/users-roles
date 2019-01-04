import React, {Component} from 'react';

import {getRoles, subscribeToRolesReceived} from '../api';
import Paginate from './common/Paginate';
import Table from './common/Table';
import RoleModal from './RoleModal';

export default class Roles extends Component {
  static initialPage = 0;

  static initialRole = {
    id: '',
    name: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      pageCount: 0,
      currentPage: Roles.initialPage,
      isRoleModalOpen: false,
      currentRole: Roles.initialRole,
    };

    subscribeToRolesReceived((err, {roles, pageCount}) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({roles, pageCount});
    });
  }

  componentDidMount() {
    this.getRoles();
  }

  componentDidUpdate(prevProps, prevState) {
    const {currentPage} = this.state;
    if (prevState.currentPage !== currentPage) {
      this.getRoles();
    }
  }

  getRoles = () => getRoles(this.state.currentPage);

  handleChangePage = ({selected}) => this.setState({currentPage: selected});

  handleOpenRoleModal = () => this.setState({isRoleModalOpen: true});

  handleOpenRoleUsers = (event, roleName) => {
    event.stopPropagation();
    const {history} = this.props;
    history.push({
      pathname: '/users',
      search: `?role=${roleName}`,
    });
  };

  handleEditRole = currentRole =>
    this.setState({isRoleModalOpen: true, currentRole});

  handleCloseRoleModal = () =>
    this.setState({isRoleModalOpen: false, currentRole: Roles.initialRole});

  render() {
    const {roles, pageCount, isRoleModalOpen, currentRole} = this.state;
    return (
      <>
        <h1 className="title">Roles</h1>
        <button className="button" onClick={this.handleOpenRoleModal}>
          Create Role
        </button>
        <Paginate
          pageCount={pageCount}
          initialPage={Roles.initialPage}
          onPageChange={this.handleChangePage}
        />
        <Table titles={['Name', '']}>
          {roles.map(role => (
            <tr
              key={role.id}
              className="table-row"
              onClick={() => this.handleEditRole(role)}
            >
              <td>{role.name}</td>
              <td>
                <button
                  className="button is-small"
                  onClick={event => this.handleOpenRoleUsers(event, role.name)}
                >
                  Open Users
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {isRoleModalOpen && (
          <RoleModal
            role={currentRole}
            onEditRole={this.getRoles}
            onClose={this.handleCloseRoleModal}
          />
        )}
      </>
    );
  }
}

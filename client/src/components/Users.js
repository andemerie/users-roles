import React, {Component} from 'react';

import {PAGE_SIZE} from './../constants';
import {getUsers, subscribeToUsersReceived, removeUsersReceived} from '../api';
import Paginate from './common/Paginate';
import Table from './common/Table';
import UserModal from './UserModal';

export default class Users extends Component {
  static initialPage = 0;

  static initialUser = {
    id: '',
    name: '',
    roles: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      pageCount: 0,
      currentPage: Users.initialPage,
      isUserModalOpen: false,
      currentUser: Users.initialUser,
    };

    this.onUsersReceived = ({users, count}) =>
      this.setState({users, pageCount: Math.ceil(count / PAGE_SIZE)});

    subscribeToUsersReceived(this.onUsersReceived);
  }

  componentDidMount() {
    this.getUsers();
  }

  componentWillUnmount() {
    removeUsersReceived(this.onUsersReceived);
  }

  componentDidUpdate(prevProps, prevState) {
    const {location} = this.props;
    const {currentPage} = this.state;
    if (
      prevState.currentPage !== currentPage ||
      prevProps.location.search !== location.search
    ) {
      this.getUsers();
    }
  }

  getRole = () => {
    const {location} = this.props;
    const params = new URLSearchParams(location.search);
    return params.get('role');
  };

  getUsers = () => {
    const {currentPage} = this.state;
    const role = this.getRole();

    getUsers(currentPage, role);
  };

  handleChangePage = ({selected}) => this.setState({currentPage: selected});

  handleOpenUserModal = () => this.setState({isUserModalOpen: true});

  handleEditUser = currentUser =>
    this.setState({isUserModalOpen: true, currentUser});

  handleCloseUserModal = () =>
    this.setState({isUserModalOpen: false, currentUser: Users.initialUser});

  render() {
    const {users, pageCount, isUserModalOpen, currentUser} = this.state;
    const role = this.getRole();
    return (
      <>
        <h1 className="title">
          {role ? `Users with "${role}" role` : 'Users'}
        </h1>
        <button className="button" onClick={this.handleOpenUserModal}>
          Create User
        </button>
        <Paginate
          pageCount={pageCount}
          initialPage={Users.initialPage}
          onPageChange={this.handleChangePage}
        />
        <Table titles={['Name', 'Roles']}>
          {users.map(user => (
            <tr
              key={user.id}
              className="table-row"
              onClick={() => this.handleEditUser(user)}
            >
              <td>{user.name}</td>
              <td>
                <div className="tags">
                  {user.roles.map(role => (
                    <span key={`${user.id}${role.id}`} className="tag">
                      {role.name}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </Table>
        {isUserModalOpen && (
          <UserModal
            user={currentUser}
            onEditUser={this.getUsers}
            onClose={this.handleCloseUserModal}
          />
        )}
      </>
    );
  }
}

import openSocket from 'socket.io-client';

import {outgoing, incoming} from './constants';

const socket = openSocket('http://localhost:8000');

const PAGE_SIZE = 5;

export const getUsers = (currentPage, role) =>
  socket.emit(outgoing.getUsers, {currentPage, pageSize: PAGE_SIZE, role});

export const createUser = user => socket.emit(outgoing.createUser, {user});

export const updateUser = user => socket.emit(outgoing.updateUser, {user});

export const subscribeToUsersReceived = callback =>
  socket.on(incoming.usersReceived, ({users, count}) => {
    callback(null, {users, pageCount: Math.ceil(count / PAGE_SIZE)});
  });

export const subscribeToUserCreated = callback =>
  socket.on(incoming.userCreated, () => callback(null));

export const subscribeToUserUpdated = callback =>
  socket.on(incoming.userUpdated, () => callback(null));

export const getRoles = currentPage =>
  socket.emit(
    outgoing.getRoles,
    currentPage !== undefined ? {currentPage, pageSize: PAGE_SIZE} : {},
  );

export const createRole = role => socket.emit(outgoing.createRole, {role});

export const updateRole = role => socket.emit(outgoing.updateRole, {role});

export const subscribeToRolesReceived = callback =>
  socket.on(incoming.rolesReceived, ({roles, count}) => {
    callback(null, {roles, pageCount: Math.ceil(count / PAGE_SIZE)});
  });

export const subscribeToRoleCreated = callback =>
  socket.on(incoming.roleCreated, () => callback(null));

export const subscribeToRoleUpdated = callback =>
  socket.on(incoming.roleUpdated, () => callback(null));

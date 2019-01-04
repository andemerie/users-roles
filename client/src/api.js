import openSocket from 'socket.io-client';

import {outgoing, incoming, PAGE_SIZE} from './constants';

const socket = openSocket('http://localhost:8000');

// Outgoing

export const getUsers = (currentPage, role) =>
  socket.emit(outgoing.getUsers, {currentPage, pageSize: PAGE_SIZE, role});

export const createUser = user => socket.emit(outgoing.createUser, {user});

export const updateUser = user => socket.emit(outgoing.updateUser, {user});

export const getRoles = currentPage =>
  socket.emit(
    outgoing.getRoles,
    currentPage !== undefined ? {currentPage, pageSize: PAGE_SIZE} : {},
  );

export const createRole = role => socket.emit(outgoing.createRole, {role});

export const updateRole = role => socket.emit(outgoing.updateRole, {role});

// Incoming

export const subscribeToUsersReceived = callback =>
  socket.on(incoming.usersReceived, callback);

export const subscribeToUserCreated = callback =>
  socket.on(incoming.userCreated, callback);

export const subscribeToUserUpdated = callback =>
  socket.on(incoming.userUpdated, callback);

export const subscribeToRolesReceived = callback =>
  socket.on(incoming.rolesReceived, callback);

export const subscribeToRoleCreated = callback =>
  socket.on(incoming.roleCreated, callback);

export const subscribeToRoleUpdated = callback =>
  socket.on(incoming.roleUpdated, callback);

// Remove listeners

export const removeUsersReceived = callback =>
  socket.removeListener(incoming.usersReceived, callback);

export const removeUserCreated = callback =>
  socket.removeListener(incoming.userCreated, callback);

export const removeUserUpdated = callback =>
  socket.removeListener(incoming.userUpdated, callback);

export const removeRolesReceived = callback =>
  socket.removeListener(incoming.rolesReceived, callback);

export const removeRoleCreated = callback =>
  socket.removeListener(incoming.roleCreated, callback);

export const removeRoleUpdated = callback =>
  socket.removeListener(incoming.roleUpdated, callback);

const OUTGOING = [
  'getUsers',
  'createUser',
  'updateUser',
  'getRoles',
  'createRole',
  'updateRole',
];

const INCOMING = [
  'usersReceived',
  'userCreated',
  'userUpdated',
  'rolesReceived',
  'roleCreated',
  'roleUpdated',
];

const createConstants = list =>
  list.reduce(
    (acc, cur) => ({...acc, [cur]: cur}),
    {},
  );

export const outgoing = createConstants(OUTGOING);
export const incoming = createConstants(INCOMING);

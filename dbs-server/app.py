import uvloop
from gmqtt import Client as MQTTClient
import asyncio
import signal
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import json
from functools import partial, reduce

from models import User, Role, users, roles, users_roles
from config import SQLALCHEMY_DATABASE_URI, FLESPI_TOKEN


# gmqtt also compatibility with uvloop
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())


STOP = asyncio.Event()


def reduce_users(acc, curr):
    user_id, user_name, role_id, role_name = curr
    user = acc.get(user_id, {
        'id': user_id,
        'name': user_name,
        'roles': [],
    })
    if role_id != None:
        user['roles'].append({'id': role_id, 'name': role_name})
    acc[user_id] = user
    return acc


def get_users(conn, session, client, body):
    page_size = body['pageSize']
    current_page = body['currentPage']
    role = body['role']

    start_index = page_size * current_page
    if role == None:
        user_query = session.query(User).limit(
            page_size).offset(start_index).subquery()
        query = session.query(user_query, Role.id,
                              Role.name).outerjoin(users_roles, Role).order_by(user_query.c.id)

        count = session.query(User).count()

    else:
        role_query = session.query(Role).filter(Role.name == role).subquery()
        user_query = session.query(User).select_from(role_query).join(
            users_roles, User).subquery()
        result_user = session.query(user_query).limit(
            page_size).offset(start_index).subquery()
        query = session.query(result_user, Role.id, Role.name).select_from(
            result_user).join(users_roles, Role)

        count = session.query(user_query).count()

    rows = list(map(lambda row: row, query))
    result = list(dict(reduce(reduce_users, rows, {})).values())
    object_to_send = {'users': result, 'count': count}
    client.publish('usersReceived', json.dumps(object_to_send), qos=1)


def create_user(conn, session, client, body):
    user = body['user']
    insert_result = conn.execute(users.insert().values(name=user['name']))
    user_id = insert_result.inserted_primary_key[0]

    users_roles_values = list(
        map(lambda role: {'user_id': user_id, 'role_id': role['id']}, user['roles']))
    conn.execute(users_roles.insert().values(users_roles_values))

    client.publish('userCreated', json.dumps({'status': 'success'}), qos=1)


def update_user(conn, session, client, body):
    user = body['user']
    conn.execute(users.update().where(
        users.c.id == user['id']).values(name=user['name']))

    conn.execute(users_roles.delete().where(
        users_roles.c.user_id == user['id']))

    users_roles_values = list(
        map(lambda role: {'user_id': user['id'], 'role_id': role['id']}, user['roles']))
    conn.execute(users_roles.insert().values(users_roles_values))

    client.publish('userUpdated', json.dumps({'status': 'success'}), qos=1)


def get_roles(conn, session, client, body):
    page_size = body.get('pageSize', None)
    current_page = body.get('currentPage', None)

    if current_page != None:
        start_index = page_size * current_page
        query = session.query(Role.id, Role.name).limit(page_size).offset(
            start_index).from_self().order_by(Role.id).all()
    else:
        query = session.query(Role.id, Role.name).order_by(Role.id).all()

    count = session.query(Role).count()

    result = list(map(lambda role: {
                  'id': role[0], 'name': role[1]}, query))
    object_to_send = {'roles': result, 'count': count}
    client.publish('rolesReceived', json.dumps(object_to_send), qos=1)


def create_role(conn, session, client, body):
    role = body['role']
    conn.execute(roles.insert().values(name=role['name']))
    client.publish('roleCreated', json.dumps({'status': 'success'}), qos=1)


def update_role(conn, session, client, body):
    role = body['role']
    conn.execute(roles.update().where(
        roles.c.id == role['id']).values(name=role['name']))
    client.publish('roleUpdated', json.dumps({'status': 'success'}), qos=1)


CONTROLLER_BY_TOPIC = {
    'getUsers': get_users,
    'createUser': create_user,
    'updateUser': update_user,
    'getRoles': get_roles,
    'createRole': create_role,
    'updateRole': update_role,
}


def on_connect(client, flags, rc, properties):
    print('Connected')
    client.subscribe('getUsers', qos=0)
    client.subscribe('createUser', qos=0)
    client.subscribe('updateUser', qos=0)
    client.subscribe('getRoles', qos=0)
    client.subscribe('createRole', qos=0)
    client.subscribe('updateRole', qos=0)


def on_message(conn, session, client, topic, payload, qos, properties):
    body = json.loads(payload)
    controller = CONTROLLER_BY_TOPIC[topic]
    if controller:
        controller(conn, session, client, body)


def on_disconnect(client, packet, exc=None):
    print('Disconnected')


def on_subscribe(client, mid, qos):
    print('SUBSCRIBED')


def ask_exit(*args):
    STOP.set()


async def main(loop, broker_host, token):
    engine = create_engine(SQLALCHEMY_DATABASE_URI)

    conn = engine.connect()

    Session = sessionmaker(bind=engine)
    session = Session()

    client = MQTTClient("client-id")

    client.on_connect = on_connect
    client.on_message = partial(on_message, conn, session)
    client.on_disconnect = on_disconnect
    client.on_subscribe = on_subscribe

    client.set_auth_credentials(token, None)
    await client.connect(broker_host)

    await STOP.wait()
    await client.disconnect()


if __name__ == '__main__':
    loop = asyncio.get_event_loop()

    host = 'mqtt.flespi.io'
    token = FLESPI_TOKEN

    loop.add_signal_handler(signal.SIGINT, ask_exit)
    loop.add_signal_handler(signal.SIGTERM, ask_exit)

    loop.run_until_complete(main(loop, host, token))

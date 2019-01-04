import asyncio
from aiopg.sa import create_engine
from faker import Faker
from random import sample, randint
from sqlalchemy import schema

from models import users, roles, users_roles


fake = Faker()

tables = [users, roles, users_roles]


async def drop_tables(conn):
    await conn.execute('DROP TABLE IF EXISTS users_roles')
    await conn.execute('DROP TABLE IF EXISTS users')
    await conn.execute('DROP TABLE IF EXISTS roles')

roles_data = list(map(lambda x: f'Role {x + 1}', range(15)))

users_data = list(map(lambda x: fake.name(), range(15)))


async def fill_data(conn):
    async with conn.begin():
        roles_ids = []
        for name in roles_data:
            role_id = await conn.scalar(roles.insert().values(name=name))
            roles_ids.append(role_id)

        users_ids = []
        for name in users_data:
            user_id = await conn.scalar(users.insert().values(name=name))
            users_ids.append(user_id)

        max_roles = min(len(roles_data), 5)

        for user_id in users_ids:
            user_roles = sample(roles_ids, randint(0, max_roles))
            for user_role in user_roles:
                await conn.execute(users_roles.insert().values(user_id=user_id, role_id=user_role))


async def go():
    engine = await create_engine(user='postgres',
                                 database='users_roles_dev',
                                 host='127.0.0.1',
                                 password='password')
    async with engine:
        async with engine.acquire() as conn:
            await drop_tables(conn)
            for table in tables:
                create_expr = schema.CreateTable(table)
                await conn.execute(create_expr)
            await fill_data(conn)


loop = asyncio.get_event_loop()
loop.run_until_complete(go())

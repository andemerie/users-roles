POSTGRES = {
    'user': 'postgres',
    'password': 'password',
    'db': 'users_roles_dev',
    'host': 'localhost',
}

SQLALCHEMY_DATABASE_URI = 'postgresql://%(user)s:%(password)s@%(host)s/%(db)s' % POSTGRES

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:password@localhost/users_roles_dev'

FLESPI_TOKEN = 'N2ngz7UexLxJh4e9OsRiapV9CGfmHIUkA5pX29ZpIlXPd1MQjuYhHJfagikLQ4Ue'

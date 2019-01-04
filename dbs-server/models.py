from sqlalchemy import Column, Table, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

users_roles = Table('users_roles', Base.metadata,
                    Column('id', Integer, primary_key=True),
                    Column('user_id', Integer, ForeignKey('users.id')),
                    Column('role_id', Integer, ForeignKey('roles.id'))
                    )



class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    roles = relationship(
        "Role",
        secondary=users_roles, back_populates="users")


class Role(Base):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    users = relationship(
        "User",
        secondary=users_roles, back_populates="roles")


users = User.__table__
roles = Role.__table__

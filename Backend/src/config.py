# authentication/config.py

import os
basedir = os.path.abspath(os.path.dirname(__file__))
user_name = 'postgres'
password = 'postgres'
database_name = 'postgres'

postgres_local_base = 'postgresql://' + user_name + ':' + password + '@localhost/'


class BaseConfig:
    """Base configuration."""
    SECRET_KEY = os.getenv(
        'SECRET_KEY', 'my_precious')  #get the value 'my_precious' if not found
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', postgres_local_base + database_name)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587 
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'centrale.genetic.lab@gmail.com'
    MAIL_PASSWORD = "]BSC/M!\\uvw7Fge7"
    MAIL_DEFAULT_SENDER = 'centrale.genetic.lab@gmail.com'


class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', postgres_local_base + database_name)


class TestingConfig(BaseConfig):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', postgres_local_base + database_name+'_test')
    PRESERVE_CONTEXT_ON_EXCEPTION = False


class ProductionConfig(BaseConfig):
    """Production configuration."""
    SECRET_KEY = 'my_precious'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'postgresql:///example'

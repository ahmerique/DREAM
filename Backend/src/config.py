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
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT =  os.getenv('MAIL_PORT')
    MAIL_USE_TLS =  os.getenv('MAIL_USE_TLS')
    MAIL_USE_SSL =  os.getenv('MAIL_USE_SSL')
    MAIL_USERNAME =  os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD =  os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')



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

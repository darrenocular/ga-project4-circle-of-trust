import psycopg
from psycopg.rows import dict_row

def connect_db():
    return psycopg.connect("dbname=project4 user=db_user", row_factory=dict_row)
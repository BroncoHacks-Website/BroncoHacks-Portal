from flask import Flask, jsonify
import sqlite3


app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    return "<p>Server is Running :)</p>"
    

@app.route("/hackers",  methods=['GET'])
def urmom():
    try:
        conn = get_db_connection()
        posts = conn.execute('SELECT * FROM hackers').fetchall()
        conn.close()

        posts_list = [dict(row) for row in posts]

        return jsonify(status=200,hackers=posts_list)
    except Exception as e:
        return jsonify(status=400,message=str(e))
from flask import Flask, jsonify, request
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

        return jsonify(status=200,message="urmom",hackers=posts_list)
    except Exception as e:
        return jsonify(status=400,message=str(e))
    
@app.route("/hacker", methods=['PUT'])
def update_hacker():
    try:
        data = request.get_json()
        # check if data is empty
        if not data:
            return jsonify(status=404, message="no data provided")
        
        uuid = data.get('UUID', None)
        first_name = data.get('firstName', None)
        last_name = data.get('lastName', None)
        password = data.get('password', None)
        school = data.get('school', None)
        discord = data.get('discord', None)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        if not uuid:
            return jsonify(status=404, message="uuid not provided")
        else:
            if first_name:
                cursor.execute("UPDATE hackers SET firstName = ? WHERE uuid = ?", (first_name, uuid))
            if last_name:
                cursor.execute("UPDATE hackers SET lastName = ? WHERE uuid = ?", (last_name, uuid))
            if password:
                cursor.execute("UPDATE hackers SET password = ? WHERE uuid = ?", (password, uuid))
            if school:
                cursor.execute("UPDATE hackers SET school = ? WHERE uuid = ?", (school, uuid))
            if discord:
                cursor.execute("UPDATE hackers SET discord = ? WHERE uuid = ?", (discord, uuid))
        conn.commit()

        cursor.execute('SELECT * FROM hackers WHERE uuid = ?', (uuid,))
        updated_hacker = cursor.fetchone()
        
        conn.close()

        return jsonify(status=200, message="successfully updated hacker", hacker=updated_hacker) 

    except Exception as e:
        return jsonify(status=400, message=str(e))
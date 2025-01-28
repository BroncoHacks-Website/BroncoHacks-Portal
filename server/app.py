from flask import Flask, jsonify, request
import sqlite3
import uuid


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

@app.route("/hacker", methods=['POST'])
def create_hacker():
    try:
        data = request.get_json()
        firstName = data['firstName']
        lastName = data['lastName']
        password = data['password']
        email = data['email']
        school = data['school']
        discord = data.get('discord', "")
        teamID = ""
        confirmationNumber = ""
        isConfirmed = False
        hacker_uuid = str(uuid.uuid4())
    
        conn = get_db_connection()
        conn.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
               (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed))

        conn.commit()
        conn.close()

        return jsonify(status=201, message="Hacker created successfully")
    except Exception as e:
     return jsonify(status=400, message=str(e))
from flask import Flask, jsonify, request
import sqlite3
import uuid


app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_hacker_by_id(hacker_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed FROM hackers WHERE UUID = ?", (hacker_id,))
    hacker = cursor.fetchone()
    conn.close()
    if hacker:
        return dict(hacker)
    return None

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
        discord = data.get('discord', None)
        teamID = None
        confirmationNumber = None
        isConfirmed = False
        hacker_uuid = str(uuid.uuid4())
    
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM hackers WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify(status=400, message="Email already in use")

        if discord:
            cursor.execute("SELECT * FROM hackers WHERE discord = ?", (discord,))
            if cursor.fetchone():
                conn.close()
                return jsonify(status=400, message="Discord already in use")
        
        cursor.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
               (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed))
        conn.commit()

        hacker_id = cursor.lastrowid
        new_hacker = get_hacker_by_id(hacker_id)
        conn.close()


        return jsonify(status=201, message="Hacker created successfully", hacker=new_hacker)
    except Exception as e:
        return jsonify(status=400, message=str(e))
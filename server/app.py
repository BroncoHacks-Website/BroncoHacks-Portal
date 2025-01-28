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
    
    
@app.route("/oneHacker", methods=['GET'])
def getOneHacker():
    # get req param from url
    uuid = request.args.get('uuid')
    
    try:
        conn = get_db_connection()
        hacker = conn.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed FROM hackers WHERE UUID=?', (uuid,)).fetchall()
        conn.close
        
        hacker_list = [dict(row) for row in hacker]
        
        if len(hacker_list) == 0:
            return jsonify(status=404, message="Hacker Not Found")
        else:
            return jsonify(status=200, message="Hacker Found", hacker=hacker_list)
    except Exception as e:
        return jsonify(status=400, message=str(e))
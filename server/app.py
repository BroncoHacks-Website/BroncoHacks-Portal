from flask import Flask, jsonify, request
import sqlite3
import random


app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def generate_team_id():
    digits = "0123456789"
    random_id = ""

    while len(random_id) < 6:
        random_digit_or_letter_being_inserted_into_the_id = random.choice(digits)
        random_id += random_digit_or_letter_being_inserted_into_the_id

    return str(random.randint(100000, 999999))   

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
    
@app.route("/team", methods=["POST"])
def create_tuah():

    try:
        #getting the parameters from frontend
        data = request.get_json()
        if not data:
            return jsonify({"error": "no data provided"}), 400
        team_name = data.get("teamName")
        owner = data.get("owner")

        #connect to db
        conn = get_db_connection()

        #find out if the owner is confirmed first
        owner_confirmation = conn.execute("SELECT isConfirmed FROM hackers WHERE uuid = ?", (owner,)).fetchone()
        if not owner_confirmation or owner_confirmation[0] == 0:
            return jsonify({"confirmation error": "owner is not confirmed"}), 400
        
        #check from the existing team names and owners in each team
        #deny if owner is already in a team or if the team name already exists
        existing_teams = conn.execute("SELECT teamName, owner FROM teams").fetchall()
        existing_team_names = [team["teamName"] for team in existing_teams]
        existing_team_owners_names = [team["owner"] for team in existing_teams] 
        if team_name in existing_team_names:
            return jsonify({"team error": "team name already in use"}), 400
        if owner in existing_team_owners_names:
            return jsonify({"owner error": "player is already in a team"}), 400
    
        #secure a unique id for the new team once the teamName and owner cases pass verification
        id = generate_team_id()
        list_of_ids = conn.execute("SELECT teamID FROM teams").fetchall()
        while id in list_of_ids:
            id = generate_team_id()

        #insert into teams table
        conn.execute("INSERT INTO teams (teamID, teamName, owner, teamMember1, teamMember2, teamMember3) VALUES (?, ?, ?, ?, ?, ?)", (id, team_name, owner, None, None, None))
        print(f"team {team_name} created with {owner} as the owner")

        #save changes
        conn.commit()

        return jsonify({
            "message": "success !!!! Yippyyyyy",
            "team" : {
                "teamID": id,
                "teamName": team_name,
                "owner": owner,
                "teamMember1": None,
                "teamMember2": None,
                "teamMember3": None
            }
        }), 200
    except Exception as e:
        print("nahh the team creation didn't work")
        return jsonify({"500 error": str(e)}), 500
    finally:
        conn.close()
    
@app.route("/hacker", methods=['GET'])
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

@app.route("/team", methods=['GET'])
def get_a_team_from_id():
    uuid = request.args.get("teamID")
    conn = get_db_connection()

    try:
        team_info = conn.execute(f"SELECT teamID, teamName, owner WHERE teamID = {uuid}")
    except Exception as e:
        return jsonify(status=400, message=str(e))
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
    
        

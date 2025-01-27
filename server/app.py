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
    conn = get_db_connection()

    try:
        #getting the parameters from frontend
        data = request.get_json()
        if not data:
            return jsonify({"error": "no data provided"}), 400
        
        team_name = data.get("teamName")
        owner = data.get("ownerID")

        #find out if the owner is confirmed first
        owner_confirmation = get_hacker()

        #I think Daniel is doing this function so I will just use it when it's done
        existing_teams = get_teams()

        #check from the existing team names and owners in each team
        #deny if owner is already in a team or if the team name already exists
        existing_team_names = [team["teamName"] for team in existing_teams]
        existing_team_owners_names = [king["owner"] for king in existing_teams] 
        if team_name in existing_team_names:
            return jsonify({"error": "team name already in use"})
        if owner in existing_team_owners_names:
            return jsonify({"error": "player is already in a team"})
        
        id = generate_team_id()
        
        with conn.cursor() as cursor:
            sql = "INSERT INTO `hackers` (`teamID`, `teamName`, `owner`, `teamMember1`, `teamMember2`, `teamMember3`) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, (id, team_name, owner, None, None, None))
            print(f"team {team_name} created with {owner} as the owner")
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
        return jsonify({"error": "server error"}), 500
    finally:
        conn.close()
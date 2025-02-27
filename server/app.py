from flask import Flask, jsonify, request
import sqlite3
import random
import bcrypt


app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def generate_team_id():
    return str(random.randint(100000, 999999))

def get_hacker_by_id(hacker_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed, isAdmin FROM hackers WHERE UUID = ?", (hacker_id,))
    hacker = cursor.fetchone()
    conn.close()
    if hacker:
        return dict(hacker)
    return None

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

def generate_confirmation_number():
    return random.randint(100000, 999999)

@app.route("/")
def index():
    string = """
                <h1>Hackers</h1>
                <table>
                    <tr>
                        <th>UUID</th>
                        <th>teamID</th>
                        <th>firstName</th>
                        <th>lastName</th>
                        <th>password</th>
                        <th>email</th>
                        <th>school</th>
                        <th>disord</th>
                        <th>confirmationNumber</th>
                        <th>isConfirmed</th>
                        <th>isAdmin</th>
                    </tr>
             """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM hackers")
    hackers = cursor.fetchall()

    for hacker in hackers:
        string += "<tr>"
        for attr in hacker:
            string += "<th>" + str(attr) + "</th>"
        string += "</tr>"
    string += """</table>
                <h1>Teams</h1>
                <table>
                    <tr>
                        <th>teamID</th>
                        <th>teamName</th>
                        <th>owner</th>
                        <th>teamMember1</th>
                        <th>teamMember2</th>
                        <th>teamMember3</th>
                    </tr>
                """
    cursor.execute("SELECT * FROM teams")
    teams = cursor.fetchall()

    for team in teams:
        string += "<tr>"
        for attr in team:
            string += "<th>" + str(attr) + "</th>"
        string += "</tr>"
    return string + "</table>"

@app.route("/admin", methods=['GET'])
def get_all_data():
    try:
        # retrieve data
        conn = get_db_connection()
        hackers = conn.execute("SELECT * FROM hackers").fetchall()
        teams = conn.execute("SELECT * FROM teams").fetchall()
        
        # organize into lists
        hawk, tuah = [], []
        for hacker in hackers:
            hack = dict(hacker)
            del hack["password"]
            hawk.append(hack)
        for team in teams:
            temu = dict(team)
            tuah.append(temu)
        
        return jsonify(status=200, message="successfully got all data", hackers=hawk, teams=tuah)
    except Exception as e:
        return jsonify(status=400, message=str(e))

########## Hackers ##########
@app.route("/hacker", methods=['POST'])
def create_hacker():
    try:
        data = request.get_json()

        required_fields = ['firstName', 'lastName', 'password', 'email', 'school']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")

        firstName = data['firstName']
        lastName = data['lastName']
        password = hash_password(data['password'])
        email = data['email']
        school = data['school']
        discord = data.get('discord', None)
        teamID = None
        confirmationNumber = generate_confirmation_number()
        isConfirmed = False
        isAdmin = None
    
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM hackers WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify(status=409, message="Email already in use")

        if discord:
            cursor.execute("SELECT * FROM hackers WHERE discord = ?", (discord,))
            if cursor.fetchone():
                conn.close()
                return jsonify(status=409, message="Discord already in use")
        
        cursor.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
               (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin))
        conn.commit()

        hacker_id = cursor.lastrowid
        new_hacker = get_hacker_by_id(hacker_id)
        conn.close()


        return jsonify(status=201, message="Hacker created successfully", hacker=new_hacker)
    except Exception as e:
        return jsonify(status=400,message=str(e))
    
@app.route("/hacker", methods=['GET'])
def getOneHacker():
    # get req param from url
    UUID = request.args.get('UUID')

    if UUID is None:
        return jsonify(status=400, message=f"Missing UUID in query paramter")
    
    try:
        int(UUID)
    except:
        return jsonify(status=422, message="Unprocessable Entity (wrong data type for paramters)")
    
    try:
        conn = get_db_connection()
        hacker = conn.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed, isAdmin FROM hackers WHERE UUID=?', (UUID,)).fetchall()
        conn.close()
        
        hacker_list = [dict(row) for row in hacker]
        if len(hacker_list) == 0:
            return jsonify(status=404, message="Hacker Not Found")
        else:
            return jsonify(status=200, message="Hacker Found", hacker=next(iter(hacker_list)))
    except Exception as e:
        return jsonify(status=400, message=str(e))
    

@app.route("/hackers",  methods=['GET'])
def urmom():
    try:
        conn = get_db_connection() 
        posts = conn.execute('SELECT * FROM hackers').fetchall()
        conn.close()
        posts_list = []

        for row in posts:
            hacker = dict(row)
            del hacker["password"]
            # hacker['password'] = hacker['password'].decode('utf-8')  # Convert bytes to string
            posts_list.append(hacker)
        
        return jsonify(status=200,message="success",hackers=posts_list)
    except Exception as e:
        return jsonify(status=400,message=str(e))
    
@app.route("/hacker", methods=['PUT'])
def update_hacker():
    try:
        data = request.get_json()
        # check if data is empty
        if not data:
            return jsonify(status=404, message="no data provided")
        
        if "isAdmin" in data:
            return jsonify(status=406, message="updating admin privileges not allowed")
        
        UUID = data.get('UUID', None)
        first_name = data.get('firstName', None)
        last_name = data.get('lastName', None)
        school = data.get('school', None)
        discord = data.get('discord', None)

        try:
            int(UUID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for: UUID)")
        password = data.get('password', None)
        if password:
            password = hash_password(data['password'])

        UUID = int(UUID)
        conn = get_db_connection()
        cursor = conn.cursor()
        if not UUID:
            return jsonify(status=404, message="UUID not provided")
        else:
            # check if UUID exists in database
            cursor.execute("SELECT * FROM hackers WHERE UUID = ?", (UUID,))
            hacker = cursor.fetchone()
            if hacker is None:
                return jsonify(message= "UUID not found",status=404)
            
            # update hacker info
            if first_name:
                cursor.execute("UPDATE hackers SET firstName = ? WHERE UUID = ?", (first_name, UUID))
            if last_name:
                cursor.execute("UPDATE hackers SET lastName = ? WHERE UUID = ?", (last_name, UUID))
            if password:
                cursor.execute("UPDATE hackers SET password = ? WHERE UUID = ?", (password, UUID))
            if school:
                cursor.execute("UPDATE hackers SET school = ? WHERE UUID = ?", (school, UUID))
            if discord:
                cursor.execute("SELECT * FROM hackers WHERE discord = ?", (discord,))
                if cursor.fetchone():
                    conn.close()
                    return jsonify(status=409, message="Discord already in use")
                cursor.execute("UPDATE hackers SET discord = ? WHERE UUID = ?", (discord, UUID))

        conn.commit()

        cursor.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed, isAdmin FROM hackers WHERE UUID = ?', (UUID,))
        updated_hacker = cursor.fetchone()

        return jsonify(status=200, message="successfully updated hacker", hacker=dict(updated_hacker))

    except Exception as e:
        return jsonify(status=500, message=str(e))
    finally:
        conn.close()

########## Team ########## 

@app.route("/team", methods=['GET'])
def get_users_team():
    #grab UUID from get request
    UUID = request.args.get("UUID")

    if UUID is None:
        return jsonify(status=400, message=f"Missing UUID in query paramter")
    
    try:
        int(UUID)
    except:
        return jsonify(status=422, message="Unprocessable Entity (wrong data type for paramters)")

    try:
        conn = get_db_connection()
        #find a team based on the UUID of one of the members
        team = conn.execute("SELECT * FROM teams WHERE owner = ? OR teamMember1 = ? OR teamMember2 = ? OR teamMember3 = ?", (UUID, UUID, UUID, UUID)).fetchone()

        #if no team pops up, throw an error
        if not team:
            return jsonify(message= "hacker is not in a team", status=406)
        
        owner = conn.execute("SELECT UUID, firstName, lastName, email, school FROM hackers WHERE UUID = ?", (team["owner"],)).fetchone()
        team_member_1 = conn.execute("SELECT UUID, firstName, lastName, email, school FROM hackers WHERE UUID = ?", (team["teamMember1"],)).fetchone()
        team_member_2 = conn.execute("SELECT UUID, firstName, lastName, email, school FROM hackers WHERE UUID = ?", (team["teamMember2"],)).fetchone()
        team_member_3 = conn.execute("SELECT UUID, firstName, lastName, email, school FROM hackers WHERE UUID = ?", (team["teamMember3"],)).fetchone()
        
        #otherwise, return the team id and the team name
        return jsonify({
            "message": "success, we got them",
            "team": {
                "teamID" : team["teamID"],
                "teamName" : team["teamName"] 
            },
            "owner" : {
                "UUID" : owner["UUID"] if owner else None,
                "firstName" : owner["firstName"] if owner else None,
                "lastName" : owner["lastName"] if owner else None,
                "email": owner["email"] if owner else None,
                "school": owner["school"] if owner else None,
            },
            "teamMember1" : {
                "UUID" : team_member_1["UUID"] if team_member_1 else None,
                "firstName" : team_member_1["firstName"] if team_member_1 else None,
                "lastName" : team_member_1["lastName"] if team_member_1 else None,
                "email": team_member_1["email"] if team_member_1 else None,
                "school": team_member_1["school"] if team_member_1 else None,
            },
            "teamMember2" : {
                "UUID" : team_member_2["UUID"] if team_member_2 else None,
                "firstName" : team_member_2["firstName"] if team_member_2 else None,
                "lastName" : team_member_2["lastName"] if team_member_2 else None,
                "email": team_member_2["email"] if team_member_2 else None,
                "school": team_member_2["school"] if team_member_2 else None,
            },
            "teamMember3" : {
                "UUID" : team_member_3["UUID"] if team_member_3 else None,
                "firstName" : team_member_3["firstName"] if team_member_3 else None,
                "lastName" : team_member_3["lastName"] if team_member_3 else None,
                "email": team_member_3["email"] if team_member_3 else None,
                "school": team_member_3["school"] if team_member_3 else None
            },
            "status":200
        })

    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        conn.close()

@app.route("/team", methods=["POST"])
def create_tuah():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "no data provided","status":400})
        
        required_fields = ['teamName', "owner"]
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
        
        team_name = data.get("teamName")
        owner = data.get("owner")


        if team_name == "":
            return jsonify(status=422, message="Unprocessable Entity (teamName is either empty or invalid data type)")
        
        try:
            int(owner)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for: owner)")

        conn = get_db_connection()
        owner_exists = conn.execute("SELECT UUID FROM hackers WHERE UUID = ?", (int(owner),)).fetchone()

        if not owner_exists:
            return jsonify(status=404, message="Owner does not exist in the database")


        owner_confirmation = conn.execute("SELECT isConfirmed FROM hackers WHERE UUID = ?", (owner,)).fetchone()
        if not owner_confirmation or owner_confirmation[0] == 0:
            return jsonify(message="owner is not confirmed",status=400)
        
        existing_teams = conn.execute("SELECT teamName, owner FROM teams").fetchall()
        existing_team_names = [team["teamName"] for team in existing_teams]
        existing_team_owners_names = [int(team["owner"]) for team in existing_teams] 
        if team_name in existing_team_names:
            return jsonify(message="team name already in use",status=400)
        if owner in existing_team_owners_names:
            return jsonify(message= "player is already in a team",status=400)
    
        id = generate_team_id()
        list_of_ids = conn.execute("SELECT teamID FROM teams").fetchall()
        while id in list_of_ids:
            id = generate_team_id()

        conn.execute("INSERT INTO teams (teamID, teamName, owner, teamMember1, teamMember2, teamMember3) VALUES (?, ?, ?, ?, ?, ?)", (id, team_name, owner, None, None, None))
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
            },
            "status": 200})
    except Exception as e:
        return jsonify(message=str(e),status=500)
    finally:
        conn.close()

@app.route("/team", methods=["DELETE"])
def delete_tuah():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        required_fields = ['teamID', "owner"]
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
        
        team_id = data.get("teamID")
        owner = data.get("owner")

        try:
            int(owner)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for: owner)")
    
        try:
            int(team_id)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for: owner)")

        conn = get_db_connection()

        team_exists = conn.execute("SELECT teamID FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()
        if not team_exists:
            return jsonify(status=404, message="Team does not exist in the database")
        
        owner_Leader = conn.execute("SELECT owner FROM teams WHERE teamID = ? AND owner = ?", (int(team_id), int(owner),)).fetchone()
        if not owner_Leader:
            return jsonify(status=403, message="User is not Owner of the team")
        
        teamcheck = conn.execute("SELECT teamMember1, teamMember2, teamMember3 FROM teams WHERE teamID = ? AND owner = ?", (int(team_id), int(owner),)).fetchone()
        for teamMember in teamcheck:
            if teamMember:
                return jsonify(status=402, message="teammates exist, cannot delete.")
        
        conn.execute("DELETE FROM teams WHERE teamID = ?", (int(team_id),))
        conn.execute("UPDATE hackers SET teamID = NULL where UUID = ?",(int(owner),))
        conn.commit()

        return jsonify({
            "message": "team deleted","status":"200"})
    except Exception as e:
        return jsonify(message=str(e),status=500)
    finally:
        conn.close()

@app.route("/team/removeTeamMember", methods=['PUT'])
def remove_that_playa():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        team_id = data.get("teamID")
        owner = data.get("owner")
        team_member_to_kick = data.get("teamMember")

        conn = get_db_connection()

        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        if not team:
            return jsonify(status=404, message="Team does not exist in the database")
        
        if owner != team["owner"]:
            return jsonify(status=418, message="This user is not the owner of the team")
        
        if team_member_to_kick not in [team["teamMember1"], team["teamMember2"], team["teamMember3"]]:
            return jsonify(status=404, message="Team Member the Owner is trying to kick is not in the team")

        #shift the other teamMembers up when the player needing to be kicked is either teamMember1 or teamMember2 and set teamMember3 to null
        conn.execute("""
            UPDATE teams 
            SET 
            teamMember1 = CASE WHEN teamMember1 = ? THEN teamMember2 ELSE teamMember1 END, 
            teamMember2 = CASE WHEN teamMember1 = ? THEN teamMember3 WHEN teamMember2 = ? THEN teamMember3 ELSE teamMember2 END, 
            teamMember3 = CASE WHEN teamMember1 = ? OR teamMember2 = ? THEN NULL WHEN teamMember3 = ? THEN NULL ELSE teamMember3 END 
            WHERE teamID = ?
        """, (team_member_to_kick, team_member_to_kick, team_member_to_kick, team_member_to_kick, team_member_to_kick, team_member_to_kick, team_id)
        )
        conn.execute("UPDATE hackers SET teamID = NULL WHERE UUID = ?", (team_member_to_kick,))
        conn.commit()
        
        kicked_member_info = get_hacker_by_id(team_member_to_kick)
        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        return jsonify({
            "message": "Success",
            "status": 200,
            "team": {
                "teamID": team_id,
                "teamName": team["teamName"],
                "owner": owner,
                "teamMember1": team["teamMember1"],
                "teamMember2": team["teamMember2"],
                "teamMember3": team["teamMember3"]
            },
            "removedMember": {
                "UUID": kicked_member_info["UUID"],
                "teamID": kicked_member_info["teamID"]
            }
        })
    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        conn.close()
        
@app.route("/teams", methods=['GET'])
def get_team():
    try:
        conn = get_db_connection()
        posts = conn.execute('SELECT * FROM teams').fetchall()
        conn.close()
        posts_list = []
        
        for row in posts:
            team = dict(row)
            posts_list.append(team)
    
        return jsonify(status=200, message="success", teams=posts_list)
    except Exception as e:
        return jsonify(status=400, message=str(e))
        
@app.route("/team/leave", methods=["PUT"])
def memberLeave():
    
    try:
        # check if missing data
        data = request.get_json()
        
        if not data:
            return jsonify(message="No data provided",status=400)
        
        required_fields = ['teamID', "teamMember"]
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
            
        teamID = data["teamID"]
        member = data["teamMember"]

        try:
            int(teamID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (teamID is of wrong type)")

        try:
            int(member)
        except:
            return jsonify(status=422, message="Unprocessable Entity (Member is of wrong type)")
        
        # flags to see which member of the team in the db they are
        isMem1 = False
        isMem2 = False
        isMem3 = False
        
        conn = get_db_connection()
        
        # check if team exists
        find_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
        convert_team = [dict(row) for row in find_team]
        if len(find_team) == 0:
            return jsonify(status=404, message="Team does not exist")
        
        # check if member is owner or is not in team
        teamData = convert_team[0]
            
        try:
            if int(teamData["owner"]) == member:
                return jsonify(status=403, message="Owner may not leave team")
            elif int(teamData["teamMember1"]) == member:
                isMem1 = True
            elif int(teamData["teamMember2"]) == member:
                isMem2 = True
            elif int(teamData["teamMember3"]) == member:
                isMem3 = True
            else:
                return jsonify(status=404, message="Not a member of team")
        except:
            return jsonify(status=404, message="Not a member of team")
        
        # change team db and shift members over
        if (isMem1):
            shift = conn.execute('UPDATE teams SET teamMember1=?, teamMember2=?, teamMember3=NULL', (teamData["teamMember2"],teamData["teamMember3"],))
        elif (isMem2):
            shift = conn.execute('UPDATE teams SET teamMember2=?, teamMember3=NULL', (teamData["teamMember3"],))
        else:
            shift = conn.execute('UPDATE teams SET teamMember3=NULL')
            
        # remove teamID from hacker
        remove = conn.execute('UPDATE hackers SET teamID=NULL WHERE UUID=?', (member,))
        
        conn.commit()
        
        res = conn.execute('SELECT UUID, teamID FROM hackers WHERE UUID=?', (member,))
        convert_res = [dict(row) for row in res]
        conn.close()
        
        return jsonify(status=200, message="Success", hacker=next(iter(convert_res)))
    except Exception as e:
        return jsonify(status=400, message=str(e))
    
@app.route("/team/owner", methods=["PUT"])
def switcheroo():
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify(message="no data provided",status=400)
        
        required_fields = ['teamID', 'owner', 'teamMember']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
            
        owner = data['owner']
        member = data['teamMember']
        teamID = data['teamID']
        
        # Check if owner and member are ints
        try:
            int(owner)
        except:
            return jsonify(status=422, message="Unprocessable Entity (Owner is of wrong type)")

        try:
            int(member)
        except:
            return jsonify(status=422, message="Unprocessable Entity (Member is of wrong type)")
        
        try:
            if owner == member:
                return jsonify(status=422, message="Duplicate Entity")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # check if team exists
        try:
            conn = get_db_connection()
            find_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            convert_team = [dict(row) for row in find_team]
            if len(find_team) == 0:
                return jsonify(status=404, message="Team Not Found")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # check if owner and member exist
        try:
            conn = get_db_connection()
            found_hackers = conn.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed FROM hackers WHERE UUID=? OR UUID=?', (owner, member,)).fetchall()
            conn.close()
            
            if len(found_hackers) < 2:
                return jsonify(status=400, message="Owner or Member does not exist")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # Check if owner is actually the owner
        try:
            conn = get_db_connection()
            found_owner = conn.execute('SELECT owner FROM teams WHERE teamID=?', (teamID,)).fetchall()
            conn.close()
            convert_owner = [dict(row) for row in found_owner]
            if int(next(iter(convert_owner))["owner"]) != owner:
                return jsonify(status=400, message="Owner provided is not the owner of the teamID provided")
        except Exception as e:
                return jsonify(status=400, message=str(e))
        
        # Check if owner and member exist AND if owner and member are on the same team
        try:
            conn = get_db_connection()
            found_hackers = conn.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, confirmationNumber, isConfirmed FROM hackers WHERE UUID=? OR UUID=?', (owner, member,)).fetchall()
            convert_found = [dict(row) for row in found_hackers]
            conn.close()
            
            # since we already validated that owner is the owner of the team, if the teamMember and owner are different team, then member is not on team
            if convert_found[0]["teamID"] != convert_found[1]["teamID"]:
                return jsonify(status=400, message="Team Member is not a member of given teamID")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # actually switch the ownership
        try:
            conn = get_db_connection()
            
            #switch teamMember to owner
            update_ownership = conn.execute('UPDATE teams SET owner=? WHERE teamID=?', (member, teamID,))
            
            # switch owner to teamMember
            test_1 = conn.execute('SELECT teamMember1 FROM teams WHERE teamID=?', (teamID,)).fetchall()
            test_2 = conn.execute('SELECT teamMember2 FROM teams WHERE teamID=?', (teamID,)).fetchall()
            conv_test_1 = [dict(row) for row in test_1]
            conv_test_2 = [dict(row) for row in test_2]
            
            if int(next(iter(conv_test_1))["teamMember1"]) == member:
                update_ownership_again = conn.execute('UPDATE teams SET teamMember1=? WHERE teamID=?', (owner, teamID,))
            elif int(next(iter(conv_test_2))["teamMember2"]) == member:
                update_ownership_again = conn.execute('UPDATE teams SET teamMember2=? WHERE teamID=?', (owner, teamID,))
            else:
                update_ownership_again = conn.execute('UPDATE teams SET teamMember3=? WHERE teamID=?', (owner, teamID,))
                
            conn.commit()
            
            # get team data for response
            get_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            res = [dict(row) for row in get_team]
            
            conn.close()
                
            return jsonify(status=200, message="Success", team=next(iter(res)))
        except Exception as e:
            return jsonify(status=404, message="boohoo")
    except Exception as e:
        return jsonify(status=400, message=str(e))
    
@app.route("/team/addTeamMember", methods=["PUT"])
def addTeamMember():
    try:
        data = request.get__json()
        
        if not data:
            return jsonify(message="no data provided", status=400)
        
        required_fields = ['teamID', 'teamMember']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
        
        teamID = data['teamID']
        member = data['teamMember'] 
        
        # check if member is an int
        try:
            int(member)
        except:
            return jsonify(status=422, message="Unprocessable Entity (Member is of wrongtype)")
        
        # check if team is an int
        try:
            int(teamID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (Member is of wrong type)")
        
        #check if user is confirmed
        try: 
            conn = get_db_connection()
            found_hacker=conn.execute("SELECT confirmationNumber, isConfirmed FROM hackers WHERE UUID=?", (member,)).fetchall()
            conn.close()
            convert_hacker = [dict(row) for row in found_hacker]
            
            if len(convert_hacker) < 2:
                return jsonify(status=400, message="Member does not exist")
        except:
            return jsonify(status=422, message=str(e))
        
        #check if team exists
        try:
            conn = get_db_connection()
            find_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            conn.close()
            convert_team = [dict(row) for row in find_team]
            if len(find_team) == 0:
                return jsonify(status=404, message="Team does not exist")
        except Exception as e:
            return jsonify(status=404, message=str(e))
            
        #check if member is already apart of the team
        try:
            conn = get_db_connection()
            find_member = conn.execute('SELECT teamMember1, teamMember2, teamMember3 FROM teams WHERE teamMember1=? or teamMember2=? or teamMember3=?', (member, member, member)).fetchall()
            conn.close()
            convert_member = [dict(row) for row in find_member]
            if len(convert_member) > 0:
                return jsonify(status=404, message="Team member already on team")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        #check if team is full
        try:
            conn = get_db_connection()
            find_team = conn.execute('SELECT teamMember1, teamMember2, teamMember3 FROM teams WHERE teamID=?', (teamID,)).fetchall()
            conn.close()
            convert_team = [dict(row) for row in find_team]
            counter = 0
            for hacker in convert_team:
                if hacker != None:
                    counter += 1
                if counter == 3:
                    return jsonify(status=404, message="Team is full")
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # add member to team
        try:
            conn = get_db_connection()
            find_members = conn.execute('SELECT teamMember1, teamMember2, teamMember3 FROM teams WHERE teamID=?', (teamID,)).fetchall()
            convert_members = [dict(row) for row in find_members]
            counter = 0
            for hacker in convert_members:
                if hacker == None:
                    if counter == 0:
                        add_team_member=conn.execute(UPDATE teamMember1)
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
        # add teamID to member
        
    except:
        return urmom
        
    
if __name__ == "__main__":
    app.run(debug=True)
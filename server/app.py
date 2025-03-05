from flask import Flask, jsonify, request, make_response, send_from_directory, abort
import sqlite3
import random
import bcrypt
import json
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
import requests
import sqlitecloud

#Settings
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = 'sybautspmo'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


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

#Admin
@app.route("/")
def index():
    conn = get_db_connection()
    return "Server is Running :)"

@app.route("/admin", methods=['GET']) #Good
@jwt_required()
@cross_origin()
def get_all_data():
    try:
        # retrieve data
        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)
        if not hacker["isAdmin"]:
            return jsonify(status=401, message="fuck outta here",)
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

@app.route("/admin/sql", methods=['PUT']) #Good
@jwt_required()
@cross_origin()
def switchit():
    try:
        # retrieve data
        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)
        if not hacker["isAdmin"]:
            return jsonify(status=401, message="fuck outta here non admin",)
        conn = get_db_connection()
        data = request.get_json()
        sql = data['sql']
        secret = data['secret']
        if (str(secret) != "bruh"):
            return jsonify(status=401, message="fuck outta here wrong code",)
        
        conn.execute(sql)
        conn.commit()
        return jsonify(status=200,message="Succesfully ran: " + str(sql))


    except Exception as e:
        return jsonify(status=400, message=str(e))
    
    
@app.route("/admin/approve", methods=['PUT']) #Good
@jwt_required()
@cross_origin()
def approve():
    try:
        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)
        if not hacker["isAdmin"]:
            return jsonify(status=401, message="fuck outta here bitch",)
        
        data = request.get_json()
        
        if not data:
            return jsonify(message="No data provided", status=400)
        
        required_fields = ['teamID']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, messsage=f"Missing {field}")
            
        teamID = data["teamID"]
        
        try:
            int(teamID)
        except:
            return jsonify(status=422, message="Unprocessable Entity")
        
        try:
            conn = get_db_connection()
            # check if team exists
            find_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            if len(find_team) == 0:
                return jsonify(status=404, message="Team does not exist")
            conn.close()
        except:
            return jsonify(status=404, message="Team does not exist")
        
        # change status
        
        try:
            conn = get_db_connection()
            
            team_thang = conn.execute('SELECT status FROM teams WHERE teamID=?', (teamID,)).fetchall()
            convert_thang = [dict(row) for row in team_thang]
            status = convert_thang[0]["status"].lower()
            if (status == "pending" or status == "unregistered"):
                conn.execute('UPDATE teams SET status=? WHERE teamID=?', ("approved", teamID,))
                conn.commit()
            elif (convert_thang[0]["status"].lower() == "approved"):
                return jsonify(status=400, message="Already Approved")
            else:
                return jsonify(status=400, message="Team is Not Pending Or Unregistered")   
            conn.close()         
        except:
            return jsonify(status=404, message="yeah it didnt change dumass")
        
        # email shit
        try:
            conn = get_db_connection()
            
            all_members = conn.execute('SELECT owner, teamMember1, teamMember2, teamMember3 FROM teams WHERE teamID=?', (teamID,)).fetchall()
            mem_arr = [dict(row) for row in all_members]

            json_str = json.dumps(mem_arr[0])
            pyobj = json.loads(json_str)
            for key, value in pyobj.items():
                if value is not None:
                    hacker = get_hacker_by_id(value)
                    if hacker["email"]:     
                        sendmail = requests.post(
                                                "https://api.mailgun.net/v3/send.broncohacksportal.org/messages",
                                                auth=("api", os.getenv('API_KEY')),
                                                data={
                                                    "from": "BroncoHacks2025 <postmaster@send.broncohacksportal.org>",
                                                    "to": f"{hacker["firstName"]} {hacker["lastName"]} <{hacker["email"]}>",
                                                    "subject": "[BroncoHacks2025] Your Team Has Been Approved!",
                                                    "html": """
                                                        <!DOCTYPE html>
                                                        <html lang="en">
                                                            <head>
                                                                <meta charset="UTF-8">
                                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                <title>Your Team is Approved!</title>
                                                            </head>
                                                            <body style="font-family: Arial, sans-serif; color: #01426A; background-color: #f4f4f4; padding: 20px; margin: 0;">
                                                                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                                                    
                                                                    <!-- Logo -->
                                                                    <img src="https://www.broncohacks.org/assets/BroncoHacks_Logo-DleTz4ik.png" alt="BroncoHacks Logo" style="max-width: 200px; margin-bottom: 20px;">

                                                                    <!-- Header -->
                                                                    <h2 style="color: #00843D;">Your Team Has Been Approved for BroncoHacks 2025! 🎉</h2>

                                                                    <!-- Message -->
                                                                    <p style="font-size: 16px; line-height: 1.6;">
                                                                        If you wish to make changes regarding your team, please <strong>unsubmit your application and resubmit.</strong>
                                                                    </p>

                                                                    <p style="font-size: 16px; line-height: 1.6; font-weight: bold;">
                                                                        Otherwise, lock in and Start Hacking! 🚀
                                                                    </p>

                                                                    <!-- Call to Action -->
                                                                    <a href="https://broncohacks.org" 
                                                                        style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #00843D; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                                                                        Visit BroncoHacks Portal
                                                                    </a>

                                                                </div>
                                                            </body>
                                                        </html>
                                                    """
                                                }
                                            )

                
            conn.close()
            
            return jsonify(status=200, message="poggers")
                    
        except Exception as e:
            return jsonify(status=404, message=str(e))
        
    except Exception as e:
        return jsonify(status=400, message=str(e))
    
@app.route('/admin/download', methods=['GET']) #Good
@jwt_required()
@cross_origin()
def download_file():
    UUID = get_jwt_identity()
    hacker = get_hacker_by_id(UUID)
    if not hacker["isAdmin"]:
        return jsonify(status=401, message="fuck outta here bitch",)
    file_path = os.path.join(BASE_DIR, "database.db")
    
    if not os.path.isfile(file_path):
        abort(404, "File not found")

    return send_from_directory(BASE_DIR, "database.db", as_attachment=True)

#Tokens
@app.route("/login", methods=["GET"]) #Good
@cross_origin()
def login():
    email = request.args.get('email')
    if email is None:
        return jsonify(status=400, message=f"Missing email in query paramter")
    email = email.lower()
    password = request.args.get('password')
    if password is None:
        return jsonify(status=400, message=f"Missing passowrd in query paramter")
    
    try:
        conn = get_db_connection()
        hacker = conn.execute('SELECT * FROM hackers WHERE email=?', (email,)).fetchall()
        conn.close()
        
        hacker_list = [dict(row) for row in hacker]
        if len(hacker_list) == 0:
            return jsonify(status=404, message="Email Not Found"),404
        else:
            user = hacker_list[0]
            if bcrypt.checkpw(password.encode('utf-8'), user['password']):
                access_token = create_access_token(identity=str(user["UUID"]))
                return jsonify(status=200, message="Correct Password", token=access_token, isConfirmed=user["isConfirmed"], isAdmin=user["isAdmin"]),200
            else:
                return jsonify(status=403,message="Incorrect Password"),403
    except Exception as e:
        return jsonify(status=400, message=str(e)),400
    
@app.route("/whoami", methods=["GET"]) #Good
@jwt_required()
@cross_origin()
def whoami():
    try:
        UUID = get_jwt_identity()
        if UUID:
            return jsonify(status=200, UUID=str(UUID)),200
        else:
            return jsonify(status=401,message="UUID not found with corresponding token"),401
    except Exception as e:
        return jsonify(status=400, message=str(e)),400
    
@app.route("/logout", methods=["POST"]) #Good
@jwt_required()
@cross_origin()
def logout():
    try:
        response = jsonify({"msg": "logout successful","status":200})
        unset_jwt_cookies(response)
        return response
    except Exception as e:
        return jsonify(status=401,message=str(e)),401
    
@app.route("/sendPasswordReset", methods=['GET']) #Good
@cross_origin()
def sendPasswordReset():
    try:
        email = request.args.get('email')
        conn = get_db_connection()
        cursor = conn.cursor()

        hacker = cursor.execute("SELECT * FROM hackers WHERE email = ?", (email,)).fetchone()
        if not hacker:
            conn.close()
            return jsonify(status=401, message="Email not found"),401
        else:
            hacker_id = hacker["UUID"]
            access_token = create_access_token(identity=str(hacker_id))
            sendmail = requests.post(
                                    "https://api.mailgun.net/v3/send.broncohacksportal.org/messages",
                                    auth=("api", os.getenv('API_KEY')),
                                    data={
                                        "from": "BroncoHacks2025 <postmaster@send.broncohacksportal.org>",
                                        "to": email,
                                        "subject": "BroncoHacks2025",
                                        "html": f"""
                                            <!DOCTYPE html>
                                            <html lang="en">
                                                <head>
                                                    <meta charset="UTF-8">
                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <title>Reset Your Password</title>
                                                </head>
                                                <body style="font-family: Arial, sans-serif; color: #01426A; background-color: #f4f4f4; padding: 20px; margin: 0;">
                                                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                                                        
                                                        <!-- Logo -->
                                                        <img src="https://www.broncohacks.org/assets/BroncoHacks_Logo-DleTz4ik.png" alt="BroncoHacks Logo" style="max-width: 200px; margin-bottom: 20px;">

                                                        <!-- Header -->
                                                        <h2 style="color: #00843D;">Reset Your Password</h2>

                                                        <!-- Message -->
                                                        <p style="font-size: 16px; line-height: 1.6;">
                                                            You recently requested to reset your password for <strong>BroncoHacks 2025</strong>.
                                                            Click the button below to proceed.
                                                        </p>

                                                        <!-- Reset Password Button -->
                                                        <a href="http://broncohacksportal.org/ResetPassword?token={access_token}" 
                                                            style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #00843D; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                                                            Reset Your Password
                                                        </a>

                                                        <!-- Expiry Notice -->
                                                        <p style="font-size: 14px; color: #777; margin-top: 20px;">
                                                            This link will expire soon. If you did not request a password reset, please ignore this email.
                                                        </p>
                                                    </div>
                                                </body>
                                            </html>
                                        """
                                    }
                                )
            print(sendmail)
            return jsonify(status=200,message="Email Sent!"),200

    except Exception as e:
        return jsonify(status=400,message=str(e)),400
    
@app.route("/resetPassword", methods=['PUT']) #Good
@jwt_required()
@cross_origin()
def resetPassword():
    data = request.get_json()
    password = data['password']
    newPassword = hash_password(password)
    try:
        UUID = get_jwt_identity()
        if UUID:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE hackers SET password = ? WHERE UUID = ?", (newPassword, UUID))
            conn.commit()
            return jsonify(status=200, message="Password Updated"),200
        else:
            return jsonify(status=401,message="Session Has Expired"),401
    except Exception as e:
        return jsonify(status=400, message=str(e)),400


@app.after_request
def refresh_expiring_jwts(response): #Done
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

########## Hackers ##########
@app.route("/hacker", methods=['POST']) #Done
@cross_origin()
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
        email = data['email'].lower()
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
            return jsonify(status=409, message="Email already in use"),409

        if discord:
            cursor.execute("SELECT * FROM hackers WHERE discord = ?", (discord,))
            if cursor.fetchone():
                conn.close()
                return jsonify(status=409, message="Discord already in use"),409
        
        cursor.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
               (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin))
        conn.commit()

        hacker_id = cursor.lastrowid
        new_hacker = get_hacker_by_id(hacker_id)
        conn.close()
        sendmail =  requests.post(
                                 "https://api.mailgun.net/v3/send.broncohacksportal.org/messages",
                                 auth=("api", os.getenv('API_KEY')),
                                 data={
                                    "from": "BroncoHacks2025 <postmaster@send.broncohacksportal.org>",
                                    "to": email,
                                    "subject": "[BroncoHacks2025] Welcome To BroncoHacks",
                                    "html": f"""
                                        <html>
                                            <body style="font-family: Arial, sans-serif; color: #01426A; background-color: #f4f4f4; padding: 20px;">
                                                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                                    
                                                    <!-- Logo -->
                                                    <div style="text-align: center; margin-bottom: 20px;">
                                                        <img src="https://www.broncohacks.org/assets/BroncoHacks_Logo-DleTz4ik.png" alt="BroncoHacks Logo" style="max-width: 200px;">
                                                    </div>

                                                    <!-- Header -->
                                                    <h2 style="color: #00843D; text-align: center;">Welcome to BroncoHacks 2025!</h2>
                                                    
                                                    <!-- Greeting -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        Hello <strong>{firstName} {lastName}</strong>,  
                                                    </p>
                                                    
                                                    <!-- Message -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        Thank you for registering for BroncoHacks 2025! To complete your registration, use the verification code below:
                                                    </p>

                                                    <!-- Verification Code Box -->
                                                    <div style="background-color: #00843D; color: #FFB500; padding: 15px; border-radius: 6px; text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
                                                        {confirmationNumber}
                                                    </div>

                                                    <!-- Closing Message -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        We’re excited to have you join us at BroncoHacks! 🚀  
                                                    </p>
                                                </div>
                                            </body>
                                        </html>
                                    """
                                }
                            )
        access_token = create_access_token(identity=str(hacker_id))
        return jsonify(status=200, message="Hacker created successfully", hacker=new_hacker, token=access_token),200
    except Exception as e:
        return jsonify(status=400,message=str(e)),400
    
@app.route("/hacker", methods=['GET']) #Done
@jwt_required()
@cross_origin()
def getOneHacker():
    # get req param from url
    UUID = request.args.get('UUID')

    token_UUID = get_jwt_identity()
    if UUID != token_UUID:
        return jsonify(status=403, message=f"Incorrect User"),403
    
    if UUID is None:
        return jsonify(status=400, message=f"Missing UUID in query paramter"),400
    
    try:
        int(UUID)
    except:
        return jsonify(status=422, message="Unprocessable Entity (wrong data type for paramters)"),422
    
    try:
        conn = get_db_connection()
        hacker = conn.execute('SELECT UUID, teamID, firstName, lastName, email, school, discord, isConfirmed, isAdmin FROM hackers WHERE UUID=?', (UUID,)).fetchall()
        conn.close()
        
        hacker_list = [dict(row) for row in hacker]
        if len(hacker_list) == 0:
            return jsonify(status=404, message="Hacker Not Found"),404
        else:
            return jsonify(status=200, message="Hacker Found", hacker=next(iter(hacker_list))),200
    except Exception as e:
        return jsonify(status=400, message=str(e)),400
    
@app.route("/code", methods=['POST']) #Done
@jwt_required()
@cross_origin()
def getCode():
    # get req param from url
    try:
        data = request.get_json()
        required_fields = ['UUID','confirmationNumber']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")
        
        UUID = data['UUID']
        confirmationNumber = data["confirmationNumber"]
        token_UUID = get_jwt_identity()

        print("here")
        print(UUID,token_UUID)
        if str(UUID) != str(token_UUID):
            print("there")
            return jsonify(status=403,message="Forbidden")
        
        if UUID is None:
            return jsonify(status=400, message=f"Missing UUID in query paramter"),400
        
        try:
            int(UUID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for UUID)"),422
        
        if confirmationNumber is None:
            return jsonify(status=400, message=f"Missing confirmationNumber in query paramter"),400
        
        try:
            int(confirmationNumber)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for confirmationNumber)"),422
        
        conn = get_db_connection()
        hacker = conn.execute('SELECT confirmationNumber FROM hackers WHERE UUID=?', (UUID,)).fetchall()
        
        hacker_list = [dict(row) for row in hacker]
        if len(hacker_list) == 0:
            return jsonify(status=404, message="Hacker Not Found"),404
        else:
            if hacker_list[0]["confirmationNumber"] == int(confirmationNumber):
                conn.execute("UPDATE hackers SET isConfirmed = ? WHERE UUID = ?", (True, UUID))
                conn.commit()
                return jsonify(status=200, message="Account is now confirmed"),200
            else:
                return jsonify(status=403, message="Incorrect Code"),403

    except Exception as e:
        return jsonify(status=400, message=str(e)),400
    
@app.route("/code", methods=['PUT'])
@jwt_required()
@cross_origin()
def changeCode():
    # get req param from url
    try:
        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)
        confirmationNumber = generate_confirmation_number()
        conn = get_db_connection()
        conn.execute("UPDATE hackers SET confirmationNumber = ? WHERE UUID = ?", (confirmationNumber, UUID))
        conn.commit()
        sendmail =  requests.post(
                                 "https://api.mailgun.net/v3/send.broncohacksportal.org/messages",
                                 auth=("api", os.getenv('API_KEY')),
                                 data={
                                    "from": "BroncoHacks2025 <postmaster@send.broncohacksportal.org>",
                                    "to": f"{hacker["firstName"]} {hacker["lastName"]} <{hacker["email"]}>",
                                    "subject": "[BroncoHacks2025] Welcome To BroncoHacks",
                                    "html": f"""
                                        <html>
                                            <body style="font-family: Arial, sans-serif; color: #01426A; background-color: #f4f4f4; padding: 20px;">
                                                <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                                                    
                                                    <!-- Logo -->
                                                    <div style="text-align: center; margin-bottom: 20px;">
                                                        <img src="https://www.broncohacks.org/assets/BroncoHacks_Logo-DleTz4ik.png" alt="BroncoHacks Logo" style="max-width: 200px;">
                                                    </div>

                                                    <!-- Header -->
                                                    <h2 style="color: #00843D; text-align: center;">Welcome to BroncoHacks 2025!</h2>
                                                    
                                                    <!-- Greeting -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        Hello <strong>{hacker["firstName"]} {hacker["lastName"]}</strong>,  
                                                    </p>
                                                    
                                                    <!-- Message -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        Thank you for registering for BroncoHacks 2025! To complete your registration, use the verification code below:
                                                    </p>

                                                    <!-- Verification Code Box -->
                                                    <div style="background-color: #00843D; color: #FFB500; padding: 15px; border-radius: 6px; text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
                                                        {confirmationNumber}
                                                    </div>

                                                    <!-- Closing Message -->
                                                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">
                                                        We’re excited to have you join us at BroncoHacks! 🚀  
                                                    </p>

                                                    <!-- Contact Info -->
                                                    <p style="font-size: 14px; color: #777; text-align: center;">
                                                        If you have any questions, reach out at  
                                                        <a href="mailto:contact@broncohacks.org" style="color: #01426A; font-weight: bold;">contact@broncohacks.org</a>.
                                                    </p>
                                                </div>
                                            </body>
                                        </html>
                                    """
                                }
                            )
        
        return jsonify(status=200, message="New Verification Code is Sent!"),200
    except Exception as e:
        return jsonify(status=400, message=str(e)),400
    
# @app.route("/hackers",  methods=['GET'])
# @jwt_required()
# @cross_origin()
# def urmom():
#     try:
#         conn = get_db_connection() 
#         posts = conn.execute('SELECT * FROM hackers').fetchall()
#         conn.close()
#         posts_list = []

#         for row in posts:
#             hacker = dict(row)
#             del hacker["password"]
#             # hacker['password'] = hacker['password'].decode('utf-8')  # Convert bytes to string
#             posts_list.append(hacker)
        
#         return jsonify(status=200,message="success",hackers=posts_list)
#     except Exception as e:
#         return jsonify(status=400,message=str(e))
    
@app.route("/hacker", methods=['PUT']) #Done
@jwt_required()
@cross_origin()
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
        discord = data.get('discord', None)
        school = data.get('school', None)

        token_UUID = get_jwt_identity()
        if UUID != token_UUID:
            return jsonify(status=403,message="Forbidden")

        try:
            int(UUID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (wrong data type for: UUID)")

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
            if first_name and (first_name != hacker["firstName"]):
                cursor.execute("UPDATE hackers SET firstName = ? WHERE UUID = ?", (first_name, UUID))
            if last_name and (last_name != hacker["lastName"]):
                cursor.execute("UPDATE hackers SET lastName = ? WHERE UUID = ?", (last_name, UUID))
            if school and (school != hacker["school"]):
                cursor.execute("UPDATE hackers SET school = ? WHERE UUID = ?", (school, UUID))
            if discord and (discord!= hacker["discord"]):
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

@app.route("/team", methods=['GET']) #Done
@jwt_required()
@cross_origin()
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
        
        owner = conn.execute("SELECT UUID, firstName, lastName, email, school, discord FROM hackers WHERE UUID = ?", (team["owner"],)).fetchone()
        team_member_1 = conn.execute("SELECT UUID, firstName, lastName, email, school, discord FROM hackers WHERE UUID = ?", (team["teamMember1"],)).fetchone()
        team_member_2 = conn.execute("SELECT UUID, firstName, lastName, email, school, discord FROM hackers WHERE UUID = ?", (team["teamMember2"],)).fetchone()
        team_member_3 = conn.execute("SELECT UUID, firstName, lastName, email, school, discord FROM hackers WHERE UUID = ?", (team["teamMember3"],)).fetchone()

        token_UUID = get_jwt_identity()
        UUIDs = []
        if owner["UUID"]:
            UUIDs.append(str(owner["UUID"]))
        if team_member_1["UUID"]:
            UUIDs.append(str(team_member_1["UUID"]))
        if team_member_2["UUID"]:
            UUIDs.append(str(team_member_2["UUID"]))
        if team_member_3["UUID"]:
            UUIDs.append(str(team_member_3["UUID"]))
        if (str(token_UUID) not in UUIDs):
            return jsonify(message= "hacker is not in a team, TOKEN NOT ACCEPTED", status=403)

        
        #otherwise, return the team id and the team name
        return jsonify({
            "message": "success, we got them",
            "team": {
                "teamID" : team["teamID"],
                "teamName" : team["teamName"],
                "status": team["status"]
            },
            "owner" : {
                "UUID" : owner["UUID"] if owner else None,
                "firstName" : owner["firstName"] if owner else None,
                "lastName" : owner["lastName"] if owner else None,
                "email": owner["email"] if owner else None,
                "school": owner["school"] if owner else None,
                "discord": owner["discord"] if owner else None,
            },
            "teamMember1" : {
                "UUID" : team_member_1["UUID"] if team_member_1 else None,
                "firstName" : team_member_1["firstName"] if team_member_1 else None,
                "lastName" : team_member_1["lastName"] if team_member_1 else None,
                "email": team_member_1["email"] if team_member_1 else None,
                "school": team_member_1["school"] if team_member_1 else None,
                "discord": team_member_1["discord"] if team_member_1 else None,
            },
            "teamMember2" : {
                "UUID" : team_member_2["UUID"] if team_member_2 else None,
                "firstName" : team_member_2["firstName"] if team_member_2 else None,
                "lastName" : team_member_2["lastName"] if team_member_2 else None,
                "email": team_member_2["email"] if team_member_2 else None,
                "school": team_member_2["school"] if team_member_2 else None,
                "discord": team_member_2["discord"] if team_member_2 else None,
            },
            "teamMember3" : {
                "UUID" : team_member_3["UUID"] if team_member_3 else None,
                "firstName" : team_member_3["firstName"] if team_member_3 else None,
                "lastName" : team_member_3["lastName"] if team_member_3 else None,
                "email": team_member_3["email"] if team_member_3 else None,
                "school": team_member_3["school"] if team_member_3 else None,
                "discord": team_member_3["discord"] if team_member_3 else None,
            },
            "status":200
        })

    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        conn.close()

@app.route("/team", methods=["POST"]) #Done
@jwt_required()
@cross_origin()
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

        token_UUID = get_jwt_identity()
        if str(owner) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)


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
        
        existing_teams = conn.execute("SELECT teamName, owner, teamMember1, teamMember2, teamMember3 FROM teams").fetchall()
        existing_team_names = [team["teamName"] for team in existing_teams]
        existing_team_owners_names = [int(team["owner"]) for team in existing_teams] 
        existing_teamMember1 = [team["teamMember1"] for team in existing_teams]
        existing_teamMember2 = [team["teamMember2"] for team in existing_teams]
        existing_teamMember3 = [team["teamMember3"] for team in existing_teams]
        if team_name in existing_team_names:
            return jsonify(message="team name already in use",status=400)
        if owner in existing_team_owners_names:
            return jsonify(message="owner is already in a team",status=400)
        if str(owner) in existing_teamMember1:
            return jsonify(message="user is already in a team (member 1)",status=400)
        if str(owner) in existing_teamMember2:
            return jsonify(message="user is already in a team (member 2)",status=400)
        if str(owner) in existing_teamMember3:
            return jsonify(message="user is already in a team (member 3)",status=400)
    
        id = generate_team_id()
        list_of_ids = conn.execute("SELECT teamID FROM teams").fetchall()
        while id in list_of_ids:
            id = generate_team_id()

        conn.execute("INSERT INTO teams (teamID, teamName, owner, teamMember1, teamMember2, teamMember3, status) VALUES (?, ?, ?, ?, ?, ?, ?)", (id, team_name, owner, None, None, None, "unregistered",))
        conn.execute("UPDATE hackers SET teamID = ? where UUID = ?",(id, int(owner)))
        conn.commit()

        return jsonify({
            "message": "success !!!! pYippyyyyy",
            "team" : {
                "teamID": id,
                "teamName": team_name,
                "owner": owner,
                "teamMember1": None,
                "teamMember2": None,
                "teamMember3": None,
                "status" : 'unregistered'
            },
            "status": 200})
    except Exception as e:
        return jsonify(message=str(e),status=500)
    finally:
        conn.close()

@app.route("/team", methods=["DELETE"]) #Done
@jwt_required()
@cross_origin()
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

        token_UUID = get_jwt_identity()
        if str(owner) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)

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
            "message": "team deleted","status":200})
    except Exception as e:
        return jsonify(message=str(e),status=500)
    finally:
        conn.close()

@app.route("/team/removeTeamMember", methods=['PUT']) #Done
@jwt_required()
@cross_origin()
def remove_that_playa():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        team_id = data.get("teamID")
        owner = data.get("owner")
        team_member_to_kick = data.get("teamMember")

        token_UUID = get_jwt_identity()
        if str(owner) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)

        conn = get_db_connection()

        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        if not team:
            return jsonify(status=404, message="Team does not exist in the database")
        
        if str(owner) != team["owner"]:
            return jsonify(status=418, message="This user is not the owner of the team")
        
        if str(team_member_to_kick) not in [team["teamMember1"], team["teamMember2"], team["teamMember3"]]:
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

        if team["status"] == "approved":
            conn.execute("UPDATE teams SET status = unregistered WHERE teamID = ?", (team_id,))

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
        
@app.route("/teamsApproved", methods=['GET'])
def get_team():
    try:
        conn = get_db_connection()
        teams_unformatted = conn.execute('SELECT * FROM teams WHERE status = "approved"').fetchall()
        conn.close()
        all_teams = []
        
        for row in teams_unformatted:
            team = {}
            team["teamName"] = row["teamName"]
            if row["owner"]:
                owner = get_hacker_by_id(row["owner"])
                firstName = owner["firstName"]
                lastName = owner["lastName"]
                team["owner"] = str(firstName) + " " + str(lastName)
            if row["teamMember1"]:
                member = get_hacker_by_id(row["teamMember1"])
                firstName = member["firstName"]
                lastName = member["lastName"]
                team["teamMember1"] = str(firstName) + " " + str(lastName)
            if row["teamMember2"]:
                member = get_hacker_by_id(row["teamMember2"])
                firstName = member["firstName"]
                lastName = member["lastName"]
                team["teamMember2"] = str(firstName) + " " + str(lastName)
            if row["teamMember3"]:
                member = get_hacker_by_id(row["teamMember3"])
                firstName = member["firstName"]
                lastName = member["lastName"]
                team["teamMember3"] = str(firstName) + " " + str(lastName)
            all_teams.append(team)

    
        return jsonify(status=200, message="success", teams=all_teams)
    except Exception as e:
        return jsonify(status=400, message=str(e))
        
@app.route("/team/leave", methods=["PUT"]) #Done
@jwt_required()
@cross_origin()
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

        token_UUID = get_jwt_identity()
        if str(member) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)

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
        
        if teamData["status"] == "approved":
            conn.execute("UPDATE teams SET status = 'unregistered' WHERE teamID = ?", (teamID,))
        conn.commit()
        
        res = conn.execute('SELECT UUID, teamID FROM hackers WHERE UUID=?', (member,))
        convert_res = [dict(row) for row in res]
        conn.close()
        
        return jsonify(status=200, message="Success", hacker=next(iter(convert_res)))
    except Exception as e:
        return jsonify(status=400, message=str(e))
    
@app.route("/team/owner", methods=["PUT"])
@jwt_required()
@cross_origin()
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

        token_UUID = get_jwt_identity()
        if str(owner) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)
        
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
@jwt_required()
@cross_origin()
def addTeamMember():
    try:
        data = request.get_json()
        if not data:
            return jsonify(status=400, message="No data provided")

        required_fields = ['teamID', 'teamMember']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")

        try:
            teamID = int(data['teamID'])
            member = int(data['teamMember'])
            token_UUID = get_jwt_identity()
            if str(member) != str(token_UUID):
                return jsonify(message= "Invalid Token", status=403)
        except ValueError:
            return jsonify(status=422, message="Unprocessable Entity (Invalid data type)")

        conn = get_db_connection()

        # Check if member exists and is confirmed
        found_hacker = conn.execute("SELECT isConfirmed FROM hackers WHERE UUID=?", (member,)).fetchone()
        if not found_hacker:
            return jsonify(status=400, message="Member does not exist")
        if not found_hacker["isConfirmed"]:
            return jsonify(status=403, message="Member is not confirmed")

        # Check if team exists
        find_team = conn.execute("SELECT * FROM teams WHERE teamID=?", (teamID,)).fetchone()
        if not find_team:
            return jsonify(status=404, message="Team does not exist")

        # Check if member is already on a team
        find_member = conn.execute("SELECT teamID FROM hackers WHERE UUID=?", (member,)).fetchone()
        if find_member and find_member["teamID"] is not None:
            return jsonify(status=400, message="Team member already on a team")

        # Check if team is full
        find_team = conn.execute("SELECT status, teamMember1, teamMember2, teamMember3 FROM teams WHERE teamID=?", (teamID,)).fetchone()
        if find_team["teamMember3"]:
            return jsonify(status=400, message="Team is full")

        # Add member to the first available spot
        if find_team["teamMember1"] is None:
            conn.execute("UPDATE teams SET teamMember1=? WHERE teamID=?", (member, teamID))
        elif find_team["teamMember2"] is None:
            conn.execute("UPDATE teams SET teamMember2=? WHERE teamID=?", (member, teamID))
        else:
            conn.execute("UPDATE teams SET teamMember3=? WHERE teamID=?", (member, teamID))

        # Update hacker's teamID
        conn.execute("UPDATE hackers SET teamID=? WHERE UUID=?", (teamID, member))


        if find_team["status"] == "approved":
            conn.execute("UPDATE teams SET status = 'unregistered' WHERE teamID = ?", (teamID,))
        conn.commit()

        # Fetch updated data
        get_hacker = conn.execute("SELECT UUID, teamID FROM hackers WHERE UUID=?", (member,)).fetchone()
        get_team = conn.execute("SELECT * FROM teams WHERE teamID=?", (teamID,)).fetchone()
        conn.close()

        return jsonify(status=200, message="Success", hacker=dict(get_hacker), team=dict(get_team))
    except Exception as e:
        return jsonify(status=500, message=str(e))
    
@app.route("/team/sendApplication", methods=['PUT'])
@jwt_required()
@cross_origin()
def send_application():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        team_id = data.get("teamID")
        owner = data.get("owner")
        token_UUID = get_jwt_identity()
        if str(owner) != str(token_UUID):
            return jsonify(message= "Invalid Token", status=403)
        

        conn = get_db_connection()

        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        if not team:
            return jsonify(status=404, message="Team does not exist in the database")
        
        stuff = dict(team)
        
        if owner != int(stuff["owner"]):
            return jsonify(status=418, message="This user is not the owner of the team")
    
        if not team["teamMember1"]:
            return jsonify(status=403, message="Teams must have at least 2 members")

        conn.execute("UPDATE teams SET status=? WHERE teamID=?", ("pending", team_id,))

        conn.commit()
        
        return jsonify({
            "message": "Success",
            "status": 200,
        })
    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        conn.close()

@app.route("/team/approveApplication", methods=['PUT'])
@jwt_required()
@cross_origin()
def approveApplication():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        team_id = data.get("teamID")
        status = data.get("approved")

        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)
        if not hacker["isAdmin"]:
            return jsonify(status=401, message="fuck outta here",)

        conn = get_db_connection()

        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        if not team:
            return jsonify(status=404, message="Team does not exist in the database")
        
        if status == "approved":
            conn.execute("UPDATE teams SET status=approved WHERE teamID=?", (team_id))
        else:
            conn.execute("UPDATE teams SET status=unregistered WHERE teamID=?", (team_id))

        conn.commit()

        return jsonify({
            "message": "Success",
            "applicationStatus": status,
            "status": 200,
        })
    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        conn.close()

@app.route("/team/withdrawApplication", methods=['PUT'])
@jwt_required()
@cross_origin()
def withdrawApplication():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided",status=400)
        
        team_id = data.get("teamID")

        UUID = get_jwt_identity()
        hacker = get_hacker_by_id(UUID)

        if str(hacker["teamID"]) != str(team_id):
            return jsonify(status=401, message="not member of team",)

        conn = get_db_connection()

        team = conn.execute("SELECT * FROM teams WHERE teamID = ?", (int(team_id),)).fetchone()

        if not team:
            return jsonify(status=404, message="Team does not exist in the database")
        
        conn.execute("UPDATE teams SET status=? WHERE teamID=?", ('unregistered',team_id,))
        conn.commit()

        return jsonify({
            "message": "Success",
            "status": 200,
        })
    except Exception as e:
        return jsonify({"message": str(e), "status":500})
    finally:
        if conn:
            conn.close()


@app.route("/team/changeName", methods=['PUT'])
@jwt_required()
@cross_origin()
def changeTeamName():
    try:
        data = request.get_json()
        if not data:
            return jsonify(message="no data provided", status=400)

        # check if body had correct fields
        required_fields = ['teamID', 'newName']
        for field in required_fields:
            if field not in data:
                return jsonify(status=400, message=f"Missing {field}")

        teamID = data['teamID']
        newName = data['newName'] # do i have to validate the name for anything? idk

        token_UUID = get_jwt_identity()
        hacker = get_hacker_by_id(token_UUID)
        if str(hacker["teamID"]) != str(teamID):
            return jsonify(message= "Invalid Token", status=403)

        # check if teamID is int
        try:
            int(teamID)
        except:
            return jsonify(status=422, message="Unprocessable Entity (teamID is of wrong type)")

        # check if team exists
        try:
            conn = get_db_connection()
            find_team = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            if len(find_team) == 0:
                return jsonify(status=404, message="Team Not Found")
            conn.close()
        except Exception as e:
            return jsonify(status=404, message=str(e))

        # update teamName
        try:
            conn = get_db_connection()
            print(newName, teamID)
            conn.execute('UPDATE teams SET teamName=? WHERE teamID=?', (newName, str(teamID),))
            conn.commit()
            
            # send res to show the name changed
            res = conn.execute('SELECT * FROM teams WHERE teamID=?', (teamID,)).fetchall()
            convert_res = [dict(row) for row in res]
            
            conn.close()
            return jsonify(status=200, message="Successfully Changed Name", team=next(iter(convert_res)))
        except Exception as e:
            return jsonify(status=400, message=str(e))

        
    except Exception as e:
        return jsonify(status=400, message=str(e))
    
if __name__ == "__main__":
    app.run(debug=True)
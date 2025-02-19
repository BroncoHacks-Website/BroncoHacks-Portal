import pytest
import os
from app import app
from init_db import run_db
import sqlite3
import json

DB_PATH = os.path.abspath("database.db")

@pytest.fixture(scope="session")
def client():
    app.config["TESTING"] = True 
    #get the db to connect by running init_db.py first and then running pytest -vv
    run_db()

    def test_db_connection():
        return sqlite3.connect(DB_PATH, check_same_thread=False)
    
    app.get_db_connection = test_db_connection 
    
    with app.test_client() as client:
        yield client

def test_get_users_team(client):
    response = client.get("/team?UUID=1")
    assert response.json == {
        "message": "success, we got them",
        "owner": {
            "UUID": 1,
            "email": "dpasion@cpp,edu",
            "firstName": "Daniel",
            "lastName": "Pasion",
            "school": "cpp"
        },
        "status": 200,
        "team": {
            "teamID": 123456,
            "teamName": "Hawk Tuahers"
        },
        "teamMember1": {
            "UUID": 3,
            "email": "lbj@cpp,edu",
            "firstName": "LeCaleb",
            "lastName": "chung",
            "school": "cpp"
        },
        "teamMember2": {
            "UUID": None,
            "email": None,
            "firstName": None,
            "lastName": None,
            "school": None
        },
        "teamMember3": {
            "UUID": None,
            "email": None,
            "firstName": None,
            "lastName": None,
            "school": None
        }
    }


def test_create_tuah(client):
    data = {
        "teamName": "Hawk Tuaher",
        "owner": 2
    }
    response = client.post("/team", json=data)
    response_json = response.json
    assert response_json["message"] == "success !!!! Yippyyyyy"
    assert response_json["status"] == 200
    
    team = response_json["team"]
    assert team["owner"] == 2
    assert "teamID" in team
    assert isinstance(team["teamID"], str)
    assert team["teamMember1"] == None
    assert team["teamMember2"] == None
    assert team["teamMember3"] == None
    assert team["teamName"] == "Hawk Tuaher"
    
def test_delete_tuah(client):
    data = {
        "teamID": 919191,
        "owner": 4 
    }
    response = client.delete("/team", json=data)
    assert response.status_code == 200
    assert response.json == {
        "message": "team deleted","status":"200"
    }

def test_get_team(client):
    response = client.get("/teams")
    response_json = response.json

    assert response_json["status"] == 200
    assert response_json["message"] == "success"

    team1 = response_json["teams"][0]
    team2 = response_json["teams"][1]

    assert team1["owner"] == "1"
    assert "teamID" in team1
    assert isinstance(team1["teamID"], int)
    assert team1["teamMember1"] == "3"
    assert team1["teamMember2"] == None
    assert team1["teamMember3"] == None
    assert team1["teamName"] == "Hawk Tuahers"

    assert team2["owner"] == "2"
    assert "teamID" in team2
    assert isinstance(team2["teamID"], int)
    assert team2["teamMember1"] == None
    assert team2["teamMember2"] == None
    assert team2["teamMember3"] == None
    assert team2["teamName"] == "Hawk Tuaher"




def test_get_all_data(client):
    response = client.get("/admin")
    assert response.status_code == 200
    assert json.loads(response.data)["message"] == "successfully got all data"
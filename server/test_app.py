import pytest
import os
from app import app
import sqlite3
import json

DB_PATH = os.path.abspath("database.db")

@pytest.fixture(scope="session")
def client():
    app.config["TESTING"] = True 
    #get the db to connect by running init_db.py first and then running pytest -vv
    def test_db_connection():
        return sqlite3.connect(DB_PATH, check_same_thread=False)
    
    app.get_db_connection = test_db_connection 
    
    with app.test_client() as client:
        yield client

def test_create_tuah(client):
    data = {
        "teamName": "Hawk Tuaher",
        "owner": 2
    }
    response = client.post("/team", json=data)
    assert response.status_code == 200
    assert response.json == {
    "message": "success !!!! Yippyyyyy",
    "status": 200,
    "team": {
        "owner": 2,
        "teamID": "331745", #this will output fail but only because the randomly generated team id is causing it
        "teamMember1": None,
        "teamMember2": None,
        "teamMember3": None,
        "teamName": "Hawk Tuaher"
    }
}
    
def test_get_all_data(client):
    response = client.get("/admin")
    assert response.status_code == 200
    assert json.loads(response.data)["message"] == "successfully got all data"
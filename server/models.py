from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Hacker(db.Model):
    UUID = db.Column(db.Integer, primary_key=True)
    teamID = db.Column(db.Integer)
    firstName = db.Column(db.String(100))
    lastName = db.Column(db.String(100))
    password_hash = db.Column(db.String(150))
    email = db.Column(db.String(100), unique=True)
    school = db.Column(db.String(100))
    discord = db.Column(db.String(100), unique=True)
    confirmationNumber = db.Column(db.Integer)
    isConfirmed = db.Column(db.Boolean)

class Teams(db.Model):
    teamID = db.Column(db.Integer, primary_key=True)
    teamName = db.Column(db.String(100))
    owner = db.Column(db.String(100))
    teamMember1 = db.Column(db.String(100))
    teamMember2 = db.Column(db.String(100))
    teamMember3 = db.Column(db.String(100))
    status = db.Column(db.String(100))
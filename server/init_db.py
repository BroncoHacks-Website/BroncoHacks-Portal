import sqlite3
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (123456, 'Daniel', 'Pasion', hash_password('urmom'), 'dpasion@cpp,edu', 'cpp','.theDaniel', 666420, True )
            )

cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (None, 'Cesar Henry', 'de Paula', hash_password('urdad'), 'chdp@cpp,edu', 'cpp','putanginamo', 666420, True ))

cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (123456, 'LeCaleb', 'chung', hash_password('ursis'), 'lbj@cpp,edu', 'cpp','thebigtig', 666420, True ))

cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (123456, 'Nick', 'Amancio', hash_password('urajfp'), 'namancio@cpp,edu', 'cpp','nickthecan', 666420, True ))

cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (123456, 'Jade', 'Nguyen', hash_password('urdasfhp'), 'jgnuyen@cpp,edu', 'cpp','jadethegemstone', 666420, True ))

cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
            (123456, "Hawk Tuahers", 1)
            )

cur.execute("UPDATE teams SET teamMember1 = 3 WHERE teamID = 123456")
cur.execute("UPDATE teams SET teamMember2 = 4 WHERE teamID = 123456")
cur.execute("UPDATE teams SET teamMember3 = 5 WHERE teamID = 123456")

connection.commit()
connection.close()



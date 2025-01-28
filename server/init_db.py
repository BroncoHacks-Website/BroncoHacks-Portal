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
            ('ABCDEF', 'Daniel', 'Pasion', hash_password('urmom'), 'dpasion@cpp,edu', 'cpp','.theDaniel', '666420', True )
            )

cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
            ('ABCDEF', "Hawk Tuahers", 'Skibidi')
            )

connection.commit()
connection.close()



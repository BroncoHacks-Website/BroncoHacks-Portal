import sqlite3
import bcrypt

def run_db():
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

    cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
                (123456, "Hawk Tuahers", 1)
                )

    cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (123457, 'nicek', 'ama', hash_password('ursis'), 'nja@cpp,edu', 'cpp','nicktehcan', 111111, True ))
    
    cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
                (919191, "chinatsu", 4)
                )

    cur.execute("UPDATE teams SET teamMember1 = 3 WHERE teamID = 123456")

    connection.commit()
    connection.close()



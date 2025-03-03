import sqlite3
import bcrypt

def run_db():
    def hash_password(password):
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed

    try:

        connection = sqlite3.connect('database.db')


        with open('schema.sql') as f:
            connection.executescript(f.read())

        cur = connection.cursor()

        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (123456, 'Daniel', 'Pasion', hash_password('1'), 'dpasion@cpp.edu', 'cpp','.theDaniel', 666420, True, False ))
        
        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, 'Cesar Henry', 'de Paula', hash_password('1'), 'chdp@cpp.edu', 'cpp','putanginamo', 666420, True, False ))

        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (123456, 'LeCaleb', 'chung', hash_password('1'), 'lbj@cpp.edu', 'cpp','thebigtig', 666420, True, False ))

        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (123456, 'Nick', 'Amancio', hash_password('1'), 'njamancio@cpp.edu', 'cpp','nickthecan', 666420, True, False ))

        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (123456, 'Jade', 'Nguyen', hash_password('1'), 'jgnuyen@cpp.edu', 'cpp','jadethegemstone', 666420, True, False ))
        
        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, 'Justin', 'Nguyen', hash_password('1'), 'jmn@cpp.edu', 'cpp','saltybagels', 666420, True, False ))
        
        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (222222, 'Habibi', 'Mark', hash_password('1'), 'hmark@cpp.edu', 'cpp','habibimark', 666420, True, True ))


        cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
                    (123456, "Hawk Tuahers", 1)
                    )
        cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
                    (222222, "Skibidist", 7)
                    )

        cur.execute("UPDATE teams SET teamMember1 = 3 WHERE teamID = 123456")
        cur.execute("UPDATE teams SET teamMember2 = 4 WHERE teamID = 123456")
        cur.execute("UPDATE teams SET teamMember3 = 5 WHERE teamID = 123456")

        connection.commit()
        connection.close()
        print("Complete")
    except Exception as e:
        print(e)
run_db()



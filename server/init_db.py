import sqlite3
import bcrypt
import sqlitecloud

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
                    (None, 'Daniel', 'Pasion', hash_password('passwordurmom'), 'dnpaxion@gmail.com', 'Cobra Kai','.theDaniel', 123456, True, True ))
        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, 'Admin', 'Admin', hash_password('passwordurdad'), 'cppbroncohacks@gmail.com', 'Miyagi Do','CPPBroncoHacks', 123456, True, True ))
        cur.execute("INSERT INTO hackers (teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, 'Backup', 'Admin', hash_password('passwordpassword'), 'adming@gmail.com', 'Eagle Fang','COBRAKAI!!!!!', 123456, True, True ))

        connection.commit()
        connection.close()
        print("Complete")
    except Exception as e:
        print(e)
run_db()
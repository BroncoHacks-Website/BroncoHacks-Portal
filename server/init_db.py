import sqlite3

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO hackers (UUID, teamID, firstName, lastName, password, email, school, discord, confirmationNumber, isConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            ('Skibidi', 'ABCDEF', 'Daniel', 'Pasion', 'urmom', 'dpasion@cpp,edu', 'cpp','.theDaniel', '666420', True )
            )

cur.execute("INSERT INTO teams (teamID, teamName, owner) VALUES (?, ?, ?)",
            ('ABCDEF', "Hawk Tuahers", 'Skibidi')
            )

connection.commit()
connection.close()



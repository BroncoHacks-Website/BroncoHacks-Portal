import os
import requests
def send_simple_message():
    print('hi')
    print(requests.post(
  		"https://api.mailgun.net/v3/sandbox591f22ffe45a4464b93979cb2c3d1787.mailgun.org/messages",
  		auth=("api", 'f8c136a268033191411166e074b9c00f-e298dd8e-ecb2d6db'),
  		data={"from": "Mailgun Sandbox <postmaster@sandbox591f22ffe45a4464b93979cb2c3d1787.mailgun.org>",
			"to": "Daniel Pasion <cppbroncohacks@gmail.com>",
  			"subject": "Hello Daniel Pasion",
  			"text": "Congratulations Daniel Pasion, you just sent an email with Mailgun! You are truly awesome!"}))

send_simple_message()
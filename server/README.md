# Quickstart

## Development Enviornment Setup

First Download Docker Desktop

- https://www.docker.com/products/docker-desktop/

Building the Docker Container (Do this to push any changes made)

- docker build --tag bh-portal .

Running the Image

- docker run -d -p 8000:8000 bh-portal

Calling the enpoint

- http://127.0.0.1:8000/{whatever uri u created}

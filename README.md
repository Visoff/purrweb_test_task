# Purrweb Node js Trello API

## Structure
├── backend
│   └── docker-compose.yaml
└── frontend
    └── docker-compose.yaml

Backend is requested NestJS API project
Frontend is proof of concept React app using that API

## Run

Frontend:
``` bash
cd frontend
docker compose up -d
```

Backend:
``` bash
cd backend
docker compose up -d
```

All together:
``` bash
docker compose -f backend.docker-compose.yaml -f frontend.docker-compose.yaml up -d
```

## Use

`http://localhost:3000` - api
/api - Swagger

`http://localhost:5173` - frontend

## Database

Using postgres with typeorm
Structure:
    https://dbdiagram.io/d/Purrweb_trell_task-682aa42e1227bdcb4ee2d280

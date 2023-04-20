docker stop pinger-api-db
docker rm pinger-api-db
docker volume rm pinger_sqlvolume
docker compose up pinger-api-db -d
echo "Database reseted"
docker exec pinger-api-service rm -rf Migrations

how to setup docker and run it?
# steps
- install the docker 
- set docker file and will automatically docker pull over/bun
- no need of manual run it.

prefer to use alpine image is small and less vulnerable

# chnge local postgres password if weak
sudo -i -u postgres 
- psql

# change
ALTER USER your_user WITH PASSWORD 'NEW_STRONG_PASSWORD';

\q for quit 

# to build docker
docker compose up --build

# remove systemctl for redis and postgres for docker to run


look data in doker
sudo docker exec -it server-postgres-1 psql -U postgres -d PosTech
then SELECT * FROM PosTech

## test redis speed
redis-benchmark -q -n 1000 -c 1 -t set,get

result must be milliseconds
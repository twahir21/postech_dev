use ssh username@ip-address to connect to vps remote use ssh root@91.99.199.122

then update sudo apt update && sudo apt upgrade -y

## BUN

then sudo apt install unzip -y for unzip as requirement to install bun

then install bun curl -fsSL https://bun.sh/install | bash

then reload shell exec $SHELL and test bun -v 

## POSTGRES
sudo apt install postgresql postgresql-contrib -y

then sudo systemctl enable postgresql
sudo systemctl start postgresql

set password sudo -u postgres psql

then \password postgres and enter new password then \q to exit

then restart with sudo systemctl restart postgresql

create db sudo -i -u postgres

then createdb PosTech

then exit

## SET PASSWORD FOR POSTGRES USER
1. sudo -i -u postgres

2. psql

3. ALTER USER postgres WITH PASSWORD 'newstrongpassword';

4. \q
5. EXIT

note that all passwords must match with one connecting to db.


# point api.mypostech.store to vps
use curl ifconfig.me to get public ip and then use as dns record for it.

then use AAAA and paste ipv6 address and but server like api mypostech.store to dns record 

## TEST DNS CONNECTIVITY

ping6 api.mypostech.store

or curl -6 http://api.mypostech.store:3000

## FIREWALL
add firewall rule to allow traffic on port 3000 with sudo ufw allow 3000  

## CADDY
-> install with:
```BASH
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

edit caddy file with sudo nano /etc/caddy/Caddyfile then

```CADDYFILE
    change reverse proxy to 3000 from 8080
    and change :80 with domain name api.mypostech.store
```
save and restart caddy

# HIDE ENV
sudo nano etc/app.env

then sudo chmod 600 /etc/app.env and sudo chown root:root /etc/app.env to allow only ubuntu to read

## PM2 / SYTEMD
implement pm2 to keep service running or systemd for linux

start with sudo nano /etc/systemd/system/myapp.service
better use systemd and use which bun to know location to run bun

## CHECK DB
connect with:

```bash
    sudo -u postgres psql -d PosTech
```
```sql
grant all permision with: 
-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE "PosTech" TO postgres;

-- Connect to the database (if not already inside)
\c "PosTech"

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

-- Grant all privileges on all sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Grant all privileges on all functions (optional)
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;
```
then SELECT * FROM tablename.

show db size with  
```bash 
SELECT pg_size_pretty(pg_database_size('PosTech'));
```

export to CSV with 

```bash
    COPY (SELECT * FROM tablename) TO '/home/ubuntu/PosTech.csv' DELIMITER ',' CSV HEADER;
```

## drop every table 
using cli sql 
```sql
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

## SETTING UP CONNECTION POOLER 
by default postgres doesnot support many users so we use:
1. PgBounce for connection/pooling
2. PgBounce for load balancing for advanced level of optimization

2.1 setup:
```bash
sudo apt install pgbouncer
```

## 📁 Example: Copy file from VPS to PC
```bash
scp root@123.45.67.89:/root/db.sql ~/Downloads/
```
### 📁 Example: Copy folder (add -r)
```bash
scp -r root@123.45.67.89:/root/myproject ~/Desktop/
```

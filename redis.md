# Install Redis
sudo apt install redis-server  # Ubuntu/Debian

# Start it
sudo service redis-server start

# Connect (no password needed by default)
redis-cli ping  # should reply "PONG"

## block port to be accessed 
```bash
sudo ufw deny 6379
# or allow from ip by
sudo ufw allow from 237.84.2.178 to any port 6379
```
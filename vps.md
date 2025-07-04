use ssh username@ip-address to connect to vps remote

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

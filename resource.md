# look resource usage in ubuntu
use 
```bash
free -h
```
to check ram and swap memory made

for cpu uage
```bash
top # or 
htop
```
use SSD than HDD 
check if storage is still health
```bash
sudo smartctl -a /dev/sdX
```

RAM + swap usage: free-h
Ram slots & sizes: sudo dmidecode --type memory
Ram type and speed: sudo lshw -class memory


clear caches
```bash
    sudo sync; echo 3 | sudo tee /proc/sys/vm/drop_caches
```
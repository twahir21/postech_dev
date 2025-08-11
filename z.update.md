# when using email
- prompt for phone number (for sms notifications)
- enter username (optional)
- send email a temporary password if want to enter with password and say to change immediately

# do redis caching for
- products
- prodSearch and customers

# send sms
- after subscription to thank user
- daily report and weekly report and graph data(optional)

# in settings
- change username.
- change language.
- select notification delivery (sms - add to payment, email- free, in-app - free)

# update to http/3 
- you are using http/2 right now which is slow

to check use:
```bash
curl -v https://mypostech.store 2>&1 | grep "HTTP/"
```
### future system
1. condolence / wedding / funeral notification system via sms. user is registered and able to upload all contacts to send at once.

#### animations
- framer motion + gsap

SEO geo-targeting for tz

## SMS provider
nextSMS is best for now
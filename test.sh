#!/bin/bash
curl -H 'API-Key: PFQQC3XHUXHS5MN5E66TC4JSF6ZVSBZBVR2Q' https://api.vultr.com/v1/dns/create_record \
 --data 'domain=loukihost.com' \
 --data 'name=_acme-challenge' \
 --data 'type=TXT' \ 
 --data "data=\"$CERTBOT_VALIDATION\""
 
 
sleep 30

curl -H 'API-Key: PFQQC3XHUXHS5MN5E66TC4JSF6ZVSBZBVR2Q' https://api.vultr.com/v1/dns/records?domain=loukihost.com

# curl -H 'API-Key: YOURKEY' https://api.vultr.com/v1/dns/delete_record \
# --data 'domain=loukihost.com' \
# --data 'RECORDID=1265277'


sudo certbot certonly --dry-run --manual -d *.loukihost.com --preferred-challenges=dns --manual-auth-hook ./certauth.sh --manual-cleanup-hook ./certcleanup.sh

print(CERTBOT_VALIDATION)


#!/usr/bin/python
import os
import requests

CERTBOT_VALIDATION = os.environ['CERTBOT_VALIDATION'];
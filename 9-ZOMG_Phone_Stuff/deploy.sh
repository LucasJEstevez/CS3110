#!/bin/bash

scp html/* root@lje.crabdance.com:/var/www/html
scp jsapp/* root@lje.crabdance.com:/var/www/jsapp
ssh root@lje.crabdance.com systemctl restart jsapp

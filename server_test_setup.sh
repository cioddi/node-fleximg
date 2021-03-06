#!/bin/bash
sudo apt-get update
sudo apt-get install -y build-essential curl git-core openssl libssl-dev imagemagick
git clone git://github.com/creationix/nvm.git ~/.nvm
source ~/.nvm/nvm.sh
echo "source ~/.nvm/nvm.sh" >> ~/.profile
nvm install 0.10
nvm use 0.10

npm install

sudo iptables -A INPUT -p tcp -m tcp --sport 8080 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 8080 -j ACCEPT
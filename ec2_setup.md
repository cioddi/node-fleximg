#setting up node-fleximg on a amazon aws ec2 instance

##debian

- setup your ec2 instance in amazon aws console
- create a new security group to allow connections on port 8080
- ```sudo apt-get install -y git```
- ```git clone https://github.com/cioddi/node-fleximg.git```
- ```cd node-fleximg```
- ```./server_test_setup.sh```

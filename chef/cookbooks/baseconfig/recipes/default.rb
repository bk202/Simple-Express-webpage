# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

# Node.js
execute 'add-NodeSource-APT' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

package 'nodejs'
package 'build-essential'
package 'nodemon'

# node packages
execute 'node-packages' do 
  command 'npm install'
end

## Install forever to run the server as a daemon process 
execute 'install_forever' do
  command 'sudo npm install forever -g' 
end 

# start server
execute 'node-terminate' do
  command 'forever stopall'
end
execute 'node-start' do
  command 'forever start /home/ubuntu/project/index.js'
end


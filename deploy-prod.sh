git reset --hard
git pull
npm run build-prod
sudo rm -rf /var/www/hundequiz
sudo mkdir /var/www/hundequiz
sudo cp -r ./dist/* /var/www/hundequiz

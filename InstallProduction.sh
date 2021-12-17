
#sudo -u nodejs_user
#cd /dual_data/not_backed_up/chestxai
DestDir=/dual_data/not_backed_up/chestxai
#OAUTH_TOKEN=
echo "Cleaning old install"
rm -r -f $DestDir/BristolBoard
rm -r -f $DestDir/ChestXAI
mkdir $DestDir/BristolBoard
mkdir $DestDir/ChestXAI
cd ..
echo "Copying Bristolboard"
rsync -ah --progress --recursive ./BristolBoard $DestDir
echo "Copying ChestXAI"
rsync -ah --progress --recursive ./ChestXAI $DestDir
echo "Install Complete"
#echo "Cloning BristolBoard"
#git clone -b master https://$OAUTH_TOKEN:x-oauth-basic@github.com/AlanSorrill/BristolBoard.git BristolBoard
#echo "Cloning ChestXAI"
#git clone -b master https://$OAUTH_TOKEN:x-oauth-basic@github.com/AlanSorrill/ChestXAI.git ChestXAI
#cd ./BristolBoard
#echo "Resolving BristolBoard Dependancies"
#npm install
#cd ../ChestXAI
#npm install
# trps-backend  

TRPS ENGINE  

## Deployment steps:  
az login  
az acr login --name trpsapp  
docker build -t trps-engine .  
docker tag trps-engine trpsapp.azurecr.io/trps-engine:latest  
docker push trpsapp.azurecr.io/trps-engine:latest  

### Test the doker image in local env:  

docker container run -d -p 5000:5000 trps-engine  
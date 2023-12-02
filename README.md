# sym-react-crm
CRM application made with React, API-platform and Symfony. Made with Lior CHamla Course (in FRENCH) available here: http://bit.ly/CRMSymReact

## Technologies used

API-Plateform: https://api-platform.com/

Symfony4: https://symfony.com/

React JS: https://reactjs.org/


## How to run

`docker compose up --build`

`docker exec -it crm-php composer install`

`docker exec -it crm-php php bin/console lexik:jwt:generate-keypair --overwrite`

`docker exec -it crm-php php bin/console doctrine:fixtures:load`

`docker exec -it crm-node yarn install`

`docker exec -it crm-node yarn build`



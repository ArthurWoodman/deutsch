# the current version of Symfony SO-O-O RAW that it's just mind boggling!!! I had to workaround at least 3 bugs!!! 

# if the following command:
$ bin/console doctrine:migrations:list

# does not show anything just run:
$ bin/console doctrine:migrations:diff

# so as generate a new Migration and then migrate:
$ bin/console doctrine:migrations:migrate

---------------------------------------------------------
# to deploy docker run:
$ sudo docker compose up -d

# make sure that containers are up:
$ sudo docker ps

# and also verify that DATABASE_URL in .env has a proper IP for DB container. now it's like:
DATABASE_URL="mysql://root:arthur@172.21.0.1:33066/deutsch?charset=utf8mb4"
# but the value 172.21.0.1 on your machine can be different so run:
$ sudo docker inspect symfony2-db-1

# and verify: "Gateway": "172.21.0.1"

-------------------------------------------------------------

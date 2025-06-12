if [ -d "$HOME/docker/postgres/data" ]; then
    mkdir -p ~/docker/postgres/data
fi

cd ../docker
docker compose -f docker-compose.yml up -d

rc=$?
if [ $rc -ne 0 ] ; then
  echo Could not spinup docker container, exit code [$rc]; exit $rc
fi

SQL_DDL_FILE_PATH="../src/main/resources/setup.sql"
export PGPASSWORD=postgres
psql postgresql://localhost:5432/satchat -U postgres -f "$SQL_DDL_FILE_PATH"

rc=$?
if [ $rc -ne 0 ] ; then
  echo Could not setup database ddl, exit code [$rc]; exit $rc
fi
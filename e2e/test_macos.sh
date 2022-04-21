export HOSTNAME=localhost
export PORT1=1337
export PORT2=1338
npx testcafe remote e2e/**/*.spec.{js,ts} --hostname ${HOSTNAME} --ports ${PORT1},${PORT2} --disable-screenshots &
$pid=$!
sleep 5
open -a Safari http://${HOSTNAME}:${PORT1}/browser/connect
wait $pid

export HOSTNAME=localhost
export PORT1=1337
export PORT2=1338
npx testcafe remote e2e/**/*.spec.{js,ts} --hostname ${HOSTNAME} --ports ${PORT1},${PORT2} -d --debug-on-fail --dev &
$pid=$!
rm -rf ~/.testcafe-browser-tools
sleep 10
open -a Safari http://${HOSTNAME}:${PORT1}/browser/connect
wait $pid

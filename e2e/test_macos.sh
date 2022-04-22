export HOSTNAME=localhost
export PORT1=1341
export PORT2=1342
testcafe remote e2e/**/*.spec.{js,ts} --hostname ${HOSTNAME} --ports ${PORT1},${PORT2} &
pid=$!
sleep 5
open -a Safari http://${HOSTNAME}:${PORT1}/browser/connect
wait $pid
stat=$?

if [ $stat –eq 0 ]
then
       echo "Exit status - $stat"
else
        echo "Exit status - $stat"
fi

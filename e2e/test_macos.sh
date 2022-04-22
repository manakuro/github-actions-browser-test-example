export HOSTNAME=localhost
export PORT1=1341
export PORT2=1342
testcafe remote e2e/**/*.spec.{js,ts} --hostname ${HOSTNAME} --ports ${PORT1},${PORT2} &
pid=$!
sleep 5
open -a Safari http://${HOSTNAME}:${PORT1}/browser/connect
wait $pid
status=$?

if [ $status -eq 0 ]
then
       echo "Success: $status"
       exit 0
else
        echo "Failed: $status"
        exit 1
fi

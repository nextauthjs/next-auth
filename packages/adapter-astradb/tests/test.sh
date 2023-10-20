echo "Starting test cases"


if npx jest tests; then
  echo "success"
else
  echo "failed" && exit 1
fi
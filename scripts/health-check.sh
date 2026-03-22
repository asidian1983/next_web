#!/bin/bash
# Check all services are healthy.
# Run from repo root: bash scripts/health-check.sh
#
# Make executable: chmod +x scripts/health-check.sh
set -euo pipefail

# Allow overriding service hostnames via environment variables
WEB_HOST="${WEB_HOST:-web}"
API_HOST="${API_HOST:-api}"
AI_HOST="${AI_HOST:-ai}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
REDIS_HOST="${REDIS_HOST:-redis}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-redis}"

FAILURES=0

check_http() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  echo -n "Checking $name ($url) ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")

  if [[ "$status" == "$expected_status" ]]; then
    echo "OK (HTTP $status)"
  else
    echo "FAIL (HTTP $status, expected $expected_status)"
    FAILURES=$((FAILURES + 1))
  fi
}

check_postgres() {
  echo -n "Checking postgres ($POSTGRES_HOST:$POSTGRES_PORT) ... "
  if command -v pg_isready &>/dev/null; then
    if pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -q; then
      echo "OK"
    else
      echo "FAIL"
      FAILURES=$((FAILURES + 1))
    fi
  elif command -v psql &>/dev/null; then
    if psql "postgresql://$POSTGRES_USER@$POSTGRES_HOST:$POSTGRES_PORT/textile_ai" -c "SELECT 1" -q &>/dev/null; then
      echo "OK"
    else
      echo "FAIL"
      FAILURES=$((FAILURES + 1))
    fi
  else
    echo "SKIP (pg_isready not available)"
  fi
}

check_redis() {
  echo -n "Checking redis ($REDIS_HOST:$REDIS_PORT) ... "
  if command -v redis-cli &>/dev/null; then
    result=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -a "$REDIS_PASSWORD" ping 2>/dev/null || echo "")
    if [[ "$result" == "PONG" ]]; then
      echo "OK"
    else
      echo "FAIL (got: $result)"
      FAILURES=$((FAILURES + 1))
    fi
  else
    echo "SKIP (redis-cli not available)"
  fi
}

echo "=== Health Check ==="
echo ""

check_http "web"  "http://$WEB_HOST/"
check_http "api"  "http://$API_HOST/health"
check_http "ai"   "http://$AI_HOST/health"
check_postgres
check_redis

echo ""
if [[ "$FAILURES" -eq 0 ]]; then
  echo "All checks passed."
  exit 0
else
  echo "$FAILURES check(s) failed."
  exit 1
fi

#!/bin/bash
# Push local Supabase data to hosted project
# Usage: ./push-data.sh <REMOTE_DB_URL> [--truncate]
# Get REMOTE_DB_URL from: Supabase Dashboard → Project Settings → Database → Connection string (URI)

set -e

DUMP_FILE="supabase/data-dump.sql"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

if [ -z "$1" ] || [ "$1" = "--truncate" ]; then
  echo "Usage: ./push-data.sh <REMOTE_DB_URL> [--truncate]"
  echo ""
  echo "Get your remote URL from:"
  echo "  Supabase Dashboard → Project Settings → Database → Connection string (URI)"
  echo ""
  echo "  --truncate  Clear existing data on remote before restore (default: yes)"
  exit 1
fi

REMOTE_URL="$1"
TRUNCATE=1
for arg in "$@"; do [ "$arg" = "--no-truncate" ] && TRUNCATE=0; done

cd "$REPO_ROOT"

echo "→ Dumping data from local DB..."
supabase db dump --local --data-only -s public -f "$DUMP_FILE"

if [ "$TRUNCATE" = "1" ]; then
  echo "→ Truncating remote tables (to avoid duplicates)..."
  psql "$REMOTE_URL" -c "
    TRUNCATE TABLE
      public.payments,
      public.bookings,
      public.profiles,
      public.services,
      public.available_slots,
      public.booking_questions
    RESTART IDENTITY CASCADE;
  " 2>/dev/null || true
fi

echo "→ Pushing to hosted DB..."
psql "$REMOTE_URL" -f "$DUMP_FILE" --set ON_ERROR_STOP=on

echo "→ Cleaning up..."
rm -f "$DUMP_FILE"

echo "✓ Data pushed successfully."

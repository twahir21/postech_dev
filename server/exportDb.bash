#!/bin/bash

DB_NAME="PosTech"
DB_USER="postgres"
DB_PASSWORD="your_password"  # Change this to your actual password
OUTPUT_DIR="./table_exports"

mkdir -p "$OUTPUT_DIR"

# Export with password
export PGPASSWORD="$DB_PASSWORD"

TABLES=$(psql -U "$DB_USER" -d "$DB_NAME" -h localhost -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")

for TABLE in $TABLES; do
    echo "Exporting $TABLE..."
    psql -U "$DB_USER" -d "$DB_NAME" -h localhost -c "\copy (SELECT * FROM $TABLE) TO '$OUTPUT_DIR/$TABLE.txt' WITH (FORMAT csv, DELIMITER '|', HEADER true)"
    echo "Exported $TABLE to $OUTPUT_DIR/$TABLE.txt"
done

unset PGPASSWORD
echo "All tables exported to $OUTPUT_DIR"

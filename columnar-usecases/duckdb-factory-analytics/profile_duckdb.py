import duckdb

con = duckdb.connect("factory_telemetry.duckdb", read_only=True)

query = """
EXPLAIN ANALYZE
SELECT
    timestamp,
    air_temp_k,
    process_temp_k,
    rotational_speed_rpm,
    torque_nm
FROM obt_columnar
WHERE equipment_id = 12
AND timestamp BETWEEN '2026-01-01 00:00:00'
                  AND '2026-01-07 00:00:00'
ORDER BY timestamp DESC;
"""

result = con.execute(query).fetchall()

for row in result:
    print(row[1])

con.close()

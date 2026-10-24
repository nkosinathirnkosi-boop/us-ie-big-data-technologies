const database = db.getSiblingDB("quality_assurance");
const collection = database.getCollection("temporary_throughput_benchmark");

const totalDocuments = 10000;
const batchSize = 1000;

collection.drop();

const start = Date.now();

for (let i = 0; i < totalDocuments; i += batchSize) {
    const batch = [];

    for (let j = i; j < Math.min(i + batchSize, totalDocuments); j++) {
        batch.push({
            event_id: j,
            equipment_id: j % 50,
            timestamp: new Date(),
            temperature: 300 + (j % 20),
            vibration: (j % 100) / 100,
            torque_nm: 40 + (j % 30)
        });
    }

    collection.insertMany(batch);
}

const elapsedSeconds = (Date.now() - start) / 1000;
const throughput = totalDocuments / elapsedSeconds;

print("========================================");
print("MONGODB INSERTION THROUGHPUT BENCHMARK");
print("========================================");
print("Documents inserted: " + totalDocuments);
print("Elapsed time: " + elapsedSeconds.toFixed(3) + " seconds");
print("Insertion throughput: " + throughput.toFixed(2) + " documents/second");
print("Factory ingestion requirement: 5000 documents/second");
print("========================================");

collection.drop();

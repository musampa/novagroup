const { MongoClient } = require("mongodb");

async function runConsistencyChecks() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("nuova");

    // Verifica Dipendenti Senza Filiale Valida
    const invalidEmployees = await db.collection("dipendenti").find({
      $or: [
        { filiale_id: { $nin: await db.collection("filiali").distinct("filiale_id") } },
        { divisione: { $nin: await db.collection("filiali").distinct("divisione") } }
      ]
    }).toArray();
    console.log("Dipendenti senza Filiale Valida:", invalidEmployees);

    // Verifica Filiali Senza Dipendenti
    const unusedBranches = await db.collection("filiali").aggregate([
      {
        $lookup: {
          from: "dipendenti",
          let: { filiale_id: "$filiale_id", divisione: "$divisione" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$filiale_id", "$$filiale_id"] },
              { $eq: ["$divisione", "$$divisione"] }
            ] } } }
          ],
          as: "linked_employees"
        }
      },
      { $match: { linked_employees: { $size: 0 } } }
    ]).toArray();
    console.log("Filiali senza Dipendenti:", unusedBranches);

    // Verifica Filiali Duplicate
    const duplicateBranches = await db.collection("filiali").aggregate([
      { $group: { _id: { filiale_id: "$filiale_id", divisione: "$divisione" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    console.log("Filiali Duplicate:", duplicateBranches);

    // Verifica Dipendenti Duplicati
    const duplicateEmployees = await db.collection("dipendenti").aggregate([
      { $group: { _id: { _id: "$_id", divisione: "$divisione" }, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    console.log("Dipendenti Duplicati:", duplicateEmployees);
  } catch (error) {
    console.error("Errore durante i controlli di consistenza:", error);
  } finally {
    await client.close();
  }
}

runConsistencyChecks();
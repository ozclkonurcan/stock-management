import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Replace the uri string with your connection string.
  const uri = process.env.mongoDbUri;

  const client = new MongoClient(uri);

  try {
    const database = client.db("StockMasterDB");
    const inventoryItems = database.collection("inventory_items");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const inventoryItem = await inventoryItems.find(query).toArray();
    console.log(inventoryItem);
    return NextResponse.json({ a: 34, inventoryItem });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

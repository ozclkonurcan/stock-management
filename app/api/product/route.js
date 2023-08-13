import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.mongoDbUri;

export async function GET(req) {
  // Replace the uri string with your connection string.

  const client = new MongoClient(uri);

  try {
    const database = client.db("StockMasterDB");
    const inventoryItems = database.collection("inventory_items");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const products = await inventoryItems.find(query).toArray();
    // console.log(products);
    return NextResponse.json({ ok: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(req) {
  // Replace the uri string with your connection string.
  let body = await req.json();

  const client = new MongoClient(uri);

  try {
    const database = client.db("StockMasterDB");
    const inventoryItems = database.collection("inventory_items");
    const product = await inventoryItems.insertOne(body);
    return NextResponse.json({ product, ok: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

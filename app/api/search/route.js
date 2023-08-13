import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.mongoDbUri;

export async function GET(req) {
  const query = req.nextUrl.searchParams.get("query");
  // Replace the uri string with your connection string.

  const client = new MongoClient(uri);

  try {
    const database = client.db("StockMasterDB");
    const inventoryItems = database.collection("inventory_items");

    const products = await inventoryItems
      .aggregate([
        {
          $match: {
            $or: [{ productName: { $regex: query, $options: "i" } }],
          },
        },
      ])
      .toArray();

    // console.log(products);
    return NextResponse.json({ ok: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

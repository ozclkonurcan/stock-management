import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Replace the uri string with your connection string.
  let { action, productName, initialQuantity } = await req.json();
  const uri = process.env.mongoDbUri;
  const client = new MongoClient(uri);

  try {
    const database = client.db("StockMasterDB");
    const inventoryItems = database.collection("inventory_items");
    const filter = { productName: productName };

    let newProductQuantity =
      action == "increment"
        ? parseInt(initialQuantity) + 1
        : parseInt(initialQuantity) - 1;
    const updateDoc = {
      $set: {
        productQuantity: newProductQuantity,
      },
    };
    const result = await inventoryItems.updateOne(filter, updateDoc, {});

    return NextResponse.json({
      ok: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  } finally {
    await client.close();
  }
}

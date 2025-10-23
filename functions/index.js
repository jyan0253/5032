
const functions = require("firebase-functions"); // 2.1
const onRequest = functions.https.onRequest; // 2.1
const admin = require("firebase-admin"); // 2.2

admin.initializeApp(); // 2.2

/**
 * Upper-case all string values recursively.
 * Works for strings, arrays, and plain objects.
 * Non-string values are returned unchanged.
 * @param {*} v Input value to transform.
 * @return {*} Transformed value with strings upper-cased.
 */
function upperAllStrings(v) {
  if (typeof v === "string") return v.toUpperCase();
  if (Array.isArray(v)) return v.map(upperAllStrings);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v)) out[k] = upperAllStrings(v[k]);
    return out;
  }
  return v;
}


exports.httpAddBook = onRequest(async (req, res) => {
  // 2.3 CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Use POST",
    });
  }

  try {
    const body = req.body || {};
    const isbnNum = Number(body.isbn);
    const name = (body.name || "").toString().trim();

    if (!Number.isFinite(isbnNum) || !name) {
      return res.status(400).json({
        ok: false,
        error: "isbn(number) and name are required",
      });
    }

    const toSave = upperAllStrings({
      isbn: isbnNum, // 2.6
      name: name,
    });

    const ref = await admin
        .firestore()
        .collection("books") // 2.5
        .add({
          ...toSave,
          serverTime: admin.firestore.FieldValue.serverTimestamp(),
        });

    return res.status(200).json({
      ok: true,
      id: ref.id,
      saved: toSave,
    });
  } catch (e) { // 2.6
    return res.status(500).json({
      ok: false,
      error: e.message || String(e),
    });
  }
});


exports.countBooks = onRequest(async (req, res) => { // 2.4
  // 2.3 CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Use GET",
    });
  }

  try { // 2.6
    const snap = await admin
        .firestore()
        .collection("books") // 2.5
        .get();
    return res.status(200).json({
      ok: true,
      count: snap.size,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message || String(e),
    });
  }
});


exports.getAllBooks = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Use GET",
    });
  }

  try {
    const snap = await admin.firestore().collection("books").get();
    const books = [];
    snap.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json({
      ok: true,
      count: books.length,
      books,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message || String(e),
    });
  }
});

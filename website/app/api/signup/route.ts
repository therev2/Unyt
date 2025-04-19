import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { uid, username, email, college, regNo } = await req.json();
    console.log("Received signup request:", { username, email, college, regNo });

    // 1. Check if college exists (case-insensitive)
    const collegeQuery = query(
      collection(db, "Colleges"),
      where("name_lower", "==", college.trim().toLowerCase())
    );
    const collegeSnapshot = await getDocs(collegeQuery);
    console.log("College query result count:", collegeSnapshot.size);

    let collegeId = "";
    if (!collegeSnapshot.empty) {
      collegeId = collegeSnapshot.docs[0].id;
      console.log("College exists:", collegeId);
    } else {
      // College does not exist, create it (only once)
      const { addDoc, collection } = await import("firebase/firestore");
      const newCollegeDoc = await addDoc(collection(db, "Colleges"), {
        name: college.trim(),
        name_lower: college.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
      });
      collegeId = newCollegeDoc.id;
      console.log("Created new college:", collegeId);
    }

    // 2. Store user info in Firestore (userId should come from client after successful Auth)
    // For demo, use email as doc id (not recommended for production)
    await setDoc(doc(db, "Students", uid), {
      username,
      email,
      collegeId,
      college: college.trim(),
      regNo,
    });
    console.log("User info written to Firestore:", { username, email, collegeId, regNo });

    return NextResponse.json({ message: "User info stored in Firestore. Complete Auth on client." });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}

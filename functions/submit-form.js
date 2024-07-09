const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("Parsed data:", data);

    const { data: insertedData, error } = await supabase
      .from("memberships")
      .insert({
        full_name: data.fullName,
        address: data.address,
        email: data.email,
        phone: data.phone,
        member_type: data.memberType,
        children: data.children,
      })
      .select();

    if (error) throw error;

    if (!insertedData || insertedData.length === 0) {
      throw new Error("No data returned from insert operation");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Form data saved successfully",
        memberId: insertedData[0].id,
      }),
    };
  } catch (error) {
    console.error("Error in submit-form function:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

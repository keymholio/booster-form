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

    // Validate required fields
    if (
      !data.fullName ||
      !data.address ||
      !data.email ||
      !data.phone ||
      !data.memberType
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Validate children if member type is parent
    if (data.memberType === "parent") {
      if (!data.children || !data.children.length) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Parent members must have at least one child",
          }),
        };
      }
      for (let child of data.children) {
        if (!child.name || !child.grade || !child.performingArts) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Incomplete child information" }),
          };
        }
      }
    }

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

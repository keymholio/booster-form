const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const submissionData = {
      full_name: data.fullName,
      address: data.address,
      email: data.email,
      phone: data.phone,
      member_type: data.memberType,
      payment_method: data.paymentMethod,
      children: data.children,
    };

    const { error } = await supabase.from("memberships").insert(submissionData);

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Form submitted successfully",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Error submitting form: ${error.message}`,
      }),
    };
  }
};

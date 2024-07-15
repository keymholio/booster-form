const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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

    // Process payment
    const charge = await stripe.charges.create({
      amount: 2600, // $26.00
      currency: "usd",
      source: data.token,
      description: "Booster Club Membership",
    });

    // If payment successful, save to database
    const { data: insertedData, error } = await supabase
      .from("memberships")
      .insert({
        full_name: data.fullName,
        address: data.address,
        email: data.email,
        phone: data.phone,
        member_type: data.memberType,
        children: data.children,
        payment_status: "paid",
        payment_id: charge.id,
      })
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Form submitted and payment successful",
        memberId: insertedData[0].id,
      }),
    };
  } catch (error) {
    console.error("Error in submit-form-and-process-payment function:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

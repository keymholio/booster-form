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

  let memberId;

  try {
    const { token, amount, memberId: id } = JSON.parse(event.body);
    memberId = id; // Assign to outer scope variable

    // Process payment
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: token,
      description: "Booster Club Membership",
    });

    // Update Supabase record
    const { error } = await supabase
      .from("memberships")
      .update({
        payment_status: "paid",
        payment_id: charge.id,
      })
      .eq("id", memberId);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Payment successful and record updated",
      }),
    };
  } catch (error) {
    console.error("Error processing payment:", error);

    // Only attempt to update if memberId is defined
    if (memberId) {
      try {
        // If payment fails, update the payment_status to 'failed'
        await supabase
          .from("memberships")
          .update({ payment_status: "failed" })
          .eq("id", memberId);
      } catch (supabaseError) {
        console.error("Error updating Supabase:", supabaseError);
      }
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

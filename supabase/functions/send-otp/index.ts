import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp } = await req.json();

    const transporter = new SmtpClient({
      service: 'gmail',
      auth: {
        user: 'asdmyself123@gmail.com',
        pass: '#IamSaitama'
      }
    });

    await transporter.sendMail({
      from: 'asdmyself123@gmail.com',
      to: email,
      subject: 'Your Planova OTP',
      text: `Your OTP for Planova payment is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #E91E63;">Planova Payment OTP</h1>
          <p>Your one-time password for completing the payment is:</p>
          <h2 style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px;">
            ${otp}
          </h2>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
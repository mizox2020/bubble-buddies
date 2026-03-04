export function getWelcomeEmailHtml(userName: string, siteUrl: string): string {
  const logoUrl = `${siteUrl}/bubble-heroes-logo.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Bubble Heroes</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #fce7f3 100%); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; margin: 0 auto;">
          <tr>
            <td align="center" style="padding: 32px 0 24px;">
              <img src="${logoUrl}" alt="The Bubble Heroes" width="220" height="auto" style="display: block; max-width: 220px; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(30, 64, 175, 0.12); overflow: hidden; border: 2px solid #7dd3fc;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: linear-gradient(90deg, #0ea5e9 0%, #ec4899 100%); padding: 20px 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                      Welcome, ${userName}!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 16px; color: #1e40af; font-size: 16px; line-height: 1.6;">
                      You&apos;re officially a Bubble Hero!
                    </p>
                    <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 1.6;">
                      We&apos;re a mobile foam and bubble party service serving the entire DFW Metroplex. We bring professional foam cannons, bubble machines, and trained operators to your backyard, school, or event. Our foam is 100% organic, non-toxic, and mess-free — it evaporates within 15–30 minutes. No cleanup required!
                    </p>
                    <p style="margin: 0 0 16px; color: #334155; font-size: 15px; line-height: 1.6; font-weight: 600;">
                      How it works:
                    </p>
                    <ol style="margin: 0 0 24px; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                      <li><strong>Choose Your Package</strong> — Browse our fun-filled bubble and foam party packages.</li>
                      <li><strong>Pick a Date</strong> — Select from our available time slots.</li>
                      <li><strong>Party Time!</strong> — We show up with all the gear and make your event unforgettable!</li>
                    </ol>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="${siteUrl}/dashboard/book" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e3a8a; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4); border: 2px solid #fcd34d;">
                            Book Your First Party
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 0;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                The Bubble Heroes · Bubble parties that make memories
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

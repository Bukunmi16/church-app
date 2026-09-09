const emailTemplateBase = ({ title, relatedModel, description, image, action, bodyText }) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<style>
  @media only screen and (max-width: 480px) {
    .stack-col {
      display: block !important;
      width: 100% !important;
      border-left: none !important;
      border-top: 1px solid #eeeeee !important;
    }
    .content-cell {
      padding: 20px !important;
    }
  }

  @media (prefers-color-scheme: dark) {
    body, .email-bg {
      background-color: #f4f4f7 !important;
    }
    .card {
      background-color: #ffffff !important;
    }
    h2, p, a {
      color: inherit !important;
    }
    .logo-light {
      display: none !important;
    }
    .logo-dark {
      display: inline-block !important;
    }
  }
</style>
</head>
<body class="email-bg" style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-bg" style="background-color:#f4f4f7; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="400" cellpadding="0" cellspacing="0" class="card" style="max-width:400px; width:100%; background-color:#ffffff; border-radius: 8px; overflow:hidden; border: 1px solid #eaeaea;">

          ${image ? `
          <!-- Full event/service image, uncropped -->
          <tr>
            <td style="padding:0;" align="center">
              <img src="${image}" alt="${relatedModel}"
                   style="display:block; width:100%; height:auto; margin:0 auto;" />
            </td>
          </tr>
          ` : `  <tr>
            <td style="padding:0;" align="center">
              <img src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg" alt="${relatedModel}"
                   style="display:block; width:100%; height:auto; margin:0 auto;" />
            </td>
          </tr>`}

          <tr>
            <td class="stack-col content-cell" style="padding: 28px;">
              <!-- Logo + heading, side by side -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td valign="middle" style="padding-right:10px;">
                    <!-- Light mode: dark/black-bg logo -->
                    <img src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788384142/rhema-logo.jpg"
                    alt="Church Logo" width="32" height="32" class="logo-light"
                    style="display:inline-block; border-radius:50%;"
                    />
                    <!-- Dark mode: white-bg logo (hidden by default, shown via media query) -->
                    <img src="https://res.cloudinary.com/jkjwwa8p/image/upload/v1788830563/rhema-logo-white-bg.jpg"
                         alt="Church Logo" width="32" height="32" class="logo-dark"
                         style="display:none; border-radius:50%;"
                    />
                  </td>
                  <td valign="middle">
                    <h2 style="color:#1a237e; margin:0; font-size:18px;">${relatedModel} ${action}</h2>
                  </td>
                </tr>
              </table>

              <p style="font-size:14px; color:#333; line-height:1.5; margin:0 0 12px 0;">
                <strong>${title}</strong> ${bodyText}
              </p>
              ${description ? `
              <p style="font-size:13px; color:#555; line-height:1.5; margin:0 0 12px 0; background-color:#f8f8fb; padding:10px 12px; border-radius:6px;">
                ${description}
              </p>` : ''}
              <a href="https://your-church-app.com/${relatedModel.toLowerCase()}"
                 style="background-color:#1a237e; color:#ffffff; padding:10px 18px; border-radius:6px; text-decoration:none; font-size:13px; display:inline-block;">
                View ${relatedModel} Details
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 24px; background-color:#f9f9fb; text-align:center; border-top: 1px solid #eeeeee;">
              <p style="font-size:12px; color:#888; margin:0;">
                You're receiving this because you're a member of Rhema Chapel Ogbomoso.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const emailTemplateCreate = ({ title, relatedModel, description, image }) =>
  emailTemplateBase({
    title,
    relatedModel,
    description,
    image,
    action: 'Added',
    bodyText: 'has been added to the church website.'
  });

export const emailTemplateUpdate = ({ title, relatedModel, description, image }) =>
  emailTemplateBase({
    title,
    relatedModel,
    description,
    image,
    action: 'Updated',
    bodyText: "has been updated on the church's website."
  });
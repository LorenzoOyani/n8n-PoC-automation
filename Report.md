📄 Phase 3 – Technical Report

Project: Node.js + PostgreSQL + n8n Automation
Author: Bema Music Engineering
Date: November 2025

This report answers the three required Phase 3 questions regarding data storage, email provider selection, and analytics tracking when using n8n + MailerSend.

1. Data Storage Strategy
Should we store values like wallet_balance inside n8n, or in our database?

Short Answer:
- All subscriber data should remain in our backend database. n8n should not be used for storage.

Reasoning being:  

- n8n is an automation engine, not a data store.

- Any variables stored in n8n context (like workflow data or global data) are:

- Not persistent across workflow executions.

- Lost if n8n restarts or crashes.

- Not queryable like a real database.

But our backend database ensures:

- Reliability

- Permanent storage of subscriber info

- History tracking

- Consistency across all services

- Safety when scaling workflows and triggers

Conclusion

- The database is the single source of truth.
- n8n should only read from the DB, perform automation actions, and optionally write results back — but never store key values internally.

2. Email Provider Analysis – Why Not Gmail / Google SMTP?
Short Answer:

➡️ Gmail SMTP is not designed for production email automation.
➡️ MailerSend is the safer, scalable, and professional option.

Key Risks of Using Gmail/Google SMTP

1. Sending Limits

2. Gmail Workspace limits outgoing mail.

3. Automated emails (notifications, campaigns, triggers) can hit these limits easily.

4. Once limits are hit:

5. Emails fail quietly

6. Automation breaks

7. Account may be temporarily blocked

2. Domain Blacklisting Risk

Automated messages from Gmail are more likely to land in spam.

Too many sends or spam reports damage our domain reputation.

Worst case: Gmail rate-limits or suspends the account.

3. Not Built for Automation

No event tracking (open/click logs)

No bounce management

No unsubscribe logic

No reputation protection

Hard to scale

4. Security & Compliance Issues

Using Gmail for automation can violate:

Google Terms of Service

Standard email sending practices

Anti-spam compliance guidelines

Why MailerSend is Better

API-based sending optimized for automation

High deliverability and domain protection

Proper logs, dashboards & monitoring

Detailed error reporting

Open/click tracking

Bounce/complaint handling

Webhook support for analytics

Built for scalable automation

## Conclusion

# Gmail SMTP is acceptable only for personal one-off emails.
# For automation, transactional messages, and workflow integration, MailerSend is the correct choice.

3. Email Analytics Tracking Without MailerLite
Short Answer:

We track opens and clicks using MailerSend Webhooks + our backend (or n8n trigger nodes).

How This Works

MailerSend provides built-in tracking for:

Email opened (via tracking pixel)

Link clicked (via tracked redirect URL)

Delivered

Bounced

Spam complaint

Unsubscribed

When any of these events occur, MailerSend automatically triggers a webhook.

What a MailerSend Webhook Does

MailerSend sends a request like this to our webhook URL:

{
  "event": "opened",
  "recipient": "user@example.com",
  "timestamp": 1700000000,
  "message_id": "abc-123",
  "metadata": {
    "subscriberId": 7
  }
}

Where We Receive This

We create a webhook endpoint in either:

Our Node backend (/webhook/email-events), OR

An n8n Webhook node (recommended for rapid automation).

What We Do With the Data

Save events in our DB

Update fields like:

last_opened_at

last_clicked_at

open_count

click_count

Trigger additional automations (e.g., onboarding steps, badges, referral bonuses)

## Conclusion

1. Even without MailerLite, we have full analytics via MailerSend webhooks.
2. This setup gives us flexibility and ownership over our email data.

## Summary Table
Question	Short Answer
Data Storage	Use our database — n8n is not a storage layer.
Email Provider	Gmail SMTP too risky; use MailerSend for scalability + deliverability.
Analytics	MailerSend provides open/click tracking via webhooks.
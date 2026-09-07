# AutoServe — Known Limitations & Architectural Notes

## Known Limitations & Environment Scope

1. **Vercel Hobby Serverless Database Connections**:
   - Vercel Hobby serverless functions spin down when idle. To manage connection quotas safely with TiDB Cloud Serverless MySQL, HikariCP pool parameters are tuned to `maximum-pool-size: 4`, `minimum-idle: 0`, and `idle-timeout: 30000`.
   - *Recommendation*: For high-concurrency production deployments with millions of requests, upgrade to dedicated database connection pooling proxy (such as ProxySQL or TiProxy).

2. **Vercel Cron Schedule Precision**:
   - Vercel Cron cleanup job (`/api/cron/cleanup`) executes once daily (`0 3 * * *`). Cron invocations on Hobby tier are subject to Vercel daily limit policies.
   - *Security*: The endpoint requires header `X-Cron-Secret` matching `CRON_SECRET` to prevent unauthorized execution.

3. **Razorpay Live Gateway Integration**:
   - Razorpay integration operates in Test Mode (`rzp_test_*`). Signature verification is executed server-side to guarantee webhook idempotency and payment authenticity.
   - *Recommendation*: Supply live Razorpay Key ID and Secret in environment variables when connecting to live banking settlement rails.

4. **SMTP Mail Delivery**:
   - In offline or restricted environments without an active SMTP gateway, email confirmation routines gracefully log warnings (`MailConnectException`) without interrupting core transaction processing.
   - *Recommendation*: Configure SendGrid, AWS SES, or standard SMTP credentials in environment variables for production email notifications.

## Planned Enhancements
- Mobile Push Notifications (FCM / APNS) for real-time repair progress alerts when app is minimized.
- Multi-branch Garage Management supporting regional service center routing.
- Advanced Analytics Dashboard with predictive inventory reordering.

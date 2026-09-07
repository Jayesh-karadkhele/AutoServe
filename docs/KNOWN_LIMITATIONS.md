# AutoServe — Known Limitations & Future Enhancements

## Known Limitations

1. **SMTP Mail Server Dependency**:
   - In offline local environments without an active SMTP server on port 25 or 587, appointment confirmation emails output connection warnings (`MailConnectException`). The application catches these gracefully without aborting transaction workflows.
   - *Recommendation*: Supply valid SMTP credentials in `application-prod.properties` or standard mail service for production email delivery.

2. **Razorpay Live Gateway Integration**:
   - For evaluation without live Razorpay API keys, payment verification supports simulated signature verification fallback.
   - *Recommendation*: Configure real Razorpay Key ID and Secret in environment variables when connecting to live banking channels.

3. **In-Memory H2 Database for Tests**:
   - Integration tests execute against H2 in-memory database using MySQL compatibility mode for rapid execution.
   - *Recommendation*: Run final staging verification against live MySQL 8.0 instance.

## Planned Enhancements
- Mobile Push Notifications (FCM / APNS) for real-time status alerts when app is minimized.
- Multi-branch Garage Management supporting regional garage routing.
- Advanced Analytics Dashboard with predictive inventory reordering.

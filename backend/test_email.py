from app.services.email_service import send_meeting_summary_email

send_meeting_summary_email(
    to_email="parnamimanya39@gmail.com",
    meeting_title="Test Meeting · ABC123",
    meeting_date="30 Jul 2026, 3:00 PM",
    participants=["Manya Parnami", "Vedika Vedika"],
    summary={
        "summary": "This is a test summary to confirm email delivery works correctly.",
        "key_points": ["First test point", "Second test point"],
        "action_items": ["Test action item one"],
    },
)
import httpx
from app.config import EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY

EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send"


def build_summary_email_html(meeting_title: str, meeting_date: str, participants: list, summary: dict) -> str:
    participants_str = ", ".join(participants) if participants else "No participants recorded"

    key_points_html = "".join(
        f'<li style="margin-bottom:8px;color:#334155;">{point}</li>'
        for point in summary.get("key_points", [])
    ) or "<li style='color:#94a3b8;'>No key points generated.</li>"

    action_items_html = "".join(
        f'<li style="margin-bottom:8px;color:#334155;">{item}</li>'
        for item in summary.get("action_items", [])
    ) or "<li style='color:#94a3b8;'>No action items generated.</li>"

    return f"""
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background-color:#f6f8fc; padding:32px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e2e8f0;">

        <div style="padding:24px 28px; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:18px; font-weight:700; color:#4f46e5;">Conferio</div>
          <div style="font-size:12px; color:#64748b;">Your Pensieve for Meetings</div>
        </div>

        <div style="padding:28px;">
          <h1 style="font-size:18px; color:#0f172a; margin:0 0 6px;">{meeting_title}</h1>
          <p style="font-size:13px; color:#64748b; margin:0 0 20px;">{meeting_date} &nbsp;·&nbsp; {participants_str}</p>

          <div style="background:#eef2ff; border-radius:10px; padding:16px; margin-bottom:20px;">
            <div style="font-size:11px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
              Executive Summary
            </div>
            <p style="font-size:14px; color:#0f172a; line-height:1.6; margin:0;">
              {summary.get("summary", "Summary not available.")}
            </p>
          </div>

          <div style="margin-bottom:20px;">
            <div style="font-size:11px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
              Key Points
            </div>
            <ul style="margin:0; padding-left:18px; font-size:13px;">
              {key_points_html}
            </ul>
          </div>

          <div>
            <div style="font-size:11px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px;">
              Action Items
            </div>
            <ul style="margin:0; padding-left:18px; font-size:13px;">
              {action_items_html}
            </ul>
          </div>
        </div>

        <div style="padding:16px 28px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
          <span style="font-size:11px; color:#94a3b8;">
            This summary was generated automatically by Conferio.
          </span>
        </div>

      </div>
    </div>
    """


def send_meeting_summary_email(
    to_email: str,
    meeting_title: str,
    meeting_date: str,
    participants: list,
    summary: dict,
):
    try:
        participants_str = ", ".join(participants) if participants else "No participants"

        key_points = "\n".join(
            [f"• {p}" for p in summary.get("key_points", [])]
        ) or "No key points generated."

        action_items = "\n".join(
            [f"• {a}" for a in summary.get("action_items", [])]
        ) or "No action items generated."

        payload = {
            "service_id": EMAILJS_SERVICE_ID,
            "template_id": EMAILJS_TEMPLATE_ID,
            "user_id": EMAILJS_PUBLIC_KEY,
            "accessToken": EMAILJS_PRIVATE_KEY,
            "template_params": {
                "to_email": to_email,
                "subject": f"Meeting Summary: {meeting_title}",
                "meeting_title": meeting_title,
                "meeting_date": meeting_date,
                "participants": participants_str,
                "summary": summary.get("summary", ""),
                "key_points": key_points,
                "action_items": action_items,
            },
        }

        response = httpx.post(
            EMAILJS_API_URL,
            json=payload,
            timeout=30,
        )
        response.raise_for_status()

        print(f"=== EMAIL SENT via EmailJS: {to_email} ===")
        return {"status": "sent"}

    except Exception as e:
        print(f"=== EMAIL FAILED: {e} ===")
        return None
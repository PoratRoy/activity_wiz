"use client";

const SHARE_TEXT = "מצאתי אתר שבונה פעולות בעזרת בינה מלאכותית, שווה לנסות!";

/** "שתפו עם חברים": the phone's share sheet, or WhatsApp where there is none. */
export async function shareSite(): Promise<void> {
  const url = window.location.origin;
  if (navigator.share) {
    try {
      await navigator.share({ title: "ActivityWiz", text: SHARE_TEXT, url });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n${url}`)}`, "_blank", "noopener");
}

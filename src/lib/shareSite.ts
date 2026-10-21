"use client";

const SHARE_TEXT = "מצאתי אתר שבונה פעולות לתנועות נוער בעזרת בינה מלאכותית, שווה לנסות https://activitywiz.com";

/** "שתפו עם חברים": the phone's share sheet, or WhatsApp where there is none. */
export async function shareSite(): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title: "ActivityWiz", text: SHARE_TEXT });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`, "_blank", "noopener");
}

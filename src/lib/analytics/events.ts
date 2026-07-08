/**
 * Analytics event contract.
 *
 * Central registry of every custom PostHog event name used across the app.
 * Keep names snake_case and reuse these constants instead of string literals
 * so the taxonomy stays consistent between client and server captures.
 */
export const EVENTS = {
  // Page views (dynamic story pages — supplements autocaptured $pageview so
  // "most visited country/region/indicator/dimension" is queryable directly).
  COUNTRY_PAGE_VIEWED: "country_page_viewed",
  REGION_PAGE_VIEWED: "region_page_viewed",
  INDICATOR_PAGE_VIEWED: "indicator_page_viewed",
  DIMENSION_PAGE_VIEWED: "dimension_page_viewed",

  // Downloads
  DOWNLOAD_MODAL_OPENED: "download_modal_opened",
  DOWNLOAD_FORM_SUBMITTED: "download_form_submitted",
  DOWNLOAD_COMPLETED: "download_completed",
  DOWNLOAD_FAILED: "download_failed",
  DOWNLOAD_REQUESTED: "download_requested", // server-side

  // Comparison tool
  COMPARISON_ENTITY_SELECTED: "comparison_entity_selected",
  COMPARISON_SLOT_ADDED: "comparison_slot_added",
  COMPARISON_SLOT_REMOVED: "comparison_slot_removed",
  COMPARISON_BREAKDOWN_TOGGLED: "comparison_breakdown_toggled",
  COMPARISON_PILLAR_FILTERED: "comparison_pillar_filtered",

  // Evidence explorer
  EVIDENCE_SEARCHED: "evidence_searched",
  EVIDENCE_FILTER_APPLIED: "evidence_filter_applied",
  EVIDENCE_PATHWAY_SELECTED: "evidence_pathway_selected",
  EVIDENCE_ITEM_OPENED: "evidence_item_opened",

  // Newsletter
  NEWSLETTER_SUBSCRIBED: "newsletter_subscribed",
  NEWSLETTER_SUBSCRIBE_FAILED: "newsletter_subscribe_failed",
  NEWSLETTER_SUBSCRIBE_REQUESTED: "newsletter_subscribe_requested", // server-side

  // AI assistant
  AI_ASSISTANT_OPENED: "ai_assistant_opened",
  AI_MESSAGE_SENT: "ai_message_sent",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

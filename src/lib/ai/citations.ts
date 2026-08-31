/**
 * The Responses API returns the model's inline citations as private-use
 * Unicode markers rather than as prose — the sequence renders in a browser as
 * `?cite?turn1lookup_country0?`. The SDK surfaces the resolved sources
 * separately (we render those in the Sources drawer), but the raw markers stay
 * in the text stream, where the markdown renderer prints them as tofu boxes in
 * the middle of a sentence.
 *
 * Nothing in the private-use area is ever legitimate assistant prose, so we
 * drop it before rendering.
 */

// A complete marker: opening delimiter (U+E200) through its closing delimiter
// (U+E201). Leading whitespace goes too, so a stripped marker doesn't leave a
// dangling space behind the sentence it followed.
const CITATION_BLOCK = /[ \t]*\uE200[^\uE201]*\uE201/g;
// Mid-stream the closing delimiter may not have arrived yet. Hide the partial
// marker instead of letting it flicker at the end of the text.
const UNTERMINATED_BLOCK = /[ \t]*\uE200[^\uE201]*$/;
// Defensive sweep for delimiters that arrive without their opener.
const PRIVATE_USE = /[\uE000-\uF8FF]/;
const PRIVATE_USE_ALL = /[\uE000-\uF8FF]/g;
// Removing a marker can strand whitespace before punctuation or a line break.
const SPACE_BEFORE_PUNCTUATION = /[ \t]+([.,;:!?)\]]|\n)/g;

export function stripCitationMarkers(text: string): string {
  if (!PRIVATE_USE.test(text)) return text;

  return text
    .replace(CITATION_BLOCK, "")
    .replace(UNTERMINATED_BLOCK, "")
    .replace(PRIVATE_USE_ALL, "")
    .replace(SPACE_BEFORE_PUNCTUATION, "$1");
}

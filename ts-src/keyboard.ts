import { display_result } from "./display_result.js";

function insertAtCursor(inputElement: HTMLInputElement, textToInsert: string) {
  // Get the current text of the input element
  const currentValue = inputElement.value;

  // Get the start and end positions of the cursor
  const start = inputElement.selectionStart ?? 0;
  const end = inputElement.selectionEnd ?? 0;

  // Insert the text at the cursor position
  inputElement.value = currentValue.slice(0, start) + textToInsert + currentValue.slice(end);

  // Move the cursor after the inserted text
  inputElement.setSelectionRange(start + textToInsert.length, start + textToInsert.length);

  // Since the `oninput` event is not triggered, I have to manually run it
  display_result();
}

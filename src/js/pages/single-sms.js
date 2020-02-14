import $ from "jquery";
import textareaCounter from "../helpers/textareaCounter";

$(document).ready(() => {
    // Textarea count letters
    const $messageTextareaCounter = textareaCounter($("#message-wrapper"));
});

const textareaCounter = $wrapper => {
    const $textarea = $wrapper.find("textarea");
    const $parts = $wrapper.find(".message-parts");
    const $letters = $wrapper.find(".message-letters");

    $textarea.on("keyup", event => {
        event.preventDefault();
        const val = event.target.value;

        $letters.text(val.length);

        if (val.length <= 52) {
            $parts.text("1");
        }
        if (val.length >= 52 && val.length <= 104) {
            $parts.text("2");
        }
        if (val.length >= 104 && val.length <= 160) {
            $parts.text("3");
        }
    });
};

export default textareaCounter;

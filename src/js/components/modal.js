import $ from "jquery";
import "magnific-popup";

import closeMfpButton from "../helpers/close-svg";

const initModal = () => {
    const modalParams = ($this) => ({
        items: {
            src: $this.data("mfp-src"),
            removalDelay: 200,
            mainClass: "mfp-fade",
            closeMarkup: closeMfpButton,
        },
    });

    // eslint-disable-next-line func-names
    $(".js-modal").on("click", function() {
        const $self = $(this);
        const params = modalParams($self);

        $.magnificPopup.open(params);
    });

    $(".js-mfp-close").on("click", () => {
        if($.magnificPopup.instance.isOpen) {
            $.magnificPopup.close();
        }
    });
};


export default initModal;

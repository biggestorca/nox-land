import $ from "jquery";
import {registerServiceWorker} from "./registerServiceWorker";
import { initModal, initImageModal } from "./components/modal";
import { initForm } from "./components/form";

$(document).ready(() => {
    initModal();
    initImageModal();
    initForm();

    $(".js-trigger-collapse").each(function() {
        const $self = $(this);
        const $content = $($self.data("toggle"));
        const $short = $($self.data("short"));
        const $tridot = $short.find(".collapse__tridot");

        $content.removeClass("d-none");
        $content.slideUp(0);

        $self.on("click", function() {
            if ($self.hasClass("active")) {
                $self.removeClass("active");
                $tridot.removeClass("d-none");
                $content.slideUp(250);
            } else {
                $self.addClass("active");
                $tridot.addClass("d-none");
                $content.slideDown(250);
            }
        });
    });

    const env = process.env.NODE_ENV;

    if (env === "production") {
        registerServiceWorker();
    }
});

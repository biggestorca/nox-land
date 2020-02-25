import $ from "jquery";
import "magnific-popup";

export const initModal = () => {
    const modalParams = $this => ({
        removalDelay: 200,
        mainClass: "mfp-fade mfp-zoom-out",
        items: {
            src: $this.data("mfp-src"),
        },
        callbacks: {
            open: function() {
                // this - is Magnific Popup object
                $("html").css("overflow", "hidden");
            },
            close: function() {
                $("html").removeAttr("style");
            },
        },
    });

    // eslint-disable-next-line func-names
    $(".js-mfp").on("click", function() {
        const $self = $(this);
        const params = modalParams($self);

        $.magnificPopup.open(params);
    });

    $(".js-mfp-close").on("click", () => {
        if ($.magnificPopup.instance.isOpen) {
            $.magnificPopup.close();
        }
    });
};


export const initImageModal = () => {
    $(".mfp-image").magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        mainClass: "mfp-with-zoom",
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true, // By default it's false, so don't forget to enable it
        
            duration: 300, // duration of the effect, in milliseconds
            easing: "ease-in-out", // CSS transition easing function
        
            // The "opener" function should return the element from which popup will be zoomed in
            // and to which popup will be scaled down
            // By defailt it looks for an image tag:
            opener: function(openerElement) {
                // openerElement is the element on which popup was initialized, in this case its <a> tag
                // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                return openerElement.is("img") ? openerElement : openerElement.find("img");
            }
        }
    });
};
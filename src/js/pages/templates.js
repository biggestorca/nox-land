import $ from "jquery";
import "select2";
import "magnific-popup";
import "jquery-validation";

import TabsManager from "../components/tabs";
import TooltipManager from "../components/tooltip";
import initModal from "../components/modal";
import { closeButton } from "../helpers/close-svg";
import textareaCounter from "../helpers/textareaCounter";

/**
 * Create tab header markup
 * @param { number } wizardsCount - number of created wizards
 * @return { HTMLElement } - header markup for tab item
 * */
const createTabsHeaderItem = wizardsCount => {
    const headerItem = document.createElement("li");

    headerItem.classList.add("b-tabs__header-item");
    headerItem.innerHTML = `Template ${wizardsCount} <button class="b-tabs__remove-item">${closeButton}</button>`;

    return headerItem;
};

/**
 * Create tab content markup
 * @return { HTMLElement } - content markup for tab item
 * */
const createTabsContentItem = () => {
    const contentItem = document.createElement("div");

    contentItem.classList.add("b-tabs__content-item");

    return contentItem;
};

/**
 * Initializing new tab
 * Triggered when user clicked "+ Create new" button
 * initializing selects, tooltips in new tab, also
 * initializing logic of forms in the new tab
 *
 * @param { HTMLElement } $tabNodeSelector - New tab markup
 * @param { HTMLElement } wizardsCount - number of created wizards
 * */
const initTab = ($tabNodeSelector, wizardsCount) => {
    // Uniq id for selects
    const select2List = $tabNodeSelector.find(".select2.no-autoinit");
    // eslint-disable-next-line func-names
    select2List.each(function() {
        const self = $(this);

        // Need change id because each new tab has markup from template with same id for select
        self.attr("id", `${self.attr("id")}--${wizardsCount}`);

        self.select2({
            minimumResultsForSearch: Infinity,
        });
    });

    // Textarea count letters
    const $messageTextareaCounter = textareaCounter(
        $tabNodeSelector.find("#message-wrapper")
    );

    const $tooltipsList = $tabNodeSelector.find(".b-tooltip");

    // eslint-disable-next-line func-names
    $tooltipsList.each(function() {
        // eslint-disable-next-line no-new
        new TooltipManager($(this));
    });

    // Need to re-init modal handler here because we need to use modals which is triggered by buttons in last step
    // Each steps block creates from html example and handlers don't propagate for any buttons, etc in new markup
    // In future probably this modals will be triggered from code and initialization method will be removed from here
    initModal();
};

$(document).ready(() => {
    let haveOpenedBatchWizard = false;
    let wizardsCount = 0;
    const dashboardNode = $("#templates-dashboard");
    const tabsNode = $("#tabs-templates-wizard");
    const tabNode = $("#template-tab-example");
    const tabsHeaderListNode = tabsNode.find(".b-tabs__header-list");
    const tabsContentNode = tabsNode.find(".b-tabs__content");
    let tabsManager = null;

    const $filteredForm = $("#templates-filtered-form");
    const $filteredFormSubmitHandler = $filteredForm.find(
        ".b-button[type='submit']"
    );

    const validateConstrains = {
        rules: {
            "filter-batch-name": {
                required: false,
            },
        },
        messages: {
            "filter-batch-name": {
                required: "Please provide an batch name",
            },
        },
    };

    $filteredForm.validate({
        submitHandler(form, event) {
            $filteredFormSubmitHandler.attr("disable", "disable");
            event.preventDefault();

            const errors = $("#errors ul");
            const success = $("#success");
            errors.hide();
            success.hide();

            $.ajax({
                url: "",
                data: $(form).serializeArray(),
                type: "POST",
                success: function(response) {
                    errors.empty();
                    if (response.result) {
                        success.show();
                        $filteredFormSubmitHandler.removeAttr("disable");
                        // Update table
                    } else {
                        if (response.message.length) {
                            response.message.forEach(function(item) {
                                errors.append(`<li>${item}</li>`);
                            });

                            errors.show();
                        } else {
                            errors.hide();
                        }
                    }
                },
            });
        },
        ...validateConstrains,
    });

    /*
     * Handler of click which is create new tab (batch wizard) with steps
     * */
    $("#open-template-wizard").on("click", event => {
        event.preventDefault();
        wizardsCount += 1;

        // Create new tab header and content markup
        const headerItem = createTabsHeaderItem(wizardsCount);
        const contentItem = createTabsContentItem();

        // Clone tab from hidden template
        const tab = tabNode.clone();

        $(tab).removeAttr("id");

        // Added tab content to new tab
        tab.appendTo(contentItem);

        // Added tabs header and content to tabs markup
        tabsHeaderListNode.append($(headerItem));
        tabsContentNode.append($(contentItem));

        // Init new tab
        initTab($(tab), wizardsCount);

        // Show tab
        tab.removeClass("d-none");

        /**
         * Callback for removing tab
         * @param { number } tabsCount - count of created tabs at the page.
         * */
        const removeTabCallback = tabsCount => {
            // eslint-disable-next-line no-cond-assign
            if (tabsCount === 0) {
                // Show Dashboard content
                dashboardNode.removeClass("d-none");

                // Hide tabs
                tabsNode.addClass("d-none");

                wizardsCount = 0;
                haveOpenedBatchWizard = false;
                tabsManager = null;
            }
        };

        if (haveOpenedBatchWizard) {
            // Tracked tab by TabsManager
            tabsManager.registerTab(headerItem, contentItem, wizardsCount - 1);

            // Make new tab visible
            tabsManager.activateTab(
                tabsManager.tabs[tabsManager.tabs.length - 1]
            );
        } else {
            // Tracked tab by TabsManager
            tabsManager = new TabsManager(tabsNode, removeTabCallback);

            // Hide Dashboard content
            dashboardNode.addClass("d-none");

            // Show tabs
            tabsNode.removeClass("d-none");

            haveOpenedBatchWizard = true;
        }
    });
});

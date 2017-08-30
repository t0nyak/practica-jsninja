import UIManager from "./UIManager";

export default class FooterManager extends UIManager {

    constructor(elementSelector) {
        super(elementSelector); // constructor UIManager
    }

    init() {
        this.element.on("click", "a", function (event) {
            if (this.hash !== "") {
                event.preventDefault();

                var hash = this.hash;

                $('html, body').animate({
                    scrollTop: 0
                }, 750, function () {
                    window.location.hash = hash;
                });
            }
        });
    }
}
import UIManager from "./UIManager";

export default class HeaderManager extends UIManager {

    constructor(elementSelector, pubSub) {
        super(elementSelector); // constructor UIManager
        this.pubSub = pubSub;
    }

    init() {
        this.loadInitial();
        this.element.on("click", ".search", () => {
            if (!this.element.hasClass("searching")) {
                this.loadSearch();
                this.element.addClass("searching");
            } else {
                this.loadInitial();
                this.element.removeClass("searching");
            }
        });
    }

    loadSearch() {
        let html = `<div class="input-search"><input name="search" type="text" placeholder="Buscar..."></div>
                <div class="search"><i class="fa fa-search"></i> </div>`;
        this.setIdealHtml(html);
    }

    loadInitial() {
        let html = `<h1 class="web-title"><a href="/">Quartum</a></h1>
        <div class="menu"><i class="fa fa-navicon"></i> </div>
        <div class="search"><i class="fa fa-search"></i> </div>
        <div class="login"><i class="fa fa-user"></i></div>    `;
        this.setIdealHtml(html);
    }
}
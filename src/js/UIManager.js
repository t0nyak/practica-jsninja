const $ = require("jquery");

export default class UIManager {

    constructor(selector) {
        this.uiStateClasses = "empty loading error partial ideal"; // clases CSS que definen estados de componente
        this.element = $(selector); // seleccionamos el elemento de jQuery en el constructor
    }

    setEmpty() {
        this.element.removeClass(this.uiStateClasses).addClass("empty");
    }

    setLoading() {
        this.element.removeClass(this.uiStateClasses).addClass("loading");
    }

    setError() {
        this.element.removeClass(this.uiStateClasses).addClass("error");
    }

    setPartial() {
        this.element.removeClass(this.uiStateClasses).addClass("partial");
    }

    setIdeal() {
        this.element.removeClass(this.uiStateClasses).addClass("ideal");
    }

    setEmptyHtml(html) {
        // busca un descendiente de this.element, que tenga las classes CSS ui-status y empty y le asigna el HTML
        this.element.find(".ui-status.empty").html(html);
    }

    setLoadingHtml(html) {
        this.element.find(".ui-status.loading").html(html);
    }

    setErrorHtml(html) {
        this.element.find(".ui-status.error").html(html);
    }

    setPartialHtml(html) {
        this.element.find(".ui-status.partial").html(html);
    }

    setIdealHtml(html) {
        this.element.find(".ui-status.ideal").html(html).fadeIn("slow");
    }

    // Aunque no es una función de la UI, es conveniente tenerla aquí pues la usarán varias
    // clases que extiendan UIManager. De otra manera, habría redundancia de código
    getWeekday(day) {
        let weekday;
        switch (day){
            case 0:
                weekday = "domingo";
                break;
            case 1:
                weekday = "lunes";
                break;
            case 2:
                weekday = "martes";
                break;
            case 3:
                weekday = "miércoles";
                break;
            case 4:
                weekday = "jueves";
                break;
            case 5:
                weekday = "viernes";
                break;
            case 6:
                weekday = "sábado";
                break;
        }
        return weekday;
    }
}
const $ = require("jquery");

import UIManager from './UIManager';

export default class CommentsFormManager extends UIManager {

    constructor(elementSelector, webService, pubSub) {
        super(elementSelector); 
        this.webService = webService;
        this.pubSub = pubSub;
    }

    init() {
        this.setupSubmitEventHandler();
    }

    setupSubmitEventHandler() {
        this.element.on("submit", () => {
            this.validateAndSendData();
            return false; // == event.preventDefault();
        });
    }

    validateAndSendData() {
        if (this.isValid()) {
            this.send();
        }
    }

    isValid() {
        const inputs = this.element.find("input");
        for (let input of inputs) {
            if (input.checkValidity() == false) {
                const errorMessage = input.validationMessage;
                input.focus();
                console.log(errorMessage);
                this.setErrorHtml('<h3 class="error">El elemento de formulario ' + input.getAttribute('name') + ' ha producido el siguiente error: ' + errorMessage + '. Por favor, recarga la página y envía el formulario de nuevo</h3>');
                this.setError();
                return false;
            }
        }
        const textarea = this.element.find("textarea");
        if(textarea.val().split(" ").length > 120) {
            textarea.focus();
            this.setErrorHtml('<h3 class="error">El elemento de formulario ' + textarea.getAttribute('name') + ' ha producido el siguiente error: No están permitidos comentarios de más de 120 palabras. Por favor, recarga la página y envía el formulario de nuevo</h3>');
            this.setError();
            return false;
        }
        // Llegamos aquí, si no hay ningún error
        this.setIdeal(); 
        return true;
    }

    send() {
        this.setLoading();
        const comment = {
            idArticle: parseInt(this.element.find("#id-article").val()),
            author: this.element.find("#nombre").val(),
            email: this.element.find("#email").val(),
            comment: this.element.find("#comment").val(),
            date: Date.now().toString()
        };
        this.webService.save(comment, success => {
            this.pubSub.publish("new-comment", comment); 
            this.resetForm();
            this.setIdeal();
        }, error => {
            this.setErrorHtml("Se ha producido un error al guardar la canción en el servidor.");
            this.setError();
        });
    }

    resetForm() {
        this.element[0].reset(); // resetea el formulario
    }

    disableFormControls() {
        this.element.find("input, button").attr("disabled", true);
    }

    enableFormControls() {
        this.element.find("input, button").attr("disabled", false);
    }

    setLoading() {
        super.setLoading();
        this.disableFormControls();
    }

    setError() {
        super.setError();
        this.enableFormControls();
    }

    setIdeal() {
        super.setIdeal();
        this.enableFormControls();
    }

}
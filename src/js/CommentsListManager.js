import UIManager from './UIManager';

export default class CommentsListManager extends UIManager {

    constructor(elementSelector, webService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.webService = webService;
        this.pubSub = pubSub;
    }

    init() {
        this.loadComments();        
        this.pubSub.subscribe("new-comment", (topic, comment) => {
            this.loadComments();
        });
    }

    loadComments() {
        this.webService.list(comments => {
            // Comprobamos si hay canciones
            if (comments.length == 0) {
                // Mostramos el estado vacío
                this.setEmpty();
            } else {
                // Componemos el HTML con todas las canciones
                this.renderComments(comments);
                // Quitamos el mensaje de cargando y mostramos la lista de canciones
                this.setIdeal();
            }
        }, error => {
            // Mostrar el estado de error
            this.setError();
            // Hacemos log del error en la consola
            console.error("Error al cargar las canciones", error);
        });
    }

    renderComments(comments) {
        let html = "";
        for (let comment of comments) {
            if(comment.idArticle == this.element.data("id")) {
                html += this.renderComment(comment);
            }
        }
        // Metemos el HTML en el div que contiene las canciones
        this.setIdealHtml(html);
    }

    renderComment(comment) {
        let commentDate = comment.date;
        let currentDate = Date.now();
        let elapsedTime = currentDate - commentDate;
        let time;
        let seconds = Math.floor(elapsedTime/1000);
        if (seconds < 60) {
            time = "Hace " + seconds + " segundos";
        } else if (seconds < 3600) {
            time = "Hace " + Math.floor(seconds/60) + " minutos";
        } else if (seconds < 3600*24) {
            time = "Hace " + Math.floor(seconds/(3600)) + " horas";
        } else if (seconds < 3600*24*7) {
            let date = new Date(Number.parseInt(commentDate));
            time = "El " + this.getWeekday(date.getDay()) + " pasado";
        } else {
            let date = new Date(Number.parseInt(commentDate));
            time = date.getUTCDate();
        }
        return `<div class="comment">
            <span class="author">${comment.author}</span> - 
            <span class="e-mail">${comment.email}</span><br>
            <span class="time">${time}</span>
            <p class="text-comment">${comment.comment}</p>
        </div>`;
    }

    deleteComment(commentId) {
        this.setLoading();
        this.webService.delete(commentId, success => {
            this.loadComments();
        }, error => {
            this.setError();
        })
    }

}
import UIManager from './UIManager';

export default class ArticlesListManager extends UIManager {
    
    constructor(elementSelector, commentsService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.commentsService = commentsService;
        this.pubSub = pubSub;
    }

    init() {
        if(!localStorage.likes){
            let likesArray = new Array(9).fill(0);
            localStorage.likes = JSON.stringify(likesArray);
        }
        this.loadActions();
        this.pubSub.subscribe("new-like", (topic, article) => {
            this.loadActions();
        });
        this.element.on("click", "#comment-button", function (event) {
            if (this.hash !== "") {
                event.preventDefault();

                var hash = this.hash;

                window.location.href = "article.html#go-comments";
            }
        });
    }

    loadDates() {
        let self = this;
        this.element.find(".article").find(".artist").find(".date").each( function() {
            let fechaPub = $(this).text();
            let fechaAct = new Date();
            fechaPub = fechaPub.split(" - ");
            fechaPub[0] = fechaPub[0].split("/");
            fechaPub[1] = fechaPub[1].split(":");
            let result = new Date(fechaPub[0][2], Number.parseInt(fechaPub[0][1])-1, fechaPub[0][0], fechaPub[1][0], fechaPub[1][1], fechaPub[1][2], 0);
            let elapsedTime = Math.floor((fechaAct - result)/1000);
            let time;
            if (elapsedTime < 60) {
                time = "Hace " + elapsedTime + " segundos";
            } else if (elapsedTime < 3600) {
                time = "Hace " + Math.floor(elapsedTime/60) + " minutos";
            } else if (elapsedTime < 3600*24) {
                time = "Hace " + Math.floor(elapsedTime/(3600)) + " horas";
            } else if (elapsedTime < 3600*24*7) {
                let date = new Date(result);
                time = "El " + self.getWeekday(date.getDay()) + " pasado";
            } else {
                time = $(this).text();
            }
            $(this).text(time);
        });
    }

    loadActions() {
        let articles = this.element.find(".article");
        if (localStorage.likes) {
            let likes = JSON.parse(localStorage.likes);
            $.map(this.element.find(".article").find(".like"), function (like, id) {
                like.innerText = likes[id];
            });
            $.map(this.element.find(".article").find(".comment"), (comment, id) => {
                comment.innerText = this.countComments(id);
            });
        } else {
            articles.find(".like").text("0");
        }
        articles.find(".share").text("0");
        articles.find(".download").text("0");
        this.loadDates();
    }

    countComments(commentId) {
        this.commentsService.list(comments => {
            this.setNumComments(comments);
        }, error => {
            this.setError();
            console.error("Error al cargar los comentarios", error);
        });
    }

    setNumComments(comments) {
        if (comments.length == 0) {
             this.element.find(".article").find(".comment").text(0);
        } else {
            for(let id = 0; id < 9; id++){
                let numComments = 0;
                for (let comment of comments) {
                    if (comment.idArticle == (id+1)) {
                        numComments++;
                    }
                }
                this.element.find(".article").find(".comment")[id].innerText = numComments;
            }
        }
    }
}
window.$ = window.jQuery = require("jquery"); // Hace jQuery accesible públicamente

import ArticlesListManager from "./ArticlesListManager";
import CommentsListManager from "./CommentsListManager";
import CommentsFormManager from "./CommentsFormManager";
import WebService from "./WebService";
import HeaderManager from "./HeaderManager";
import FooterManager from "./FooterManager";
import PubSub from "pubsub-js";

const commentService = new WebService("/comments/");
const articleService = new WebService("/articles/"); // Aunque no lo uso, lo pongo porque sería lo lógio para tratar con los artículos en el backend

const headerManager = new HeaderManager(".web-header", PubSub);
headerManager.init();

const footerManager = new FooterManager(".web-footer");
footerManager.init();

/* Le paso el commentService en esta versión, ya que los artículos son estáticos y no necesito para nada un servicio para los artículos
        pero si necesito el servicio para conocer el número de comentarios de cada artículo         */
const articlesListManager = new ArticlesListManager(".articles-list", commentService, PubSub);
articlesListManager.init();

$(".article #like-button").on("click", function (e) {
    e.preventDefault();
    let likes = JSON.parse(localStorage.likes);
    let index = $(this).parent().parent().data("id");
    let articleId = Number.parseInt(index)-1;
    likes[articleId]++;
    localStorage.likes = JSON.stringify(likes);
    PubSub.publish("new-like", articleId);
});

$(document).ready(function () {
    if (window.location.hash == '#go-comments') {
        $('html, body').animate({
            scrollTop: $("#comments-container").offset().top - 150
        }, 1000, function () {
            window.location.hash = hash;
        });
    }
});

const commentsListManager = new CommentsListManager(".comments", commentService, PubSub);

$(window).on("scroll", function() {
    if($(window).scrollTop() >= ($('.article-content').height() - 200)) {
        commentsListManager.init();
    }
})

const commentsFormManager = new CommentsFormManager("#comment-form", commentService, PubSub);
commentsFormManager.init();
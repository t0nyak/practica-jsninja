const $ = require("jquery");

export default class WebService {

    constructor(url) {
        this.url = url;
    }

    // Obtener listado de canciones
    list(successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            success: successCallback,
            error: errorCallback
        });
    }

    // Crear o actualizar canción
    save(object, successCallback, errorCallback) {
        if (object.id) {
            this.update(object, successCallback, errorCallback);
        } else {
            this.create(object, successCallback, errorCallback);
        }
    }

    // Crear una cancion
    create(object, successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            method: "post",
            data: object,
            success: successCallback,
            error: errorCallback
        })
    }

    // Obtener el detalle de canción
    getDetail(objectId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${objectId}`,
            success: successCallback,
            error: errorCallback
        })
    }

    // Actualizar una canción
    update(object, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${object.id}`,
            method: "put",
            data: object,
            success: successCallback,
            error: errorCallback
        })
    }

    // Borrar una canción (songsService.delete(4, response => {}, error => {}))
    delete(objectId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${objectId}`,
            method: 'delete', // método HTTP a utilizar
            success: successCallback,
            error: errorCallback
        })
    }

}
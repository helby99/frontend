$(function () {
    //CRUD Application

    var form = $(".form");
    var inputTitle = $("#commentTitle");
    var inputEmail = $("#commentEmail");
    var inputDescription = $("#commentDescription");
    var list = $(".comment-list");
    var url = "http://localhost:3000";

    function loadcomments() {

        $.ajax({
            method: "GET",
            url: url + "/komentar",
            dataType: "json"
        }).done(function (response) {
            list.empty();
            insertcomments(response);

        })
            .fail(function (error) {
                console.log(error);
            })
    }

    loadcomments();


    function insertcomments(comments) {
        comments.forEach(function (e) {
            var li = $(
                `<li class="comment">
                    <div class="comment-content">
                        <h3 class="comment-title">${e.title}</h3>
                        <p class="comment-email">${e.email}</p>
                        <p class="comment-description">${e.description}</p>
                    </div>
                    <button class="btn-edit" data-id="${e.id}">Edit</button>
                    <button class="btn-delete" data-id="${e.id}">Hapus</button>
                </li>`);
            list.append(li);
        })
    }


    function addcomment(title,email, description) {
        var pengunjung = {
            "title": title,
            "email": email,
            "description": description
        };
        $.ajax({
            method: "POST",
            url: url + "/komentar",
            dataType: "json",
            data: pengunjung
        }).done(function (response) {
            loadcomments();
        })
            .fail(function (error) {
                console.log(error);
            })


    }


    form.on("submit", function (e) {
        e.preventDefault();
        addcomment(inputTitle.val(), inputEmail.val(), inputDescription.val());
        inputTitle.val("");
        inputEmail.val("");
        inputDescription.val("");
    });

    function removecomment(id) {
        $.ajax({
            method: "DELETE",
            url: url + "/komentar/" + id,
            dataType: "json",
        }).done(function (response) {
            loadcomments();
        })
            .fail(function (error) {
                console.log(error);
            })

    }

    list.on("click", ".btn-delete", function () {
        var id = $(this).data("id");
        removecomment(id);

    });


    function updatecomment(id, title, email, description) {
        var komen = {
            "title": title,
            "email": email,
            "description": description
        };
        $.ajax({
            method: "PATCH",
            url: url + "/komentar/" + id,
            dataType: "json",
            data: komen
        }).done(function (response) {
            loadcomments()

        })
            .fail(function (error) {
                console.log(error);
            });

    }
    list.on("click", ".btn-edit", function (e) {
        e.preventDefault();


        var titleToEdit = $(this).parent().find(".comment-title");
        var emailToEdit = $(this).parent().find(".comment-email");
        var descriptionToEdit = $(this).parent().find(".comment-description");

        $(this).toggleClass("editable");

        if ($(this).hasClass("editable")) {
            var titleToEditText = titleToEdit.text();
            var emailToEditText = emailToEdit.text();
            var descriptionToEditText = descriptionToEdit.text();


            titleToEdit.replaceWith(`<input type="text" class="comment-title" value="${titleToEditText}" />`);
            emailToEdit.replaceWith(`<input type="text" class="comment-email" value="${emailToEditText}" />`);
            descriptionToEdit.replaceWith(`<input type="text" class="comment-description" value="${descriptionToEditText}" />`);

            $(this).text("simpan");

        }
        else{
            var modId = $(this).data("id");
            var thisTitle = titleToEdit.val();
            var thisEmail = emailToEdit.val();
            var thisDesc= descriptionToEdit.val();

            titleToEdit.replaceWith(` <h3 class="comment-title">${thisTitle}</h3>`);
            emailToEdit.replaceWith(` <p class="comment-email">${thisEmail}</p>`);
            descriptionToEdit.replaceWith(`<p class="comment-description">${thisDesc}</p>`);

            updatecomment(modId, thisTitle, thisEmail, thisDesc);
            $(this).text("edit");
        }
    });
});


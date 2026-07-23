document.addEventListener("DOMContentLoaded", () => {

    const editor = document.querySelector("#editor");

    if (!editor) return;

    const quill = new Quill("#editor", {

        theme: "snow",

        placeholder: "Write your article...",

        modules: {

            toolbar: [

                [{ header: [1, 2, 3, false] }],

                ["bold", "italic", "underline"],

                [{ list: "ordered" }, { list: "bullet" }],

                ["blockquote", "code-block"],

                ["link", "image"],

                ["clean"]

            ]

        }

    });

    const form = editor.closest("form");

    form.addEventListener("submit", () => {

        document.querySelector("#contentHtml").value =
            quill.root.innerHTML;

    });

});
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById("book-list");

        // create tr element
        const row = document.createElement("tr");

        // insert columns
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className){
        // create a div
        const div = document.createElement("div");

        // Add classes
        div.className = `alert ${className}`;

        // add text
        div.appendChild(document.createTextNode(message));

        // get parent
        const container = document.querySelector(".container");

        // get form
        const form = document.querySelector("#book-form");

        // insert alert
        container.insertBefore(div, form);

        // timeout after 3 sec
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    deleteBook(target){
        if (target.className === "delete") {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }
}

// localstorage class
class Store {
    static getBooks(){
        let books;
        if (localStorage.getItem("books") === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(book => {
            const ui = new UI;

            // add books to ui
            ui.addBookToList(book);
        });
    }

    static addBooks(book){
        const books = Store.getBooks();
        
        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));
    }
    
    static removeBook(isbn){
        // console.log(isbn);
        
        const books = Store.getBooks();
        
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        });
        
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById("book-form").addEventListener("submit", (e) => {
    // get form values
    const title = document.getElementById("title").value,
        author = document.getElementById("author").value,
        isbn = document.getElementById("isbn").value;

    // instantiate book
    const book = new Book(title, author, isbn);

    // instantiate ui
    const ui = new UI();

    // validate
    if (title === "" || author === "" || isbn === "") {
        // error alert
        ui.showAlert("Please fill in all fields", "error");
    } else {
        // add book to the list
        ui.addBookToList(book);

        // add to ls
        Store.addBooks(book);

        // show success
        ui.showAlert("Book Added!", "success");

        // clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

//   event listener to delete
document.getElementById("book-list").addEventListener("click", (e) => {
    // instantiate  UI
    const ui = new UI;

    // Delete book
    ui.deleteBook(e.target);

    // remove from ls
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    // show message
    ui.showAlert("Book Removed!", "success");

    e.preventDefault();
});
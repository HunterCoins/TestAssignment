window.addEventListener("DOMContentLoaded", () => {
    let selected = null;

    function showNotification(text, className) {
        const div = document.createElement("div");
        div.classList.add("alert", `alert-${className}`);
        div.textContent = text;

        container = document.querySelector(".container");
        main = document.querySelector(".main__content");

        container.insertBefore(div, main);

        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    function editDelete() {
        document
            .querySelector(".items__list")
            .addEventListener("click", (e) => {
                let target = e.target;

                if (target && target.classList.contains("delete")) {
                    target.parentElement.parentElement.remove();
                    showNotification("Item deleted", "danger");
                } else if (target && target.classList.contains("edit")) {
                    selected = target.parentElement.parentElement;
                    document.querySelector("#itemId").value =
                        selected.children[0].textContent;
                    document.querySelector("#itemName").value =
                        selected.children[1].textContent;
                    document.querySelector("#itemEmail").value =
                        selected.children[2].textContent;
                    document.querySelector("#itemAge").value =
                        selected.children[3].textContent;
                }
            });
    }
    editDelete();

    function clearInputs() {
        document.querySelectorAll("input").forEach((input) => {
            if (input.type === "submit") return;
            input.value = "";
        });
    }

    function SubmitFunc() {
        document.querySelector("#main-form").addEventListener("submit", (e) => {
            e.preventDefault();

            const id = document.querySelector("#itemId").value,
                name = document.querySelector("#itemName").value,
                email = document.querySelector("#itemEmail").value,
                age = document.querySelector("#itemAge").value;

            if (!selected) {
                const list = document.querySelector(".items__list");
                const newItem = document.createElement("tr");
                newItem.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${age}</td>
                <td>
                    <a
                        href="#"
                        class="btn btn-warning btn-sm edit"
                        >Edit</a
                    >
                    <a
                        href="#"
                        class="btn btn-danger btn-sm delete"
                        >Delete</a
                    >
                </td>
            `;
                list.appendChild(newItem);
                selected = null;

                showNotification(
                    "The element has been successfully added!",
                    "success"
                );
            } else {
                selected.children[0].textContent = id;
                selected.children[1].textContent = name;
                selected.children[2].textContent = email;
                selected.children[3].textContent = age;
                selected = null;
                showNotification(
                    "The element has been successfully edited!",
                    "info"
                );
            }
            clearInputs();
        });
    }
    SubmitFunc();

    function sortTableByColumn(table, column, asc = true) {
        const dirModifier = asc ? 1 : -1;
        const tableBody = table.tBodies[0];
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        console.log(tableBody);
        console.log(rows);

        const sortedRows = rows.sort((a, b) => {
            const aRowText = a
                .querySelector(`td:nth-child(${column + 1})`)
                .textContent.trim();
            const bRowText = b
                .querySelector(`td:nth-child(${column + 1})`)
                .textContent.trim();

            return aRowText > bRowText ? 1 * dirModifier : -1 * dirModifier;
        });
        console.log(sortedRows);

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        tableBody.append(...sortedRows);

        table
            .querySelectorAll("th")
            .forEach((th) =>
                th.classList.remove("th-sort-asc", "th-sort-desc")
            );
        table
            .querySelector(`th:nth-child(${column + 1})`)
            .classList.toggle("th-sort-asc", asc);
        table
            .querySelector(`th:nth-child(${column + 1})`)
            .classList.toggle("th-sort-desc", !asc);
    }

    document.querySelectorAll(".table-sortable th").forEach((th) => {
        if (th.textContent === "ACTIONS") return;
        th.addEventListener("click", () => {
            const tableElem = th.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(
                th.parentElement.children,
                th
            );
            const currIsAscending = th.classList.contains("th-sort-asc");

            sortTableByColumn(tableElem, headerIndex, !currIsAscending);
        });
    });
});

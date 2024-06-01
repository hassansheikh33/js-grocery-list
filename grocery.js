document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.grocery-form');
    const alert = document.querySelector('.alert');
    const grocery = document.querySelector('#grocery');
    const submitBtn = document.querySelector('.submit-btn');
    const container = document.querySelector('.grocery-container');
    const list = document.querySelector('.grocery-list');
    const clearList = document.querySelector('.clear-btn');

    let editFlag = false;
    let editElement;
    let editId = "";
    let timer;

    window.addEventListener('DOMContentLoaded', () => loadItems());
    clearList.addEventListener('click', () => clearItems());
    form.addEventListener('submit', e => addItem(e));

    const addItem = (e) => {
        e.preventDefault();
        const value = grocery.value;
        const id = new Date().getTime().toString();
        if (value && !editFlag) {
            showItems(id, value);
            container.classList.add('show-container');
            displayAlert("Item added", "success");
            setItem(id, value);
            setBackToDefault();
        } else if (value && editFlag) {    //if user is clicking enter after editing the value.
            editElement.innerHTML = value;
            displayAlert("value changed successfully", "success");
            editStorage(editId, value);
            setBackToDefault();
        } else {      //if text bar is empty
            displayAlert("Please type something", "danger");
        }
    }

    const setBackToDefault = () => {
        grocery.value = '';
        submitBtn.textContent = "Submit";
        editFlag = false;
        submitBtn.value = "Submit"
    }

    const displayAlert = (text, action) => {
        clearTimeout(timer);
        alert.innerHTML = text;
        alert.classList.add(`alert-${action}`, "show-container");

        // Use setTimeout to remove the alert after 3 seconds
        timer = setTimeout(() => {
            alert.classList.remove(`alert-${action}`, "show-container");
            clearTimeout(timer);
            alert.innerHTML = '';
        }, 2000);
    };


    const editItem = x => {
        editElement = x.parentElement.previousElementSibling;
        grocery.value = editElement.innerHTML;
        submitBtn.textContent = "Edit";
        editFlag = true;
        editId = editElement.parentElement.dataset.id;
    }

    const deleteItem = x => {
        const listItem = x.parentElement.parentElement;
        list.removeChild(listItem);
        displayAlert("Item deleted", "danger");
        const id = listItem.dataset.id;
        removeItem(id);
        if (list.children.length === 0) {
            container.classList.remove('show-container');
        }
        setBackToDefault();
    }


    const clearItems = () => {
        list.innerHTML = '';
        container.classList.remove("show-container");
        displayAlert("empty list", "danger");
        setBackToDefault();
        localStorage.removeItem("list");
    }

    const setItem = (id, value) => {
        let add = { id: id, value: value };
        let list = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
        list.push(add);
        localStorage.setItem("list", JSON.stringify(list));
    }

    const removeItem = id => {
        let list = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
        for (i in list) {
            if (list[i].id === id) {
                list.splice(i, 1);
                break;
            } else {
                continue;
            }
        }
        localStorage.setItem("list", JSON.stringify(list));
        if (list.length === 0) {
            localStorage.clear();
        }
    }

    const editStorage = (editId, value) => {
        let list = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
        list = list.map(item => {
            if (item.id == editId) {
                item.value = value;
            }
            return item;
        });
        localStorage.setItem("list", JSON.stringify(list));
    }

    const loadItems = () => {
        let list = localStorage.getItem('list') ? JSON.parse(localStorage.getItem("list")) : [];
        if (list.length > 0) {
            list.forEach(item => {
                showItems(item.id, item.value);
            })
            container.classList.add('show-container');
        }
    }

    const showItems = (id, value) => {
        const item = document.createElement("article");
        item.classList.add('grocery-item');
        item.setAttribute('data-id', id);
        item.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">Edit</button>
              <button type="button" class="delete-btn">Delete</button>
            </div>`;
        /*selecting these buttons and adding event listeners to them
        here becuase we have access to them now. (they are added dynamically)*/
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteItem(this);
        });
        const editBtn = item.querySelector('.edit-btn');
        editBtn.addEventListener('click', function () {
            editItem(this);
        });
        ///////////
        list.appendChild(item);
    }

});

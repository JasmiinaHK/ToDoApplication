document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JavaScript loaded successfully!");

    /** ======================= TO-DO APP ======================= **/
    const taskTitle = document.getElementById("task-title");
    const taskCategory = document.getElementById("task-category");
    const taskDue = document.getElementById("task-due");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const filterAll = document.getElementById("filter-all");
    const filterCompleted = document.getElementById("filter-completed");
    const filterPending = document.getElementById("filter-pending");

    /** === FUNKCIJA ZA UČITAVANJE ZADATAKA IZ BAZE === **/
    function loadTasks() {
        fetch("get_tasks.php")
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = ""; // Očisti listu pre dodavanja novih zadataka

            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.setAttribute("data-id", task.id);
                taskItem.setAttribute("data-status", task.status);

                if (task.status === "completed") {
                    taskItem.classList.add("completed");
                }

                // Formatiranje datuma
                const formattedDate = task.due_date && task.due_date !== "0000-00-00 00:00:00" ? task.due_date : "No deadline";

                taskItem.innerHTML = `
                    <span class="task-text">${task.description} - <em>${task.category}</em> (Due: ${formattedDate})</span>
                    <div class="task-buttons">
                        <button class="complete-task">✔</button>
                        <button class="delete-task">✖</button>
                    </div>
                `;

                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error("❌ Error loading tasks:", error));
    }

    /** === DODAVANJE NOVOG ZADATKA === **/
    if (addTaskButton) {
        addTaskButton.addEventListener("click", () => {
            if (taskTitle.value.trim() === "") {
                console.log("❌ Please enter a task title.");
                return;
            }

            let formData = new FormData();
            formData.append("description", taskTitle.value);
            formData.append("category", taskCategory.value);
            formData.append("due_date", taskDue.value);

            fetch("add_task.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log("🔵 Task added response:", data);
                if (data.success) {
                    loadTasks(); // Ponovno učitavanje zadataka
                }
            })
            .catch(error => console.error("❌ Error adding task:", error));

            taskTitle.value = "";
            taskDue.value = "";
        });
    }

    /** === OZNAČAVANJE ZADATAKA KAO ZAVRŠENIH === **/
    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("complete-task")) {
            const taskItem = e.target.closest(".task-item");
            const taskId = taskItem.getAttribute("data-id");

            fetch("update_task.php", {
                method: "POST",
                body: new URLSearchParams({ task_id: taskId })
            })
            .then(response => response.text())
            .then(data => {
                console.log("🔵 Task update response:", data);
                taskItem.classList.toggle("completed"); // Precrtavanje zadatka
                taskItem.setAttribute("data-status", taskItem.classList.contains("completed") ? "completed" : "pending");
            })
            .catch(error => console.error("❌ Error updating task:", error));
        }
    });

    /** === BRISANJE ZADATAKA === **/
    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-task")) {
            const taskItem = e.target.closest(".task-item");
            const taskId = taskItem.getAttribute("data-id");

            fetch("delete_task.php", {
                method: "POST",
                body: new URLSearchParams({ task_id: taskId })
            })
            .then(response => response.text())
            .then(data => {
                console.log("🔵 Task delete response:", data);
                taskItem.remove(); // Uklanjanje iz DOM-a
            })
            .catch(error => console.error("❌ Error deleting task:", error));
        }
    });

    /** === FILTRIRANJE ZADATAKA === **/
    if (filterAll) {
        filterAll.addEventListener("click", () => {
            document.querySelectorAll(".task-item").forEach(task => task.style.display = "flex");
        });
    }

    if (filterCompleted) {
        filterCompleted.addEventListener("click", () => {
            document.querySelectorAll(".task-item").forEach(task => {
                task.style.display = task.getAttribute("data-status") === "completed" ? "flex" : "none";
            });
        });
    }

    if (filterPending) {
        filterPending.addEventListener("click", () => {
            document.querySelectorAll(".task-item").forEach(task => {
                task.style.display = task.getAttribute("data-status") === "pending" ? "flex" : "none";
            });
        });
    }

    /** === UČITAVANJE ZADATAKA PRI POKRETANJU STRANICE === **/
    loadTasks();
});

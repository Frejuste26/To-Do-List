// Variables
let inputname = document.getElementById('name');
let inputage = document.getElementById('age');
let addBtn = document.getElementById('addBtn');
let table = document.getElementById('tableBody');
let updatename = document.getElementById('updateName');
let updateAge = document.getElementById('updateAge');
let updateBtn = document.getElementById('updateBtn');
let cancelBtn = document.getElementById('cancelBtn');
let modal = document.getElementById('update-container');

// Fetch data from the JSON file
fetch('./Assets/data/todos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    let users = data;

    // Functions
    function showUpdateForm(userId) {
      // Show modal with user information for updating users
      let user = users.find(user => user.id === userId);
      if (user) {
        modal.style.display = 'block';
        updatename.value = user.name;
        updateAge.value = user.age;

        // Remove existing click event listeners to avoid duplicates
        updateBtn.onclick = () => {
          user.name = updatename.value;
          user.age = updateAge.value;
          displayUsers(users);
          modal.style.display = 'none';
        };

        cancelBtn.onclick = () => {
          modal.style.display = 'none';
        };
      }
    }

    function displayUsers(users) {
      // Clear existing rows to prevent duplicates
      table.innerHTML = '';

      users.forEach(user => {
        let row = document.createElement('tr');
        let idCell = document.createElement('td');
        let nameCell = document.createElement('td');
        let ageCell = document.createElement('td');
        let actionsCell = document.createElement('td');
        let editBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');

        editBtn.className = 'editBtn';
        editBtn.innerHTML = '<i class="fi fi-br-user-pen"></i>';
        editBtn.addEventListener('click', () => {
          showUpdateForm(user.id);
        });

        deleteBtn.className = 'deleteBtn';
        deleteBtn.innerHTML = '<i class="fi fi-br-remove-user"></i>';
        deleteBtn.addEventListener('click', () => {
          deleteUser(user.id);
        });

        idCell.textContent = user.id;
        nameCell.textContent = user.name;
        ageCell.textContent = user.age;

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(ageCell);
        row.appendChild(actionsCell);
        table.appendChild(row);
      });
    }

    function showNotification(message, type) {
      // Remove existing messages
      document.querySelectorAll('.notification').forEach(el => el.remove());

      // Create and display notification
      let notification = document.createElement('div');
      notification.className = `${type}-message`;
      notification.textContent = message;
      document.body.appendChild(notification);

      // Auto-remove notification after 3 seconds
      setTimeout(() => notification.remove(), 3000);
    }

    // Add new user
    addBtn.addEventListener('click', () => {
      let newUser = {
        id: users.length + 1,
        name: inputname.value,
        age: inputage.value,
      };

      if (!newUser.name || !newUser.age) {
        showNotification('Name and age are required!', 'error');
        return;
      }

      users.push(newUser);
      inputname.value = '';
      inputage.value = '';
      displayUsers(users);
      showNotification('User added successfully!', 'success');
    });

    // Delete user
    function deleteUser(userId) {
      users = users.filter(user => user.id !== userId);
      displayUsers(users);
      showNotification('User deleted successfully!', 'success');
    }

    // Initial display of users
    displayUsers(users);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
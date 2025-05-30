 // Sample data
    let users = [
      { username: "john", role: "Editor" },
      { username: "sarah", role: "Admin" },
      { username: "mike", role: "Viewer" }
    ];

    let permissions = {
      "Edit Contact Info": { Admin: true, Editor: false, Viewer: false, Support: false },
      "Manage FAQs": { Admin: true, Editor: true, Viewer: false, Support: false },
      "Update Privacy Policy": { Admin: true, Editor: true, Viewer: false, Support: false },
      "View User List": { Admin: true, Editor: false, Viewer: false, Support: false },
      "Delete Users": { Admin: true, Editor: false, Viewer: false, Support: false }
    };

    const roles = ['Admin', 'Editor', 'Viewer', 'Support'];

    function renderUsers() {
      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = "";
      users.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>
            <select onchange="changeUserRole(${index}, this.value)">
              ${roles.map(r => `<option value="${r}" ${r === user.role ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
          </td>
          <td><button class="btn btn-danger btn-sm" onclick="removeUser(${index})">X</button></td>
        `;
        tbody.appendChild(tr);
      });
    }

    function changeUserRole(index, newRole) {
      users[index].role = newRole;
      showNotification("User role updated.", "success");
    }

    function removeUser(index) {
      if (confirm("Are you sure you want to remove this user?")) {
        users.splice(index, 1);
        renderUsers();
        showNotification("User removed.", "success");
      }
    }

    function addUser() {
      const username = prompt("Enter username:");
      if (username && !users.some(u => u.username === username)) {
        users.push({ username, role: "Viewer" });
        renderUsers();
        showNotification("User added successfully.", "success");
      } else {
        alert("Username is empty or already exists.");
      }
    }

    function renderPermissions() {
      const tbody = document.getElementById("permissionTable");
      tbody.innerHTML = "";
      Object.entries(permissions).forEach(([perm, roleAccess]) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${perm}</td>
          ${roles.map(role => `
            <td>
              <label>
                <input type="checkbox" ${roleAccess[role] ? 'checked' : ''}
                       onchange="updatePermission('${perm}', '${role}', this.checked)" />
                Allow
              </label>
            </td>
          `).join('')}
        `;
        tbody.appendChild(tr);
      });
    }

    function updatePermission(permission, role, allowed) {
      permissions[permission][role] = allowed;
      showNotification("Permission updated.", "success");
    }

    function saveAccessControl() {
      try {
        localStorage.setItem("accessControl_users", JSON.stringify(users));
        localStorage.setItem("accessControl_permissions", JSON.stringify(permissions));
        showNotification("All access control settings saved!", "success");
      } catch (e) {
        showNotification("Failed to save changes.", "error");
      }
    }

    function showNotification(message, type) {
      const notification = document.getElementById("notification");
      notification.className = "notification " + type;
      notification.textContent = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
    }

    // Load from localStorage or default
    window.onload = () => {
      const savedUsers = localStorage.getItem("accessControl_users");
      const savedPerms = localStorage.getItem("accessControl_permissions");

      if (savedUsers) users = JSON.parse(savedUsers);
      if (savedPerms) permissions = JSON.parse(savedPerms);

      renderUsers();
      renderPermissions();
    };
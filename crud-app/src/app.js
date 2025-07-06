const postTitle = document.getElementById('postTitle');
const postBody = document.getElementById('postBody');
const addPostBtn = document.getElementById('addPostBtn');
const postsList = document.getElementById('postsList');

let posts = JSON.parse(localStorage.getItem('posts') || '[]');
let editingPostId = null;

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Add Post
addPostBtn.addEventListener('click', () => {
    const title = postTitle.value.trim();
    const body = postBody.value.trim();
    if (title && body) {
        const newPost = {
            id: Date.now(),
            title,
            body,
            userId: 1
        };
        posts.unshift(newPost);
        savePosts();
        renderPosts();
        postTitle.value = '';
        postBody.value = '';
    }
});

function renderPosts() {
    postsList.innerHTML = '';
    posts.forEach(post => {
        const li = document.createElement('li');
        if (editingPostId === post.id) {
            li.innerHTML = `
                <input type="text" id="editTitle${post.id}" value="${post.title}">
                <textarea id="editBody${post.id}">${post.body}</textarea>
                <button class="edit-btn" onclick="saveEdit(${post.id})">Save</button>
                <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
            `;
        } else {
            li.innerHTML = `
                <strong>${post.title}</strong>
                <p>${post.body}</p>
                <button onclick="editPost(${post.id})">Edit</button>
                <button onclick="deletePost(${post.id})">Delete</button>
            `;
        }
        postsList.appendChild(li);
    });
}

window.editPost = function(id) {
    editingPostId = id;
    renderPosts();
};

window.cancelEdit = function() {
    editingPostId = null;
    renderPosts();
};

window.saveEdit = function(id) {
    const newTitle = document.getElementById(`editTitle${id}`).value.trim();
    const newBody = document.getElementById(`editBody${id}`).value.trim();
    if (newTitle && newBody) {
        posts = posts.map(post =>
            post.id === id ? { ...post, title: newTitle, body: newBody } : post
        );
        editingPostId = null;
        savePosts();
        renderPosts();
    }
};

window.deletePost = function(id) {
    posts = posts.filter(post => post.id !== id);
    savePosts();
    renderPosts();
};

// Initial render
renderPosts();
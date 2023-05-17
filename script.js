import { posts } from "./data.js";

let fromStorage = [];

const startHTML = () => {
  bookmark();
  like();
  comment();
};

const comment = () => {
  const btn = document.querySelectorAll(".btn");

  btn.forEach((a) => {
    a.addEventListener("click", () => {
      const loggedUser = "Admir";
      const id = a.closest(".post-content").getAttribute("data-id");
      let comments = a.closest(".post-content").querySelector(".comments");
      let userValue = a.closest(".comment-input").querySelector(".input");
      const injectHTML = `<p><span>${loggedUser}</span> ${userValue.value}</p>`;

      if (userValue.value.length > 0) {
        comments.insertAdjacentHTML("beforeend", `${injectHTML}`);

        updateComment(id, loggedUser, userValue.value);
        userValue.value = "";
      } else {
        alert("Das Eingabefeld darf nicht leer sein.!");
      }
    });
  });
};

const updateComment = (id, user, comment) => {
  fromStorage.forEach((u) => {
    if (u.data_id === id) {
      u.comments = [
        ...u.comments,
        {
          user,
          comment,
        },
      ];
    }
  });
  saveToLocalStorage();
};

const bookmark = () => {
  const postBookmark = document.querySelectorAll(".bookmark");

  postBookmark.forEach((t) => {
    t.addEventListener("click", () => {
      const closest = t.closest(".post-content");
      const selectId = closest.getAttribute("data-id");

      updateBookmark(closest, selectId);
    });
  });
};

const updateBookmark = (closest, selectId) => {
  fromStorage.forEach((t) => {
    if (+t.data_id === +selectId) {
      t.isShownBookmark = !t.isShownBookmark;

      if (t.isShownBookmark) {
        closest.querySelector(".bookmark").src = "./images/bookmark2.png";
      } else {
        closest.querySelector(".bookmark").src = "./images/bookmark.png";
      }

      saveToLocalStorage();
    }
  });
};

const like = () => {
  const postHeart = document.querySelectorAll(".post-heart");
  postHeart.forEach((a) => {
    a.addEventListener("click", () => {
      updateLikes(a);
    });
  });
};

const updateLikes = (a) => {
  fromStorage.forEach((b) => {
    if (b.data_id === a.id) {
      b.isShownHeart = !b.isShownHeart;

      updateHeartImg(a, b);
      updateLikesHTML(a, b);
      saveToLocalStorage();
    }
  });
};

const updateHeartImg = (a, b) => {
  if (b.isShownHeart) {
    a.src = "./images/heart2.png";
    b.likes = b.likes + 1;
  } else {
    a.src = "./images/heart.png";
    b.likes = b.likes - 1;
  }
};

const updateLikesHTML = (a, b) => {
  const postContent = document.querySelectorAll(".post-content");

  postContent.forEach((c) => {
    const userId = parseInt(c.getAttribute("data-id"));

    if (userId === +a.id) {
      c.querySelector(".likes span").textContent = b.likes;
    }
  });
};

const saveToLocalStorage = () => {
  localStorage.setItem("posts", JSON.stringify(fromStorage));
};

const whichHeartImg = (u) => {
  if (u.isShownHeart) {
    return "./images/heart2.png";
  } else {
    return "./images/heart.png";
  }
};

const whichBookmarkImg = (u) => {
  if (u.isShownBookmark) {
    return "./images/bookmark2.png";
  } else {
    return "./images/bookmark.png";
  }
};

const createComment = (u) => {
  let comment = "";
  u.comments.forEach((w) => {
    comment += `<p><span>${w.user}</span> ${w.comment}</p>`;
  });
  return comment;
};

const renderHTML = (u, heartImg, bookmarkImg, comment) => {
  const content = document.querySelector("#content");
  content.innerHTML += `
    <div data-id="${u.data_id}" class="post-content">
      <div class="post-header">
        <div class="post-user">
          <img
            id="post-user-img"
            src="./images/${u.user_img}"
            alt="Profile picture 2"
          />
          <div class="post-user-info">
            <p id="post-user-name">${u.user_name}</p>
            <p id="post-user-location">${u.user_location}</p>
          </div>
        </div>
        <img id="post-dots" src="./images/dots.png" alt="Dots img" />
      </div>

      <div class="post-img">
        <img src="./images/${u.post_img}" alt="Urlaub img" />
      </div>

      <div class="post-info">
        <div class="post-options">
          <div class="post-container-options">
            <img id="${u.data_id}" class="post-heart" src="${heartImg}" alt="Heart img" />
            <img src="./images/comment.png" alt="Comment img" />
            <img src="./images/message.png" alt="Message img" />
          </div>
          <div class="post-container-bookmark">
            <img
              class="bookmark"
              src="${bookmarkImg}"
              alt="Bookmark img"
            />
          </div>
        </div>

        <div class="likes">
          <p>Gefällt <span>${u.likes}</span> Mal</p>
        </div>

        <div class="comments">${comment}</div>

        <div class="comment-input">
          <input
            class="input"
            type="text"
            placeholder="Kommentar hinzufügen"
          />
          <button class="btn">Posten</button>
        </div>
      </div>
    </div>
  `;
};

const render = (u) => {
  let heartImg = whichHeartImg(u);
  let bookmarkImg = whichBookmarkImg(u);

  const comment = createComment(u);

  renderHTML(u, heartImg, bookmarkImg, comment);
  startHTML();
};

const ifExistStorage = () => {
  const getPosts = localStorage.getItem("posts");
  const storagePosts = JSON.parse(getPosts);

  fromStorage = storagePosts;

  storagePosts.forEach((u) => {
    render(u);
  });
};

const onLoad = () => {
  if (localStorage.getItem("posts")) {
    ifExistStorage();
  } else {
    if (fromStorage.length > 0) {
      fromStorage.forEach((u) => {
        render(u);
      });
    } else {
      fromStorage = posts;
      fromStorage.forEach((u) => {
        render(u);
      });
    }
  }
};

onLoad();

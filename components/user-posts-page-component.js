import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js";
import ru from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/ru/index.js';

export function renderUserPostsPageComponent({ appEl }) {
  console.log(
    "Рендерим страницу постов пользователя. Количество постов:",
    posts.length
  );

  if (posts.length === 0) {
    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="no-posts">
          <p>У этого пользователя пока нет постов.</p>
        </div>
      </div>
    `;
  } else {
    // Генерируем HTML для постов
    const postsHtml = posts
      .map((post) => {
        let postTime = formatDistanceToNow(new Date(post.createdAt), {
          locale: ru,
        });

        return `
    <li class="post" data-post-id="${post.id}">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
                <img src="./assets/images/like-not-active.svg">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">            
              ${postTime}
            </p>
          </li>
        `;
      })
      .join("");

    appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}          
      </ul>
    </div>`;
  }

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}

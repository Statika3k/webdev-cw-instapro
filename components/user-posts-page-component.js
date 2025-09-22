import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";

/**
 * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
 * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
 */
export function renderUserPostsPageComponent({ appEl }) {
    console.log("Рендерим страницу постов пользователя. Количество постов:", posts.length);
    
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
      .map(
        (post) =>
          `
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
              ${post.addLater}  // Добавить позже
            </p>
          </li>
        `
      )
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

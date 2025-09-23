import { AUTH_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js";
import ru from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/ru/index.js';

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

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
                <img src="./assets/images/${
                  post.isLiked ? "like-active" : "like-not-active"
                }.svg">
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

  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      ${postsHtml}          
    </ul>
  </div>`;

  appEl.innerHTML = appHtml;

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

  // Обработчик кликов по кнопкам лайков
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const postId = button.dataset.postId;

      const token = getToken();
      if (!token) {
        alert("Пожалуйста, войдите, чтобы ставить лайки");
        goToPage(AUTH_PAGE);
        return;
      }

      const likeImage = button.querySelector("img");
      const isCurrentlyLiked = likeImage.src.includes("like-active.svg");

      button.disabled = true; // Блокируем кнопку на время запроса
      likeImage.style.opacity = "0.5"; // Визуальная индикация загрузки

      // Выбираем, какой запрос отправить, и выполняем его
      const likePromise = isCurrentlyLiked
        ? dislikePost({ token, postId })
        : likePost({ token, postId });

      likePromise
        .then((updatedPost) => {
          // Обновляем пост в глобальном массиве
          const postIndex = posts.findIndex((p) => p.id === updatedPost.id);
          if (postIndex !== -1) {
            posts[postIndex] = updatedPost;
          }

          // Обновляем иконку лайка
          likeImage.src = `./assets/images/like-${
            updatedPost.isLiked ? "active" : "not-active"
          }.svg`;

          // Обновляем счётчик лайков
          const likesText = button.nextElementSibling;
          if (likesText?.classList.contains("post-likes-text")) {
            likesText.innerHTML = `Нравится: <strong>${updatedPost.likes.length}</strong>`;
          }
        })
        .catch((error) => {
          console.error("Ошибка при обработке лайка:", error);
          alert("Не удалось обновить лайк: " + error.message);
        })
        .finally(() => {
          // Снимаем индикатор загрузки
          button.disabled = false;
          likeImage.style.opacity = "1";
        });
    });
  });
}

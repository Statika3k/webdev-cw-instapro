import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавление поста</h3>
          <div class="form-inputs">
            <textarea id="description-input" class="input" placeholder="Описание поста"></textarea>
            <div class="upload-image-container"></div>
            <button class="button" id="add-button">Добавить пост</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;
    
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document
        .getElementById("description-input")
        .value.trim();
      
      if (!description) {
        alert("Пожалуйста, добавьте описание к посту.");
        return;
      }
      
      if (!imageUrl) {
        alert("Пожалуйста, загрузите изображение.");
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };
  render();
}

/* ===== 基本元素 ===== */
const jobSelect = document.getElementById("job");
const typeSelect = document.getElementById("type");
const clearBtn = document.getElementById("clear");
const boxes = document.querySelectorAll(".box");

/* ===== Lightbox 元素 ===== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-main-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxText = document.getElementById("lightbox-text");
const lightboxClose = document.querySelector(".lightbox-close");

/* ===== 彩蛋 Modal 元素 ===== */
const easterEggBtn = document.getElementById("easter-egg-btn");
const surpriseModal = document.getElementById("surprise-modal");
const surpriseImg = document.getElementById("surprise-img");
const closeModal = surpriseModal.querySelector(".close-button");

/* ===== 補充圖片連結 ===== */
const imgLinks = document.querySelectorAll(".img-link");
const formulaLink = document.getElementById("formula-link");

/* ===== Lightbox 狀態 ===== */
let currentGallery = [];
let currentIndex = -1;

/* ===== 取得目前可見的圖片卡片 ===== */
function getVisibleImageBoxes() {
  return Array.from(boxes).filter(
    (box) => !box.classList.contains("hidden") && box.querySelector("img"),
  );
}

/* ===== 建立目前可見圖片的 gallery ===== */
function buildGalleryFromVisibleBoxes() {
  const visibleBoxes = getVisibleImageBoxes();

  return visibleBoxes.map((box) => {
    const img = box.querySelector("img");
    const title =
      box.dataset.title || box.querySelector("h3")?.textContent || "圖片說明";
    const text = box.dataset.text || "暫無說明";

    return {
      src: img.src,
      title,
      text,
    };
  });
}

/* ===== 渲染 Lightbox 內容 ===== */
function renderLightboxItem(item) {
  if (!item) return;

  lightboxImg.src = item.src || "";
  lightboxTitle.textContent = item.title || "圖片說明";

  const content = item.text || "暫無說明";

  if (content.includes("<")) {
    lightboxText.innerHTML = content;
  } else {
    lightboxText.textContent = content;
  }
}

/* ===== 開啟 Lightbox ===== */
function openLightbox(item, gallery = [], index = -1) {
  if (!item) return;

  currentGallery = gallery;
  currentIndex = index;

  renderLightboxItem(item);
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ===== 關閉 Lightbox ===== */
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";
  currentGallery = [];
  currentIndex = -1;
}

/* ===== 上一張 / 下一張 ===== */
function showPrevImage() {
  if (!currentGallery.length) return;

  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;

  renderLightboxItem(currentGallery[currentIndex]);
}

function showNextImage() {
  if (!currentGallery.length) return;

  currentIndex = (currentIndex + 1) % currentGallery.length;
  renderLightboxItem(currentGallery[currentIndex]);
}

/* ===== 篩選卡片 ===== */
function filterBoxes() {
  const job = jobSelect.value;
  const type = typeSelect.value;

  boxes.forEach((box) => {
    const match =
      (job === "all" || box.dataset.job === job) &&
      (type === "all" || box.dataset.type === type);

    box.classList.toggle("hidden", !match);
  });
}

/* ===== 篩選事件 ===== */
jobSelect.addEventListener("change", filterBoxes);
typeSelect.addEventListener("change", filterBoxes);

clearBtn.addEventListener("click", () => {
  jobSelect.value = "all";
  typeSelect.value = "all";
  filterBoxes();
});

/* ===== 點擊卡片圖片，打開 Lightbox ===== */
boxes.forEach((box) => {
  const img = box.querySelector("img");
  if (!img) return;

  img.addEventListener("click", (e) => {
    e.stopPropagation();

    const gallery = buildGalleryFromVisibleBoxes();
    const clickedSrc = img.src;
    const index = gallery.findIndex((item) => item.src === clickedSrc);

    const item = {
      src: clickedSrc,
      title:
        box.dataset.title || box.querySelector("h3")?.textContent || "圖片說明",
      text: box.dataset.text || "暫無說明",
    };

    openLightbox(item, gallery, index);
  });
});

/* ===== 點擊補充圖片連結，打開 Lightbox ===== */
imgLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const item = {
      src: link.dataset.img,
      title: link.dataset.title || link.textContent.trim() || "補充圖片",
      text: link.dataset.text || "暫無說明",
    };

    openLightbox(item, [], -1);
  });
});

/* ===== 如果有公式連結，也支援 Lightbox ===== */
if (formulaLink) {
  formulaLink.addEventListener("click", (e) => {
    e.preventDefault();

    const item = {
      src: formulaLink.dataset.img,
      title: formulaLink.dataset.title || "傷害計算公式（非官方）",
      text: formulaLink.dataset.text || "暫無說明",
    };

    openLightbox(item, [], -1);
  });
}

/* ===== Lightbox 關閉事件 ===== */
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

/* ===== 彩蛋圖片池 ===== */
const randomImages = [
  "pic/gengtu1.png",
  "pic/gengtu2.png",
  "pic/gengtu3.png",
  "pic/gengtu4.png",
  "pic/gengtu5.png",
  "pic/gengtu6.png",
  "pic/gengtu7.png",
  "pic/gengtu8.png",
  "pic/gengtu9.png",
  "pic/gengtu10.png",
  "pic/gengtu11.png",
  "pic/gengtu12.png",
  "pic/gengtu13.png",
  "pic/gengtu14.png",
  "pic/gengtu15.png",
  "pic/gengtu16.png",
  "pic/gengtu17.png",
];

/* ===== 彩蛋洗牌池 ===== */
let shuffledImages = [];
let currentShuffleIndex = 0;

/* ===== 洗牌函式 ===== */
function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

/* ===== 取得下一張彩蛋圖片 ===== */
function getNextSurpriseImage() {
  if (
    shuffledImages.length === 0 ||
    currentShuffleIndex >= shuffledImages.length
  ) {
    shuffledImages = shuffleArray(randomImages);
    currentShuffleIndex = 0;
  }

  const nextImage = shuffledImages[currentShuffleIndex];
  currentShuffleIndex++;

  return nextImage;
}

/* ===== 開啟彩蛋 Modal ===== */
easterEggBtn.addEventListener("click", () => {
  surpriseImg.src = getNextSurpriseImage();

  surpriseModal.style.display = "flex";
  setTimeout(() => surpriseModal.classList.add("active"), 10);

  document.body.style.overflow = "hidden";
});

/* ===== 關閉彩蛋 Modal ===== */
closeModal.addEventListener("click", () => {
  surpriseModal.classList.remove("active");

  setTimeout(() => {
    surpriseModal.style.display = "none";
  }, 300);

  document.body.style.overflow = "auto";
});

surpriseModal.addEventListener("click", (e) => {
  if (e.target === surpriseModal) {
    closeModal.click();
  }
});

/* ===== 鍵盤控制 ===== */
document.addEventListener("keydown", (e) => {
  const lightboxActive = lightbox.classList.contains("active");
  const surpriseActive = surpriseModal.classList.contains("active");

  if (e.key === "Escape") {
    if (lightboxActive) closeLightbox();
    if (surpriseActive) closeModal.click();
    return;
  }

  if (!lightboxActive) return;

  if (e.key === "ArrowLeft" && currentGallery.length > 1) {
    showPrevImage();
  }

  if (e.key === "ArrowRight" && currentGallery.length > 1) {
    showNextImage();
  }
});

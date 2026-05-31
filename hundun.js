/* ===== 基本元素 ===== */
const jobSelect = document.getElementById("job");
const typeSelect = document.getElementById("type");
const clearBtn = document.getElementById("clear");
const boxes = document.querySelectorAll(".box");
const filterCount = document.getElementById("filter-count");

/* ===== Lightbox 元素 ===== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-main-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxText = document.getElementById("lightbox-text");
const lightboxClose = document.querySelector(".lightbox-close");
const prevBtn = document.getElementById("lb-prev");
const nextBtn = document.getElementById("lb-next");
const lbCounter = document.getElementById("lb-counter");

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

/* ===== 從卡片 DOM 自動讀取說明文字（不再需要 data-text 雙寫） ===== */
function getBoxText(box) {
  if (box.dataset.text && box.dataset.text.trim())
    return box.dataset.text.trim();
  const ps = Array.from(box.querySelectorAll("p:not(.source)"));
  return ps.map((p) => p.innerHTML.trim()).join("\n\n") || "暫無說明";
}

/* ===== 取得目前可見的圖片卡片 ===== */
function getVisibleImageBoxes() {
  return Array.from(boxes).filter(
    (b) => !b.classList.contains("hidden") && b.querySelector("img"),
  );
}

/* ===== 建立 gallery ===== */
function buildGallery() {
  return getVisibleImageBoxes().map((box) => ({
    src: box.querySelector("img").src,
    title:
      box.dataset.title || box.querySelector("h3")?.textContent || "圖片說明",
    text: getBoxText(box),
  }));
}

/* ===== 更新導覽按鈕 ===== */
function updateNav() {
  const single = currentGallery.length <= 1;
  prevBtn.disabled = single;
  nextBtn.disabled = single;
  if (lbCounter) {
    lbCounter.textContent =
      currentGallery.length > 1
        ? `${currentIndex + 1} / ${currentGallery.length}`
        : "";
  }
}

/* ===== 渲染 Lightbox ===== */
function renderLightboxItem(item) {
  if (!item) return;
  lightboxImg.src = item.src || "";
  lightboxTitle.textContent = item.title || "圖片說明";
  const content = item.text || "暫無說明";
  if (content.includes("<")) lightboxText.innerHTML = content;
  else lightboxText.textContent = content;
  updateNav();
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
  document.body.style.overflow = "";
  currentGallery = [];
  currentIndex = -1;
}

/* ===== 上/下張 ===== */
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

prevBtn.addEventListener("click", showPrevImage);
nextBtn.addEventListener("click", showNextImage);

/* ===== 篩選 ===== */
function filterBoxes() {
  const job = jobSelect.value;
  const type = typeSelect.value;

  let visible6 = 0,
    visible7 = 0;

  boxes.forEach((box) => {
    const match =
      (job === "all" || box.dataset.job === job) &&
      (type === "all" || box.dataset.type === type);
    box.classList.toggle("hidden", !match);

    if (match) {
      if (box.closest("#grid-6")) visible6++;
      if (box.closest("#grid-7")) visible7++;
    }
  });

  const total = visible6 + visible7;
  if (filterCount) {
    filterCount.textContent =
      job !== "all" || type !== "all" ? `共 ${total} 筆` : "";
  }

  const nr6 = document.getElementById("no-results");
  const nr7 = document.getElementById("no-results-7");
  if (nr6) {
    nr6.textContent = "目前沒有符合篩選條件的資料。";
    nr6.classList.toggle("visible", visible6 === 0);
  }
  if (nr7) {
    nr7.textContent = "目前沒有符合篩選條件的資料。";
    nr7.classList.toggle("visible", visible7 === 0);
  }
}

jobSelect.addEventListener("change", filterBoxes);
typeSelect.addEventListener("change", filterBoxes);

clearBtn.addEventListener("click", () => {
  jobSelect.value = "all";
  typeSelect.value = "all";
  filterBoxes();
});

/* ===== 點擊卡片圖片 ===== */
boxes.forEach((box) => {
  const img = box.querySelector("img");
  if (!img) return;

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    const gallery = buildGallery();
    const index = gallery.findIndex((item) => item.src === img.src);
    const item =
      index >= 0
        ? gallery[index]
        : {
            src: img.src,
            title:
              box.dataset.title ||
              box.querySelector("h3")?.textContent ||
              "圖片說明",
            text: getBoxText(box),
          };
    openLightbox(item, gallery, index);
  });
});

/* ===== 補充圖片連結 ===== */
imgLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openLightbox(
      {
        src: link.dataset.img,
        title: link.dataset.title || link.textContent.trim() || "補充圖片",
        text: link.dataset.text || "暫無說明",
      },
      [],
      -1,
    );
  });
});

if (formulaLink) {
  formulaLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLightbox(
      {
        src: formulaLink.dataset.img,
        title: formulaLink.dataset.title || "傷害計算公式（非官方）",
        text: formulaLink.dataset.text || "暫無說明",
      },
      [],
      -1,
    );
  });
}

/* ===== Lightbox 關閉 ===== */
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ===== 彩蛋圖片池 ===== */
const randomImages = Array.from(
  { length: 17 },
  (_, i) => `pic/gengtu${i + 1}.png`,
);
let shuffledImages = [];
let shuffleIndex = 0;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNextSurpriseImage() {
  if (!shuffledImages.length || shuffleIndex >= shuffledImages.length) {
    shuffledImages = shuffleArray(randomImages);
    shuffleIndex = 0;
  }
  return shuffledImages[shuffleIndex++];
}

easterEggBtn.addEventListener("click", () => {
  surpriseImg.src = getNextSurpriseImage();
  surpriseModal.style.display = "flex";
  setTimeout(() => surpriseModal.classList.add("active"), 10);
  document.body.style.overflow = "hidden";
});

function closeSurpriseModal() {
  surpriseModal.classList.remove("active");
  setTimeout(() => {
    surpriseModal.style.display = "none";
  }, 280);
  document.body.style.overflow = "";
}

closeModal.addEventListener("click", closeSurpriseModal);
surpriseModal.addEventListener("click", (e) => {
  if (e.target === surpriseModal) closeSurpriseModal();
});

/* ===== 鍵盤 ===== */
document.addEventListener("keydown", (e) => {
  const lbActive = lightbox.classList.contains("active");
  const mActive = surpriseModal.classList.contains("active");

  if (e.key === "Escape") {
    if (lbActive) closeLightbox();
    if (mActive) closeSurpriseModal();
    return;
  }
  if (!lbActive) return;
  if (e.key === "ArrowLeft" && currentGallery.length > 1) showPrevImage();
  if (e.key === "ArrowRight" && currentGallery.length > 1) showNextImage();
});

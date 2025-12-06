<template>
  <footer class="pt-4 border-top mt-5 bg-body-secondary text-body mt-auto">
    <div class="container py-4">
      <div class="row">
        <div class="col-md-5 mb-4">
          <h5 class="fw-bold">{{ t("footer.title") }}</h5>
          <p>{{ t("footer.description") }}</p>
        </div>

        <div class="col-md-4 mb-4">
          <h5 class="fw-bold">{{ t("footer.contact") }}</h5>
          <ul class="list-unstyled">
            <li>{{ t("footer.address") }}</li>
            <li>{{ t("footer.phone") }}</li>
            <li>
              <a :href="'mailto:' + t('footer.email')" class="text-decoration-none">
                {{ t("footer.email") }}
              </a>
            </li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold">Social</h5>
          <div class="d-flex flex-wrap gap-3 social-icons-container">
            <a
              v-for="item in socialMedia"
              :key="item.url"
              :href="item.url"
              :title="item.alt"
              :aria-label="item.alt"
              target="_blank"
              rel="noopener"
              class="text-body"
            >
              <i :class="`bi bi-${item.name}`" class="social-icon"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="text-center mt-4 small text-muted">
        {{ t("footer.copyright") }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const socialMedia = [
  { name: "facebook", alt: "Facebook", url: "https://www.facebook.com/UTFPR.TD/" },
  { name: "instagram", alt: "Instagram", url: "https://www.instagram.com/utfprtd/" },
  { name: "linkedin", alt: "LinkedIn", url: "https://www.linkedin.com/school/utfpr-oficial" },
  { name: "tiktok", alt: "TikTok", url: "https://tiktok.com/@utfpr.toledo" },
  { name: "twitter-x", alt: "X / Twitter", url: "https://x.com/utfpr_td" },
  { name: "whatsapp", alt: "WhatsApp", url: "https://whatsapp.com/channel/0029Vb3tWIO3wtb3Jvag6Z0H" },
  { name: "youtube", alt: "YouTube", url: "https://www.youtube.com/@UTFPRToledoOficial" },
];
</script>

<style scoped>
.social-icon {
  font-size: 1.5rem; /* Tamanho do ícone via fonte */
  transition: transform 0.2s, color 0.2s;
  display: inline-block;
}

.social-icon:hover {
  transform: scale(1.2);
  color: #007bff; /* Cor de destaque ao passar o mouse */
}
</style>
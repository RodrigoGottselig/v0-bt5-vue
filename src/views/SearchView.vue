<template>
  <main class="container py-5">
    <h1>{{ t("navbar.search") }}</h1>

    <!-- Campo de busca opcional (já vem com valor da URL) -->
    <input
      v-model="searchTerm"
      class="form-control my-3"
      :placeholder="t('navbar.search')"
    />

    <!-- Resultados encontrados -->
    <div v-if="filteredRoutes.length">
      <ul class="list-group">
        <li
          v-for="route in filteredRoutes"
          :key="route.path"
          class="list-group-item"
        >
          <router-link :to="route.path">
            {{ t(`routes.${route.children[0].name.toLowerCase()}`) }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Nenhum resultado -->
    <div v-else>
      <p class="text-muted mt-4">{{ t("navbar.noResults") }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { routes } from "@/router";

const { t } = useI18n();
const route = useRoute();

const searchTerm = ref(route.query.q?.toString() || "");

// Atualiza se navegar de novo com outro ?q=
watch(
  () => route.query.q,
  (newVal) => {
    searchTerm.value = newVal?.toString() || "";
  },
);

// Filtra as rotas com base no termo
const filteredRoutes = computed(() =>
  routes.filter((r) =>
    r.children?.some((c) =>
      c.name?.toLowerCase().includes(searchTerm.value.toLowerCase()),
    ),
  ),
);
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppConfigStore } from '@/stores/appConfig'
import { useSidebarState } from '@/composables/useSidebarState'
import Sidebar from '@/components/common/sideBar/Sidebar.vue'
import InsideNavbar from '@/components/common/insideNavbar/InsideNavbar.vue'
import OuterFooter from '@/components/common/outerFooters/OuterFooter.vue'

const appConfig = useAppConfigStore()
const { ui } = storeToRefs(appConfig)

// contentOffset is 0 whenever the drawer isn't on screen — on mobile, or
// before the user's role has loaded — so the content never reserves space for
// a sidebar that isn't rendered.
const { contentOffset } = useSidebarState()

const navbarHeight = 64

const contentStyle = computed(() => ({
  paddingLeft: `${contentOffset.value}px`,
  paddingTop: `${navbarHeight}px`,
}))
</script>

<template>
  <v-app>
    <!-- Left Sidebar — collapsible icon rail -->
    <Sidebar :version="undefined" :config="ui" />

    <!-- Top bar — offsets itself past the sidebar -->
    <InsideNavbar :config="ui" />

    <v-main class="app-main" :style="contentStyle">
      <slot name="content" />
    </v-main>

    <OuterFooter :config="ui" compact />
  </v-app>
</template>

<style scoped>
.app-main {
  background-color: rgb(var(--v-theme-background));
  min-height: 100vh;
}
</style>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import OuterFooter from '@/components/common/outerFooters/OuterFooter.vue'
import OuterNavbar from '@/components/common/outerNavbars/OuterNavbar.vue'
import { useAppConfigStore } from '@/stores/appConfig'

const appConfig = useAppConfigStore()
const { ui } = storeToRefs(appConfig)
</script>

<template>
  <v-app>
    <OuterNavbar :config="ui" />

    <v-main>
      <slot name="content"></slot>
    </v-main>

    <OuterFooter :config="ui" />
  </v-app>
</template>

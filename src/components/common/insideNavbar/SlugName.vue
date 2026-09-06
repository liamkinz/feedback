<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAuthStore, doLogout } from '@/stores/authStore'
import { useUserRolesStore } from '@/stores/roles'
import { getEmailInitials } from '@/utils/helpers'
import { roleTitle, roleColor } from '@/utils/roles'

const authStore = useAuthStore()
const rolesStore = useUserRolesStore()
const router = useRouter()
const { mobile } = useDisplay()

interface Props {
  /** When true, shows a compact logout button next to the avatar instead of a menu. */
  showInlineLogout?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showInlineLogout: false,
})

const menu = ref(false)

const userEmail = computed(() => authStore.user?.email ?? null)
const displayName = computed(() => authStore.userName || userEmail.value || 'User')
const userInitials = computed(() => getEmailInitials(userEmail.value))
const userRoleId = computed(() => authStore.userRole)

const userRoleText = computed(() => roleTitle(userRoleId.value, rolesStore.roles))
const userRoleColor = computed(() => roleColor(userRoleId.value))

onMounted(async () => {
  if (!rolesStore.roles.length && !rolesStore.loading) {
    await rolesStore.fetchRoles()
  }
})

async function handleLogout() {
  menu.value = false
  await doLogout()
}

function goToSettings() {
  menu.value = false
  router.push('/account/settings')
}
</script>

<template>
  <div class="d-flex align-center ga-1">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom end"
      :offset="8"
      transition="slide-y-transition"
    >
      <template #activator="{ props: menuActivatorProps }">
        <v-btn
          v-bind="menuActivatorProps"
          icon
          variant="text"
          :aria-label="`Open user menu for ${userEmail}`"
        >
          <v-avatar size="36" color="primary">
            <span class="text-white font-weight-medium">{{ userInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>

      <v-card :min-width="mobile ? 260 : 280" elevation="8" rounded="lg">
        <v-card-item class="pb-2">
          <div class="d-flex align-center">
            <v-avatar size="48" color="primary" class="me-3">
              <span class="text-white font-weight-bold">{{ userInitials }}</span>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="text-h6 font-weight-bold text-high-emphasis">{{ displayName }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ userEmail }}</div>
              <div class="d-flex align-center mt-1">
                <v-chip :color="userRoleColor" size="x-small" variant="flat">
                  {{ userRoleText }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card-item>

        <v-divider class="mx-4" />

        <v-card-actions class="pa-4 d-flex flex-column ga-2">
          <v-btn
            block
            variant="outlined"
            prepend-icon="mdi-cog-outline"
            rounded="lg"
            @click="goToSettings"
          >
            Settings
          </v-btn>
          <v-btn
            block
            variant="outlined"
            prepend-icon="mdi-logout"
            color="error"
            :loading="authStore.isLoading"
            rounded="lg"
            @click="handleLogout"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn
      v-if="props.showInlineLogout"
      class="flex-grow-1"
      variant="outlined"
      color="error"
      prepend-icon="mdi-logout"
      :loading="authStore.isLoading"
      rounded="lg"
      @click="handleLogout"
    >
      Logout
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { requiredRule } from '@/utils/formRules'

interface Props {
  modelValue: boolean
  saving: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', title: string): void
}>()

const { mobile } = useDisplay()

const title = ref('')

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) title.value = ''
  },
)

function close() {
  emit('update:modelValue', false)
}

function submit() {
  if (!title.value.trim()) return
  emit('create', title.value)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="mobile ? 340 : 460"
    persistent
    @update:model-value="!$event && close()"
  >
    <v-card rounded="xl" class="pa-2">
      <v-card-item class="pt-5">
        <div class="d-flex align-center ga-3">
          <v-avatar color="primary" variant="tonal" rounded="lg" size="44">
            <v-icon icon="mdi-shield-plus-outline" size="24" />
          </v-avatar>
          <span class="text-h6 font-weight-bold">New role</span>
        </div>
      </v-card-item>

      <v-card-text>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Name the role first. You will pick the pages it can open straight after.
        </p>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="title"
            label="Role title"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-tag-outline"
            :rules="[requiredRule]"
            :disabled="saving"
            autofocus
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <div class="d-flex ga-2 w-100" :class="mobile ? 'flex-column-reverse' : 'justify-end'">
          <v-btn variant="text" :block="mobile" :disabled="saving" @click="close">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :block="mobile"
            :loading="saving"
            :disabled="!title.trim()"
            @click="submit"
          >
            Create role
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

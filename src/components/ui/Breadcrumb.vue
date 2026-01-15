<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight } from '@/components/icons'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const matches = route.matched

  return matches
    .filter((match) => match.meta && (match.meta.breadcrumb || match.meta.title))
    .map((match) => ({
      name: match.meta.breadcrumb || match.meta.title || match.name,
      path: match.path,
      // If it's the last item, it shouldn't be clickable
      isLink: match.path !== route.path && match.redirect !== undefined,
    }))
})

const crumbs = computed(() => {
  const path = route.path
  const segments = path.split('/').filter((p) => p)

  const items = []
  let currentPath = ''
  
  for (const segment of segments) {
    currentPath += `/${segment}`
    // Skip dynamic segments (like :id)
    if (segment.match(/^\d+$/)) continue
    
    // Find route definition for this path
    const routes = router.getRoutes()
    let found = routes.find((r) => r.path === currentPath)
    
    // If not found, try to match with dynamic route
    if (!found) {
      found = routes.find((r) => {
        const pattern = r.path.replace(/:\w+/g, '\\d+')
        const regex = new RegExp(`^${pattern}$`)
        return regex.test(path)
      })
      
      // Use the current accumulated path for matching
      if (found && found.path.includes(':')) {
        currentPath = path
      }
    }
    
    if (found && found.meta && (found.meta.breadcrumb || found.meta.title)) {
      items.push({
        name: found.meta.breadcrumb || found.meta.title,
        path: found.path.includes(':') ? route.path : found.path,
        isLast: currentPath === route.path,
      })
    }
  }

  return items
})

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <nav class="breadcrumbs" v-if="crumbs.length > 0">
    <template v-for="(crumb, index) in crumbs" :key="crumb.path">
      <span v-if="index > 0" class="separator">
        <ChevronRight class="separator-icon" />
      </span>

      <a
        v-if="!crumb.isLast"
        href="#"
        @click.prevent="navigate(crumb.path)"
        class="breadcrumb-link"
      >
        {{ crumb.name }}
      </a>
      <span v-else class="breadcrumb-item active">
        {{ crumb.name }}
      </span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-item.active {
  color: var(--color-text-primary);
  font-weight: 600;
}

.separator {
  color: var(--color-text-light);
  display: flex;
  align-items: center;
}

.separator-icon {
  width: 14px;
  height: 14px;
}
</style>

export type AppRoute =
  | 'dashboard'
  | 'performance'
  | 'storage'
  | 'startup'
  | 'processes'
  | 'settings'

export interface NavItem {
  id: AppRoute
  label: string
  path: string
  icon: string
}

// ============================================================
// SELECTION MANAGER
// ============================================================

export class SelectionManager {
  constructor() {
    this.selectedIds = new Set();
    this.isActive = false;
  }

  enter() {
    this.isActive = true;
  }

  exit() {
    this.isActive = false;
  }

  select(id) {
    this.selectedIds.add(id);
  }

  deselect(id) {
    this.selectedIds.delete(id);
  }

  toggle(id) {
    if (this.has(id)) {
      this.deselect(id);
      return false;
    }

    this.select(id);
    return true;
  }

  clear() {
    this.selectedIds.clear();
  }

  has(id) {
    return this.selectedIds.has(id);
  }

  getSelected() {
    return Array.from(this.selectedIds);
  }

  get count() {
    return this.selectedIds.size;
  }
}

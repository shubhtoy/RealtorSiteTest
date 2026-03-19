# Studio Implementation - Todo List
*Created: March 19, 2026*

## Overview
Implement a visual editing studio for the Baba Flats website that allows URL-based edit mode activation and inline/panel editing of components with minimal code changes.

## Phase 1: Core Infrastructure ✅

### 1.1 Edit Mode Context
- [ ] Create `src/context/EditModeContext.tsx`
  - [ ] Implement URL parameter detection (`?edit=true`)
  - [ ] Provide context hook `useEditMode()`
  - [ ] Add edit mode state management

### 1.2 Selection Overlay Component
- [ ] Create `src/components/studio/SelectionOverlay.tsx`
  - [ ] Implement visual overlay for selectable components
  - [ ] Add hover/click detection
  - [ ] Style with TailwindCSS

### 1.3 URL Parameter Integration
- [ ] Update main app router to handle edit parameter
- [ ] Add edit mode detection to root layout/component
- [ ] Test URL-based activation

## Phase 2: Component Integration

### 2.1 Component Wrapper System
- [ ] Create `src/components/studio/EditableWrapper.tsx`
  - [ ] Generic wrapper for existing components
  - [ ] Component ID generation/management
  - [ ] Edit mode conditional rendering

### 2.2 Key Component Wrappers
- [ ] Wrap `SiteHeader` component
- [ ] Wrap `SiteFooter` component  
- [ ] Wrap `HomeHero` component
- [ ] Wrap `HomeFeatures` component
- [ ] Wrap `ContactForm` component

### 2.3 Property Mapping
- [ ] Define editable props for each component
- [ ] Create prop-to-field mappings
- [ ] Implement validation for edited values

## Phase 3: Editing Interface

### 3.1 Floating Puck Panel Enhancement
- [ ] Enhance `src/components/studio/FloatingPuckPanel.tsx`
  - [ ] Connect to EditModeContext
  - [ ] Implement component selection handling
  - [ ] Add panel positioning logic

### 3.2 Live Editing Preview
- [ ] Implement real-time prop updates
- [ ] Add debounced updates for performance
- [ ] Support nested component editing

### 3.3 Save/Load System
- [ ] Integrate with existing `EditableContentContext`
- [ ] Implement local storage persistence
- [ ] Add save/load UI feedback

## Phase 4: Polish & UX

### 4.1 Visual Feedback
- [ ] Add edit mode indicator in UI
- [ ] Implement selection highlight animations
- [ ] Add loading states for edits

### 4.2 Keyboard Shortcuts
- [ ] Add `Escape` to exit edit mode
- [ ] Add `Ctrl+S` to save changes
- [ ] Add `Ctrl+Z` for undo

### 4.3 Error Handling
- [ ] Add validation error display
- [ ] Implement graceful fallbacks
- [ ] Add error recovery mechanisms

## Phase 5: Testing & Validation

### 5.1 Component Testing
- [ ] Test each wrapped component in edit mode
- [ ] Verify prop editing works correctly
- [ ] Test save/load functionality

### 5.2 Performance Testing
- [ ] Measure edit mode impact on page load
- [ ] Test with multiple components selected
- [ ] Verify no memory leaks

### 5.3 User Flow Testing
- [ ] Test URL-based activation flow
- [ ] Verify selection overlay interaction
- [ ] Test editing panel usability

## Technical Requirements

### Dependencies (Already Installed)
- ✅ @puckeditor/core: ^0.21.1
- ✅ react: ^19.2.4  
- ✅ react-router-dom: ^7.13.1
- ✅ TailwindCSS: configured

### File Structure
```
src/
├── context/
│   ├── EditModeContext.tsx          # NEW
│   └── EditableContentContext.tsx   # EXISTS
├── components/
│   ├── studio/
│   │   ├── SelectionOverlay.tsx     # NEW
│   │   ├── EditableWrapper.tsx      # NEW
│   │   └── FloatingPuckPanel.tsx    # EXISTS (needs enhancement)
│   └── (existing components)
└── (other directories)
```

### Implementation Notes

1. **Minimal Code Changes**: Preserve existing component APIs and behavior
2. **URL-Based Activation**: No UI toggle needed, user opens via `/?edit=true`
3. **Progressive Enhancement**: Edit mode should not break normal site usage
4. **Performance First**: Ensure edit mode doesn't impact site performance

## Success Criteria

### Must Have
- [ ] Edit mode activates via `/?edit=true` URL parameter
- [ ] Components show selection overlay in edit mode
- [ ] Clicking component opens editing panel
- [ ] Changes persist across page reloads
- [ ] No breaking changes to existing functionality

### Should Have  
- [ ] Smooth animations for selection/editing
- [ ] Keyboard shortcuts for common actions
- [ ] Visual feedback for save states
- [ ] Support for nested component editing

### Nice to Have
- [ ] Component tree view in editing panel
- [ ] Bulk editing capabilities
- [ ] Export/import of edited content
- [ ] Undo/redo history

## Current Status
- **Phase 1**: Planning complete, ready for implementation
- **Next Action**: Start implementing EditModeContext
- **Blockers**: None identified

## Notes
- User prefers URL-based activation over UI toggle
- Leverage existing @puckeditor/core infrastructure
- Keep implementation simple and focused
- Test thoroughly before each phase completion
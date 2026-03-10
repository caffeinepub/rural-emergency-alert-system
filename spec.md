# Rural Emergency Alert System

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Emergency incident reporting (type, location, severity, description)
- Interactive map with color-coded incident markers by severity
- Alert composer with Tamil-language support
- Geo-targeted alert radius controls
- Volunteer management (register, assign, track status)
- Admin dashboard with incident stats and live feed
- SMS command reference panel
- Mobile-responsive dark dashboard design

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: incidents CRUD (id, type, lat, lng, severity, description, status, timestamp), alerts (message, tamil text, radius, timestamp), volunteers (name, phone, skills, status, location)
2. Frontend: dark dashboard layout with sidebar nav, map view with Leaflet markers, incident report form, alert composer (English + Tamil), volunteer list/management, admin stats cards, SMS command reference panel

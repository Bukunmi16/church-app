# church-app

User
├── name
├── email
├── phone
├── password
├── dateOfBirth
├── gender
├── address
├── profileImage
├── role
└── timestamps

Department
├── name
├── description
├── image
├── leader
├── assistants
├── workers
└── timestamps

Service
├── title
├── description
├── date/time
├── recurrence
├── location
├── image
└── timestamps

Event
├── title
├── description
├── image
├── date/time
├── location
└── timestamps

EventRegistration
├── event
├── user
└── timestamps

Sermon
├── title
├── description
├── speaker
├── service
├── series
├── YouTube URL
├── Telegram URL
├── resources
├── assignedDepartment
└── timestamps

SermonSeries
├── title
├── description
└── timestamps

Announcement
├── title
├── content
├── image
├── link
├── audience
├── schedule
├── expiry
└── timestamps

Notification
├── recipient
├── type
├── title
├── message
├── read
└── timestamps

Email
├── subject
├── content
├── recipients
├── scheduledAt
├── status
└── timestamps

Media
├── URL
├── type
├── uploadedBy
└── timestamps

AuditLog
├── user
├── action
├── resource
├── resourceId
└── timestamps
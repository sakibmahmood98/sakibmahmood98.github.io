export interface Project {
  slug: string;
  year: number;
  project: string;
  madeAt: string;
  builtWith: string[];
  description: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'salesedge-ai',
    year: 2026,
    project: 'SalesEdge AI - Real-Time Sales Copilot for IT Service Sales Teams',
    madeAt: 'Brain Station 23',
    builtWith: ['Electron', 'React', 'TypeScript', 'Django', 'Django REST Framework', 'Django Channels', 'PostgreSQL', 'Redis', 'Celery', 'Qdrant', 'LangChain', 'AWS Transcribe', 'AWS Bedrock', 'Docker'],
    description: `Developed an intelligent, real-time desktop application that listens to live sales calls locally, transcribes conversation in real time, and surfaces domain-specific guidance to help sales reps sell more effectively. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Local, bot-free live call listening and real-time transcription during sales meetings</li>
      <li>Real-time conversational intelligence, including live suggestions and talking points surfaced during the call</li>
      <li>Knowledge retrieval and suggestion engine that grounds in-call guidance in a company knowledge base</li>
      <li>Post-meeting AI processing: automatic summaries, action item extraction, and follow-up draft generation</li>
      <li>Meeting lifecycle management, from scheduling/joining through live capture to post-meeting artifacts</li>
      <li>Contact and company management to link meetings, transcripts, and summaries to CRM-style entities</li>
      <li>Bookmarking and search across meetings, transcripts, and summaries for quick recall</li>
      <li>Notifications to keep sales reps and teams informed of meeting outcomes and action items</li>
      <li>Analytics and scoring to evaluate call/conversation quality and surface coaching insights</li>
      <li>Desktop app experience (Electron + React) with a system tray presence for persistent background operation</li>
    </ul>
    <p class="mt-2">Enabled sales teams to focus on the conversation while AI handled real-time guidance, note-taking, and follow-up, improving deal-relevant response quality and reducing manual post-call admin work.</p>`
  },
  {
    slug: 'logistiq',
    year: 2026,
    project: 'Logistiq - Offshore Supply Chain & Logistics Management Platform',
    madeAt: 'Brain Station 23',
    builtWith: ['.NET 10', 'Angular', 'TypeScript', 'Azure', 'SQL Server', 'Redis Cache', 'Azure Service Bus', 'Azure Kubernetes Service (AKS)', 'Mapbox', 'NgRx'],
    description: `Developed a comprehensive end-to-end logistics platform for planning, tracking, and executing the movement of equipment, materials, and containers between onshore supply bases and offshore rigs/vessels. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Real-time tracking (TraQ) of shipments, containers, and assets on an interactive map with list and reporting views</li>
      <li>Project and package management, including project dashboards and package-level planning</li>
      <li>Goods receipt processing, from receiving to inventory intake, with supply base and container-type context</li>
      <li>Voyage planning and route/journey management for vessel-based transport between supply bases and offshore locations</li>
      <li>Equipment operations scheduling with rig-based date planning and bulk scheduling actions</li>
      <li>Packing workflows shared across supply-base and offshore contexts, with staged packing state management</li>
      <li>Manifestation for building and managing manifests across supply-base and offshore operations</li>
      <li>Receive-manifest workflows for both supply-base and offshore destinations, with detail-level manifest processing</li>
      <li>Inventory management for supply-base and offshore locations, including offshore consumption tracking</li>
      <li>Backload planning and execution for returning equipment/materials from offshore back to supply base</li>
      <li>Time Planner module for building recursive, hierarchical operation/activity schedules with planning and operational modes, including a plan selector, schedule cascade, and file attachments</li>
      <li>Epiq module for package and activity-level assembly views, batch item handling, and activity grids, delivered with a Figma-spec UI redesign</li>
      <li>Settings and administration for vessels, rigs, supply bases, helicopters, and user access control</li>
    </ul>
    <p class="mt-2">Enabled streamlined coordination of offshore logistics operations, reducing manual tracking overhead and improving visibility across the full onshore-to-offshore supply chain.</p>`
  },
  {
    slug: 'rvl-etp',
    year: 2025,
    project: 'RVL-ETP – eTicket Platform for Major Sporting Events',
    madeAt: 'Brain Station 23',
    builtWith: ['Angular', '.NET Core', 'Microservices', 'Azure', 'Docker', 'PostgreSQL', 'Redis', 'SignalR'],
    description: `Developed a centralized, fully digital ticketing and event logistics platform. Key components of the system include:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Admin Portal for configuring events, venue and seating plans, pricing, tickets, admin users, roles, generating tickets and reporting</li>
      <li>User Web & Mobile Apps for browsing, purchasing, and managing digital tickets</li>
      <li>Ticket Checker Mobile App for real-time ticket validation at venue gates</li>
      <li>Built on a secure, scalable architecture to handle high traffic and real-time operations</li>
      <li>Designed to simplify operations and elevate the fan experience through intuitive and modern interfaces</li>
    </ul>
    <p class="mt-2">Proven in high-profile tournaments, the platform now serves as a trusted digital solution for large-scale sporting events.</p>`
  },
  {
    slug: 'generativeai23',
    year: 2024,
    project: 'GenerativeAI23 - AI-Powered Organizational Chat & Case Study Generator',
    madeAt: 'Brain Station 23',
    builtWith: ['.NET 8', 'Blazor', 'Semantic Kernel', 'Ollama', 'Vector Databases', 'OpenAI', 'SQL Server', 'Docker', 'OpenXML', 'SendGrid'],
    description: `Developed an intelligent application enabling real-time chat with an AI-powered organizational chatbot, designed to support internal communication and knowledge sharing. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Real-time chat interface with a context-aware AI assistant</li>
      <li>Automated generation of PowerPoint presentations (PPTX) for organizational case studies</li>
      <li>Streamlined access to organizational insights and data through conversational AI</li>
      <li>Enhanced productivity and knowledge management using generative AI capabilities</li>
    </ul>
    <p class="mt-2">Empowered teams to interact with organizational knowledge more efficiently and automate the creation of professional case study presentations.</p>`
  },
  {
    slug: 'hilux',
    year: 2024,
    project: 'Hilux – Digital Owner\'s Manual & AI Assistant for Toyota Motor Corporation',
    madeAt: 'Brain Station 23',
    builtWith: ['React', 'TypeScript', 'Node.js', 'Express', 'OpenAI', 'MongoDB', 'AWS', 'Docker'],
    description: `Built a digital solution for Toyota Hilux that delivers an interactive, AI-powered owner's manual experience. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Well-structured and visually rich digital owner's manual for the Toyota Hilux vehicle</li>
      <li>AI-powered virtual assistant capable of responding via voice, text, and images</li>
      <li>Context-aware support tailored to Hilux-specific features and functionalities</li>
      <li>Enhanced user experience through smart search, guided tutorials, and interactive content</li>
    </ul>
    <p class="mt-2">Enabled Toyota Hilux owners to access vehicle information effortlessly and interact with an intelligent assistant for real-time support.</p>`
  },
  {
    slug: 'skyclub',
    year: 2024,
    project: 'SkyClub – Online Flight Booking Platform',
    madeAt: 'Brain Station 23',
    builtWith: ['Angular', 'Tailwind CSS', '.NET 8', 'AWS S3', 'AWS EKS', 'Sabre REST API', 'Stripe', 'Docker', 'Kubernetes'],
    description: `Developed a full-stack online flight booking system with a modern frontend, admin dashboard, and scalable backend architecture. The platform integrates with Sabre's global distribution system for real-time flight data and bookings. Key highlights:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Frontend: Built with Angular and Tailwind CSS, deployed on AWS S3 for high availability</li>
      <li>Backend: Developed using .NET 8 Web API, containerized and hosted on AWS EKS (Elastic Kubernetes Service)</li>
      <li>Integration with Sabre REST APIs for flight search, booking, and itinerary management</li>
      <li>Stripe payment gateway integration for secure and seamless transactions</li>
      <li>Admin panel for managing users, bookings, flights, and system settings</li>
    </ul>
    <p class="mt-2">SkyClub is designed to deliver a smooth booking experience with enterprise-grade infrastructure and modern web technologies.</p>`
  },
  {
    slug: 'trygg-bat',
    year: 2024,
    project: 'TRYGG BÅT – Smart Boating Safety & Monitoring System',
    madeAt: 'Brain Station 23',
    builtWith: ['IoT', '.NET Core', 'Angular', 'Azure IoT Hub', 'SignalR', 'PostgreSQL', 'Docker', 'Microservices'],
    description: `An IoT-powered application designed to enhance boating safety and boat monitoring through smart sensors and real-time alerts. The platform aims to deliver peace of mind to boat owners and passengers alike. Key functionalities include:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Man Overboard (MOB) Detection: Sends automatic alerts to the Rescue Company if a person falls overboard. The MOB tag can also function as a wireless deadman switch, stopping the engine immediately for increased safety.</li>
      <li>Digital Geo-Fence: Creates a virtual boundary around the boat and sends instant movement alerts in case of theft or drift.</li>
      <li>Water Intrusion Alerts: Notifies the owner in case of leakage—especially valuable for boats kept in water year-round.</li>
      <li>Battery Monitoring: Continuously tracks and displays battery voltage via the mobile app.</li>
      <li>Temperature Sensors: Offers real-time readings from multiple areas inside the boat.</li>
      <li>Humidity Monitoring: Allows installation of multiple sensors to monitor moisture levels and prevent damage.</li>
    </ul>
    <p class="mt-2">TRYGG BÅT combines smart boating features, emergency responsiveness, and environmental monitoring—all in one connected platform to deliver a safer and smarter boating experience.</p>`
  },
  {
    slug: 'iotix',
    year: 2023,
    project: 'IOTIX – IoT-Based Device Monitoring & Analytics Platform',
    madeAt: 'Brain Station 23',
    builtWith: ['Microservices', '.NET Framework', 'AutoMapper', 'MySQL', 'AngularJS', 'RxJS', 'NgRx', 'Docker', 'Entity Framework Core'],
    description: `Developed an IoT solution for real-time monitoring, notifications, status tracking, and analytics of connected devices. The platform provides:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Live device status updates and performance insights</li>
      <li>Smart notification system for alerts and anomalies</li>
      <li>Data collection and analysis for predictive insights</li>
      <li>Dashboard for device health monitoring and reporting</li>
    </ul>
    <p class="mt-2">Enabled proactive maintenance and better operational visibility across IoT devices.</p>`
  },
  {
    slug: 'nuarca-admin-tool',
    year: 2022,
    project: 'NUARCA Admin Tool – NFT Management Platform',
    madeAt: 'Brain Station 23',
    builtWith: ['AngularJS', 'RxJS', 'Angular Material', '.NET 5', 'Azure SQL Server', 'Azure Active Directory', 'AutoMapper', 'Platform Service', 'Graph API'],
    description: `Developed an internal admin application for Nuarca Lab to streamline the creation and management of NFTs. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Management and creation of digital cards (NFTs)</li>
      <li>Real-time card preview functionality</li>
      <li>Pack management: create and organize packs of cards</li>
      <li>Group management and assignment</li>
      <li>Mapping of groups to specific packs for structured NFT distribution</li>
    </ul>
    <p class="mt-2">Enabled efficient curation and organization of digital assets within the NFT ecosystem for Nuarca Lab.</p>`
  },
  {
    slug: 'rs-sjoliv',
    year: 2022,
    project: 'RS SJØLIV - Community Engagement & Safety Platform for Norwegian Sea Rescue Society',
    madeAt: 'Brain Station 23',
    builtWith: ['Project Management', 'Microservices', 'Entity Framework', '.NET 6', 'Stripe', 'Azure DevOps', 'Azure SQL Server', 'Microsoft Azure', 'Azure Blob Storage', 'Azure Redis Service', 'CI/CD', 'Mapbox', 'Azure Service Bus', 'Angular', 'Angular Material', 'Angular CLI', 'NgRx', 'RxJS', 'Fuse Template', 'Tailwind CSS', '.NET 8'],
    description: `Built a application to support the Norwegian Sea Rescue Society in fostering community building at sea and promoting boating life and safety education. The platform enables:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Management of courses, instructors and participants</li>
      <li>Real-time notifications and communication between instructors and participants</li>
      <li>Participant and instructors mapping to courses</li>
      <li>Media management: upload and organize contents related to courses</li>
      <li>Delivery of educational content, courses, and sea-based experiences</li>
    </ul>
    <p class="mt-2">Empowered the organization to enhance outreach, streamline event operations, and improve safety awareness.</p>`
  },
  {
    slug: 'vntx',
    year: 2021,
    project: 'VNTX - Event Management Platform',
    madeAt: 'Brain Station 23',
    builtWith: ['.NET Framework', 'AngularJS', 'NgRx', 'Entity Framework Core', 'Azure SQL', 'SignalR', 'Azure Redis Service', 'Auth0', 'SendGrid', 'MassTransit', 'Mapbox', 'AutoMapper', 'FluentValidation', 'Azure Service Bus', 'Azure DevOps', 'Azure Kubernetes Service'],
    description: `Developed a comprehensive solution for end-to-end event management and real-time collaboration between web and mobile applications. Key features included:
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Seamless communication with end users via web and mobile platforms</li>
      <li>Event and activity management capabilities</li>
      <li>Participant management: tagging, tracking, and segmentation</li>
      <li>Real-time notifications and updates to participants</li>
      <li>Management of Points of Interest (POIs) and linking them to events and activities</li>
      <li>Designation and management of event contact persons</li>
      <li>Media management: upload and organize photos related to events, activities, and POIs</li>
      <li>Live location tracking of attendees for better coordination and safety</li>
    </ul>
    <p class="mt-2">Enabled smooth coordination and enhanced user engagement through modern technology integration.</p>`
  },
  // Add more projects as needed
];

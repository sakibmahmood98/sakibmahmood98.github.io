import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  imports: [
    NgForOf
  ],
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  
  goBack(): void {
    this.location.back();
  }
  
  projects = [
    {
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
  ]
}

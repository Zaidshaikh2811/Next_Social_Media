# Next Social Media Platform

A modern, full-stack social media application built with Next.js 14, featuring real-time interactions, secure authentication, and cloud storage capabilities.

## 🌟 Overview

Next Social Media is a contemporary social networking platform that enables users to share posts, interact through comments and likes, and maintain personal profiles. Built with performance and scalability in mind.

## ✨ Key Features

- 🔐 Secure authentication with Clerk
- 📝 Create, edit, and delete posts
- 💭 Comment system
- ❤️ Like functionality
- 👤 Custom user profiles
- 🖼️ Image upload support
- 🔍 Real-time search capabilities
- 📱 Responsive design

## 🛠️ Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Shadcn UI

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL (Neon DB)

- **Authentication:**
  - Clerk

- **File Storage:**
  - UploadThing

## 📦 Installation

1. Clone the repository:
````bash
git clone https://github.com/yourusername/next-social-media.git
cd next-social-media
````

2. Install dependencies:
````bash
npm install
````

3. Set up environment variables:
````env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_postgresql_url
UPLOADTHING_TOKEN=your_uploadthing_token
````

4. Run database migrations:
````bash
npx prisma generate
npx prisma db push
````

5. Start the development server:
````bash
npm run dev
````

## 🚀 Usage

1. Register/Login using Clerk authentication
2. Create your profile
3. Start posting, commenting, and interacting with other users
4. Upload images to enhance your posts
5. Search for other users and content

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/posts` | GET | Fetch all posts |
| `/api/posts` | POST | Create new post |
| `/api/posts/:id` | GET | Get specific post |
| `/api/posts/:id` | DELETE | Delete post |
| `/api/comments` | POST | Add comment |
| `/api/likes` | POST | Toggle like |

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Write clean, commented code
- Include tests for new features
- Follow the existing code structure
- Use conventional commits

## 🤝 Support

For support, email zaidshaikh811@gmail.com or join our Discord community [link].

## 📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Clerk for authentication services
- Neon DB for database hosting
- UploadThing for file storage solutions

---
Made with ❤️ by [Mohammad Zaid Shaikh]




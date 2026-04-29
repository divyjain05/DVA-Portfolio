# DVA Portfolio & GitHub CMS

A high-performance, professional portfolio designed for Data Visualization & Analytics (DVA) experts. This project features a monochromatic, GitHub-inspired monochromatic aesthetic and a built-in CMS for seamless project management.

## 🚀 Features

- **GitHub Integration**: Automatically fetch public and private repositories using the GitHub API.
- **Custom CMS**: A PIN-protected admin panel (`/admin`) to publish, edit, and remove projects.
- **Professional Aesthetics**: Clean monochromatic dark mode inspired by GitHub's official design system.
- **Multi-Image Support**: Support for multiple project screenshots with a native-feeling horizontal scroll gallery.
- **Skill Filtering**: Dynamic skill-based filtering (Excel, Tableau, Python, SQL, etc.) to showcase your technical stack.
- **Custom Branding**: Ability to use custom display names for repositories and personalized skill tagging.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS (High-fidelity custom design)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Media**: [Cloudinary](https://cloudinary.com/) (Secure image storage and processing)
- **API**: GitHub REST API

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
# GitHub Token (Classic token with 'repo' scope)
GITHUB_TOKEN=your_github_token_here

# Cloudinary Credentials
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Access
ADMIN_PIN=your_4_digit_pin
```

### 4. Run the development server
```bash
npm run dev
```

## 📝 GitHub CMS Usage

1.  **Access**: Navigate to `/admin` and enter your configured PIN.
2.  **Select**: Choose a repository from your GitHub account.
3.  **Customize**:
    *   Set a **Display Name** (e.g., "Sales Dashboard" instead of "sales-v1").
    *   Edit the **Description** to highlight your analytics methodology.
    *   Add **Skills/Tools** as comma-separated tags (e.g., `Tableau, Python, SQL`).
4.  **Gallery**: Upload one or more screenshots. These will automatically form a gallery in the project preview.
5.  **Publish**: Hit "Save to Portfolio" to push the project live.

## 🎨 Design Philosophy

This portfolio avoids flashy gradients and unnecessary colors to maintain a focused, "Data-First" professional look. The layout is perfectly aligned to mirror the precision required in data visualization work.

---
Created by [Divy Kumar Jain](https://github.com/divyjain05)

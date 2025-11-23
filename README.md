# Daily Task Planner

A modern, professional, and intuitive daily task planner built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Smart Task Management**: Create, edit, and organize tasks with comprehensive fields
- **Multiple Views**: Today, Next 7 Days, Upcoming, and All tasks views
- **Task Lists**: Custom lists with colors and emojis (including default Inbox)
- **Labels & Organization**: Color-coded labels with icons for better task categorization
- **Priority Levels**: High, Medium, Low, and None priority levels
- **Subtasks Support**: Break down complex tasks into manageable subtasks
- **Search & Filter**: Fast fuzzy search across task names and descriptions

### Advanced Features
- **Time Tracking**: Estimate vs actual time tracking
- **Task Scheduling**: Set dates, deadlines, and reminders
- **Dark & Light Themes**: System theme support with manual toggle
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Activity Logging**: Track all task changes and modifications
- **Keyboard Shortcuts**: Efficient navigation and task management

### Data Management
- **Local Storage**: SQLite database for reliable local data persistence
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Data Validation**: Comprehensive form validation for all inputs

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom dark theme
- **Components**: shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation
- **Database**: Better SQLite for local data storage
- **Testing**: Bun Test with React Testing Library
- **Package Manager**: Bun for fast development

## 📦 Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd daily-task-planner
   bun install
   ```

2. **Run Development Server**
   ```bash
   bun run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Run Tests**
   ```bash
   bun test
   ```

5. **Build for Production**
   ```bash
   bun run build
   bun run start
   ```

## 🎯 Usage Guide

### Getting Started
1. **Add Your First Task**: Click the "Add Task" button or use the keyboard shortcut
2. **Choose Your View**: Navigate between Today, Next 7 Days, Upcoming, or All views
3. **Organize with Lists**: Create custom lists with colors and icons
4. **Use Labels**: Apply labels for better categorization

### Task Management
- **Create Tasks**: Use the modal to add detailed information
- **Edit Tasks**: Click on tasks to open the edit dialog
- **Complete Tasks**: Check off tasks and mark subtasks as done
- **Set Priorities**: Assign priority levels for better task management
- **Schedule Tasks**: Set dates, deadlines, and time estimates

### Advanced Features
- **Search**: Use the search bar to quickly find tasks
- **Filter**: Toggle completed tasks visibility
- **Mobile Usage**: Access on mobile with responsive design
- **Theme Toggle**: Switch between light and dark themes

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── TaskList.tsx       # Task list display
│   ├── TaskItem.tsx       # Individual task component
│   ├── AddTaskModal.tsx   # Task creation modal
│   ├── EditTaskModal.tsx  # Task editing modal
│   ├── AddListModal.tsx   # List creation modal
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── MobileLayout.tsx   # Mobile responsive layout
├── lib/
│   ├── context/           # React context providers
│   ├── database.ts        # SQLite database setup
│   └── utils.ts           # Utility functions
├── types/
│   └── index.ts           # TypeScript type definitions
└── tests/                 # Test files
```

## 🧪 Testing

The project includes comprehensive tests covering:
- Task filtering and sorting logic
- Component interactions
- Data validation
- User workflows
- Mobile responsiveness

Run tests with:
```bash
bun test
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Muted**: Gray (#6b7280)

### Component Library
- Built with shadcn/ui for accessibility
- Tailwind CSS for consistent styling
- Dark mode support with CSS custom properties
- Responsive breakpoints (sm, md, lg, xl)

## 🔧 Development

### Available Scripts
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun test` - Run test suite

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier formatting (configurable)
- Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity apps and task management best practices
- Component library from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Privacy

This application stores all data locally on your device using SQLite. No data is sent to external servers, ensuring complete privacy and ownership of your task data.

---

**Built with ❤️ using Next.js 16, TypeScript, and modern web technologies**

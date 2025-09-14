// constants/categories.js
import { Pen, Cpu, BookOpen, Shirt, Volleyball } from "lucide-react";

// Make sure icon names are correct and lucide-react is installed
export const categoriesData = [
    { id: 1, title: "Stationery", icon: Pen, color: "from-blue-400 to-blue-600" , link: "/categories/stationery" },
    { id: 2, title: "Electronics", icon: Cpu, color: "from-purple-400 to-purple-600", link: "/categories/electronics" },
    { id: 3, title: "Sports", icon: Volleyball, color: "from-green-400 to-green-600", link: "/categories/sports" },
    { id: 4, title: "Books", icon: BookOpen, color: "from-orange-400 to-orange-600", link: "/categories/books" },
    { id: 5, title: "Clothing", icon: Shirt, color: "from-red-400 to-red-600", link: "/categories/clothing" },
  ];


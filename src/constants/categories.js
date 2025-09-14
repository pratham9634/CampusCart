import { Pen, Cpu, Football, BookOpen, Shirt } from 'lucide-react'; // Example icons

export const categoriesData = [
  {
    id: 1,
    title: "Stationery",
    icon: <Pen className="w-8 h-8 text-blue-500" />,
    link: "/categories/stationery"
  },
  {
    id: 2,
    title: "Electronics",
    icon: <Cpu className="w-8 h-8 text-purple-500" />,
    link: "/categories/electronics"
  },
  {
    id: 3,
    title: "Sports",
    icon: <Football className="w-8 h-8 text-green-500" />,
    link: "/categories/sports"
  },
  {
    id: 4,
    title: "Books",
    icon: <BookOpen className="w-8 h-8 text-orange-500" />,
    link: "/categories/books"
  },
  {
    id: 5,
    title: "Clothing",
    icon: <Shirt className="w-8 h-8 text-red-500" />,
    link: "/categories/clothing"
  }
];

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FolderOpen, 
  Edit, 
  Trash2, 
  Move, 
  MoreVertical,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from '../ui/Toaster';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent: number;
  coursecount: number;
  visible: number;
  depth: number;
  path: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  onCategoryUpdate: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onCategoryUpdate
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const toggleExpanded = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Edit category: ${category.name}`);
    // TODO: Implement edit functionality
  };

  const handleDelete = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      toast.info(`Delete category: ${category.name}`);
      // TODO: Implement delete functionality
    }
  };

  const handleMove = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Move category: ${category.name}`);
    // TODO: Implement move functionality
  };

  const getChildCategories = (parentId: number) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = getChildCategories(category.id).length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const isHovered = hoveredCategory === category.id;

    return (
      <div key={category.id}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`group relative cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => onCategorySelect(category)}
          onMouseEnter={() => setHoveredCategory(category.id)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="flex items-center justify-between py-3 pr-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Expand/Collapse Button */}
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(category.id);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}

              {/* Category Icon */}
              <div className="flex-shrink-0">
                {hasChildren && isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                ) : (
                  <Folder className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Category Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium truncate ${
                    isSelected 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {category.name}
                  </h3>
                  {category.coursecount > 0 && (
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                      {category.coursecount}
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${
              isHovered || isSelected ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleEdit(category, e)}
                className="p-1 h-auto"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleMove(category, e)}
                className="p-1 h-auto"
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleDelete(category, e)}
                className="p-1 h-auto text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Child Categories */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {getChildCategories(category.id).map(childCategory =>
                renderCategory(childCategory, level + 1)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const rootCategories = categories.filter(cat => cat.parent === 0);

  return (
    <div className="h-full overflow-y-auto">
      {rootCategories.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your first category to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {rootCategories.map(category => renderCategory(category))}
        </div>
      )}
    </div>
  );
};
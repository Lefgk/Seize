import { Button } from '@/components/ui/button';
import React from 'react';

interface SidebarProps {
  pageContent: Array<{
    icon: React.ReactNode;
    title: string;
  }>;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ pageContent, activeTab, setActiveTab }) => {
  return (
    <nav className="p-4">
      <ul>
        {pageContent.map((item, index) => (
          <li key={index} className="mb-2">
            <Button
              variant={"ripple"}
              onClick={() => setActiveTab(index)}
              className={`flex items-center w-full p-2 bg-transparent whitespace-normal h-fit min-h-0 normal-case text-left justify-start rounded-md transition-colors ${activeTab === index
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-default-800'
                }`}
            >
              <span className="ml-3 mr-2">{item.icon}</span>
              <span className="text-sm">{item.title}</span>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};


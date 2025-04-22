import React from 'react';

interface TopTabsProps {
  pageContent: Array<{
    icon: React.ReactNode;
    title: string;
  }>;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const TopTabs: React.FC<TopTabsProps> = ({ pageContent, activeTab, setActiveTab }) => {
  return (
    <div className="flex overflow-x-auto bg-default-900 border-b border-border">
      {pageContent.map((item, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex items-center px-4 py-3 transition-colors ${
            activeTab === index
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-default-800'
          }`}
        >
          <span className="mr-2">{item.icon}</span>
          <span className="text-sm whitespace-nowrap">{item.title}</span>
        </button>
      ))}
    </div>
  );
};


import React from 'react';

interface TextBlockProps {
  content: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div 
          className="prose prose-lg max-w-4xl mx-auto text-brand-gray-700" 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  );
};

export default TextBlock;

'use client'

import React, { useEffect, useState } from 'react';

/**
 * RichContentRenderer - A component to properly render rich text content from TinyMCE
 * @param {Object} props
 * @param {string} props.content - HTML content to render
 * @param {string} props.className - Additional class names to apply to wrapper
 */
const RichContentRenderer = ({ content, className = '' }) => {
  const [processedContent, setProcessedContent] = useState(content);

  // Define styles mapping for different HTML elements
  const contentStyles = {
    // Text elements
    'p': 'mb-4',
    'h1': 'text-3xl font-bold mb-4 mt-6',
    'h2': 'text-2xl font-bold mb-3 mt-5',
    'h3': 'text-xl font-bold mb-2 mt-4',
    'h4': 'text-lg font-bold mb-2 mt-3',
    'h5': 'text-base font-bold mb-2 mt-2',
    'h6': 'text-sm font-bold mb-2 mt-2',
    
    // Lists
    'ul': 'list-disc pl-5 mb-4 ml-5 space-y-1',
    'ol': 'list-decimal pl-5 mb-4 ml-5 space-y-1',
    'li': 'mb-1 ml-2',
    
    // Inline formatting
    'strong, b': 'font-bold',
    'em, i': 'italic',
    'u': 'underline',
    'strike, s, del': 'line-through',
    
    // Block elements
    'blockquote': 'border-l-4 border-gray-300 pl-4 italic my-4',
    'pre': 'bg-gray-100 p-4 rounded my-4 overflow-auto',
    'code': 'bg-gray-100 p-1 rounded text-sm',
    
    // Links
    'a': 'text-blue-600 hover:underline',
    
    // Tables
    'table': 'border-collapse border border-gray-300 my-4 w-full',
    'thead': 'bg-gray-100',
    'th': 'border border-gray-300 p-2 text-left',
    'td': 'border border-gray-300 p-2',
    
    // Media
    'img': 'max-w-full h-auto my-4',
    'figure': 'my-4',
    'figcaption': 'text-sm text-gray-600 text-center mt-2',
    
    // Other
    'hr': 'my-6 border-t border-gray-300',
  };

  // Process content on client side only
  useEffect(() => {
    const processContent = (htmlContent) => {
      if (!htmlContent) return '';
      
      try {
        // Create a div to parse the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Apply classes to each element type
        Object.entries(contentStyles).forEach(([selectors, classes]) => {
          // Handle multiple selectors separated by commas
          selectors.split(',').forEach(selector => {
            const elements = tempDiv.querySelectorAll(selector.trim());
            
            elements.forEach(el => {
              // Add the classes without removing existing ones
              classes.split(' ').forEach(className => {
                if (className) el.classList.add(className);
              });
            });
          });
        });
        
        return tempDiv.innerHTML;
      } catch (error) {
        console.error('Error processing rich content:', error);
        return htmlContent;
      }
    };

    if (typeof window !== 'undefined' && content) {
      setProcessedContent(processContent(content));
    }
  }, [content]);

  return (
    <div 
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default RichContentRenderer;